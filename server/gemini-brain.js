import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBhpN4x8woJTLKohK-GXjp8KMxSZA4E9C8';

// High-availability candidate models
const CANDIDATE_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-flash-latest',
];

// Friendly, Authentic Vedic Astrologer System Prompt
const VEDIC_SYSTEM_PROMPT = `
You are a warm, friendly, and authentic Vedic Astrologer (ज्योतिषी).
You speak directly to the person like a wise, caring mentor having a real conversation.

CRITICAL RULES:
1. KEEP RESPONSES SHORT & CONCISE: Maximum 3 to 5 simple sentences (or 3 brief bullet points). Never generate long essays or wall-of-text explanations.
2. SIMPLE, EVERYDAY WORDS ONLY: Avoid heavy academic jargon, difficult English words, or confusing terminology. Keep it warm, clear, and reassuring.
3. LANGUAGE MATCHING:
   - If the user writes or asks in Marathi (or mentions Marathi), respond in natural, sweet Marathi (मराठी).
   - If the user writes in Hindi, respond in polite, natural Hindi (हिंदी).
   - If the user writes in English, respond in simple, everyday English that anyone can easily understand.
4. GROUND TRUTH: Base your brief advice on the native's Lagna, Moon sign, active Mahadasha/Antardasha, or 10th/7th house provided in the prompt. Give direct, practical advice.
`;

// Helper: Call Gemini with automatic model failover
async function callGemini(contents, systemInstruction = VEDIC_SYSTEM_PROMPT) {
  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const payload = {
        contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 350,
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.error) {
        lastError = new Error(`Gemini [${model}] Error: ${data.error.message || JSON.stringify(data.error)}`);
        continue;
      }

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text.trim();
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini candidate models failed to return a response.');
}

// Concise Deterministic Career Report (Simple words)
function generateDeterministicCareerReport(chartData, lang = 'mr') {
  const lagna = chartData?.lagna?.sign || 'मेष (Aries)';
  const tenthLord = chartData?.careerAnalysis?.tenthLord || 'बुध';
  const currentMaha = chartData?.currentDasha?.maha || 'गुरू';
  const currentAntar = chartData?.currentDasha?.antar || 'शनी';

  if (lang === 'mr') {
    return `तुमचे लग्न **${lagna}** असून १० व्या भावाचा स्वामी **${tenthLord}** आहे.
सध्या **${currentMaha}** महादशेत **${currentAntar}** ची अंतर्दशा चालू आहे.
- **सल्ला:** नोकरी व व्यवसायात नवीन जबाबदाऱ्या स्वीकारण्यासाठी हा काळ चांगला आहे.
- **अनुकूल क्षेत्र:** तंत्रज्ञान, व्यवस्थापन, नियोजन आणि सल्लागार कामे.
- **मार्गदर्शन:** घाईगडबड न करता कामात शिस्त ठेवा, नक्कीच यश आणि सन्मान मिळेल.`;
  }
  if (lang === 'hi') {
    return `आपका लग्न **${lagna}** है और दशमेश **${tenthLord}** है।
वर्तमान में **${currentMaha}** महादशा में **${currentAntar}** की अंतर्दशा चल रही है।
- **सलाह:** कार्यक्षेत्र और व्यवसाय में उन्नति के लिए समय अनुकूल है।
- **शुभ क्षेत्र:** तकनीक, प्रबंधन, व्यापार और योजनाबद्ध कार्य।
- **मार्गदर्शन:** धैर्य और लगन से काम करें, आपको निश्चित सफलता और मान-सम्मान मिलेगा।`;
  }
  return `Your Ascendant is **${lagna}** and 10th house is governed by **${tenthLord}**.
Currently, you are running **${currentMaha}** Mahadasha with **${currentAntar}** Antardasha.
- **Key Advice:** Favorable time for career growth and taking on greater leadership roles.
- **Best Domains:** Technology, management, consulting, and business administration.
- **Guidance:** Stay disciplined and avoid impulsive career switches; steady focus brings solid rewards.`;
}

