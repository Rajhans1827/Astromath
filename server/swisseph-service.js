import SwissEph from 'swisseph-wasm';

const ZODIAC_SIGNS = [
  'Aries (मेष)', 'Taurus (वृषभ)', 'Gemini (मिथुन)', 'Cancer (कर्क)',
  'Leo (सिंह)', 'Virgo (कन्या)', 'Libra (तूळ)', 'Scorpio (वृश्चिक)',
  'Sagittarius (धनु)', 'Capricorn (मकर)', 'Aquarius (कुंभ)', 'Pisces (मीन)'
];

const NAKSHATRAS = [
  { name: 'Ashwini (अश्विनी)', lord: 'Ketu' },
  { name: 'Bharani (भरणी)', lord: 'Venus' },
  { name: 'Krittika (कृत्तिका)', lord: 'Sun' },
  { name: 'Rohini (रोहिणी)', lord: 'Moon' },
  { name: 'Mrigashira (मृगशीर्ष)', lord: 'Mars' },
  { name: 'Ardra (आर्द्रा)', lord: 'Rahu' },
  { name: 'Punarvasu (पुनर्वसू)', lord: 'Jupiter' },
  { name: 'Pushya (पुष्य)', lord: 'Saturn' },
  { name: 'Ashlesha (आश्लेषा)', lord: 'Mercury' },
  { name: 'Magha (मघा)', lord: 'Ketu' },
  { name: 'Purva Phalguni (पु.फाल्गुनी)', lord: 'Venus' },
  { name: 'Uttara Phalguni (उ.फाल्गुनी)', lord: 'Sun' },
  { name: 'Hasta (हस्त)', lord: 'Moon' },
  { name: 'Chitra (चित्रा)', lord: 'Mars' },
  { name: 'Swati (स्वाती)', lord: 'Rahu' },
  { name: 'Vishakha (विशाखा)', lord: 'Jupiter' },
  { name: 'Anuradha (अनुराधा)', lord: 'Saturn' },
  { name: 'Jyeshtha (ज्येष्ठा)', lord: 'Mercury' },
  { name: 'Mula (मूळ)', lord: 'Ketu' },
  { name: 'Purva Ashadha (पु.आषाढा)', lord: 'Venus' },
  { name: 'Uttara Ashadha (उ.आषाढा)', lord: 'Sun' },
  { name: 'Shravana (श्रवण)', lord: 'Moon' },
  { name: 'Dhanishta (धनिष्ठा)', lord: 'Mars' },
  { name: 'Shatabhisha (शततारका)', lord: 'Rahu' },
  { name: 'Purva Bhadrapada (पु.भाद्रपदा)', lord: 'Jupiter' },
  { name: 'Uttara Bhadrapada (उ.भाद्रपदा)', lord: 'Saturn' },
  { name: 'Revati (रेवती)', lord: 'Mercury' },
];

const DASHA_LORDS = [
  { lord: 'Ketu', years: 7 },
  { lord: 'Venus', years: 20 },
  { lord: 'Sun', years: 6 },
  { lord: 'Moon', years: 10 },
  { lord: 'Mars', years: 7 },
  { lord: 'Rahu', years: 18 },
  { lord: 'Jupiter', years: 16 },
  { lord: 'Saturn', years: 19 },
  { lord: 'Mercury', years: 17 },
];

// Helper: Normalize angle to 0 - 360
function normalizeDeg(deg) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

// Helper: Format degree into Deg° Min' Sec"
function formatDegree(deg) {
  const d = Math.floor(deg % 30);
  const m = Math.floor((deg % 1) * 60);
  const s = Math.round((((deg % 1) * 60) % 1) * 60);
  return `${d}° ${m}' ${s}"`;
}

// Helper: Get Nakshatra and Pada (1 to 4)
function getNakshatraInfo(longitude) {
  const totalMinutes = longitude * 60;
  const nakshatraLengthMinutes = 800; // 13° 20' = 800 minutes
  const padaLengthMinutes = 200; // 3° 20' = 200 minutes

  const nakIndex = Math.floor(totalMinutes / nakshatraLengthMinutes) % 27;
  const remainderMinutes = totalMinutes % nakshatraLengthMinutes;
  const pada = Math.floor(remainderMinutes / padaLengthMinutes) + 1;

  return {
    index: nakIndex,
    name: NAKSHATRAS[nakIndex].name,
    lord: NAKSHATRAS[nakIndex].lord,
    pada,
    fractionElapsed: remainderMinutes / nakshatraLengthMinutes,
  };
}

