// Harvest sources for the Latest feed.
//
// Two kinds of source:
//   - Structured (PubMed, gov.uk): return clean JSON we can parse into candidates.
//   - Pages (NICE, RCOG, MBRRACE): HTML listing pages whose text we hand to the
//     triage model to extract candidates from. More resilient than a scraper.
//
// Every fetch is wrapped so one dead source never fails the whole run.

const UA = "PocketOG-Latest/1.0 (+https://github.com/kshamiyah/pocket_og)";
const PUBMED_TOOL = "pocket-og-latest";
const PUBMED_EMAIL = "k.shamiyah@gmail.com";

async function getJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function getText(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function ymd(d) {
  return `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCDate()).padStart(2, "0")}`;
}

// Strip HTML to rough text and cap length so page excerpts stay bounded.
function htmlToText(html, cap = 6000) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, cap);
}

// --- Tier 2: journal shortlist via PubMed E-utilities (entry-date window) ---
// Entry date (edat) tracks when PubMed indexed the paper, not the print-issue
// date, so a short window actually catches things when they appear online.
export async function harvestPubMed({ lookbackDays = 3, apiKey = "" } = {}) {
  const key = apiKey ? `&api_key=${apiKey}` : "";
  const now = new Date();
  const from = new Date(now.getTime() - lookbackDays * 86400000);
  const journals = [
    "N Engl J Med", "Lancet", "BJOG", "Obstet Gynecol", "Am J Obstet Gynecol",
    "Lancet Obstet Gynaecol Womens Health", "Hum Reprod", "Fertil Steril",
  ];
  const journalClause = journals.map(j => `"${j}"[Journal]`).join(" OR ");
  const topicClause = [
    "pregnancy", "obstetric", "postpartum", "labour", "labor", "gynaecolog",
    "gynecolog", "contracept", "menopause", "endometrio", "fetal", "maternal",
  ].map(t => `${t}[Title/Abstract]`).join(" OR ");
  const typeClause = [
    "Randomized Controlled Trial[Publication Type]",
    "Meta-Analysis[Publication Type]",
    "Guideline[Publication Type]",
    "Practice Guideline[Publication Type]",
  ].join(" OR ");
  const term = encodeURIComponent(`(${journalClause}) AND (${topicClause}) AND (${typeClause})`);
  const esearch = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&datetype=edat&mindate=${ymd(from)}&maxdate=${ymd(now)}&retmax=40&term=${term}&tool=${PUBMED_TOOL}&email=${PUBMED_EMAIL}${key}`;

  const search = await getJson(esearch);
  const ids = search?.esearchresult?.idlist ?? [];
  if (ids.length === 0) return [];

  const esummary = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(",")}&tool=${PUBMED_TOOL}&email=${PUBMED_EMAIL}${key}`;
  const summary = await getJson(esummary);
  const result = summary?.result ?? {};
  return (result.uids ?? []).map(uid => {
    const a = result[uid] ?? {};
    const doi = (a.articleids ?? []).find(x => x.idtype === "doi")?.value ?? "";
    return {
      source: "PubMed",
      kind_hint: (a.pubtype ?? []).some(t => /guideline/i.test(t)) ? "guideline" : "trial",
      title: a.title ?? "",
      journal: a.fulljournalname || a.source || "",
      date: a.sortpubdate || a.epubdate || a.pubdate || "",
      doi,
      url: doi ? `https://doi.org/${doi}` : `https://pubmed.ncbi.nlm.nih.gov/${uid}/`,
      pmid: uid,
    };
  });
}

// --- Tier 1: MHRA safety notices via the keyless gov.uk search API ---
export async function harvestGovUk() {
  const types = ["drug_safety_update", "medical_safety_alert", "drug_device_alert"];
  const out = [];
  for (const t of types) {
    try {
      const url = `https://www.gov.uk/api/search.json?filter_content_store_document_type=${t}&order=-public_timestamp&count=15&fields=title,link,public_timestamp,description`;
      const data = await getJson(url);
      for (const r of data?.results ?? []) {
        out.push({
          source: "MHRA",
          kind_hint: "safety",
          title: r.title ?? "",
          date: (r.public_timestamp ?? "").slice(0, 10),
          description: r.description ?? "",
          url: r.link?.startsWith("http") ? r.link : `https://www.gov.uk${r.link ?? ""}`,
        });
      }
    } catch (e) {
      console.warn(`gov.uk ${t}: ${e.message}`);
    }
  }
  return out;
}

// --- Tier 1/3: listing pages we hand to the model to extract from ---
const PAGES = [
  { source: "NICE", url: "https://www.nice.org.uk/guidance/published?ndt=Guidance&ngt=Antenatal,Intrapartum,Postnatal,Fertility,Gynaecology&type=apg,csg,cg,mpg,ng,qs" },
  { source: "NICE-news", url: "https://www.nice.org.uk/news/articles" },
  { source: "RCOG", url: "https://www.rcog.org.uk/news/" },
  { source: "MBRRACE", url: "https://www.npeu.ox.ac.uk/mbrrace-uk/reports" },
];

export async function harvestPages() {
  const out = [];
  for (const p of PAGES) {
    try {
      out.push({ source: p.source, url: p.url, text: htmlToText(await getText(p.url)) });
    } catch (e) {
      console.warn(`page ${p.source}: ${e.message}`);
    }
  }
  return out;
}
