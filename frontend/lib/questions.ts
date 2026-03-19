export type Language = 'en' | 'hi' | 'mr'

export interface Question {
  id: string
  category: 'risk' | 'symptom' | 'lifestyle'
  question: Record<Language, string>
  options: { value: string; label: Record<Language, string>; points: number }[]
}

export const QUESTIONS: Question[] = [
  {
    id: 'age', category: 'risk',
    question: { en: 'How old are you?', hi: 'आपकी उम्र क्या है?', mr: 'तुमचे वय किती आहे?' },
    options: [
      { value: 'under40', label: { en: 'Under 40', hi: '40 से कम', mr: '40 पेक्षा कमी' }, points: 0 },
      { value: '40to60',  label: { en: '40 – 60',  hi: '40 से 60',  mr: '40 ते 60' },       points: 8 },
      { value: 'over60',  label: { en: 'Over 60',  hi: '60 से अधिक', mr: '60 पेक्षा जास्त' }, points: 15 },
    ],
  },
  {
    id: 'diabetes', category: 'risk',
    question: { en: 'Do you have diabetes?', hi: 'क्या आपको मधुमेह है?', mr: 'तुम्हाला मधुमेह आहे का?' },
    options: [
      { value: 'yes',     label: { en: 'Yes',      hi: 'हाँ',       mr: 'होय' },       points: 30 },
      { value: 'no',      label: { en: 'No',       hi: 'नहीं',      mr: 'नाही' },      points: 0  },
      { value: 'unsure',  label: { en: 'Not sure', hi: 'पता नहीं',  mr: 'माहीत नाही' }, points: 5  },
    ],
  },
  {
    id: 'htn', category: 'risk',
    question: { en: 'Do you have high blood pressure?', hi: 'क्या आपको उच्च रक्तचाप है?', mr: 'तुम्हाला उच्च रक्तदाब आहे का?' },
    options: [
      { value: 'yes',    label: { en: 'Yes',      hi: 'हाँ',      mr: 'होय' },       points: 25 },
      { value: 'no',     label: { en: 'No',       hi: 'नहीं',     mr: 'नाही' },      points: 0  },
      { value: 'unsure', label: { en: 'Not sure', hi: 'पता नहीं', mr: 'माहीत नाही' }, points: 5  },
    ],
  },
  {
    id: 'family', category: 'risk',
    question: { en: 'Does anyone in your family have kidney disease?', hi: 'क्या आपके परिवार में किसी को किडनी की बीमारी है?', mr: 'तुमच्या कुटुंबातील कोणाला मूत्रपिंडाचा आजार आहे का?' },
    options: [
      { value: 'yes',    label: { en: 'Yes',      hi: 'हाँ',      mr: 'होय' },       points: 10 },
      { value: 'no',     label: { en: 'No',       hi: 'नहीं',     mr: 'नाही' },      points: 0  },
      { value: 'unsure', label: { en: 'Not sure', hi: 'पता नहीं', mr: 'माहीत नाही' }, points: 3  },
    ],
  },
  {
    id: 'swelling', category: 'symptom',
    question: { en: 'Do your feet or ankles swell by evening?', hi: 'क्या शाम तक आपके पैर या टखने सूज जाते हैं?', mr: 'संध्याकाळपर्यंत तुमचे पाय किंवा घोटे सुजतात का?' },
    options: [
      { value: 'often',     label: { en: 'Often',     hi: 'अक्सर',    mr: 'नेहमी' },    points: 15 },
      { value: 'sometimes', label: { en: 'Sometimes', hi: 'कभी-कभी', mr: 'कधीकधी' }, points: 6  },
      { value: 'never',     label: { en: 'Never',     hi: 'कभी नहीं', mr: 'कधीच नाही' }, points: 0  },
    ],
  },
  {
    id: 'fatigue', category: 'symptom',
    question: { en: 'Do you feel unusually tired for no clear reason?', hi: 'क्या आप बिना किसी स्पष्ट कारण के असामान्य रूप से थका हुआ महसूस करते हैं?', mr: 'तुम्हाला कोणत्याही स्पष्ट कारणाशिवाय असामान्य थकवा जाणवतो का?' },
    options: [
      { value: 'often',     label: { en: 'Often',     hi: 'अक्सर',    mr: 'नेहमी' },    points: 8 },
      { value: 'sometimes', label: { en: 'Sometimes', hi: 'कभी-कभी', mr: 'कधीकधी' }, points: 3 },
      { value: 'never',     label: { en: 'Never',     hi: 'कभी नहीं', mr: 'कधीच नाही' }, points: 0 },
    ],
  },
  {
    id: 'urination', category: 'symptom',
    question: { en: 'Has your urination changed — more frequent, less, foamy, or dark coloured?', hi: 'क्या आपके पेशाब में बदलाव आया है — अधिक, कम, झागदार, या गहरे रंग का?', mr: 'तुमच्या लघवीत बदल झाला आहे का — जास्त, कमी, फेसाळ किंवा गडद रंगाची?' },
    options: [
      { value: 'yes',    label: { en: 'Yes, I\'ve noticed changes', hi: 'हाँ, बदलाव देखा है', mr: 'होय, बदल जाणवला' }, points: 20 },
      { value: 'no',     label: { en: 'No, normal',                hi: 'नहीं, सामान्य है',  mr: 'नाही, सामान्य आहे' }, points: 0  },
    ],
  },
  {
    id: 'back_pain', category: 'symptom',
    question: { en: 'Do you have persistent back or side pain (not from exercise)?', hi: 'क्या आपको पीठ या बाजू में लगातार दर्द है (व्यायाम से नहीं)?', mr: 'तुम्हाला पाठ किंवा बाजूला सतत वेदना आहेत का (व्यायामामुळे नाही)?' },
    options: [
      { value: 'yes', label: { en: 'Yes', hi: 'हाँ',  mr: 'होय' }, points: 10 },
      { value: 'no',  label: { en: 'No',  hi: 'नहीं', mr: 'नाही' }, points: 0  },
    ],
  },
  {
    id: 'painkillers', category: 'lifestyle',
    question: { en: 'Do you regularly take painkillers like ibuprofen or diclofenac?', hi: 'क्या आप नियमित रूप से दर्दनिवारक जैसे ibuprofen या diclofenac लेते हैं?', mr: 'तुम्ही नियमितपणे ibuprofen किंवा diclofenac सारख्या वेदनाशामक घेता का?' },
    options: [
      { value: 'daily',  label: { en: 'Daily or almost daily', hi: 'रोज या लगभग रोज', mr: 'दररोज किंवा जवळजवळ दररोज' }, points: 15 },
      { value: 'weekly', label: { en: 'Weekly',                hi: 'साप्ताहिक',       mr: 'साप्ताहिक' },                points: 5  },
      { value: 'rarely', label: { en: 'Rarely or never',       hi: 'कभी-कभी या नहीं', mr: 'क्वचितच किंवा कधीच नाही' },  points: 0  },
    ],
  },
  {
    id: 'creatinine', category: 'lifestyle',
    question: { en: 'Has any blood test ever shown high creatinine or kidney issues?', hi: 'क्या कभी किसी रक्त परीक्षण में उच्च क्रिएटिनिन या किडनी की समस्या सामने आई है?', mr: 'कोणत्याही रक्त चाचणीत कधी उच्च क्रिएटिनिन किंवा मूत्रपिंडाची समस्या दिसली का?' },
    options: [
      { value: 'yes',        label: { en: 'Yes',          hi: 'हाँ',             mr: 'होय' },             points: 35 },
      { value: 'no',         label: { en: 'No',           hi: 'नहीं',            mr: 'नाही' },            points: 0  },
      { value: 'never_tested', label: { en: 'Never tested', hi: 'कभी जांच नहीं हुई', mr: 'कधीच तपासणी नाही' }, points: 5  },
    ],
  },
]