// Concise Deterministic Marriage Report (Simple words)
function generateDeterministicMarriageReport(chartData, lang = 'mr') {
  const hasDosha = chartData?.marriageAnalysis?.hasMangalDosha;
  const doshaDetails = chartData?.marriageAnalysis?.doshaDetails || '';

  if (lang === 'mr') {
    return `तुमच्या कुंडलीनुसार सप्तम भाव आणि नवांश चक्र अनुकूल आहे.
${hasDosha ? `• **मंगळ प्रभाव:** ${doshaDetails} परस्पर संवादात संयम ठेवल्यास नाते अधिक दृढ होईल.` : '• **मंगळ स्थिती:** कुंडलीत कोणताही मंगळ दोष नाही, वैवाहिक जीवनात स्थैर्य राहील.'}
- **नात्याचा सल्ला:** जोडीदाराशी मनमोकळा संवाद ठेवा आणि एकमेकांच्या मतांचा आदर करा.
- **शुभ संकेत:** वैवाहिक जीवनात प्रेम, सहकार्य आणि कौटुंबिक आनंद उत्तम लाभेल.`;
  }
  if (lang === 'hi') {
    return `आपकी कुंडली के अनुसार सप्तम भाव और नवांश चक्र शुभ है।
${hasDosha ? `• **मंगल प्रभाव:** ${doshaDetails} आपसी बातचीत में संयम रखें, संबंध मधुर रहेंगे।` : '• **मंगल स्थिति:** कुंडली में कोई गंभीर मंगल दोष नहीं है, दांपत्य जीवन स्थिर रहेगा।'}
- **सलाह:** जीवनसाथी के साथ खुलकर बात करें और एक-दूसरे के विचारों का सम्मान करें।
- **संकेत:** वैवाहिक जीवन में प्रेम, सहयोग और सुखद माहौल बना रहेगा।`;
  }
  return `Your 7th house and Navamsha chart indicate harmony in partnerships.
${hasDosha ? `• **Mars Energy:** ${doshaDetails} Open communication and patience ensure deep mutual understanding.` : '• **Mars Alignment:** No acute Manglik Dosha detected; stability and domestic peace are well supported.'}
- **Advice:** Value each other's opinions and maintain honest, compassionate communication.
- **Outlook:** Strong mutual loyalty, growth, and joyful companionship.`;
}

// Concise Deterministic Daily Report (Simple words)
function generateDeterministicDailyReport(chartData, dailyData, lang = 'mr') {
  const chandraScore = dailyData?.chandraBala?.score || 8;
  const tithi = dailyData?.panchang?.tithi || 'शुभ तिथी';
  const vaar = dailyData?.panchang?.vaar || 'आजचा दिवस';
  const summary = dailyData?.summary;

  if (summary) return summary;

  if (lang === 'mr') {
    return `आज ${vaar}, ${tithi} असून चंद्रबल ${chandraScore}/10 आहे.
- **आजचा मूड:** मन प्रसन्न राहील, रखडलेली कामे मार्गी लावण्यासाठी दिवस चांगला आहे.
- **काळजी:** पैशांचे व्यवहार करताना सावध राहा आणि अनावश्यक वाद टाळा.
- **शुभ कृती:** दिवसाची सुरुवात शांततेने करा; कामात अपेक्षित यश मिळेल.`;
  }
  if (lang === 'hi') {
    return `आज ${vaar}, ${tithi} है और चंद्रबल ${chandraScore}/10 है।
- **आज का दिन:** मन शांत और उत्साही रहेगा, महत्वपूर्ण कार्यों के लिए समय अनुकूल है।
- **सावधानी:** आर्थिक मामलों में सावधानी बरतें और व्यर्थ के विवाद से बचें।
- **सलाह:** योजनाबद्ध तरीके से काम करें, आज आपको सकारात्मक परिणाम मिलेंगे।`;
  }
  return `Today is an auspicious day with Lunar Force (Chandra Bala) at ${chandraScore}/10.
- **Today's Energy:** Good mental clarity and positive enthusiasm for completing tasks.
- **Caution:** Be mindful with financial expenses and avoid unnecessary arguments.
- **Guidance:** Start your day calmly; focus on priorities and steady progress.`;
}