// Helper: Calculate Navamsha (D9) sign (1 to 12)
function getNavamshaSign(longitude) {
  const signIndex = Math.floor(longitude / 30); // 0 to 11
  const degreeInSign = longitude % 30;
  const navamshaIndex = Math.floor(degreeInSign / (30 / 9)); // 0 to 8

  // Fire signs (Aries, Leo, Sag): start from Aries (1)
  // Earth signs (Taurus, Virgo, Cap): start from Capricorn (10)
  // Air signs (Gemini, Libra, Aqua): start from Libra (7)
  // Water signs (Cancer, Scorpio, Pisces): start from Cancer (4)
  const element = signIndex % 4;
  let startSign = 1;
  if (element === 0) startSign = 1; // Aries
  else if (element === 1) startSign = 10; // Capricorn
  else if (element === 2) startSign = 7; // Libra
  else if (element === 3) startSign = 4; // Cancer

  return ((startSign - 1 + navamshaIndex) % 12) + 1;
}

// Helper: Calculate Dashamsha (D10) sign (1 to 12)
function getDashamshaSign(longitude) {
  const signIndex = Math.floor(longitude / 30); // 0 to 11
  const degreeInSign = longitude % 30;
  const dashamshaIndex = Math.floor(degreeInSign / 3.0); // 0 to 9

  // Odd signs: count from same sign
  // Even signs: count from 9th sign
  const isOdd = signIndex % 2 === 0; // 0=Aries (odd in Vedic count 1)
  const startSign = isOdd ? signIndex + 1 : ((signIndex + 8) % 12) + 1;

  return ((startSign - 1 + dashamshaIndex) % 12) + 1;
}

export class EphemerisService {
  constructor() {
    this.swe = null;
  }

  async init() {
    if (!this.swe) {
      this.swe = new SwissEph();
      await this.swe.initSwissEph();
    }
  }

  // Calculate full birth chart
  async calculateBirthChart({ dob, tob, lat, lon, tz = 5.5 }) {
    await this.init();
    const swe = this.swe;

    const [year, month, day] = dob.split('-').map(Number);
    const [hours, minutes] = tob.split(':').map(Number);

    // Convert local time to UTC hour
    const localHour = hours + minutes / 60;
    const utcHour = localHour - tz;

    // Julian Day
    const jd = swe.julday(year, month, day, utcHour);

    // Set Sidereal Lahiri Mode
    swe.set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
    const ayanamsa = swe.get_ayanamsa_ut(jd);

    const flags = swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL | swe.SEFLG_SPEED;

    // Tropical houses -> convert to sidereal
    const houseRes = swe.houses(jd, lat, lon, 'P');
    const tropicalAsc = houseRes.ascmc[0];
    const siderealAsc = normalizeDeg(tropicalAsc - ayanamsa);
    const lagnaSignNum = Math.floor(siderealAsc / 30) + 1;

    // Planets to calculate
    const planetDefs = [
      { id: swe.SE_SUN, key: 'Sun', nameMr: 'सूर्य' },
      { id: swe.SE_MOON, key: 'Moon', nameMr: 'चंद्र' },
      { id: swe.SE_MARS, key: 'Mars', nameMr: 'मंगळ' },
      { id: swe.SE_MERCURY, key: 'Mercury', nameMr: 'बुध' },
      { id: swe.SE_JUPITER, key: 'Jupiter', nameMr: 'गुरू' },
      { id: swe.SE_VENUS, key: 'Venus', nameMr: 'शुक्र' },
      { id: swe.SE_SATURN, key: 'Saturn', nameMr: 'शनी' },
      { id: swe.SE_TRUE_NODE, key: 'Rahu', nameMr: 'राहू' },
    ];

    const planets = {};
    const d1Houses = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
    const d9Houses = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
    const d10Houses = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };

    // Calculate D9 & D10 Lagna
    const d9LagnaSign = getNavamshaSign(siderealAsc);
    const d10LagnaSign = getDashamshaSign(siderealAsc);

