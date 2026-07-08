'use client';

import { useEffect, useRef } from 'react';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
  username: string;
}

export default function QRCode({ username }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const url = `https://instagram.com/${username}`;
    QRCodeLib.toCanvas(canvasRef.current, url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#1E1E1E',
        light: '#FAF6EE',
      },
    });
  }, [username]);

  return (
    <div className="flex items-center justify-center p-4">
      <canvas
        ref={canvasRef}
        className="rounded-xl"
        style={{ width: 'clamp(200px, 22vw, 420px)', height: 'clamp(200px, 22vw, 420px)' }}
      />
    </div>
  );
}