// Concise Deterministic Chat Response (Real conversational tone)
function generateDeterministicChatResponse(question, chartData, lang = 'mr') {
  const q = question.toLowerCase();
  const lagna = chartData?.lagna?.sign || 'मेष';
  const moon = chartData?.planets?.Moon?.sign || 'वृषभ';
  const maha = chartData?.currentDasha?.maha || 'गुरू';
  const antar = chartData?.currentDasha?.antar || 'शनी';
  const until = chartData?.currentDasha?.until || '2028';
  const hasDosha = chartData?.marriageAnalysis?.hasMangalDosha;

  const isMarathi = lang === 'mr' || (!lang && /[\u0900-\u097F]/.test(question));
  const isHindi = lang === 'hi';

  if (q.includes('career') || q.includes('job') || q.includes('नोकरी') || q.includes('काम') || q.includes('करिअर') || q.includes('business')) {
    if (isMarathi) {
      return `तुमचे लग्न **${lagna}** असून सध्या **${maha}** महादशेत **${antar}** अंतर्दशा (${until} पर्यंत) चालू आहे. करिअरच्या दृष्टीने हा काळ चांगला असून नवीन जबाबदाऱ्या किंवा प्रगतीचे योग आहेत. घाईत निर्णय न घेता स्थिरपणे काम करा, नक्कीच यश मिळेल.`;
    }
    if (isHindi) {
      return `आपका लग्न **${lagna}** है और वर्तमान में **${maha}-${antar}** की दशा (${until} तक) सक्रिय है। करियर में उन्नति और नए अवसरों के लिए समय बहुत अनुकूल है। धैर्य से काम लें, सफलता अवश्य मिलेगी।`;
    }
    return `With your **${lagna}** Ascendant and active **${maha}-${antar}** Dasha (until ${until}), this is a promising period for career stability and taking on new responsibilities. Focus on building solid skills and avoid hasty changes.`;
  }

  if (q.includes('marriage') || q.includes('लग्न') || q.includes('विवाह') || q.includes('love') || q.includes('नाते') || q.includes('जोडीदार')) {
    if (isMarathi) {
      return `तुमच्या कुंडलीत सप्तम भाव चांगला आहे. ${hasDosha ? 'मंगळाचा प्रभाव असल्याने समजूतदार जोडीदार निवडणे आणि संवादात शांतता ठेवणे हिताचे ठरेल.' : 'कोणताही मोठा मंगळ दोष नाही, वैवाहिक जीवनात सामंजस्य आणि प्रेम राहील.'} एकमेकांचा आदर ठेवल्यास संसार अतिशय सुखी होईल.`;
    }
    if (isHindi) {
      return `आपकी कुंडली में सप्तम भाव शुभ है। ${hasDosha ? 'मंगल प्रभाव के कारण जीवनसाथी के साथ बातचीत में धैर्य रखें।' : 'कोई गंभीर मंगल दोष नहीं है, दांपत्य जीवन में सुख और सामंजस्य रहेगा।'} आपसी सम्मान से संबंध बहुत मधुर रहेगा।`;
    }
    return `Your chart indicates supportive partnership harmony. ${hasDosha ? 'Active Mars energy calls for open, honest communication and mutual patience.' : 'There is no heavy affliction; your bond will be grounded in mutual trust and respect.'}`;
  }

  if (q.includes('aaj') || q.includes('today') || q.includes('diwas') || q.includes('आज') || q.includes('दिन')) {
    if (isMarathi) {
      return `आजच्या गोचरानुसार चंद्र **${moon}** राशीशी संबंधित अनुकूल भ्रमण करत आहे. दिवस उत्साहाचा राहील. महत्त्वाची कामे शांततेने मार्गी लावा आणि घाईगडबडीत निर्णय घेणे टाळा.`;
    }
    if (isHindi) {
      return `आज के गोचर में चंद्रमा **${moon}** राशि के प्रभाव में अनुकूल है। दिन सकारात्मक रहेगा। जरूरी काम धैर्य से पूरे करें और अनावश्यक तनाव से बचें।`;
    }
    return `Today's transit moon supports mental clarity and focus. It is a good day to accomplish pending work, stay centered, and avoid unnecessary stress.`;
  }

  // Friendly default
  if (isMarathi) {
    return `नमस्कार! तुमच्या कुंडलीनुसार तुमचे लग्न **${lagna}** आणि चंद्रराशी **${moon}** आहे. सध्या **${maha}** ची महादशा चालू आहे. तुम्हाला करिअर, विवाह किंवा आजच्या दिवसाबद्दल काही विचारायचे असल्यास अगदी साध्या भाषेत सांगा, मी लगेच मदत करतो.`;
  }
  if (isHindi) {
    return `नमस्ते! आपकी कुंडली में लग्न **${lagna}** और चंद्र राशि **${moon}** है। वर्तमान में **${maha}** की महादशा चल रही है। आप करियर, विवाह या आज के दिन से जुड़ा कोई भी प्रश्न पूछ सकते हैं।`;
  }
  return `Hello! In your chart, your Ascendant is **${lagna}**, Moon sign is **${moon}**, and you are currently in **${maha}** Mahadasha. Feel free to ask about your career, marriage, or today's horoscope, and I will share simple, direct advice!`;
}

