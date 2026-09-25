// North Indian Diamond Kundali Visualizer
// Supports D1 (Lagna), D9 (Navamsha), and D10 (Dashamsha) charts

import React from 'react';

const rashiNames = [
  'Mesha (मेष)', 'Vrishabha (वृषभ)', 'Mithuna (मिथुन)', 'Karka (कर्क)',
  'Simha (सिंह)', 'Kanya (कन्या)', 'Tula (तूळ)', 'Vrishchika (वृश्चिक)',
  'Dhanu (धनु)', 'Makara (मकर)', 'Kumbha (कुंभ)', 'Meena (मीन)'
];

export default function KundaliChart({
  chartType = 'D1',
  lagnaSign = 1, // 1 to 12
  houses = {}, // { 1: [{ name: 'Sun', deg: '14.2°', isRetro: false }], ... }
  title = 'लग्न कुंडली (D1)',
  size = 440,
}) {
  // House geometry positions in a 400x400 SVG grid
  // In North Indian chart:
  // House 1: Top Center Diamond
  // House 2: Top Right Triangle
  // House 3: Right Top Triangle
  // House 4: Right Center Diamond
  // House 5: Right Bottom Triangle
  // House 6: Bottom Right Triangle
  // House 7: Bottom Center Diamond
  // House 8: Bottom Left Triangle
  // House 9: Left Bottom Triangle
  // House 10: Left Center Diamond
  // House 11: Left Top Triangle
  // House 12: Top Left Triangle

  // Note: Signs rotate counter-clockwise:
  // Sign in House H = ((lagnaSign - 1 + (H - 1)) % 12) + 1
  const getHouseSign = (h) => {
    return ((lagnaSign - 1 + (h - 1)) % 12) + 1;
  };

  // Label coordinates for Rashi number and Planets for each of the 12 houses
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
    <div className="flex flex-col items-center select-none">
      <div className="flex items-center justify-between w-full max-w-[440px] mb-3 px-2">
        <h4 className="font-cinzel text-amber-400 font-semibold tracking-wider text-base">
          {title}
        </h4>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
          Lagna: {rashiNames[lagnaSign - 1]}
        </span>
      </div>

      <div className="relative p-2.5 rounded-2xl cosmic-glass border border-amber-500/20 shadow-2xl">
        <svg
          viewBox="0 0 400 400"
          width={size}
          height={size}
          className="w-full max-w-[400px] h-auto drop-shadow-md"
        >
          <defs>
            <linearGradient id="chartLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#D97706" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
            </linearGradient>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Center Radial Glow */}
          <rect x="0" y="0" width="400" height="400" fill="url(#centerGlow)" rx="8" />

          {/* Outer Square Border */}
          <rect
            x="4"
            y="4"
            width="392"
            height="392"
            fill="none"
            stroke="url(#chartLineGrad)"
            strokeWidth="3"
            rx="4"
          />

          {/* Diagonal Cross Lines: (0,0)->(400,400) and (0,400)->(400,0) */}
          <line x1="4" y1="4" x2="396" y2="396" stroke="url(#chartLineGrad)" strokeWidth="2" />
          <line x1="4" y1="396" x2="396" y2="4" stroke="url(#chartLineGrad)" strokeWidth="2" />

          {/* Inner Diamond connecting midpoints: (200,0)-(400,200)-(200,400)-(0,200) */}
          <polygon
            points="200,4 396,200 200,396 4,200"
            fill="none"
            stroke="url(#chartLineGrad)"
            strokeWidth="2.5"
          />

          {/* House Contents */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
            const coord = houseCoords[houseNum];
            const signNum = getHouseSign(houseNum);
            const planetList = houses[houseNum] || [];

            return (
              <g key={houseNum} className="house-group">
                {/* Rashi / Sign Number */}
                <text
                  x={coord.sign.x}
                  y={coord.sign.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#F59E0B"
                  fontSize="13"
                  fontWeight="bold"
                  opacity="0.85"
                >
                  {signNum}
                </text>

                {/* Planets residing in this house */}
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
                          fill={p.isRetro ? '#F87171' : '#E2E8F0'}
                          fontSize={total > 2 ? '10' : '11'}
                          fontWeight="600"
                          className="hover:fill-amber-300 transition-colors"
                        >
                          {p.name}
                          {p.deg ? ` ${p.deg}` : ''}
                          {p.isRetro ? ' (R)' : ''}
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

      <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
          संख्या: राशी क्रमांक (1=मेष ... 12=मीन)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
          (R): वक्री ग्रह (Retrograde)
        </span>
      </div>
    </div>
  );
}
