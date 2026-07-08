'use client';

import { useEffect, useRef } from 'react';

interface FireworksProps {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const COLORS = [
  '#fcb045', '#fd1d1d', '#833ab4', '#ff6b6b', '#ffd93d',
  '#c084fc', '#f472b6', '#34d399', '#60a5fa', '#fff',
  '#f97316', '#a78bfa', '#22d3ee', '#fb923c',
];

export default function Fireworks({ active }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const burstCountRef = useRef(0);

  useEffect(() => {
    if (!active) {
      particlesRef.current = [];
      if (animRef.current) cancelAnimationFrame(animRef.current);
      burstCountRef.current = 0;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const burst = (cx: number, cy: number) => {
      const particles: Particle[] = [];
      const count = 40 + Math.floor(Math.random() * 30);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 3 + Math.random() * 6;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 50 + Math.random() * 50,
          size: 3 + Math.random() * 4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
      particlesRef.current = [...particlesRef.current, ...particles];
    };

    const w = canvas.width;
    const h = canvas.height;

    burstCountRef.current = 0;
    const burstInterval = setInterval(() => {
      if (burstCountRef.current >= 5) {
        clearInterval(burstInterval);
        return;
      }
      const cx = w * 0.15 + Math.random() * w * 0.7;
      const cy = h * 0.15 + Math.random() * h * 0.5;
      burst(cx, cy);
      burstCountRef.current++;
    }, 400);

    let running = true;
    function animate() {
      if (!running) return;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      particlesRef.current = particlesRef.current.filter(
        (p) => p.life < p.maxLife
      );

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx *= 0.97;
        p.life++;

        const alpha = 1 - p.life / p.maxLife;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * (0.2 + alpha * 0.8), 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = alpha;
        ctx!.fill();
      });

      ctx!.globalAlpha = 1;

      if (particlesRef.current.length > 0 || burstCountRef.current < 5) {
        animRef.current = requestAnimationFrame(animate);
      }
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      clearInterval(burstInterval);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-30 pointer-events-none"
    />
  );
}