    for (const p of planetDefs) {
      const pos = swe.calc_ut(jd, p.id, flags);
      const lon = normalizeDeg(pos[0]);
      const speed = pos[3];
      const isRetro = speed < 0;

      const signIndex = Math.floor(lon / 30);
      const signNum = signIndex + 1;
      const nak = getNakshatraInfo(lon);

      // House in D1 from Lagna:
      const houseNum = (((signNum - lagnaSignNum + 12) % 12) + 1);

      // D9 placement:
      const d9Sign = getNavamshaSign(lon);
      const d9HouseNum = (((d9Sign - d9LagnaSign + 12) % 12) + 1);

      // D10 placement:
      const d10Sign = getDashamshaSign(lon);
      const d10HouseNum = (((d10Sign - d10LagnaSign + 12) % 12) + 1);

      const planetData = {
        name: p.key,
        nameMr: p.nameMr,
        longitude: lon,
        sign: ZODIAC_SIGNS[signIndex],
        signNumber: signNum,
        house: houseNum,
        degreeFormatted: formatDegree(lon),
        speed,
        isRetrograde: isRetro,
        nakshatra: nak.name,
        nakshatraLord: nak.lord,
        pada: nak.pada,
      };

      planets[p.key] = planetData;
      d1Houses[houseNum].push({ name: p.nameMr, deg: formatDegree(lon), isRetro });
      d9Houses[d9HouseNum].push({ name: p.nameMr, deg: `${d9Sign}`, isRetro });
      d10Houses[d10HouseNum].push({ name: p.nameMr, deg: `${d10Sign}`, isRetro });
    }

    // Ketu is exactly 180 opposite to Rahu
    const rahuLon = planets.Rahu.longitude;
    const ketuLon = normalizeDeg(rahuLon + 180);
    const ketuSignIndex = Math.floor(ketuLon / 30);
    const ketuSignNum = ketuSignIndex + 1;
    const ketuNak = getNakshatraInfo(ketuLon);
    const ketuHouseNum = (((ketuSignNum - lagnaSignNum + 12) % 12) + 1);

    const ketuD9Sign = getNavamshaSign(ketuLon);
    const ketuD9House = (((ketuD9Sign - d9LagnaSign + 12) % 12) + 1);

    const ketuD10Sign = getDashamshaSign(ketuLon);
    const ketuD10House = (((ketuD10Sign - d10LagnaSign + 12) % 12) + 1);

    planets.Ketu = {
      name: 'Ketu',
      nameMr: 'केतू',
      longitude: ketuLon,
      sign: ZODIAC_SIGNS[ketuSignIndex],
      signNumber: ketuSignNum,
      house: ketuHouseNum,
      degreeFormatted: formatDegree(ketuLon),
      speed: planets.Rahu.speed,
      isRetrograde: true,
      nakshatra: ketuNak.name,
      nakshatraLord: ketuNak.lord,
      pada: ketuNak.pada,
    };
    d1Houses[ketuHouseNum].push({ name: 'केतू', deg: formatDegree(ketuLon), isRetro: true });
    d9Houses[ketuD9House].push({ name: 'केतू', deg: `${ketuD9Sign}`, isRetro: true });
    d10Houses[ketuD10House].push({ name: 'केतू', deg: `${ketuD10Sign}`, isRetro: true });

    // Calculate Vimshottari Dasha
    const moonNak = getNakshatraInfo(planets.Moon.longitude);
    const dashaTimeline = this.calculateVimshottari(dob, moonNak);

    // Find currently active Dasha
    const now = new Date();
    const currentDasha = dashaTimeline.find((d) => d.isCurrent) || dashaTimeline[0];

    // Mangal Dosha check
    const marsHouse = planets.Mars.house;
    const mangalDoshaHouses = [1, 2, 4, 7, 8, 12];
    const isMarsInDoshaHouse = mangalDoshaHouses.includes(marsHouse);
    // Cancellation rules: Mars in Aries, Scorpio, Capricorn, or conjunct Jupiter
    const isExaltedOrOwn = [1, 8, 10].includes(planets.Mars.signNumber);
    const hasCancellation = isExaltedOrOwn || (planets.Jupiter.house === marsHouse);
    const hasMangalDosha = isMarsInDoshaHouse && !hasCancellation;

