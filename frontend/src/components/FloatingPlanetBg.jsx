import { useState, useEffect } from 'react';

/**
 * FloatingPlanetBg - Atmospheric, Luxurious Celestial Planet Background
 * Renders the transparent textured celestial body with smooth, elegant floating,
 * slow axial rotation, atmospheric breathing corona, and subtle mouse parallax.
 */
export default function FloatingPlanetBg() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Soft, throttled mouse parallax for desktop
  useEffect(() => {
    let animationFrameId;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window;
        const normX = (e.clientX / innerWidth - 0.5) * 2;
        const normY = (e.clientY / innerHeight - 0.5) * 2;
        setMouseOffset({ x: normX, y: normY });
      });
    };

    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      <style>{`
        @keyframes celestialFloatPrimary {
          0% {
            transform: translate3d(0, 0px, 0) scale(1);
          }
          50% {
            transform: translate3d(12px, -26px, 0) scale(1.025);
          }
          100% {
            transform: translate3d(0, 0px, 0) scale(1);
          }
        }

        @keyframes celestialSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes celestialCoronaPulse {
          0%, 100% {
            transform: scale(0.96);
            opacity: 0.45;
          }
          50% {
            transform: scale(1.14);
            opacity: 0.75;
          }
        }

        @keyframes celestialFloatSecondary {
          0% {
            transform: translate3d(0, 0px, 0);
          }
          50% {
            transform: translate3d(-14px, 20px, 0);
          }
          100% {
            transform: translate3d(0, 0px, 0);
          }
        }

        .animate-celestial-float {
          animation: celestialFloatPrimary 18s ease-in-out infinite;
          will-change: transform;
        }

        .animate-celestial-spin {
          animation: celestialSpin 180s linear infinite;
          will-change: transform;
        }

        .animate-corona-breathe {
          animation: celestialCoronaPulse 10s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .animate-celestial-secondary {
          animation: celestialFloatSecondary 24s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      {/* ========================================================================= */}
      {/* 1. Primary Majestic Celestial Planet (Top-Right / Hero Background)      */}
      {/* ========================================================================= */}
      <div
        className="absolute top-[6%] sm:top-[8%] right-[-10%] sm:right-[2%] md:right-[6%] lg:right-[10%] w-[320px] sm:w-[440px] md:w-[520px] lg:w-[580px] aspect-square transition-transform duration-1000 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * 24}px, ${mouseOffset.y * 24}px, 0)`,
        }}
      >
        <div className="relative w-full h-full animate-celestial-float">
          {/* Atmospheric Golden Corona Glow (Behind Planet) */}
          <div
            className="absolute inset-[-18%] rounded-full animate-corona-breathe pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 45% 45%, rgba(245, 158, 11, 0.32) 0%, rgba(217, 119, 6, 0.18) 35%, rgba(168, 85, 247, 0.12) 58%, transparent 75%)',
              filter: 'blur(36px)',
            }}
          />

          {/* Faint Orbital Ring Axis */}
          <div
            className="absolute inset-[-12%] rounded-full border border-amber-400/15 pointer-events-none rotate-[-22deg]"
            style={{
              maskImage: 'radial-gradient(circle, transparent 55%, black 65%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(circle, transparent 55%, black 65%, transparent 75%)',
            }}
          />

          {/* Planet Sphere with Slow Axial Spin & Deep Radial Drop Shadows */}
          <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_80px_rgba(245,158,11,0.25)]">
            <img
              src="/celestial-planet.png"
              alt="Celestial Matrix Planet"
              className="w-full h-full object-contain animate-celestial-spin drop-shadow-[0_0_50px_rgba(245,158,11,0.35)]"
              draggable="false"
              loading="eager"
            />

            {/* Subtle Ethereal Atmospheric Limb Shimmer Overlay */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen opacity-40"
              style={{
                background:
                  'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.25) 0%, rgba(245, 158, 11, 0.15) 45%, transparent 70%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. Secondary Distant Celestial Moon/Orb (Lower-Left Balance)            */}
      {/* ========================================================================= */}
      <div
        className="hidden md:block absolute top-[52%] left-[4%] lg:left-[7%] w-[160px] lg:w-[210px] aspect-square transition-transform duration-1000 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * -16}px, ${mouseOffset.y * -16}px, 0)`,
        }}
      >
        <div className="relative w-full h-full animate-celestial-secondary opacity-65">
          {/* Subtle Violet Atmospheric Aura */}
          <div
            className="absolute inset-[-25%] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, rgba(139, 92, 246, 0.10) 45%, transparent 70%)',
              filter: 'blur(24px)',
            }}
          />

          {/* Secondary Scaled Orb */}
          <img
            src="/celestial-planet.png"
            alt="Secondary Lunar Orb"
            className="w-full h-full object-contain filter hue-rotate-30 brightness-90 animate-celestial-spin"
            style={{ animationDuration: '240s', animationDirection: 'reverse' }}
            draggable="false"
          />
        </div>
      </div>
    </div>
  );
}
