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
  { name: 'Sun (सूर्य)', src: sunImg, sign: 'Leo (सिंह)', nature: 'Soul & Authority', color: '#F59E0B' },
  { name: 'Moon (चंद्र)', src: moonImg, sign: 'Cancer (कर्क)', nature: 'Mind & Emotions', color: '#E2E8F0' },
  { name: 'Mars (मंगळ)', src: marsImg, sign: 'Aries/Scorpio', nature: 'Energy & Courage', color: '#EF4444' },
  { name: 'Mercury (बुध)', src: mercuryImg, sign: 'Gemini/Virgo', nature: 'Intellect & Trade', color: '#10B981' },
  { name: 'Jupiter (गुरू)', src: jupiterImg, sign: 'Sagittarius/Pisces', nature: 'Wisdom & Expansion', color: '#FBBF24' },
  { name: 'Venus (शुक्र)', src: venusImg, sign: 'Taurus/Libra', nature: 'Love, Beauty & Wealth', color: '#EC4899' },
  { name: 'Saturn (शनी)', src: saturnImg, sign: 'Capricorn/Aquarius', nature: 'Karma & Discipline', color: '#6366F1' },
  { name: 'Rahu (राहू)', src: rahuImg, sign: 'Taurus/Gemini', nature: 'Ambition & Unconventional', color: '#8B5CF6' },
  { name: 'Ketu (केतू)', src: ketuImg, sign: 'Scorpio/Sagittarius', nature: 'Moksha & Intuition', color: '#F97316' },
];

export const planetImages = planetsList.map(p => p.src);
