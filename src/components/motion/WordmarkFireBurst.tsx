"use client";

import { useEffect, useRef } from "react";

type Ember = {
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

type FlameLick = {
  x: number;
  baseY: number;
  height: number;
  width: number;
  phase: number;
  speed: number;
  hue: number;
};

type WordmarkFireBurstProps = {
  active: boolean;
  width: number;
  height: number;
};

function drawFlameLick(
  ctx: CanvasRenderingContext2D,
  lick: FlameLick,
  t: number,
  alpha: number
) {
  const sway = Math.sin(t * lick.speed + lick.phase) * lick.width * 0.22;
  const x = lick.x + sway;
  const baseY = lick.baseY;
  const h = lick.height * (0.88 + Math.sin(t * 0.08 + lick.phase) * 0.12);
  const w = lick.width;

  const g = ctx.createLinearGradient(x, baseY, x, baseY - h);
  g.addColorStop(0, `hsla(${lick.hue}, 100%, 42%, ${alpha * 0.75})`);
  g.addColorStop(0.35, `hsla(${lick.hue + 8}, 100%, 58%, ${alpha * 0.9})`);
  g.addColorStop(0.62, `hsla(${lick.hue + 18}, 100%, 72%, ${alpha * 0.82})`);
  g.addColorStop(0.82, `hsla(48, 100%, 88%, ${alpha * 0.55})`);
  g.addColorStop(1, `hsla(55, 100%, 96%, 0)`);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - w * 0.5, baseY);
  ctx.quadraticCurveTo(x - w * 0.35, baseY - h * 0.45, x, baseY - h);
  ctx.quadraticCurveTo(x + w * 0.35, baseY - h * 0.45, x + w * 0.5, baseY);
  ctx.closePath();
  ctx.fill();

  const core = ctx.createRadialGradient(x, baseY - h * 0.55, 0, x, baseY - h * 0.55, w * 0.55);
  core.addColorStop(0, `hsla(52, 100%, 94%, ${alpha * 0.65})`);
  core.addColorStop(0.4, `hsla(${lick.hue + 12}, 100%, 68%, ${alpha * 0.4})`);
  core.addColorStop(1, "hsla(20, 100%, 50%, 0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.ellipse(x, baseY - h * 0.52, w * 0.28, h * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawEmber(
  ctx: CanvasRenderingContext2D,
  e: Ember,
  alpha: number
) {
  const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 1.4);
  g.addColorStop(0, `hsla(${e.hue}, 100%, 92%, ${alpha * 0.95})`);
  g.addColorStop(0.35, `hsla(${e.hue - 6}, 100%, 62%, ${alpha * 0.7})`);
  g.addColorStop(0.7, `hsla(${e.hue - 20}, 95%, 42%, ${alpha * 0.35})`);
  g.addColorStop(1, "hsla(15, 90%, 30%, 0)");

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(e.x, e.y, e.size * 0.38, e.size * 0.95, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Fuego canvas premium — columnas + brasas, blend additive */
export function WordmarkFireBurst({ active, width, height }: WordmarkFireBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const embersRef = useRef<Ember[]>([]);
  const licksRef = useRef<FlameLick[]>([]);
  const rafRef = useRef<number>(0);
  const tickRef = useRef(0);

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

    const lickCount = Math.max(6, Math.floor(width / 55));
    licksRef.current = Array.from({ length: lickCount }, (_, i) => ({
      x: (width / (lickCount + 1)) * (i + 1) + (Math.random() - 0.5) * 12,
      baseY: height * 0.86,
      height: height * (0.42 + Math.random() * 0.28),
      width: 14 + Math.random() * 22,
      phase: Math.random() * Math.PI * 2,
      speed: 0.06 + Math.random() * 0.05,
      hue: 14 + Math.random() * 22,
    }));

    const spawnY = height * 0.84;

    const tick = () => {
      tickRef.current += 1;
      const t = tickRef.current;
      if (!active) {
        embersRef.current = [];
        ctx.clearRect(0, 0, width, height);
        return;
      }

      const spawnRate = width > 400 ? 4 : 3;
      for (let i = 0; i < spawnRate; i++) {
        embersRef.current.push({
          x: width * (0.04 + Math.random() * 0.92),
          y: spawnY + Math.random() * 8,
          vx: (Math.random() - 0.5) * 1.6,
          vy: -(2.8 + Math.random() * 3.4),
          life: 0,
          maxLife: 55 + Math.random() * 65,
          size: 10 + Math.random() * 20,
          hue: 16 + Math.random() * 26,
          wobble: Math.random() * Math.PI * 2,
        });
      }

      ctx.clearRect(0, 0, width, height);

      for (const lick of licksRef.current) {
        drawFlameLick(ctx, lick, t, 0.38);
      }

      embersRef.current = embersRef.current.filter((e) => {
        e.life += 1;
        e.wobble += 0.14;
        e.vx += Math.sin(e.wobble) * 0.11;
        e.vy -= 0.048;
        e.x += e.vx;
        e.y += e.vy;
        e.size *= 0.992;

        const lifeT = e.life / e.maxLife;
        const alpha =
          lifeT < 0.1 ? lifeT / 0.1 : 1 - (lifeT - 0.1) / 0.9;
        if (alpha <= 0.02) return false;

        drawEmber(ctx, e, alpha * 0.92);
        return e.life < e.maxLife;
      });

      if (embersRef.current.length > 280) {
        embersRef.current.splice(0, embersRef.current.length - 280);
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
