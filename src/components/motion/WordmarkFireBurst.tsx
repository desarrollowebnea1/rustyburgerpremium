"use client";

import { useEffect, useRef } from "react";

type Flame = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
  wobble: number;
};

type WordmarkFireBurstProps = {
  active: boolean;
  width: number;
  height: number;
};

function drawFlame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number,
  hue: number
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y - size * 0.35, size * 1.15);
  g.addColorStop(0, `hsla(${hue}, 100%, 96%, ${alpha * 0.95})`);
  g.addColorStop(0.22, `hsla(${hue - 5}, 100%, 72%, ${alpha * 0.88})`);
  g.addColorStop(0.48, `hsla(${hue - 18}, 100%, 52%, ${alpha * 0.65})`);
  g.addColorStop(0.78, `hsla(${hue - 32}, 95%, 38%, ${alpha * 0.28})`);
  g.addColorStop(1, `hsla(${hue - 45}, 90%, 28%, 0)`);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y, size * 0.42, size * 1.05, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Fuego canvas — partículas con blend additive, estilo premium */
export function WordmarkFireBurst({ active, width, height }: WordmarkFireBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flamesRef = useRef<Flame[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const spawnY = height * 0.82;

    const tick = () => {
      if (!active) {
        flamesRef.current = [];
        ctx.clearRect(0, 0, width, height);
        return;
      }

      const spawnCount = width > 400 ? 3 : 2;
      for (let i = 0; i < spawnCount; i++) {
        flamesRef.current.push({
          x: width * (0.06 + Math.random() * 0.88),
          y: spawnY + Math.random() * 10,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -2.2 - Math.random() * 2.8,
          life: 0,
          maxLife: 42 + Math.random() * 48,
          size: 8 + Math.random() * 16,
          hue: 18 + Math.random() * 28,
          wobble: Math.random() * Math.PI * 2,
        });
      }

      ctx.clearRect(0, 0, width, height);

      flamesRef.current = flamesRef.current.filter((f) => {
        f.life += 1;
        f.wobble += 0.14;
        f.vx += Math.sin(f.wobble) * 0.09;
        f.vy -= 0.045;
        f.x += f.vx;
        f.y += f.vy;
        f.size *= 0.992;

        const t = f.life / f.maxLife;
        const alpha = t < 0.12 ? t / 0.12 : 1 - (t - 0.12) / 0.88;
        if (alpha <= 0.02) return false;

        drawFlame(ctx, f.x, f.y, f.size, alpha * 0.92, f.hue);
        return f.life < f.maxLife;
      });

      if (flamesRef.current.length > 220) {
        flamesRef.current.splice(0, flamesRef.current.length - 220);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [active, width, height]);

  if (width < 1 || height < 1) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute left-0 top-0 z-0"
      aria-hidden
    />
  );
}
