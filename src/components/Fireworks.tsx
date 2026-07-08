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
  '#fcb045',
  '#fd1d1d',
  '#833ab4',
  '#ff6b6b',
  '#ffd93d',
  '#c084fc',
  '#f472b6',
  '#34d399',
  '#60a5fa',
];

export default function Fireworks({ active }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      particlesRef.current = [];
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const particles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      const angle = (Math.PI * 2 * i) / 50 + (Math.random() - 0.5) * 0.3;
      const speed = 2 + Math.random() * 5;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 35 + Math.random() * 35,
        size: 2 + Math.random() * 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    particlesRef.current = particles;

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
        p.vy += 0.05;
        p.vx *= 0.98;
        p.life++;

        const alpha = 1 - p.life / p.maxLife;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * (0.3 + alpha * 0.7), 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = alpha;
        ctx!.fill();
      });

      ctx!.globalAlpha = 1;

      if (particlesRef.current.length > 0) {
        animRef.current = requestAnimationFrame(animate);
      }
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-30 pointer-events-none"
    />
  );
}
