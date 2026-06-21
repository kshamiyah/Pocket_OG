export const PPROM_PROTOCOL = {
  id: "pprom",
  title: "?PPROM / ?SROM",
  subtitle: "Prelabour rupture of membranes — assessment & management",
  category: "antenatal",
  guideline: "RCOG GTG73 · NICE NG25",
  color: "teal",
  startId: "history",
  nodes: {

    "history": {
      type: "checklist",
      title: "Take a focused history",
      subtitle: "Establish the likelihood of membrane rupture",
      items: [
        "Onset — sudden gush vs slow trickle; ongoing or settled",
        "Colour of fluid — clear, blood-stained, green (meconium), or offensive",
        "Gestation — confirm exact dates",
        "Fetal movements since rupture",
        "Uterine contractions or abdominal pain",
        "Cervical cerclage in situ — document and plan removal",
        "GBS status — known positive swab at any point in this pregnancy",
        "Risk factors for chorioamnionitis: previous PPROM, recent PV examination, cervical instrumentation",
      ],
      next: "examination",
    },

    "examination": {
      type: "checklist",
      title: "Examine the patient",
      subtitle: "Full maternal and fetal assessment",
      items: [
        "BP, HR, temperature, RR, SpO₂",
        "Auscultate fetal heart; apply CTG",
        "Abdominal palpation — uterine tenderness, contractions, fetal lie and presentation",
        "Sterile speculum examination — visualise pooling of amniotic fluid in posterior fornix",
        "Inspect liquor colour and odour — offensive or green liquor raises infection concern",
        "Do NOT perform digital vaginal examination — increases infection risk",
      ],
      next: "confirm_diagnosis",
    },

    "confirm_diagnosis": {
      type: "treatment",
      title: "Confirming the diagnosis",
      sections: [
        {
          title: "Speculum examination — what to look for",
          items: [
            "Pooling of clear fluid in the posterior fornix = PPROM confirmed clinically",
            "Ask patient to cough or perform Valsalva — may demonstrate fluid leak",
            "Visualise cervix — document dilatation and any signs of cord or membrane prolapse",
          ],
        },
        {
          title: "If no pooling seen — consider confirmatory swab",
          items: [
            "IGFBP-1 (e.g. ActimProm) or PAMG-1 (e.g. AmniSure) vaginal swab",
            "High sensitivity and specificity for amniotic fluid — useful when diagnosis uncertain",
            "Do not perform if speculum confirms pooling — not required",
            "Send high vaginal swab (HVS) for MC&S including GBS regardless of result",
          ],
        },
        {
          title: "SROM at term (≥37+0 weeks)",
          items: [
            "Confirm with speculum ± IGFBP-1/PAMG-1 if uncertain",
            "If GBS positive → offer immediate IOL or caesarean birth",
            "If GBS negative → discuss expectant management vs IOL within 24 hours",
            "Most units offer IOL if not in established labour within 24 hours — follow local protocol",
          ],
        },
      ],
      next: "investigations",
    },

    "investigations": {
      type: "checklist",
      title: "Investigations",
      items: [
        "CTG — confirm fetal wellbeing; assess for signs of fetal compromise or tachycardia",
        "FBC — WCC >17 × 10⁹/L raises concern for infection",
        "CRP — elevated (>10 mg/L) raises concern; trend is more useful than single value",
        "HVS — MC&S including GBS; note: GBS result may not return for 48 hours",
        "MSU — exclude UTI as a precipitant",
        "USS — confirm presentation, placental site, amniotic fluid volume (AFI or deepest pool), estimated fetal weight",
        "Vaginal swab for IGFBP-1 or PAMG-1 if diagnosis uncertain",
      ],
      next: "gestation_management",
    },

    "gestation_management": {
      type: "treatment",
      title: "Management by gestation",
      sections: [
        {
          title: "24+0 to 33+6 weeks",
          items: [
            "Admit to hospital — inpatient management",
            "Antibiotics — as per local trust protocol (RCOG recommends erythromycin 250 mg QDS × 10 days or until labour)",
            "Corticosteroids — offer antenatal corticosteroids (betamethasone 12 mg IM × 2 doses, 24 hours apart)",
            "Magnesium sulphate — consider for neuroprotection if <30 weeks or delivery anticipated <34 weeks; follow local protocol",
            "Expectant management until 37+0 weeks if no contraindications",
            "Do NOT perform digital vaginal examination",
          ],
        },
        {
          title: "34+0 to 36+6 weeks",
          items: [
            "Admit to hospital",
            "Antibiotics — as per local trust protocol",
            "Corticosteroids — consider up to 35+6 weeks (discuss with senior; weigh risks vs benefits)",
            "Discuss with patient: expectant management until 37+0 weeks vs IOL — shared decision-making",
            "No routine IOL before 34+0 weeks unless infection or fetal compromise",
          ],
        },
        {
          title: "37+0 weeks and above (SROM at term)",
          items: [
            "GBS positive → offer immediate IOL or caesarean",
            "GBS negative → discuss expectant vs IOL; offer IOL if not in labour within 24 hours",
            "IV antibiotics in labour if GBS positive or chorioamnionitis suspected — as per local protocol",
            "Continuous EFM in labour",
          ],
        },
      ],
      next: "chorioamnionitis",
    },

    "chorioamnionitis": {
      type: "treatment",
      title: "Monitoring for chorioamnionitis",
      sections: [
        {
          title: "Clinical signs — any combination should prompt senior review",
          items: [
            "Maternal pyrexia ≥37.5°C",
            "Maternal tachycardia >100 bpm",
            "Fetal tachycardia >160 bpm on CTG",
            "Uterine tenderness on palpation",
            "Offensive or discoloured (green/brown) liquor",
            "Raised CRP (>10 mg/L) or raised WCC (>17 × 10⁹/L)",
          ],
        },
        {
          title: "Diagnosis — use combination, not single marker",
          items: [
            "Clinical signs + CRP + WCC + CTG used together (RCOG GTG73)",
            "No single marker is reliably diagnostic in isolation",
            "If clinical chorioamnionitis confirmed → expedite delivery regardless of gestation",
          ],
        },
        {
          title: "Monitoring schedule (inpatient)",
          items: [
            "Maternal observations — minimum 4-hourly: temperature, HR, BP",
            "Daily FBC and CRP",
            "CTG — frequency per senior plan; twice daily as minimum while inpatient",
            "USS — repeat weekly for liquor volume and fetal growth",
          ],
        },
      ],
      next: "escalation",
    },

    "escalation": {
      type: "escalation",
      title: "Escalate — call the senior if…",
      items: [
        "Signs of chorioamnionitis — pyrexia, tachycardia (maternal or fetal), offensive liquor, uterine tenderness",
        "Abnormal or suspicious CTG at any stage",
        "Cord prolapse on speculum — obstetric emergency",
        "Significant antepartum haemorrhage",
        "Meconium-stained liquor",
        "Patient in established labour at any gestation",
        "Rapidly falling liquor volume on USS",
        "Patient distressed or requesting delivery — senior shared decision-making required",
        "PPROM prior to 24+0 weeks — manage with consultant and neonatology involvement",
      ],
      next: "documentation",
    },

    "documentation": {
      type: "end",
      title: "Document on EPR",
      subtitle: "Before you leave the patient",
      items: [
        "Gestation at presentation",
        "Onset and character of fluid loss — colour, odour, amount",
        "Speculum findings — pooling confirmed or not; IGFBP-1/PAMG-1 result if used",
        "CTG result",
        "Investigations sent — FBC, CRP, HVS, MSU, USS findings",
        "GBS status documented",
        "Antibiotics prescribed — drug, dose, route, start date and time (per local protocol)",
        "Corticosteroids if given — drug, dose, batch, time, gestation",
        "Magnesium sulphate if given — indication, dose, monitoring plan",
        "Management plan — expectant vs IOL; senior review plan",
        "Consent discussion documented — risks of expectant management explained",
        "Safety-netting: patient advised of signs of infection and when to call midwife urgently",
      ],
    },

  },
};
