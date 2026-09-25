// Luxury Celestial North Indian Diamond Chart Visualizer
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
  size = 460,
}) {
  const getHouseSign = (h) => {
    return ((lagnaSign - 1 + (h - 1)) % 12) + 1;
  };

  const houseCoords = {
    1: { sign: { x: 200, y: 155 }, planets: { x: 200, y: 110 } },
    2: { sign: { x: 130, y: 70 }, planets: { x: 105, y: 45 } },
    3: { sign: { x: 70, y: 130 }, planets: { x: 45, y: 105 } },
    4: { sign: { x: 155, y: 200 }, planets: { x: 110, y: 200 } },
    5: { sign: { x: 70, y: 270 }, planets: { x: 45, y: 295 } },
    6: { sign: { x: 130, y: 330 }, planets: { x: 105, y: 355 } },
    7: { sign: { x: 200, y: 245 }, planets: { x: 200, y: 290 } },
    8: { sign: { x: 270, y: 330 }, planets: { x: 295, y: 355 } },
    9: { sign: { x: 330, y: 270 }, planets: { x: 355, y: 295 } },
    10: { sign: { x: 245, y: 200 }, planets: { x: 290, y: 200 } },
    11: { sign: { x: 330, y: 130 }, planets: { x: 355, y: 105 } },
    12: { sign: { x: 270, y: 70 }, planets: { x: 295, y: 45 } },
  };

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div className="flex items-center justify-between w-full max-w-[460px] mb-3 px-1">
        <div>
          <h4 className="text-white font-bold tracking-tight text-sm">
            {title}
          </h4>
          <span className="text-[11px] text-slate-400 font-mono tracking-tight">
            Ascendant • {ZODIAC_SIGNS[lagnaSign - 1]}
          </span>
        </div>
        <span className="text-[10px] tracking-wider uppercase px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 font-medium">
          Sidereal Wheel
        </span>
      </div>

      <div className="relative p-3.5 sm:p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl">
        <svg
          viewBox="0 0 400 400"
          width={size}
          height={size}
          className="w-full max-w-[420px] h-auto drop-shadow-xl"
        >
          <defs>
            <linearGradient id="chartGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.8" />
            </linearGradient>
            <radialGradient id="centerAtmosphere" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.04" />
              <stop offset="80%" stopColor="#05070D" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ethereal Subtle Center Glow */}
          <rect x="0" y="0" width="400" height="400" fill="url(#centerAtmosphere)" rx="16" />

          {/* Outer Border */}
          <rect
            x="6"
            y="6"
            width="388"
            height="388"
            fill="none"
            stroke="url(#chartGold)"
            strokeWidth="1.8"
            rx="8"
          />

          {/* Diagonals */}
          <line x1="6" y1="6" x2="394" y2="394" stroke="url(#chartGold)" strokeWidth="1.2" opacity="0.7" />
          <line x1="6" y1="394" x2="394" y2="6" stroke="url(#chartGold)" strokeWidth="1.2" opacity="0.7" />

          {/* Inner Diamond */}
          <polygon
            points="200,6 394,200 200,394 6,200"
            fill="none"
            stroke="url(#chartGold)"
            strokeWidth="1.8"
          />

          {/* Houses 1 to 12 */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
            const coord = houseCoords[houseNum];
            const signNum = getHouseSign(houseNum);
            const planetList = houses[houseNum] || [];

            return (
              <g key={houseNum}>
                {/* Zodiac Sign Number */}
                <text
                  x={coord.sign.x}
                  y={coord.sign.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#94A3B8"
                  fontSize="12"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontWeight="600"
                  opacity="0.85"
                >
                  {signNum}
                </text>

                {/* Planets */}
                {planetList.length > 0 && (
                  <g>
                    {planetList.map((p, idx) => {
                      const total = planetList.length;
                      const yOffset = (idx - (total - 1) / 2) * 15;
                      return (
                        <text
                          key={p.name}
                          x={coord.planets.x}
                          y={coord.planets.y + yOffset}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={p.isRetro ? '#FDA4AF' : '#FFFFFF'}
                          fontSize={total > 2 ? '9.5' : '10.5'}
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
