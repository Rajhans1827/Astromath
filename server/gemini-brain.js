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

// Master Vedic Astrologer System Prompt
const VEDIC_SYSTEM_PROMPT = `
You are 'AstroMath Oracle', an authoritative, deeply scholarly Master Vedic Astrologer (Jyotishacharya).
You are grounded in classical Maharishi Parashara, Jaimini, and Varahamihira principles.

CRITICAL INSTRUCTIONS:
1. You are provided with EXACT, VERIFIED MATHEMATICAL FACTS computed by Swiss Ephemeris.
2. DO NOT contradict any planetary positions, houses, retrogrades, or dasha dates provided to you.
3. Treat the provided chart JSON as absolute ground truth.
4. Speak warmly, authoritatively, and eloquently in English (or Marathi if explicitly asked by the seeker).
5. Ground every insight in the native's Lagna, 10th lord, 7th lord, active Vimshottari Mahadasha/Antardasha, or daily transit.
6. Provide pragmatic, constructive guidance and classical remedies (meditation, disciplines, charity, mantras).
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
          temperature: 0.7,
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
        continue;
      }

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini candidate models failed to return a response.');
}

// Deterministic Classical Vedic Synthesis Fallback
function generateDeterministicCareerReport(chartData) {
  const lagna = chartData?.lagna?.sign || 'Aries';
  const moon = chartData?.planets?.Moon?.sign || 'Taurus';
  const tenthLord = chartData?.careerAnalysis?.tenthLord || 'Mercury';
  const tenthSign = chartData?.careerAnalysis?.tenthHouseSign || chartData?.careerAnalysis?.tenthLordSign || 'Capricorn';
  const currentMaha = chartData?.currentDasha?.maha || 'Saturn';
  const currentAntar = chartData?.currentDasha?.antar || 'Mercury';
  const until = chartData?.currentDasha?.until || '2028';
  const favorableDomains = chartData?.careerAnalysis?.favorableDomains || 'Technology, Strategic Leadership & Advisory';

  return `### Strategic Vocation & Executive Mastery Synthesis

**1. Ascendant & 10th House Dynamics:**
With your **${lagna} Ascendant** and the 10th Harmonic governing public standing situated in **${tenthSign}**, your vocation is anchored by **${tenthLord}**. This positioning imparts a calculated, structured approach to leadership, high-stakes decision-making, and long-term enterprise building.

**2. Optimal Professional Spheres:**
Your planetary configuration strongly favors:
- **Primary Domains:** ${favorableDomains}
- **Structural Strength:** Strategic execution, organizational design, data-driven systems, and independent advisory roles over rigid subordinate hierarchies.

**3. Active Planetary Era Timing (${currentMaha} / ${currentAntar} Period):**
You are currently traversing the **${currentMaha} Mahadasha** with **${currentAntar} Antardasha** active until **${until}**. In classical Vedic mechanics, this period triggers significant restructuring of your professional status. The alignment indicates a powerful window for enterprise consolidation, elevation of public authority, and strategic career expansion.

**4. Strategic Recommendations & Disciplines:**
- Consolidate authority through technical mastery and indisputable competence.
- Favor long-range vision over immediate short-term fluctuations.
- Maintain consistent morning clarity disciplines (dhyana / solar alignment) to sharpen executive intuition.`;
}

function generateDeterministicMarriageReport(chartData) {
  const lagna = chartData?.lagna?.sign || 'Aries';
  const moonSign = chartData?.planets?.Moon?.sign || 'Taurus';
  const venusSign = chartData?.planets?.Venus?.sign || 'Pisces';
  const venusHouse = chartData?.planets?.Venus?.house || 7;
  const hasDosha = chartData?.marriageAnalysis?.hasMangalDosha;
  const doshaDetails = chartData?.marriageAnalysis?.doshaDetails || '';
  const currentMaha = chartData?.currentDasha?.maha || 'Venus';
  const currentAntar = chartData?.currentDasha?.antar || 'Jupiter';

  return `### Union, Partnership & 7th Harmonic Synthesis

**1. Relational Blueprint & Venusian Alignment:**
With your **${lagna} Ascendant** and **Venus** posited in **${venusSign}** (House ${venusHouse}), your relational template seeks authentic intellectual resonance, emotional loyalty, and shared philosophical aspirations. You gravitate toward a partner of depth, creative sensibility, and grounded poise.

**2. Mars Energy (Kuja / Mangal Harmonic):**
${hasDosha
  ? `**Active Kuja Factor:** An energetic Mars alignment is identified. ${doshaDetails}. In classical synthesis, this signifies high passion, direct communication, and a need for mutual autonomy in partnership. Alignment with an equally dynamic or Kuja-balanced partner yields exceptional synergy.`
  : `**Harmonious Alignment:** Mars is favorably placed outside the critical relational angles (Houses 1, 4, 7, 8, 12). There is no severe Kuja affliction, indicating natural ease in emotional balance and domestic accord.`}