// Generate Domain Analysis
export async function generateDomainAnalysis({ domain, chartData, dailyData, lang = 'mr' }) {
  try {
    const chartSummary = {
      lagna: chartData.lagna?.sign,
      moon: `${chartData.planets?.Moon?.sign} (${chartData.planets?.Moon?.nakshatra})`,
      sun: `${chartData.planets?.Sun?.sign}`,
      currentDasha: `${chartData.currentDasha?.maha} - ${chartData.currentDasha?.antar} until ${chartData.currentDasha?.until}`,
      tenthLord: chartData.careerAnalysis?.tenthLord,
      mangalDosha: chartData.marriageAnalysis?.hasMangalDosha,
      lang: lang || 'mr'
    };

    let prompt = `Provide a SHORT, CONCISE, and WARM astrological synthesis for '${domain}' in simple everyday ${lang === 'mr' ? 'Marathi (मराठी)' : (lang === 'hi' ? 'Hindi (हिंदी)' : 'English')}.
Keep it strictly under 4-5 sentences or 3 brief bullet points. No complex words.
Chart details: ${JSON.stringify(chartSummary)}`;

    const contents = [{ parts: [{ text: prompt }] }];
    return await callGemini(contents);
  } catch (err) {
    console.warn('[Gemini Fallback Activated for Domain Analysis]:', err.message);
    if (domain === 'career') return generateDeterministicCareerReport(chartData, lang);
    if (domain === 'marriage') return generateDeterministicMarriageReport(chartData, lang);
    if (domain === 'daily') return generateDeterministicDailyReport(chartData, dailyData, lang);
    return generateDeterministicCareerReport(chartData, lang);
  }
}

// Interactive Chat with AI Astrologer (Short, conversational responses)
export async function chatWithAIAstrologer({ question, chartData, history = [], lang = 'mr' }) {
  try {
    const chartContext = `
[USER CHART SUMMARY]:
- Lagna: ${chartData?.lagna?.sign}
- Moon: ${chartData?.planets?.Moon?.sign} (${chartData?.planets?.Moon?.nakshatra})
- Active Dasha: ${chartData?.currentDasha?.maha} / ${chartData?.currentDasha?.antar} until ${chartData?.currentDasha?.until}
- Preferred Language: ${lang || 'mr'}
`;

    const contents = [
      { role: 'user', parts: [{ text: `Here is the user's verified birth chart:\n${chartContext}` }] },
      { role: 'model', parts: [{ text: 'मी समजलो. मी साध्या, प्रेमळ आणि थेट शब्दांत अचूक व मोजके मार्गदर्शन देईन.' }] },
    ];

    for (const h of history.slice(-4)) {
      contents.push({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: `${question}\n(Rule: Reply concisely in 2-4 simple, warm sentences without complex jargon. Answer in ${lang === 'mr' ? 'Marathi' : lang === 'hi' ? 'Hindi' : 'English'}.)` }],
    });

    return await callGemini(contents);
  } catch (err) {
    console.warn('[Gemini Fallback Activated for Chat]:', err.message);
    return generateDeterministicChatResponse(question, chartData, lang);
  }
}

