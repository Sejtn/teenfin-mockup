import React, { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';

function TargetCursor({ spinDuration = 2, hideDefaultCursor = true }: { spinDuration?: number; hideDefaultCursor?: boolean }) {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, { x, y, duration: 0.1, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) document.body.style.cursor = 'none';
    if (!cursorRef.current) return () => void 0;
    const cursor = cursorRef.current;
    gsap.set(cursor, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
    if (spinTl.current) spinTl.current.kill();
    spinTl.current = gsap.timeline({ repeat: -1 }).to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);
    return () => {
      window.removeEventListener('mousemove', moveHandler);
      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
    };
  }, [hideDefaultCursor, moveCursor, spinDuration]);

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <style>{`
        .target-cursor-wrapper { position: fixed; top: 0; left: 0; width: 0; height: 0; pointer-events: none; z-index: 9999; mix-blend-mode: difference; transform: translate(-50%, -50%); }
        .target-cursor-dot { position: absolute; left: 50%; top: 50%; width: 6px; height: 6px; background: #fff; border-radius: 9999px; transform: translate(-50%, -50%); will-change: transform; }
      `}</style>
      <div ref={dotRef} className="target-cursor-dot" />
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<'home' | 'shop' | 'save' | 'invest'>('home');
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex flex-col items-center py-10">
      <TargetCursor spinDuration={2} hideDefaultCursor={true} />
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">TeenFin</h1>
        <p className="opacity-80">Investičná aplikácia pre vzdelávanie mladých ľudí (gamifikovaná) • Autor: Marek Janošec</p>
      </header>
      <div className="bg-gray-800/70 rounded-xl p-6">
        {screen === 'home' && <div>🏠 Domovská obrazovka</div>}
        {screen === 'shop' && <div>🛒 Shop</div>}
        {screen === 'save' && <div>💰 Save</div>}
        {screen === 'invest' && <div>📈 Invest</div>}
        <div className="mt-4 flex gap-2">
          <button onClick={() => setScreen('home')}>Home</button>
          <button onClick={() => setScreen('shop')}>Shop</button>
          <button onClick={() => setScreen('save')}>Save</button>
          <button onClick={() => setScreen('invest')}>Invest</button>
        </div>
      </div>
    </div>
  );
}
