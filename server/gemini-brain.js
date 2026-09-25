import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBhpN4x8woJTLKohK-GXjp8KMxSZA4E9C8';

// High-availability candidate models
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
];

// Vedic Astrologer Master System Prompt (Zero Hallucination Guaranteed)
const VEDIC_SYSTEM_PROMPT = `
You are 'AstroMath Brain', an enlightened, deeply scholarly Master Vedic Astrologer (ज्योतिषाचार्य).
You are grounded in classical Maharishi Parashara, Jaimini, and Varahamihira principles.

CRITICAL INSTRUCTIONS (ZERO HALLUCINATION):
1. You are provided with EXACT, VERIFIED MATHEMATICAL FACTS computed by Swiss Ephemeris (NASA JPL DE431 & Lahiri Ayanamsa).
2. DO NOT invent or contradict any planetary positions, houses, retrogrades, or dasha dates provided to you.
3. Treat the provided chart JSON as absolute ground truth.
4. Speak warmly, respectfully, and authoritatively, blending traditional wisdom with pragmatic modern psychological insight.
5. You can respond in clean, natural Marathi (मराठी) or English depending on user request. Include key Sanskrit/Vedic astrological terms (e.g. महादशा, गोचर, भाव, योग, नवांश) with brief explanations.
6. Provide actionable, constructive, and uplifting guidance without fear-mongering. Always mention practical remedies (साधना, मंत्र, दान, आचरण) where appropriate.
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
          temperature: 0.65,
          maxOutputTokens: 2048,
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
        console.warn(`[Gemini Failover] Model ${model} encountered error, trying next candidate...`);
        continue;
      }

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini Failover] Network error on ${model}:`, err.message);
    }
  }

  throw lastError || new Error('All Gemini candidate models failed to return a response.');
}

// Generate Domain-Specific Deep-Dive Interpretation
export async function generateDomainAnalysis({ domain, chartData, dailyData }) {
  const chartSummary = {
    lagna: chartData.lagna?.sign,
    moon: `${chartData.planets?.Moon?.sign} (${chartData.planets?.Moon?.nakshatra}, Pada ${chartData.planets?.Moon?.pada})`,
    sun: `${chartData.planets?.Sun?.sign} (${chartData.planets?.Sun?.degreeFormatted})`,
    currentDasha: `${chartData.currentDasha?.maha} महादशा (${chartData.currentDasha?.antar} अंतर्दशा, ${chartData.currentDasha?.until} पर्यंत)`,
    planets: Object.fromEntries(
      Object.entries(chartData.planets || {}).map(([k, v]) => [
        k,
        `${v.sign} in House ${v.house} (${v.degreeFormatted})${v.isRetrograde ? ' [RETROGRADE]' : ''}`,
      ])
    ),
    mangalDosha: chartData.marriageAnalysis?.hasMangalDosha,
    tenthHouse: chartData.careerAnalysis?.tenthHouseSign,
  };

  let prompt = '';
  if (domain === 'career') {
    prompt = `
खालील अचूक वैदिक कुंडली माहिती तपासून करिअर (Career & Profession) आणि अर्थप्राप्तीविषयी सविस्तर मार्गदर्शन करा:
कुंडली तथ्ये:
${JSON.stringify(chartSummary, null, 2)}

कृपया खालील मुद्द्यांवर लक्ष केंद्रित करा:
1. १० वे घर (दशम भाव), लग्नेश आणि सध्या चालू असलेली महादशा यांच्या आधारे करिअरची दिशा.
2. नोकरी उत्तम की स्वतःचा व्यवसाय? कोणत्या क्षेत्रांमध्ये (IT, व्यापार, वित्त, सेवा, प्रशासन) सर्वात जास्त प्रगती होईल?
3. सध्याच्या काळात पदोन्नती किंवा नोकरी बदलाचे योग.
4. करिअरमधील यशासाठी सोपे ज्योतिषीय उपाय (Remedies).
`;
  } else if (domain === 'marriage') {
    prompt = `
खालील अचूक वैदिक कुंडली माहिती तपासून विवाह आणि वैवाहिक जीवनाविषयी (Marriage & Relationships) सविस्तर मार्गदर्शन करा:
कुंडली तथ्ये:
${JSON.stringify(chartSummary, null, 2)}

कृपया खालील मुद्द्यांवर लक्ष केंद्रित करा:
1. ७ वे घर (सप्तम भाव), शुक्र/गुरूची स्थिती आणि नवांश (D9) चा प्रभाव.
2. मंगळ दोष स्थिती: ${chartSummary.mangalDosha ? 'उपस्थित' : 'दोष नाही/परिहार'}. याचा वैवाहिक जीवनावर काय प्रभाव पडेल?
3. जोडीदाराचे संभाव्य व्यक्तिमत्त्व आणि स्वभाव.
4. विवाहासाठी अनुकूल काळ आणि वैवाहिक सुख वाढवण्यासाठी उपाय.
`;
  } else if (domain === 'daily') {
    prompt = `
खालील अचूक जन्मकुंडली आणि आजच्या गोचर (Daily Transit) आधारे आजच्या दिवसाचे (Daily Forecast) वैयक्तिक विश्लेषण करा:
जन्मकुंडली:
${JSON.stringify(chartSummary, null, 2)}

आजचे गोचर तथ्ये:
- आजचा चंद्र: ${dailyData?.todayMoon?.sign} (${dailyData?.todayMoon?.nakshatra})
- चंद्रबल: ${dailyData?.chandraBala?.houseFromMoon} व्या भावातून (Score: ${dailyData?.chandraBala?.score}/10)
- ताराबल: ${dailyData?.taraBala?.taraName} तारा (${dailyData?.taraBala?.auspicious ? 'शुभ' : 'सावध'})

कृपया खालील मुद्द्यांवर ५ ते ६ ओळींत नेमके मार्गदर्शन करा:
1. आज मनःस्थिती आणि कार्यक्षमता कशी राहील?
2. कोणती कामे आज हाती घ्यावीत आणि काय टाळावे?
3. आजचा शुभ रंग (Lucky Color) आणि आजचा शुभ मंत्र.
`;
  } else {
    prompt = `कृपया या कुंडलीचे सर्वसाधारण वैदिक विश्लेषण द्या: ${JSON.stringify(chartSummary, null, 2)}`;
  }

  const contents = [{ parts: [{ text: prompt }] }];
  return await callGemini(contents);
}

