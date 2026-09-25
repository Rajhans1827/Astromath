// Luxury Celestial North Indian Diamond Chart Visualizer (High-Resolution Large Scale)
import React from 'react';

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Helper: Format degrees compactly for chart wheel (e.g. "28° 53' 12"" -> "28°")
function formatChartDegree(degStr) {
  if (!degStr) return '';
  const match = degStr.match(/(\d+)°/);
  if (match) {
    return `${match[1]}°`;
  }
  const num = parseFloat(degStr);
  if (!isNaN(num)) {
    return `${Math.floor(num)}°`;
  }
  return degStr;
}

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

  // Mathematically optimized centroids and safe internal zones for North Indian chart
  // Canvas: 400x400 (Outer border: x:6, y:6, w:388, h:388)
  const houseCoords = {
    // House 1: Top Center Diamond (Tanu Bhava)
    1: { sign: { x: 200, y: 165 }, planets: { x: 200, y: 88 } },
    // House 2: Top-Left Triangle
    2: { sign: { x: 135, y: 68 }, planets: { x: 100, y: 38 } },
    // House 3: Upper-Left Triangle
    3: { sign: { x: 68, y: 135 }, planets: { x: 48, y: 95 } },
    // House 4: Center-Left Diamond (Sukha Bhava)
    4: { sign: { x: 160, y: 200 }, planets: { x: 95, y: 200 } },
    // House 5: Lower-Left Triangle (Putra Bhava)
    5: { sign: { x: 68, y: 265 }, planets: { x: 48, y: 305 } },
    // House 6: Bottom-Left Triangle (Ripu Bhava)
    6: { sign: { x: 135, y: 332 }, planets: { x: 100, y: 362 } },
    // House 7: Bottom Center Diamond (Kalatra Bhava)
    7: { sign: { x: 200, y: 235 }, planets: { x: 200, y: 310 } },
    // House 8: Bottom-Right Triangle (Ayu Bhava)
    8: { sign: { x: 265, y: 332 }, planets: { x: 297, y: 362 } },
    // House 9: Lower-Right Triangle (Bhagya Bhava)
    9: { sign: { x: 332, y: 265 }, planets: { x: 352, y: 305 } },
    // House 10: Center-Right Diamond (Karma Bhava)
    10: { sign: { x: 240, y: 200 }, planets: { x: 305, y: 200 } },
    // House 11: Upper-Right Triangle (Labha Bhava)
    11: { sign: { x: 332, y: 135 }, planets: { x: 352, y: 95 } },
    // House 12: Top-Right Triangle (Vyaya Bhava)
    12: { sign: { x: 265, y: 68 }, planets: { x: 297, y: 38 } },
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

      {/* Chart Canvas Card (Spacious, Sharp & Boundary-Safe) */}
      <div className="relative w-full max-w-[560px] p-3 sm:p-6 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center justify-center">
        <svg
          viewBox="0 0 400 400"
          width="100%"
          height="100%"
          className="w-full max-w-[500px] aspect-square drop-shadow-2xl overflow-visible"
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
                {/* Zodiac Sign Number (Clear, Subtle & Well Positioned) */}
                <text
                  x={coord.sign.x}
                  y={coord.sign.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#94A3B8"
                  fontSize="12.5"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontWeight="700"
                  opacity="0.9"
                >
                  {signNum}
                </text>

                {/* Planets with Compact Boundary-Safe Labels */}
                {planetList.length > 0 && (
                  <g>
                    {planetList.map((p, idx) => {
                      const total = planetList.length;
                      const lineSpacing = total > 3 ? 12 : total > 2 ? 14 : 16;
                      const yOffset = (idx - (total - 1) / 2) * lineSpacing;
                      const degText = formatChartDegree(p.deg);

                      return (
                        <text
                          key={p.name + idx}
                          x={coord.planets.x}
                          y={coord.planets.y + yOffset}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={p.isRetro ? '#FDA4AF' : '#FFFFFF'}
                          fontSize={total > 3 ? '9.5' : total > 1 ? '10.5' : '11.5'}
                          fontFamily="'Plus Jakarta Sans', sans-serif"
                          fontWeight="600"
                          className="cursor-pointer"
                        >
                          <title>{`${p.name} ${p.deg || ''} ${p.isRetro ? '(वक्र / Retrograde)' : ''}`.trim()}</title>
                          <tspan>{p.name}</tspan>
                          {degText && (
                            <tspan fill={p.isRetro ? '#FECDD3' : '#CBD5E1'} fontSize={total > 3 ? '8.5' : '9.5'} fontWeight="500">
                              {` ${degText}`}
                            </tspan>
                          )}
                          {p.isRetro && (
                            <tspan fill="#F43F5E" fontSize="9" fontWeight="700">
                              {' ℞'}
                            </tspan>
                          )}
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
