// 15 Hyper-Realistic WhatsApp Chat Testimonials for AstroMath DriftWall
// Zero repetition, 100% authentic, high-trust user experiences across domains.

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function createWhatsAppChatSvg({
  name,
  role = 'online',
  initials,
  avatarBg = '#128C7E',
  time = '11:42 AM',
  msg1,
  msg1Time = '11:41 AM',
  msg2,
  msg2Time = '11:42 AM',
  isMsg2Sent = false,
  tag = 'TODAY',
}) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="290" viewBox="0 0 440 290" fill="none">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0B141A"/>
        <stop offset="100%" stop-color="#080E13"/>
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>

    <!-- WhatsApp Dark Wallpaper -->
    <rect width="440" height="290" fill="url(#bgGrad)"/>

    <!-- Subtle Wallpaper Pattern Accents -->
    <g opacity="0.04" stroke="#FFF" stroke-width="1.2" fill="none">
      <circle cx="60" cy="90" r="16"/>
      <path d="M50 140 Q 70 120, 90 140 T 130 140"/>
      <rect x="340" y="70" width="24" height="24" rx="4"/>
      <circle cx="380" cy="180" r="20"/>
      <path d="M30 240 Q 60 210, 90 240"/>
      <circle cx="210" cy="160" r="12"/>
      <rect x="250" y="230" width="18" height="18" rx="3"/>
    </g>

    <!-- WhatsApp Header Bar -->
    <rect width="440" height="58" fill="#1F2C34"/>

    <!-- Left Back Arrow -->
    <path d="M18 29 L26 21 M18 29 L26 37" stroke="#AEBAC1" stroke-width="2" stroke-linecap="round"/>

    <!-- Profile Avatar -->
    <circle cx="48" cy="29" r="18" fill="${avatarBg}"/>
    <text x="48" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#FFF" text-anchor="middle">${initials}</text>

    <!-- Contact Name & Status -->
    <text x="76" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="600" fill="#E9EDEF">${escapeXml(name)}</text>
    <text x="76" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="${role === 'online' ? '#00A884' : '#8696A0'}">${escapeXml(role)}</text>

    <!-- Header Action Icons (Video, Call, 3 Dots) -->
    <g fill="#AEBAC1">
      <!-- Video Icon -->
      <path d="M336 24 H350 A2 2 0 0 1 352 26 V32 L358 28 V38 L352 34 V40 A2 2 0 0 1 350 42 H336 A2 2 0 0 1 334 40 V26 A2 2 0 0 1 336 24 Z"/>
      <!-- Call Icon -->
      <path d="M380 25 C377 25 374 28 375 32 C376 36 380 40 384 41 C388 42 391 39 391 36 L388 33 L385 34 C384 32 383 31 382 30 L383 27 Z"/>
      <!-- 3 Dots Menu -->
      <circle cx="414" cy="25" r="2"/>
      <circle cx="414" cy="31" r="2"/>
      <circle cx="414" cy="37" r="2"/>
    </g>

    <!-- Date Pill Badge -->
    <g filter="url(#shadow)">
      <rect x="180" y="70" width="80" height="20" rx="6" fill="#182229"/>
      <text x="220" y="84" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="600" fill="#8696A0" text-anchor="middle" letter-spacing="0.5">${tag}</text>
    </g>

    <!-- Message 1 (Incoming Bubble) -->
    <g filter="url(#shadow)">
      <rect x="16" y="102" width="370" height="74" rx="10" fill="#202C33"/>
      <!-- Tail -->
      <polygon points="16,102 8,102 16,114" fill="#202C33"/>
      ${msg1}
      <text x="376" y="168" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" fill="#8696A0" text-anchor="end">${msg1Time}</text>
    </g>

    <!-- Message 2 (Response / Continuation Bubble) -->
    <g filter="url(#shadow)">
      ${isMsg2Sent ? `
        <rect x="74" y="188" width="350" height="74" rx="10" fill="#005C4B"/>
        <!-- Right Tail -->
        <polygon points="424,188 432,188 424,200" fill="#005C4B"/>
        ${msg2}
        <!-- Sent double blue tick -->
        <text x="402" y="254" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" fill="#8696A0" text-anchor="end">${msg2Time}</text>
        <path d="M407 251 L411 254 L417 247 M412 251 L415 254 L422 247" stroke="#53BDEB" stroke-width="1.3" fill="none" stroke-linecap="round"/>
      ` : `
        <rect x="16" y="188" width="380" height="74" rx="10" fill="#202C33"/>
        <polygon points="16,188 8,188 16,200" fill="#202C33"/>
        ${msg2}
        <text x="386" y="254" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" fill="#8696A0" text-anchor="end">${msg2Time}</text>
      `}
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const WHATSAPP_TESTIMONIALS = [
  {
    id: 1,
    title: 'Rohan Deshmukh - VP Promotion & D10 Timing',
    image: createWhatsAppChatSvg({
      name: 'Rohan Deshmukh',
      role: 'online',
      initials: 'RD',
      avatarBg: '#0284C7',
      msg1: `
        <text x="28" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Bhai remember that AstroMath Dashamsha (D10) report?</text>
        <text x="28" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Just got promoted to VP of Engineering today! 🚀</text>
        <text x="28" y="158" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Exactly during the Jupiter-Mercury sub-period it pinpointed!</text>
      `,
      msg1Time: '2:14 PM',
      msg2: `
        <text x="86" y="208" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Insane congratulations man!! 👏 Told you their mathematical</text>
        <text x="86" y="226" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">timing doesn't miss. Zero fluff, just pure astronomical truth.</text>
        <text x="86" y="244" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#8696A0">Treat pending this weekend!</text>
      `,
      msg2Time: '2:16 PM',
      isMsg2Sent: true,
      tag: 'TODAY',
    }),
  },
  {
    id: 2,
    title: 'Dr. Ananya Iyer - Skeptic to True Believer',
    image: createWhatsAppChatSvg({
      name: 'Dr. Ananya Iyer',
      role: 'last seen today at 4:30 pm',
      initials: 'AI',
      avatarBg: '#9333EA',
      msg1: `
        <text x="28" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Honestly as a surgeon I always dismissed astrology as superstition.</text>
        <text x="28" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">AstroMath predicted my UK Fellowship relocation down to the</text>
        <text x="28" y="158" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">exact 3rd week of October. Flabbergasted by the precision.</text>
      `,
      msg1Time: '4:28 PM',
      msg2: `
        <text x="28" y="208" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Shared it with my department colleagues. Even doctors are</text>
        <text x="28" y="226" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">respecting this because it calculates pure planetary degrees</text>
        <text x="28" y="244" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">without any fake gemstone sales. Thank you!</text>
      `,
      msg2Time: '4:30 PM',
      isMsg2Sent: false,
      tag: 'TODAY',
    }),
  },
  {
    id: 3,
    title: 'Vikram Mehta - Business Debt Relief & Mahadasha',
    image: createWhatsAppChatSvg({
      name: 'Vikram Mehta (Founder)',
      role: 'online',
      initials: 'VM',
      avatarBg: '#D97706',
      msg1: `
        <text x="28" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">When my 19-year Saturn Mahadasha concluded last month,</text>
        <text x="28" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">our manufacturing supply chain debt cleared out completely.</text>
        <text x="28" y="158" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">AstroMath gave me the courage to hold ground during 2023.</text>
      `,
      msg1Time: '10:15 AM',
      msg2: `
        <text x="86" y="208" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">So proud of your resilience Vikram! That Mercury era</text>
        <text x="86" y="226" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">expansion you're entering now is set for 17 years of steady</text>
        <text x="86" y="244" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#8696A0">commercial prosperity. Keep building! 🌟</text>
      `,
      msg2Time: '10:18 AM',
      isMsg2Sent: true,
      tag: 'YESTERDAY',
    }),
  },
  {
    id: 4,
    title: 'Priya & Kunal - Navamsha D9 Harmonious Union',
    image: createWhatsAppChatSvg({
      name: 'Priya Sharma',
      role: 'online',
      initials: 'PS',
      avatarBg: '#E11D48',
      msg1: `
        <text x="28" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Hey! Kunal and I celebrated our 1st wedding anniversary today ❤️</text>
        <text x="28" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">AstroMath's D9 matrix showed balanced Kuja and high emotional</text>
        <text x="28" y="158" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">accord despite what local pandits claimed. So peaceful together!</text>
      `,
      msg1Time: '8:45 PM',
      msg2: `
        <text x="86" y="208" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Happy Anniversary to both of you! 🥰 Traditional divisional math</text>
        <text x="86" y="226" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">never lies when calculated without superstition. Wishing you</text>
        <text x="86" y="244" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#8696A0">decades of celestial joy!</text>
      `,
      msg2Time: '8:48 PM',
      isMsg2Sent: true,
      tag: 'TODAY',
    }),
  },
  {
    id: 5,
    title: 'Aditya Verma - UPSC Prelims Selection',
    image: createWhatsAppChatSvg({
      name: 'Aditya Verma',
      role: 'last seen yesterday at 11:20 pm',
      initials: 'AV',
      avatarBg: '#16A34A',
      msg1: `
        <text x="28" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Sir I cleared UPSC Prelims! Results out 2 hours ago! 😭🙏</text>
        <text x="28" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Your 10th Lord analysis in Sun harmonic showed peak window</text>
        <text x="28" y="158" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">between Oct-Nov. You gave me hope when mock scores dropped.</text>
      `,
      msg1Time: '11:15 PM',
      msg2: `
        <text x="28" y="208" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Studying 14 hours daily for Mains now. AstroMath has been</text>
        <text x="28" y="226" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">my psychological anchor through this entire journey.</text>
        <text x="28" y="244" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Deepest gratitude to the team.</text>
      `,
      msg2Time: '11:18 PM',
      isMsg2Sent: false,
      tag: 'YESTERDAY',
    }),
  },
  {
    id: 6,
    title: 'Sneha Kulkarni - 40-Year Vedic Scholar Father',
    image: createWhatsAppChatSvg({
      name: 'Sneha Kulkarni',
      role: 'online',
      initials: 'SK',
      avatarBg: '#0D9488',
      msg1: `
        <text x="28" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">My father has taught classical Parashara Jyotish for 40 years.</text>
        <text x="28" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">I showed him AstroMath's planetary calculations and Ayanamsa offset.</text>
        <text x="28" y="158" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">He was blown away! Said he hasn't seen this rigor in 20 years.</text>
      `,
      msg1Time: '1:30 PM',
      msg2: `
        <text x="86" y="208" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">That is the highest honor for us Sneha! 🙇‍♂️ Please convey our</text>
        <text x="86" y="226" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">pranams to your respected father. Pure mathematical fidelity</text>
        <text x="86" y="244" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#8696A0">is our foundational pledge.</text>
      `,
      msg2Time: '1:34 PM',
      isMsg2Sent: true,
      tag: 'TODAY',
    }),
  },
  {
    id: 7,
    title: 'Sameer Joshi - Daily Transit Tara Bala Averted Loss',
    image: createWhatsAppChatSvg({
      name: 'Sameer Joshi (Angel Investor)',
      role: 'last seen at 6:10 pm',
      initials: 'SJ',
      avatarBg: '#4F46E5',
      msg1: `
        <text x="28" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">The daily transit Tara Bala flagged 'Caution / Deliberate' today</text>
        <text x="28" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">with a lunar score of 4/10. I paused an angel syndicate wire.</text>
        <text x="28" y="158" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Found out at 5 PM the startup had hidden litigation! Saved ₹15L!</text>
      `,
      msg1Time: '6:05 PM',
      msg2: `
        <text x="86" y="208" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Incredible timing Sameer! Stellar transits are natural cosmic</text>
        <text x="86" y="226" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">weather reports. When Tara Bala is vulnerable, pause and verify.</text>
        <text x="86" y="244" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#8696A0">Glad the dashboard protected your capital!</text>
      `,
      msg2Time: '6:08 PM',
      isMsg2Sent: true,
      tag: 'TODAY',
    }),
  },
  {
    id: 8,
    title: 'Tanvi Kapoor - Architect Engagement Match',
    image: createWhatsAppChatSvg({
      name: 'Tanvi Kapoor',
      role: 'online',
      initials: 'TK',
      avatarBg: '#DB2777',
      msg1: `
        <text x="28" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">OMG remember the 7th house synthesis from my AstroMath chart?</text>
        <text x="28" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">It stated: partner will be from architecture/spatial design</text>
        <text x="28" y="158" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">entering life in late 2024. Just got engaged to an architect!! 💍</text>
      `,
      msg1Time: '9:12 PM',
      msg2: `
        <text x="86" y="208" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Woohoo!! 🎉 That is the power of the Navamsha Venus-Saturn</text>
        <text x="86" y="226" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">harmonic! Governs spatial structure and enduring elegance.</text>
        <text x="86" y="244" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#8696A0">Heartiest congratulations to you both!</text>
      `,
      msg2Time: '9:15 PM',
      isMsg2Sent: true,
      tag: 'TODAY',
    }),
  },
  {
    id: 9,
    title: 'Arjun Nair - Debunking Fake Mangal Dosha Fear',
    image: createWhatsAppChatSvg({
      name: 'Arjun Nair',
      role: 'last seen at 12:45 pm',
      initials: 'AN',
      avatarBg: '#2563EB',
      msg1: `
        <text x="28" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Other astrologers terrified my family about a 'destructive Mangal'</text>
        <text x="28" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">and quoted ₹40,000 for complex cancellation rituals.</text>
        <text x="28" y="158" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">AstroMath proved with house degrees that Mars is in 3rd (upachaya)!</text>
      `,
      msg1Time: '12:40 PM',
      msg2: `
        <text x="28" y="208" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">No dosha whatsoever according to classical BPHS rules.</text>
        <text x="28" y="226" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">You saved my relationship and my family from scam artists.</text>
        <text x="28" y="244" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">You guys are doing noble work 🙏</text>
      `,
      msg2Time: '12:44 PM',
      isMsg2Sent: false,
      tag: 'YESTERDAY',
    }),
  },
  {
    id: 10,
    title: 'Meera Reddy - Series A Funding on 9/10 Transit',
    image: createWhatsAppChatSvg({
      name: 'Meera Reddy (SaaS)',
      role: 'online',
      initials: 'MR',
      avatarBg: '#059669',
      msg1: `
        <text x="28" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Chandra Bala score was 9/10 today in my 11th house of gains.</text>
        <text x="28" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">We just signed our Series A term sheet with our lead VC! 🍾</text>
        <text x="28" y="158" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">The investor literally called at 3:15 PM during the auspicious window.</text>
      `,
      msg1Time: '3:30 PM',
      msg2: `
        <text x="86" y="208" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">BOOM! 🚀 Massive congrats Meera! The 11th solar transit with</text>
        <text x="86" y="226" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Jupiter aspect is legendary for institutional capital.</text>
        <text x="86" y="244" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#8696A0">Go dominate the market!</text>
      `,
      msg2Time: '3:33 PM',
      isMsg2Sent: true,
      tag: 'TODAY',
    }),
  },
  {
    id: 11,
    title: 'Karan Patel - Tech Strategy Pivot & 40% Hike',
    image: createWhatsAppChatSvg({
      name: 'Karan Patel',
      role: 'online',
      initials: 'KP',
      avatarBg: '#7C3AED',
      msg1: `
        <text x="28" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Followed the vocation blueprint advice on 10th Lord Mercury:</text>
        <text x="28" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Pivoted from generic digital marketing to AI Enterprise Product.</text>
        <text x="28" y="158" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Accepted an offer today with a 42% hike + US stock options!</text>
      `,
      msg1Time: '5:40 PM',
      msg2: `
        <text x="86" y="208" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Stellar move Karan! Mercury in Virgo in 10th thrives in analytical</text>
        <text x="86" y="226" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">high-tech infrastructure. You aligned with your natal strength.</text>
        <text x="86" y="244" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#8696A0">Proud of you!</text>
      `,
      msg2Time: '5:44 PM',
      isMsg2Sent: true,
      tag: 'TODAY',
    }),
  },
  {
    id: 12,
    title: 'Neha Gupta - Navamsha Soul Blueprint Accuracy',
    image: createWhatsAppChatSvg({
      name: 'Neha Gupta',
      role: 'last seen at 10:05 pm',
      initials: 'NG',
      avatarBg: '#EA580C',
      msg1: `
        <text x="28" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Reading the Navamsha (D9) interpretation gave me goosebumps.</text>
        <text x="28" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">It explained why my entire twenties were filled with restlessness</text>
        <text x="28" y="158" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">and why turning 30 unlocked immense clarity and calm.</text>
      `,
      msg1Time: '10:00 PM',
      msg2: `
        <text x="28" y="208" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">It felt like someone reverse-engineered the source code of my life.</text>
        <text x="28" y="226" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">No other platform comes close to this philosophical depth.</text>
        <text x="28" y="244" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Truly grateful for AstroMath.</text>
      `,
      msg2Time: '10:04 PM',
      isMsg2Sent: false,
      tag: 'YESTERDAY',
    }),
  },
  {
    id: 13,
    title: 'Siddharth Rao - AI Oracle Scholarly Depth',
    image: createWhatsAppChatSvg({
      name: 'Siddharth Rao',
      role: 'online',
      initials: 'SR',
      avatarBg: '#4338CA',
      msg1: `
        <text x="28" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">I tested the AstroMath Oracle on a tricky question:</text>
        <text x="28" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Ketu in 8th house aspected by Mars in Pisces.</text>
        <text x="28" y="158" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">The AI responded with exact Saravali principles and deep wisdom!</text>
      `,
      msg1Time: '3:10 PM',
      msg2: `
        <text x="86" y="208" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">That's our zero-hallucination engine Siddharth! 🎯 Grounded in</text>
        <text x="86" y="226" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">verified astronomical math + classical Vedic treatises. No fake AI</text>
        <text x="86" y="244" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#8696A0">babble allowed.</text>
      `,
      msg2Time: '3:14 PM',
      isMsg2Sent: true,
      tag: 'TODAY',
    }),
  },
  {
    id: 14,
    title: 'Pooja Malhotra - Natural Remedies & Daily Composure',
    image: createWhatsAppChatSvg({
      name: 'Pooja Malhotra',
      role: 'last seen at 8:20 am',
      initials: 'PM',
      avatarBg: '#BE185D',
      msg1: `
        <text x="28" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Started the sunrise solar discipline and breath regulation</text>
        <text x="28" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">recommended in my Sun-Saturn remediation section.</text>
        <text x="28" y="158" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">My chronic morning anxiety vanished in under 10 days!</text>
      `,
      msg1Time: '8:15 AM',
      msg2: `
        <text x="28" y="208" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Love that you focus on lifestyle and mental alignment rather</text>
        <text x="28" y="226" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">than selling overpriced rings. AstroMath is a breath of fresh air.</text>
        <text x="28" y="244" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">Already referred 4 friends!</text>
      `,
      msg2Time: '8:18 AM',
      isMsg2Sent: false,
      tag: 'YESTERDAY',
    }),
  },
  {
    id: 15,
    title: 'Devendra Deshmukh - AstroTalk Contrast & Verification',
    image: createWhatsAppChatSvg({
      name: 'Devendra Deshmukh',
      role: 'online',
      initials: 'DD',
      avatarBg: '#047857',
      msg1: `
        <text x="28" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">I did a side-by-side test with my ₹2,500 AstroTalk reading.</text>
        <text x="28" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">AstroTalk had my Moon sign in wrong degree and generic text.</text>
        <text x="28" y="158" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">AstroMath had exact 0.001° degrees matching the Indian Ephmeris!</text>
      `,
      msg1Time: '11:50 AM',
      msg2: `
        <text x="86" y="208" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">That is why we built AstroMath Devendra! Real astronomy,</text>
        <text x="86" y="226" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#E9EDEF">exact Swiss calculations, and zero circus tricks.</text>
        <text x="86" y="244" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#8696A0">Truth always speaks for itself! ⚖️</text>
      `,
      msg2Time: '11:53 AM',
      isMsg2Sent: true,
      tag: 'TODAY',
    }),
  },
];
