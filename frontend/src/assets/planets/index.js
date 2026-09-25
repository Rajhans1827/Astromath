import sunImg from './sun.svg';
import moonImg from './moon.svg';
import marsImg from './mars.svg';
import mercuryImg from './mercury.svg';
import jupiterImg from './jupiter.svg';
import venusImg from './venus.svg';
import saturnImg from './saturn.svg';
import rahuImg from './rahu.svg';
import ketuImg from './ketu.svg';

export const planetsList = [
  { name: 'Sun', sanskrit: 'Surya', glyph: '☉', src: sunImg, sign: 'Leo', nature: 'Soul & Core Vitality', color: '#F59E0B' },
  { name: 'Moon', sanskrit: 'Chandra', glyph: '☽', src: moonImg, sign: 'Cancer', nature: 'Mind & Intuition', color: '#E2E8F0' },
  { name: 'Mars', sanskrit: 'Mangala', glyph: '♂', src: marsImg, sign: 'Aries / Scorpio', nature: 'Ambition & Courage', color: '#EF4444' },
  { name: 'Mercury', sanskrit: 'Budha', glyph: '☿', src: mercuryImg, sign: 'Gemini / Virgo', nature: 'Intellect & Eloquence', color: '#10B981' },
  { name: 'Jupiter', sanskrit: 'Guru', glyph: '♃', src: jupiterImg, sign: 'Sagittarius / Pisces', nature: 'Wisdom & Expansion', color: '#FBBF24' },
  { name: 'Venus', sanskrit: 'Shukra', glyph: '♀', src: venusImg, sign: 'Taurus / Libra', nature: 'Love, Art & Devotion', color: '#EC4899' },
  { name: 'Saturn', sanskrit: 'Shani', glyph: '♄', src: saturnImg, sign: 'Capricorn / Aquarius', nature: 'Karma & Sovereignty', color: '#818CF8' },
  { name: 'Rahu', sanskrit: 'North Node', glyph: '☊', src: rahuImg, sign: 'Exalted in Taurus', nature: 'Evolutionary Destiny', color: '#A78BFA' },
  { name: 'Ketu', sanskrit: 'South Node', glyph: '☋', src: ketuImg, sign: 'Exalted in Scorpio', nature: 'Spiritual Liberation', color: '#FB923C' },
];

export const planetImages = planetsList.map((p) => p.src);