export interface RiskResult {
  score: number
  level: 'low' | 'medium' | 'high' | 'critical'
  label: Record<Language, string>
  color: string
  bgClass: string
  recommendation: Record<Language, string>
}

export function calculateRisk(answers: Record<string, string>): RiskResult {
  let score = 0
  for (const q of QUESTIONS) {
    const answer = answers[q.id]
    if (answer) {
      const opt = q.options.find(o => o.value === answer)
      if (opt) score += opt.points
    }
  }

  if (score <= 20) return {
    score, level: 'low', color: '#16a34a', bgClass: 'risk-low',
    label: { en: 'Low Risk', hi: 'कम जोखिम', mr: 'कमी धोका' },
    recommendation: {
      en: 'Your kidney health looks good. Stay hydrated, reduce salt, and get an annual checkup.',
      hi: 'आपकी किडनी का स्वास्थ्य अच्छा दिखता है। हाइड्रेटेड रहें, नमक कम करें और वार्षिक जांच करवाएं।',
      mr: 'तुमच्या मूत्रपिंडाचे आरोग्य चांगले दिसते. पाणी पिण्याची सवय ठेवा, मीठ कमी करा.',
    },
  }
  if (score <= 50) return {
    score, level: 'medium', color: '#d97706', bgClass: 'risk-medium',
    label: { en: 'Medium Risk', hi: 'मध्यम जोखिम', mr: 'मध्यम धोका' },
    recommendation: {
      en: 'Some risk factors detected. Get a basic kidney blood test (creatinine + urea) at any diagnostic lab. Costs ₹200–400.',
      hi: 'कुछ जोखिम कारक पाए गए। किसी भी डायग्नोस्टिक लैब में बुनियादी किडनी रक्त परीक्षण (क्रिएटिनिन + यूरिया) करवाएं।',
      mr: 'काही जोखीम घटक आढळले. कोणत्याही निदान प्रयोगशाळेत मूलभूत मूत्रपिंड रक्त चाचणी (क्रिएटिनिन + युरिया) करा.',
    },
  }
  if (score <= 80) return {
    score, level: 'high', color: '#dc2626', bgClass: 'risk-high',
    label: { en: 'High Risk', hi: 'उच्च जोखिम', mr: 'उच्च धोका' },
    recommendation: {
      en: 'Multiple risk factors found. Please see a nephrologist within 2 weeks. Early treatment can prevent dialysis.',
      hi: 'कई जोखिम कारक मिले। कृपया 2 सप्ताह के भीतर एक नेफ्रोलॉजिस्ट से मिलें। जल्दी उपचार डायलिसिस को रोक सकता है।',
      mr: 'अनेक जोखीम घटक आढळले. कृपया 2 आठवड्यांत नेफ्रोलॉजिस्टला भेटा. लवकर उपचार डायलिसिस टाळू शकतो.',
    },
  }
  return {
    score, level: 'critical', color: '#be123c', bgClass: 'risk-critical',
    label: { en: 'Critical Risk', hi: 'गंभीर जोखिम', mr: 'गंभीर धोका' },
    recommendation: {
      en: 'Urgent: Please see a kidney specialist as soon as possible. Do not delay.',
      hi: 'जरूरी: कृपया जल्द से जल्द किडनी विशेषज्ञ से मिलें। देरी न करें।',
      mr: 'तातडीचे: कृपया शक्य तितक्या लवकर मूत्रपिंड तज्ञांना भेटा. उशीर करू नका.',
    },
  }
}

export function mapAnswersToMLFeatures(answers: Record<string, string>) {
  const ageMap: Record<string, number> = { under40: 30, '40to60': 50, over60: 65 }
  return {
    age:  ageMap[answers.age] ?? null,
    bp:   answers.htn === 'yes' ? 140 : answers.htn === 'no' ? 80 : null,
    dm:   answers.diabetes === 'yes' ? 'yes' : answers.diabetes === 'no' ? 'no' : null,
    htn:  answers.htn === 'yes' ? 'yes' : answers.htn === 'no' ? 'no' : null,
    pe:   answers.swelling === 'often' ? 'yes' : answers.swelling === 'never' ? 'no' : null,
    ane:  answers.fatigue === 'often' ? 'yes' : 'no',
    sc:   answers.creatinine === 'yes' ? 3.5 : null,
    cad:  'no',
    appet: answers.fatigue === 'often' ? 'poor' : 'good',
  }
}
