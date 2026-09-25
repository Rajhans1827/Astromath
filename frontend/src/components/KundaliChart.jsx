// Luxury Celestial North Indian Diamond Chart Visualizer (High-Resolution Large Scale)
import React from 'react';

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function KundaliChart({
  chartType = 'D1',
  lagnaSign = 1, // 1 to 12
  houses = {},
  title = 'Birth Matrix (D1)',
  size = 540,
}) {
  const getHouseSign = (h) => {
    return ((lagnaSign - 1 + (h - 1)) % 12) + 1;
  };

  const houseCoords = {
    1: { sign: { x: 200, y: 155 }, planets: { x: 200, y: 108 } },
    2: { sign: { x: 130, y: 68 }, planets: { x: 105, y: 44 } },
    3: { sign: { x: 68, y: 130 }, planets: { x: 44, y: 105 } },
    4: { sign: { x: 155, y: 200 }, planets: { x: 108, y: 200 } },
    5: { sign: { x: 68, y: 270 }, planets: { x: 44, y: 295 } },
    6: { sign: { x: 130, y: 332 }, planets: { x: 105, y: 356 } },
    7: { sign: { x: 200, y: 245 }, planets: { x: 200, y: 292 } },
    8: { sign: { x: 270, y: 332 }, planets: { x: 295, y: 356 } },
    9: { sign: { x: 332, y: 270 }, planets: { x: 356, y: 295 } },
    10: { sign: { x: 245, y: 200 }, planets: { x: 292, y: 200 } },
    11: { sign: { x: 332, y: 130 }, planets: { x: 356, y: 105 } },
    12: { sign: { x: 270, y: 68 }, planets: { x: 295, y: 44 } },
  };

  return (
    <div className="flex flex-col items-center select-none w-full">
      {/* Chart Header Bar */}
      <div className="flex items-center justify-between w-full max-w-[560px] mb-3 px-2">
        <div>
          <h4 className="text-white font-bold tracking-tight text-base sm:text-lg">
            {title}
          </h4>
          <span className="text-xs text-slate-300 font-mono tracking-tight">
            Ascendant • {ZODIAC_SIGNS[lagnaSign - 1]}
          </span>
        </div>
        <span className="text-[10px] tracking-wider uppercase px-3 py-1 rounded-full bg-white/[0.08] border border-white/15 text-slate-200 font-medium shadow-sm">
          Sidereal Harmonic Wheel
        </span>
      </div>

      {/* Chart Canvas Card (Enlarged, Spacious & Sharp) */}
      <div className="relative w-full max-w-[560px] p-4 sm:p-7 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center justify-center">
        <svg
          viewBox="0 0 400 400"
          width="100%"
          height="100%"
          className="w-full max-w-[500px] aspect-square drop-shadow-2xl"
        >
          <defs>
            <linearGradient id="chartGoldLarge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#CBD5E1" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.85" />
            </linearGradient>
            <radialGradient id="centerAtmosphereLarge" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.04" />
              <stop offset="70%" stopColor="#05070D" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ethereal Center Glow */}
          <rect x="0" y="0" width="400" height="400" fill="url(#centerAtmosphereLarge)" rx="20" />

          {/* Outer Border */}
          <rect
            x="6"
            y="6"
            width="388"
            height="388"
            fill="none"
            stroke="url(#chartGoldLarge)"
            strokeWidth="2.2"
            rx="12"
          />

          {/* Diagonals */}
          <line x1="6" y1="6" x2="394" y2="394" stroke="url(#chartGoldLarge)" strokeWidth="1.4" opacity="0.75" />
          <line x1="6" y1="394" x2="394" y2="6" stroke="url(#chartGoldLarge)" strokeWidth="1.4" opacity="0.75" />

          {/* Inner Diamond */}
          <polygon
            points="200,6 394,200 200,394 6,200"
            fill="none"
            stroke="url(#chartGoldLarge)"
            strokeWidth="2.2"
          />

          {/* Houses 1 to 12 */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
            const coord = houseCoords[houseNum];
            const signNum = getHouseSign(houseNum);
            const planetList = houses[houseNum] || [];

            return (
              <g key={houseNum}>
                {/* Zodiac Sign Number (Larger & Clearer) */}
                <text
                  x={coord.sign.x}
                  y={coord.sign.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#94A3B8"
                  fontSize="13.5"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontWeight="700"
                  opacity="0.9"
                >
                  {signNum}
                </text>

                {/* Planets with prominent labels */}
                {planetList.length > 0 && (
                  <g>
                    {planetList.map((p, idx) => {
                      const total = planetList.length;
                      const yOffset = (idx - (total - 1) / 2) * 16;
                      return (
                        <text
                          key={p.name}
                          x={coord.planets.x}
                          y={coord.planets.y + yOffset}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={p.isRetro ? '#FDA4AF' : '#FFFFFF'}
                          fontSize={total > 2 ? '10.5' : '12'}
                          fontFamily="'Plus Jakarta Sans', sans-serif"
                          fontWeight="600"
                          letterSpacing="0.02em"
                        >
                          {p.name}
                          {p.deg ? ` ${p.deg}` : ''}
                          {p.isRetro ? ' ℞' : ''}
                        </text>
                      );
                    })}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