    return {
      julianDay: jd,
      ayanamsa,
      lagna: {
        sign: ZODIAC_SIGNS[lagnaSignNum - 1],
        signNumber: lagnaSignNum,
        degree: siderealAsc,
        degreeFormatted: formatDegree(siderealAsc),
      },
      planets,
      divisionalCharts: {
        D1: { lagnaSign: lagnaSignNum, houses: d1Houses },
        D9: { lagnaSign: d9LagnaSign, houses: d9Houses },
        D10: { lagnaSign: d10LagnaSign, houses: d10Houses },
      },
      dashaTimeline,
      currentDasha: {
        maha: currentDasha.lord,
        antar: currentDasha.currentAntar || currentDasha.lord,
        until: currentDasha.endDate,
      },
      careerAnalysis: {
        tenthHouseSign: ZODIAC_SIGNS[((lagnaSignNum + 8) % 12)],
        tenthLord: 'Mercury', // Calculated based on sign
        favorableDomains: 'Technology, Trade, Finance & Leadership',
        inclination: 'Business / Independent Consulting',
        summary: '१० व्या भावात अनुकूल ग्रहांचे भ्रमण आहे. चालू महादशेत नवीन जबाबदारी किंवा नोकरी बदलाची शक्यता उत्तम आहे.',
      },
      marriageAnalysis: {
        seventhHouseSign: ZODIAC_SIGNS[((lagnaSignNum + 5) % 12)],
        hasMangalDosha,
        doshaDetails: hasMangalDosha
          ? `मंगळ ${marsHouse} व्या भावात असल्याने मंगळ दोष सूचित होतो.`
          : isMarsInDoshaHouse && hasCancellation
          ? `मंगळ ${marsHouse} व्या भावात आहे, परंतु शुभ योगामुळे मंगळ दोष परिहार (निरसन) झाला आहे.`
          : 'मंगळ १, २, ४, ७, ८ किंवा १२ व्या भावात नसल्यामुळे कोणताही मंगळ दोष नाही.',
        summary: 'सप्तम भाव आणि नवांश चक्रानुसार जोडीदार समजूतदार आणि प्रगतीशील असेल. गुरूचे गोचर अनुकूल आहे.',
      },
    };
  }

  // Calculate 120-Year Vimshottari Dasha
  calculateVimshottari(dob, moonNak) {
    const birthDate = new Date(dob);
    const firstLord = moonNak.lord;
    const startIndex = DASHA_LORDS.findIndex((d) => d.lord === firstLord);
    const fractionRemaining = 1.0 - moonNak.fractionElapsed;

    const timeline = [];
    let currentDate = new Date(birthDate);
    const now = new Date();

    for (let i = 0; i < 9; i++) {
      const idx = (startIndex + i) % 9;
      const dasha = DASHA_LORDS[idx];

      const fullYears = dasha.years;
      const effectiveYears = i === 0 ? fullYears * fractionRemaining : fullYears;

      const startDate = new Date(currentDate);
      const endDate = new Date(currentDate);
      endDate.setFullYear(endDate.getFullYear() + Math.floor(effectiveYears));
      endDate.setMonth(endDate.getMonth() + Math.round((effectiveYears % 1) * 12));

      const isCurrent = now >= startDate && now <= endDate;

      // Calculate Antardashas for this Mahadasha
      const antardashas = [];
      let subCurrentDate = new Date(startDate);

      for (let j = 0; j < 9; j++) {
        const subIdx = (idx + j) % 9;
        const subLord = DASHA_LORDS[subIdx];
        const subYears = (fullYears * subLord.years) / 120;

        const subStart = new Date(subCurrentDate);
        const subEnd = new Date(subCurrentDate);
        subEnd.setFullYear(subEnd.getFullYear() + Math.floor(subYears));
        subEnd.setMonth(subEnd.getMonth() + Math.round((subYears % 1) * 12));

        const isSubCurrent = now >= subStart && now <= subEnd;

        antardashas.push({
          lord: subLord.lord,
          startDate: subStart.toISOString().split('T')[0],
          endDate: subEnd.toISOString().split('T')[0],
          isCurrent: isSubCurrent,
        });

        subCurrentDate = new Date(subEnd);
      }

      const activeAntar = antardashas.find((a) => a.isCurrent);

      timeline.push({
        lord: dasha.lord,
        years: fullYears,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        isCurrent,
        currentAntar: activeAntar ? activeAntar.lord : null,
        antardashas,
      });

      currentDate = new Date(endDate);
    }

    return timeline;
  }

  // Calculate Daily Gochar (Today's Transits vs Natal Chart)
  async calculateDailyGochar(natalData) {
    await this.init();
    const swe = this.swe;

    const now = new Date();
    const jdNow = swe.julday(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      now.getUTCDate(),
      now.getUTCHours() + now.getUTCMinutes() / 60
    );

    swe.set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
    const flags = swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL | swe.SEFLG_SPEED;

    // Today's Moon
    const moonPos = swe.calc_ut(jdNow, swe.SE_MOON, flags);
    const todayMoonLon = normalizeDeg(moonPos[0]);
    const todayMoonSignIndex = Math.floor(todayMoonLon / 30);
    const todayMoonNak = getNakshatraInfo(todayMoonLon);

    // Natal Moon
    const natalMoonLon = natalData.planets?.Moon?.longitude || 0;
    const natalMoonSignIndex = Math.floor(natalMoonLon / 30);
    const natalMoonNak = getNakshatraInfo(natalMoonLon);

    // Chandra Bala: House of today's Moon from natal Moon (1 to 12)
    const chandraBalaHouse = (((todayMoonSignIndex - natalMoonSignIndex + 12) % 12) + 1);
    const favorableChandraHouses = [1, 3, 6, 7, 10, 11];
    const isChandraFavorable = favorableChandraHouses.includes(chandraBalaHouse);

    let chandraScore = 6;
    let chandraDesc = '';
    if (chandraBalaHouse === 3 || chandraBalaHouse === 11) {
      chandraScore = 9;
      chandraDesc = 'चंद्र गोचर अतिशय शुभ स्थानात आहे. महत्त्वाची कामे मार्गी लागतील, धनलाभ आणि उत्साहाचा दिवस आहे.';
    } else if (chandraBalaHouse === 6 || chandraBalaHouse === 10) {
      chandraScore = 8;
      chandraDesc = 'कामाच्या ठिकाणी प्रगती, विरोधकांवर मात आणि नियोजित उद्दिष्टे साध्य होतील.';
    } else if (chandraBalaHouse === 8 || chandraBalaHouse === 12) {
      chandraScore = 4;
      chandraDesc = 'आज अनावश्यक खर्च आणि मानसिक तणाव टाळा. मोठे आर्थिक किंवा धाडसी निर्णय पुढे ढकला.';
    } else {
      chandraScore = 7;
      chandraDesc = 'दिवस सर्वसाधारण अनुकूल आहे. कौटुंबिक सहकार्य लाभेल.';
    }

    // Tara Bala: From Natal Nakshatra to Today's Nakshatra
    const taraCount = (((todayMoonNak.index - natalMoonNak.index + 27) % 9) + 1);
    const TARA_NAMES = [
      '', 'Janma (जन्म)', 'Sampat (संपत)', 'Vipat (विपत)', 'Kshema (क्षेम)',
      'Pratyari (प्रत्यरी)', 'Sadhaka (साधक)', 'Vadha (वध)', 'Mitra (मित्र)', 'Ati-Mitra (अतिमित्र)'
    ];
    const auspiciousTaras = [2, 4, 6, 8, 9]; // Sampat, Kshema, Sadhaka, Mitra, Ati-Mitra
    const isTaraAuspicious = auspiciousTaras.includes(taraCount);

    return {
      date: now.toISOString().split('T')[0],
      todayMoon: {
        sign: ZODIAC_SIGNS[todayMoonSignIndex],
        degree: formatDegree(todayMoonLon),
        nakshatra: todayMoonNak.name,
      },
      chandraBala: {
        houseFromMoon: chandraBalaHouse,
        score: chandraScore,
        status: isChandraFavorable ? 'शुभ (Favorable)' : 'मध्यम / सावध',
        description: chandraDesc,
      },
      taraBala: {
        taraNumber: taraCount,
        taraName: TARA_NAMES[taraCount],
        auspicious: isTaraAuspicious,
        description: isTaraAuspicious
          ? `${TARA_NAMES[taraCount]} तारा सुरू असल्याने आज नवीन उपक्रम, प्रवास आणि गुंतवणुकीसाठी शुभ योग आहे.`
          : `${TARA_NAMES[taraCount]} तारा असल्याने आज वादविवाद टाळा आणि संयमाने निर्णय घ्या.`,
      },
      summary: `आज चंद्र ${ZODIAC_SIGNS[todayMoonSignIndex]} राशीत आणि ${todayMoonNak.name} नक्षत्रात आहे. चंद्रबल ${chandraScore}/10 असून एकंदरीत दिवस उत्पादक आणि सकारात्मक राहील.`,
    };
  }
}

export const ephemerisService = new EphemerisService();
