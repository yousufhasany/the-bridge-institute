import { useEffect, useRef } from 'react';
import plateSrc from '../../assets/auth/body/plate.jpg';

const frameModules = import.meta.glob('../../assets/auth/body/b*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const frameSrcs = Object.keys(frameModules)
  .sort()
  .map((key) => frameModules[key]);

const LOOK_SMOOTH = 0.16;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function coverBox(stageW: number, stageH: number, imgW: number, imgH: number) {
  const scale = Math.max(stageW / imgW, stageH / imgH);
  const w = imgW * scale;
  const h = imgH * scale;
  return { w, h, left: (stageW - w) / 2, top: (stageH - h) / 2 };
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(src));
    image.src = src;
  });
}

export function AuthMascot() {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useRef(false);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      reduced.current = media.matches;
    };
    apply();
    media.addEventListener?.('change', apply);
    return () => media.removeEventListener?.('change', apply);
  }, []);

  useEffect(() => {
    let raf = 0;
    let stopped = false;
    let plate: HTMLImageElement | null = null;
    const sprites: HTMLImageElement[] = [];
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const look = { x: 0, y: 0 };
    let prev = performance.now();

    const paint = (now: number) => {
      const node = canvas.current;
      const stageEl = stage.current;
      const ctx = node?.getContext('2d');
      const spriteReady = sprites[0];
      if (!node || !stageEl || !ctx || !plate || !spriteReady) return;

      const dt = Math.min(32, now - prev);
      prev = now;
      const box = stageEl.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = Math.max(1, Math.round(box.width * dpr));
      const height = Math.max(1, Math.round(box.height * dpr));
      if (node.width !== width || node.height !== height) {
        node.width = width;
        node.height = height;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, box.width, box.height);

      if (!reduced.current) {
        const faceX = box.left + box.width * 0.5;
        const faceY = box.top + box.height * 0.4;
        const tx = clamp((pointer.x - faceX) / (window.innerWidth * 0.22), -1, 1);
        const ty = clamp((pointer.y - faceY) / (window.innerHeight * 0.22), -1, 1);
        const k = 1 - (1 - LOOK_SMOOTH) ** (dt / 16.67);
        look.x += (tx - look.x) * k;
        look.y += (ty - look.y) * k;
      }

      const covered = coverBox(box.width, box.height, plate.naturalWidth, plate.naturalHeight);
      ctx.drawImage(plate, covered.left, covered.top, covered.w, covered.h);

      const index = clamp(Math.round(Math.abs(look.x) * (frameSrcs.length - 1)), 0, frameSrcs.length - 1);
      const sprite = sprites[index] ?? spriteReady;
      const footX = covered.left + covered.w / 2;
      const footY = covered.top + covered.h * 0.8;

      ctx.save();
      ctx.translate(footX, footY + look.y * covered.h * 0.03);
      ctx.scale(look.x < 0 ? -1 : 1, 1);
      ctx.drawImage(sprite, -covered.w / 2, covered.top - footY, covered.w, covered.h);
      ctx.restore();
    };

    const tick = (now: number) => {
      if (stopped) return;
      paint(now);
      raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener('pointermove', onMove, { passive: true });
    void loadImage(plateSrc).then((image) => {
      if (!stopped) plate = image;
    });
    frameSrcs.forEach((src, index) => {
      void loadImage(src).then((image) => {
        if (!stopped) sprites[index] = image;
      });
    });

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div ref={stage} className="mascot-stage" aria-hidden>
      <canvas ref={canvas} className="mascot-canvas" />
    </div>
  );
}
