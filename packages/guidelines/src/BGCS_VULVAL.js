// BGCS_VULVAL — Vulval Cancer
// British Gynaecological Cancer Society (BGCS) vulval cancer guidelines: an
// update on recommendations for practice 2023 (Morrison J, Baldwin P, Hanna L,
// et al. Eur J Obstet Gynecol Reprod Biol 2024;292:210-238). Original Pocket
// O&G summary; grades in brackets are the guideline's own. Verify against the
// full text and local protocol.

export const BGCS_VULVAL_SECTIONS = [
  {
    id: "bgcs-vulval-overview",
    gl: "BGCS_VULVAL",
    condition: "Vulval Cancer",
    setting: "Gynae-Oncology",
    title: "Overview & Aetiology",
    tags: [
      "vulval cancer", "vulvar cancer", "vulval carcinoma", "vulval scc",
      "vulval squamous cell carcinoma", "vulval cancer risk factors", "bgcs vulval",
    ],
    content: [
      { type: "text", value: "About 90% of vulval cancers are squamous cell carcinomas (SCC). The remaining 10% include primary vulval melanoma, basal cell carcinoma and Bartholin's gland carcinoma." },
      { type: "subheading", value: "Two pathways to vulval SCC" },
      { type: "list", items: [
        "HPV-dependent: arises through usual-type VIN (uVIN), also called high-grade squamous intraepithelial lesion (HSIL); HPV16 is the commonest subtype.",
        "HPV-independent: arises through differentiated VIN (dVIN) on a background of a vulval dermatosis, particularly lichen sclerosus (and lichen planus). dVIN carries a higher risk of progression to cancer.",
      ]},
      { type: "alert", value: "Lichen sclerosus is a key risk factor for HPV-independent vulval SCC. Treat and follow up lichen sclerosus, and biopsy any suspicious, non-responding or changing lesion." },
    ],
  },

  {
    id: "bgcs-vulval-diagnosis",
    gl: "BGCS_VULVAL",
    condition: "Vulval Cancer",
    setting: "Gynae-Oncology",
    title: "Presentation, Referral & Diagnosis",
    tags: [
      "vulval cancer referral", "vulval lump", "vulval lesion", "vulval biopsy",
      "suspected vulval cancer", "vulval cancer 2ww", "vulval cancer mdt",
    ],
    content: [
      { type: "list", items: [
        "Refer women with a suspicious vulval lesion on the suspected-cancer (2-week-wait) pathway (NICE NG12).",
        "A highly suspicious lesion, for example a fungating lesion with or without palpable groin nodes, should be referred to a cancer centre without waiting for biopsy results.",
      ]},
      { type: "subheading", value: "Diagnosis" },
      { type: "list", items: [
        "Take an incisional (punch or wedge) biopsy that includes the edge of the lesion, at the transition from normal to abnormal tissue; avoid a central ulcer, which may not be diagnostic.",
        "Avoid pre-emptive complete excision of a small lesion before diagnosis, as it can make the original site hard to identify and limit conservative surgery later.",
        "The diagnosis should be confirmed by a specialist gynaecological cancer MDT before planning radical treatment (Grade D).",
        "Offer HIV testing.",
      ]},
    ],
  },

  {
    id: "bgcs-vulval-vin",
    gl: "BGCS_VULVAL",
    condition: "Vulval Cancer",
    setting: "Gynae-Oncology",
    title: "VIN (Pre-invasive Disease)",
    tags: [
      "vin", "vulval intraepithelial neoplasia", "usual type vin", "uvin", "hsil",
      "differentiated vin", "dvin", "imiquimod vin", "vulval precancer",
    ],
    content: [
      { type: "list", items: [
        "Usual-type VIN (uVIN / HSIL): HPV-driven, more often multifocal. If cancer is suspected, surgical excision remains the treatment of choice.",
        "Where occult cancer is not suspected, uVIN can be individualised, taking account of the woman's preferences and the site and extent of disease, using excision, imiquimod, or a combination.",
        "Differentiated VIN (dVIN): HPV-independent, associated with lichen sclerosus, with a higher risk of progression; has a lower threshold for excision and close follow-up.",
      ]},
    ],
  },

  {
    id: "bgcs-vulval-surgery",
    gl: "BGCS_VULVAL",
    condition: "Vulval Cancer",
    setting: "Gynae-Oncology",
    title: "Surgical Management & the Groin",
    tags: [
      "vulval wide local excision", "vulval cancer surgery", "sentinel lymph node vulval",
      "inguinofemoral lymphadenectomy", "groin node vulval cancer", "vulval cancer margins",
    ],
    content: [
      { type: "subheading", value: "The primary lesion" },
      { type: "list", items: [
        "Wide local excision aiming for clear margins. A clear (R0) margin is defined as a 1 mm microscopic tumour-free margin; excision margins of about 0.5-1 cm are drawn around the lesion, with a trend towards more conservative margins.",
        "Reconstruction may involve primary closure or flap techniques; healing by secondary intent can give good results in patients unfit for complex surgery.",
      ]},
      { type: "subheading", value: "Groin (inguinofemoral) nodes" },
      { type: "list", items: [
        "Vulval SCC spreads mainly via the inguinofemoral (groin) lymph nodes. Groin node surgery is recommended for disease greater than FIGO stage IA.",
        "Before sentinel lymph node biopsy (SLNB), clinical examination and groin imaging (ultrasound, MRI or CT) are required; ultrasound has good accuracy but is operator dependent.",
        "Obvious groin node involvement is a contraindication to SLNB. Assess suspicious nodes with ultrasound-guided FNA or core biopsy where the result would change management.",
        "Node-positive disease requires inguinofemoral lymphadenectomy and consideration of adjuvant treatment.",
      ]},
    ],
  },

  {
    id: "bgcs-vulval-adjuvant",
    gl: "BGCS_VULVAL",
    condition: "Vulval Cancer",
    setting: "Gynae-Oncology",
    title: "Adjuvant Treatment, Melanoma & Follow-up",
    tags: [
      "vulval cancer radiotherapy", "vulval cancer adjuvant", "vulval melanoma",
      "vulval cancer follow up", "vulval cancer recurrence",
    ],
    content: [
      { type: "list", items: [
        "Radiotherapy is used adjuvantly (for example with node-positive disease or close/involved margins) and for primary treatment of advanced disease; palliative hypofractionated regimens are available for frail patients or bleeding.",
        "Vulval melanoma is rare and presents as a vulval lesion; refer to the ano-uro-genital mucosal melanoma guideline for detailed management.",
      ]},
      { type: "subheading", value: "Follow-up" },
      { type: "list", items: [
        "Annual follow-up to at least five years is suggested as a minimum.",
        "Patients with unifocal, treated disease may be discharged at that point, advised to return if new lesions or symptoms develop.",
        "Patients with multifocal or recurrent disease, and those with an underlying dermatosis such as lichen sclerosus, need longer-term follow-up.",
      ]},
    ],
  },
];