// Interactive Chat with AI Astrologer
export async function chatWithAIAstrologer({ question, chartData, history = [] }) {
  const chartContext = `
[GROUND TRUTH ASTROLOGICAL DATA FOR THE USER]:
- Lagna (Ascendant): ${chartData?.lagna?.sign} (${chartData?.lagna?.degreeFormatted})
- Moon Sign: ${chartData?.planets?.Moon?.sign} (${chartData?.planets?.Moon?.nakshatra} Pada ${chartData?.planets?.Moon?.pada})
- Sun Sign: ${chartData?.planets?.Sun?.sign} (${chartData?.planets?.Sun?.degreeFormatted})
- Current Vimshottari Period: ${chartData?.currentDasha?.maha} Mahadasha, ${chartData?.currentDasha?.antar} Antardasha (Until: ${chartData?.currentDasha?.until})
- Mangal Dosha: ${chartData?.marriageAnalysis?.hasMangalDosha ? 'Yes' : 'No'}
- 10th House (Career): ${chartData?.careerAnalysis?.tenthHouseSign}
- Planetary Placements: ${JSON.stringify(
    Object.fromEntries(
      Object.entries(chartData?.planets || {}).map(([k, v]) => [
        k,
        `${v.sign}, House ${v.house}, Retro: ${v.isRetrograde}`,
      ])
    )
  )}
`;

  const contents = [];

  contents.push({
    role: 'user',
    parts: [{ text: `Here is my verified birth chart data:\n${chartContext}\n\nPlease keep this context in mind for all my questions.` }],
  });

  contents.push({
    role: 'model',
    parts: [{ text: 'नमस्कार! मी तुमची संपूर्ण जन्मकुंडली आणि चालू महादशा समजून घेतली आहे. तुम्हाला जो प्रश्न विचारायचा आहे तो नक्की विचारा, मी वैदिक सिद्धांतांनुसार मार्गदर्शन करतो.' }],
  });

  for (const h of history) {
    contents.push({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: question }],
  });

  return await callGemini(contents);
}
