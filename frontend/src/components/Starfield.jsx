import { useEffect, useRef } from 'react';

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.05 + 0.01,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    let step = 0;
    const render = () => {
      step++;
      ctx.clearRect(0, 0, width, height);

      // Deep space nebula background glows
      const bgGrad1 = ctx.createRadialGradient(
        width * 0.25, height * 0.3, 50,
        width * 0.25, height * 0.3, width * 0.5
      );
      bgGrad1.addColorStop(0, 'rgba(139, 92, 246, 0.06)');
      bgGrad1.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = bgGrad1;
      ctx.fillRect(0, 0, width, height);

      const bgGrad2 = ctx.createRadialGradient(
        width * 0.8, height * 0.65, 40,
        width * 0.8, height * 0.65, width * 0.45
      );
      bgGrad2.addColorStop(0, 'rgba(245, 158, 11, 0.05)');
      bgGrad2.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = bgGrad2;
      ctx.fillRect(0, 0, width, height);

      // Render stars
      stars.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        const twinkle = Math.sin(step * star.twinkleSpeed + star.twinklePhase);
        const currentAlpha = Math.max(0.1, star.alpha + twinkle * 0.3);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.shadowBlur = star.size > 1.2 ? 6 : 0;
        ctx.shadowColor = 'rgba(253, 230, 138, 0.8)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
