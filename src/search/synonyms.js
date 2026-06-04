export const SYNONYMS = {
  // Skin & wound
  "cellulitis": ["wound","skin infection","soft tissue","cellulitis","redness","erythema","infected wound","co-amoxiclav","flucloxacillin"],
  "skin infection": ["cellulitis","wound","soft tissue","erythema","infected wound"],
  "wound infection": ["cellulitis","cs wound","wound","surgical site","co-amoxiclav"],
  "infected wound": ["cellulitis","wound infection","cs wound","co-amoxiclav"],
  "red wound": ["cellulitis","wound infection","erythema"],
  "perineal infection": ["perineal","episiotomy","wound","cellulitis","soft tissue"],
  // Seizure
  "fitting": ["eclampsia","seizure","convulsion","mgso4"],
  "fit": ["eclampsia","seizure","mgso4"],
  "seizure": ["eclampsia","fitting","convulsion","mgso4"],
  "convulsion": ["eclampsia","seizure","fitting","mgso4"],
  // Discharge
  "how long": ["length of stay","discharge","stay","duration"],
  "go home": ["discharge","criteria","length of stay"],
  "when can she leave": ["discharge criteria","discharge","length of stay"],
  // BP / medication
  "bp meds": ["antihypertensive","labetalol","nifedipine","medication"],
  "blood pressure tablets": ["antihypertensive","labetalol","nifedipine"],
  "high bp": ["hypertension","blood pressure","antihypertensive"],
  // UTI
  "urine infection": ["uti","urinary tract infection","cystitis"],
  "water infection": ["uti","urinary tract infection","cystitis"],
  "wee infection": ["uti","cystitis"],
  "kidney infection": ["pyelonephritis","uti","renal"],
  // CS / section
  "section antibiotics": ["caesarean","lscs","prophylaxis","co-amoxiclav"],
  "cs antibiotics": ["caesarean","lscs","prophylaxis"],
  // GBS
  "gbs": ["group b strep","streptococcus","iap","benzylpenicillin"],
  "strep b": ["gbs","group b strep","iap"],
  // Sepsis / infection
  "bug": ["infection","sepsis","antibiotics"],
  "womb infection": ["endometritis","uterus"],
  "infection after birth": ["endometritis","sepsis","postnatal","puerperal"],
  // Allergy
  "allergy": ["penicillin allergy","teicoplanin","clindamycin","alternative"],
  "pen allergy": ["penicillin allergy","teicoplanin","clindamycin"],
  // Breast
  "sore breast": ["mastitis","breast abscess","breast"],
  "breast infection": ["mastitis","breast abscess","cellulitis","flucloxacillin"],
  // Breastfeeding
  "breastfeed": ["breastfeeding","lactation","safe"],
  // Miscarriage — general
  "mc": ["miscarriage","early pregnancy loss","first trimester"],
  "miscarriage": ["missed miscarriage","incomplete miscarriage","complete miscarriage","threatened","early pregnancy loss"],
  "early pregnancy loss": ["miscarriage","first trimester","epagu"],
  "erpc": ["smm","surgical management of miscarriage","evacuation","surgical"],
  "evacuation": ["smm","erpc","surgical management of miscarriage","theatre"],
  "pregnancy loss": ["miscarriage","missed miscarriage","incomplete","complete"],
  "retained products": ["incomplete miscarriage","erpc","smm","poc","retained"],
  "poc": ["products of conception","retained products","histology","smm"],
  "products of conception": ["poc","retained products","smm","histology"],
  // Miscarriage — types
  "missed mc": ["missed miscarriage","no heartbeat","anembryonic"],
  "silent miscarriage": ["missed miscarriage","no heartbeat","anembryonic"],
  "blighted ovum": ["anembryonic","missed miscarriage","gestation sac"],
  "no heartbeat": ["missed miscarriage","fetal loss","anembryonic"],
  "incomplete mc": ["incomplete miscarriage","retained products","open os"],
  "threatened mc": ["threatened","viable","bleeding in pregnancy"],
  "threatened miscarriage": ["viable","threatened","bleeding","progesterone"],
  // Medical management of miscarriage
  "mifepristone": ["mifepristone","misoprostol","medical management","200mg"],
  "misoprostol": ["misoprostol","mifepristone","medical management","800mcg"],
  "medical miscarriage": ["mifepristone","misoprostol","medical management","cg621"],
  "pills for miscarriage": ["mifepristone","misoprostol","medical management"],
  // Ectopic
  "ectopic": ["ectopic pregnancy","methotrexate","mtx","bhcg","tubal","unruptured"],
  "ectopic pregnancy": ["methotrexate","mtx","bhcg","tubal","unruptured","ectopic"],
  "tube": ["ectopic pregnancy","tubal","fallopian","bhcg"],
  "mtx": ["methotrexate","ectopic","bhcg","day 4","day 7"],
  "methotrexate": ["mtx","ectopic","bhcg","day 4","day 7","cytotoxic"],
  "bhcg": ["beta hcg","ectopic","bhcg monitoring","day 4","day 7"],
  "beta hcg": ["bhcg","ectopic","monitoring"],
  "tubal": ["ectopic","tubal pregnancy","fallopian","mtx"],
  "shoulder tip pain": ["ectopic","haemorrhage","rupture","attend ed"],
  // PPRoM
  "pprom": ["pprom","preterm","rupture of membranes","amoxicillin","azithromycin","liquor","amni-sure"],
  "waters broken": ["pprom","rupture of membranes","liquor","amni-sure"],
  "membranes": ["pprom","rupture","liquor","preterm"],
  "liquor": ["pprom","amniotic fluid","amni-sure","rupture of membranes"],
  "amni-sure": ["pprom","liquor","rupture of membranes"],
  "preterm rupture": ["pprom","premature rupture","membranes","amoxicillin"],
  "chorioamnionitis": ["pprom","infection","antibiotics","delivery","sepsis"],
  // PUV / uncertain viability
  "uncertain viability": ["puv","pregnancy of uncertain viability","rescan","7-14 days"],
  "puv": ["uncertain viability","rescan","gestation sac","fetal pole"],
  "pul": ["pregnancy of unknown location","ectopic","bhcg","complete miscarriage"],
  "pregnancy of unknown location": ["pul","ectopic","bhcg","complete miscarriage"],
};