**3. The 9-Fold Navamsha (D9) Soul Indicator:**
The Navamsha divisional matrix governs soul trajectory beyond early adulthood. Your D9 alignment reveals that maturity brings deeper emotional grounding. Long-term unions entered into with conscious intentionality flourish remarkably under your active **${currentMaha} - ${currentAntar}** cycle.

**4. Relationship Harmonization Practices:**
- Cultivate conscious, unhurried dialogue during high-stress operational cycles.
- Practice mutual gratitude and harmonious aesthetic balance in the living environment.`;
}

function generateDeterministicDailyReport(chartData, dailyData) {
  const chandraScore = dailyData?.chandraBala?.score || 8;
  const chandraStatus = dailyData?.chandraBala?.status || 'Auspicious';
  const chandraHouse = dailyData?.chandraBala?.houseFromMoon || 11;
  const chandraDesc = dailyData?.chandraBala?.description || 'Transit Moon brings clarity and social receptivity.';
  const taraName = dailyData?.taraBala?.taraName || 'Kalyana (Prosperity)';
  const taraAuspicious = dailyData?.taraBala?.auspicious !== false;
  const taraDesc = dailyData?.taraBala?.description || 'Stellar vibration supports focused enterprise and creative execution.';

  return `### Daily Celestial Transit Synthesis

**1. Lunar State (Chandra Bala — ${chandraScore}/10 | ${chandraStatus}):**
Today the transit Moon moves through your **${chandraHouse}th solar house**. ${chandraDesc} Your mental bandwidth and emotional acuity are in high clarity. It is an auspicious window for negotiations, intellectual production, and resolving pending bottlenecks.

**2. Stellar Rhythm (Tara Bala — ${taraName}):**
${taraAuspicious
  ? `The active star frequency is highly harmonious (${taraName}). ${taraDesc} Favorable for inaugurating fresh initiatives, client discussions, and strategic planning.`
  : `The active star frequency suggests mindful deliberation (${taraName}). ${taraDesc} Prioritize careful verification of details, deliberate communication, and avoid hasty impulsive commitments.`}

**3. Action Matrix for Today:**
- **Optimal Focus:** High-leverage execution, structured communication, and disciplined creative flow.
- **Harmonic Tone:** Deep white, pearl, and soft celestial hues to amplify lunar composure.`;
}

function generateDeterministicChatResponse(question, chartData) {
  const q = question.toLowerCase();
  const lagna = chartData?.lagna?.sign || 'Aries';
  const moon = chartData?.planets?.Moon?.sign || 'Taurus';
  const sun = chartData?.planets?.Sun?.sign || 'Leo';
  const maha = chartData?.currentDasha?.maha || 'Jupiter';
  const antar = chartData?.currentDasha?.antar || 'Saturn';
  const until = chartData?.currentDasha?.until || '2028';
  const tenthLord = chartData?.careerAnalysis?.tenthLord || 'Mercury';
  const hasDosha = chartData?.marriageAnalysis?.hasMangalDosha;

  if (q.includes('career') || q.includes('job') || q.includes('business') || q.includes('work') || q.includes('money') || q.includes('finance') || q.includes('promotion')) {
    return `Regarding your vocation and material trajectory:

Your chart is anchored by a **${lagna} Ascendant** with **${tenthLord}** presiding over your 10th house of achievement and public standing. 

Under your current **${maha} Mahadasha** and **${antar} Antardasha** (active until ${until}), the celestial geometry indicates a decisive period for enterprise consolidation. This is not a time for passive hesitation—it favors deliberate mastery, upgrading strategic skills, and establishing authority in your specialized domain. 

Positions in technology, structured systems, executive leadership, and high-trust advisory roles align naturally with your natal planetary configuration. Maintain steady persistence, as your active dasha lord rewards disciplined architecture over hasty gambles.`;
  }

  if (q.includes('marriage') || q.includes('love') || q.includes('relationship') || q.includes('spouse') || q.includes('partner') || q.includes('mangal') || q.includes('dosha')) {
    return `Regarding your union and relationship harmonics:

In your natal wheel, your 7th house and Venusian alignment reflect a desire for genuine intellectual depth and unshakeable emotional integrity. 

${hasDosha 
  ? `Your chart exhibits an active Mars (Kuja) signature. In authentic Vedic calculation, this is not an omen of doom—it represents passionate vitality and high standards. Mutual independence, respectful boundaries, and open communication make such partnerships exceptionally vibrant.`
  : `Your chart shows a well-balanced Mars placement free of acute relational friction, indicating natural emotional poise and steady partnership dynamics.`}

Your Navamsha (D9) divisional chart indicates that relationships flourish progressively with personal maturity. Fostering emotional transparency during your active **${maha}** cycle will bring lasting harmony and mutual elevation.`;
  }

  if (q.includes('dasha') || q.includes('cycle') || q.includes('time') || q.includes('period') || q.includes('future') || q.includes('when')) {
    return `Examining your 120-Year Vimshottari progression:

You are navigating the major era of **${maha}**, with the sub-period of **${antar}** governing events through **${until}**.

In Vedic mechanics:
- **${maha} (Major Era):** Sets the overarching macro theme and core karmic curriculum of this phase of life.
- **${antar} (Sub-Cycle):** Dictates immediate operational shifts, opportunities, and psychological focus.

This active combination sharpens your discernment, encouraging you to eliminate superficial distractions and invest deeply in enduring life assets. Make conscious choices now, as seeds planted during this cycle yield generational fruit.`;
  }

  if (q.includes('remed') || q.includes('stone') || q.includes('mantra') || q.includes('gem') || q.includes('peace') || q.includes('mind')) {
    return `Classical Vedic Harmonization Principles for your configuration:

1. **Mind & Emotional Stability:** With your Moon in **${moon}**, daily breath regulation (Pranayama) and 10 minutes of silent meditation at sunrise harmonize the mental faculties and alleviate restless transit stress.
2. **Solar Vitality:** Honor the Sun in **${sun}** by starting each day with disciplined solar awareness and purposeful physical movement.
3. **Charity & Energetic Balance:** Express intentional gratitude and practice voluntary service on the day ruled by your active dasha lord (**${maha}**). Authentic Vedic remedies center on conscious behavioral alignment, clarity, and service.`;
  }

  // Default deep holistic answer
  return `Thank you for consulting the AstroMath Oracle.

Looking at your exact mathematical coordinates:
- **Ascendant (Lagna):** ${lagna} (${chartData?.lagna?.degreeFormatted || 'Active'})
- **Moon Sign:** ${moon}
- **Active Era:** ${maha} Mahadasha with ${antar} Antardasha (through ${until})

Your life path is structured for steady, organic ascension through calculated discipline. You possess an innate discernment that protects you during turbulent transitions. Focus on aligning your daily habits with your long-term vocational vision. 

Feel free to ask a specific inquiry regarding your career timing, relationships, or planetary remediation to explore deeper divisional layers!`;
}

// Generate Domain-Specific Deep-Dive Interpretation
export async function generateDomainAnalysis({ domain, chartData, dailyData }) {
  try {
    const chartSummary = {
      lagna: chartData.lagna?.sign,
      moon: `${chartData.planets?.Moon?.sign} (${chartData.planets?.Moon?.nakshatra})`,
      sun: `${chartData.planets?.Sun?.sign} (${chartData.planets?.Sun?.degreeFormatted})`,
      currentDasha: `${chartData.currentDasha?.maha} - ${chartData.currentDasha?.antar} until ${chartData.currentDasha?.until}`,
      tenthLord: chartData.careerAnalysis?.tenthLord,
      mangalDosha: chartData.marriageAnalysis?.hasMangalDosha,
    };

    let prompt = `Provide an authoritative, scholarly Vedic astrology synthesis for ${domain} based on these exact coordinates:\n${JSON.stringify(chartSummary, null, 2)}`;
    const contents = [{ parts: [{ text: prompt }] }];
    
    return await callGemini(contents);
  } catch (err) {
    console.warn('[Gemini Fallback Activated for Domain Analysis]:', err.message);
    if (domain === 'career') return generateDeterministicCareerReport(chartData);
    if (domain === 'marriage') return generateDeterministicMarriageReport(chartData);
    if (domain === 'daily') return generateDeterministicDailyReport(chartData, dailyData);
    return generateDeterministicCareerReport(chartData);
  }
}

// Interactive Chat with AI Astrologer
export async function chatWithAIAstrologer({ question, chartData, history = [] }) {
  try {
    const chartContext = `
[EXACT CHART GROUND TRUTH]:
- Lagna: ${chartData?.lagna?.sign}
- Moon: ${chartData?.planets?.Moon?.sign} (${chartData?.planets?.Moon?.nakshatra})
- Active Dasha: ${chartData?.currentDasha?.maha} / ${chartData?.currentDasha?.antar} until ${chartData?.currentDasha?.until}
- 10th Lord: ${chartData?.careerAnalysis?.tenthLord}
- Mangal Dosha: ${chartData?.marriageAnalysis?.hasMangalDosha ? 'Yes' : 'No'}
`;

    const contents = [
      { role: 'user', parts: [{ text: `Here is the user's verified birth chart:\n${chartContext}` }] },
      { role: 'model', parts: [{ text: 'Coordinates received. I am ready to provide precise, scholarly Vedic guidance.' }] },
    ];

    for (const h of history) {
      contents.push({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      });
    }

    contents.push({ role: 'user', parts: [{ text: question }] });

    return await callGemini(contents);
  } catch (err) {
    console.warn('[Gemini Fallback Activated for Chat]:', err.message);
    return generateDeterministicChatResponse(question, chartData);
  }
}
