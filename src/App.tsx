import React, { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';

/**
 * TeenFin – Interactive Presentation + Mockups (single-file TSX)
 * - Renders a clean presentation with sections (Problem, Solution, Features, Bank, Monetization, Mockups, Conclusion)
 * - Includes interactive phone mockups: Home, Shop, Save, Invest
 * - Uses custom TargetCursor effect (dot + spinning corners) with GSAP
 * - TailwindCSS for styling (no imports required in this canvas)
 * - Adds lightweight runtime "tests" via console.assert to validate basic behavior
 */

// ==== Custom Cursor (adapted from user's background idea) ====
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

    // Infinite spin timeline for the corner box
    if (spinTl.current) spinTl.current.kill();
    spinTl.current = gsap.timeline({ repeat: -1 }).to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });

    const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    const mouseDownHandler = () => {
      if (!dotRef.current || !cursorRef.current) return;
      gsap.to(dotRef.current, { scale: 0.8, duration: 0.15 });
      gsap.to(cursorRef.current, { scale: 0.95, duration: 0.15 });
    };
    const mouseUpHandler = () => {
      if (!dotRef.current || !cursorRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.15 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.15 });
    };
    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
    };
  }, [hideDefaultCursor, moveCursor, spinDuration]);

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <style>{`
        .target-cursor-wrapper { position: fixed; top: 0; left: 0; width: 0; height: 0; pointer-events: none; z-index: 9999; mix-blend-mode: difference; transform: translate(-50%, -50%); }
        .target-cursor-dot { position: absolute; left: 50%; top: 50%; width: 6px; height: 6px; background: #fff; border-radius: 9999px; transform: translate(-50%, -50%); will-change: transform; }
        .target-cursor-corner { position: absolute; left: 50%; top: 50%; width: 14px; height: 14px; border: 3px solid #fff; will-change: transform; }
        .corner-tl { transform: translate(-160%, -160%); border-right: none; border-bottom: none; }
        .corner-tr { transform: translate(60%, -160%); border-left: none; border-bottom: none; }
        .corner-br { transform: translate(60%, 60%); border-left: none; border-top: none; }
        .corner-bl { transform: translate(-160%, 60%); border-right: none; border-top: none; }
      `}</style>
      <div ref={dotRef} className="target-cursor-dot" />
      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>
  );
}

// ==== UI helpers ====
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="max-w-4xl w-full mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      <div className="prose prose-invert max-w-none">{children}</div>
    </section>
  );
}

// ==== Phone Mockup Screens ====
function HomeScreen({ onNav }: { onNav: (s: ScreenName) => void }) {
  return (
    <div data-testid="screen-home" className="flex flex-col items-center w-full h-full">
      <div className="w-24 h-24 bg-blue-400/90 rounded-full flex items-center justify-center text-4xl mb-3">🙂</div>
      <p className="mb-2">Zostatok: <span className="font-bold">20 €</span></p>
      <div className="flex justify-around w-full my-4 gap-2">
        <button data-testid="nav-shop" onClick={() => onNav('shop')} className="cursor-target bg-indigo-600/90 px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-500">Shop</button>
        <button data-testid="nav-save" onClick={() => onNav('save')} className="cursor-target bg-green-600/90 px-3 py-1.5 rounded-lg text-sm hover:bg-green-500">Save</button>
        <button data-testid="nav-invest" onClick={() => onNav('invest')} className="cursor-target bg-yellow-500/90 px-3 py-1.5 rounded-lg text-sm text-black hover:bg-yellow-400">Invest</button>
      </div>
      <div className="mt-1 p-3 bg-gray-700/80 rounded-xl w-full text-center">🎯 Quest: Ušetri 5 € tento týždeň</div>
      <div className="mt-5 w-full">
        <h3 className="text-lg font-semibold mb-2">🏆 Úspechy</h3>
        <ul className="space-y-1 text-sm">
          <li>✔ Prvé šetrenie</li>
          <li>✔ Investícia do fondu</li>
          <li>⬜ Ušetri 50 €</li>
        </ul>
      </div>
    </div>
  );
}

function ShopScreen({ onBack }: { onBack: () => void }) {
  return (
    <div data-testid="screen-shop" className="flex flex-col items-center w-full h-full">
      <h3 className="text-xl font-bold mb-4">🛒 Shop</h3>
      <p className="mb-4 text-sm opacity-80">Nakúp virtuálne predmety pre svojho avatara.</p>
      <ul className="space-y-2 w-full text-center text-sm">
        <li className="bg-gray-700/60 rounded-lg py-2">🎩 Nový klobúk – 5 €</li>
        <li className="bg-gray-700/60 rounded-lg py-2">👕 Tričko – 10 €</li>
        <li className="bg-gray-700/60 rounded-lg py-2">🐾 Domáce zvieratko – 15 €</li>
      </ul>
      <button data-testid="back-btn" onClick={onBack} className="mt-auto bg-white text-black rounded-xl w-full py-2 mt-6 hover:bg-gray-100">Späť</button>
    </div>
  );
}

function SaveScreen({ onBack }: { onBack: () => void }) {
  return (
    <div data-testid="screen-save" className="flex flex-col items-center w-full h-full">
      <h3 className="text-xl font-bold mb-4">💰 Save</h3>
      <p className="mb-4 text-sm opacity-80">Ulož si peniaze a sleduj svoj progres.</p>
      <div className="bg-green-600/50 w-full rounded-lg p-4 text-center">Ušetrené: 12 € / 50 €</div>
      <button data-testid="back-btn" onClick={onBack} className="mt-auto bg-white text-black rounded-xl w-full py-2 mt-6 hover:bg-gray-100">Späť</button>
    </div>
  );
}

function InvestScreen({ onBack }: { onBack: () => void }) {
  return (
    <div data-testid="screen-invest" className="flex flex-col items-center w-full h-full">
      <h3 className="text-xl font-bold mb-4">📈 Invest</h3>
      <p className="mb-4 text-sm opacity-80">Zvoľ si investičný fond alebo ETF.</p>
      <ul className="space-y-2 w-full text-center text-sm">
        <li className="bg-gray-700/60 rounded-lg py-2">ETF Tech – min. 5 €</li>
        <li className="bg-gray-700/60 rounded-lg py-2">Zelená energia – min. 10 €</li>
        <li className="bg-gray-700/60 rounded-lg py-2">Krypto fond – min. 15 €</li>
      </ul>
      <button data-testid="back-btn" onClick={onBack} className="mt-auto bg-white text-black rounded-xl w-full py-2 mt-6 hover:bg-gray-100">Späť</button>
    </div>
  );
}

type ScreenName = 'home' | 'shop' | 'save' | 'invest';

function PhoneMockup({ screen, setScreen }: { screen: ScreenName; setScreen: (s: ScreenName) => void }) {
  return (
    <div data-testid="phone" className="relative w-72 h-[520px] bg-gray-800/70 backdrop-blur rounded-3xl shadow-2xl p-4 flex flex-col items-center border border-white/10">
      <div className="w-24 h-1 bg-white/20 rounded-full mb-3" />
      {screen === 'home' && <HomeScreen onNav={setScreen} />}
      {screen === 'shop' && <ShopScreen onBack={() => setScreen('home')} />}
      {screen === 'save' && <SaveScreen onBack={() => setScreen('home')} />}
      {screen === 'invest' && <InvestScreen onBack={() => setScreen('home')} />}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('home');

  // Lightweight runtime checks ("tests")
  useEffect(() => {
    // Test 1: Phone renders
    console.assert(!!document.querySelector('[data-testid="phone"]'), 'Phone mockup should render');
    // Test 2: Home screen present by default
    console.assert(!!document.querySelector('[data-testid="screen-home"]'), 'Home screen should be visible on mount');

    // Test 3: Navigation works (programmatically click and revert)
    const investBtn = document.querySelector('[data-testid="nav-invest"]') as HTMLButtonElement | null;
    investBtn?.click();
    const sawInvest = !!document.querySelector('[data-testid="screen-invest"]');
    console.assert(sawInvest, 'Invest screen should be shown after clicking nav-invest');
    // Go back
    const backBtn = document.querySelector('[data-testid="back-btn"]') as HTMLButtonElement | null;
    backBtn?.click();
    console.assert(!!document.querySelector('[data-testid="screen-home"]'), 'Home screen should be visible after going back');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex flex-col items-center py-10">
      {/* Custom cursor */}
      <TargetCursor spinDuration={2} hideDefaultCursor={true} />

      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">TeenFin</h1>
        <p className="opacity-80">Investičná aplikácia pre vzdelávanie mladých ľudí (gamifikovaná) • Autor: Marek Janošec</p>
      </header>

      {/* Presentation sections */}
      <Section title="1. Problém">
        <p>Mladí ľudia sa v dnešnej dobe príliš prikláňajú ku konzumu a nepremýšľajú nad tým, čo bude v budúcnosti. Naša spoločnosť, najmä na Slovensku, by mala viesť mládež k finančnému vzdelávaniu už od útleho veku, aby sa naučili správne hospodáriť s peniazmi.</p>
      </Section>

      <Section title="2. Riešenie">
        <p>Spojenie starostlivosti o <strong>virtuálneho maznáčika</strong> so vzdelávaním vo finančnej gramotnosti. Vreckové od rodiča mladý používateľ používa na nakupovanie, šetrenie, investovanie a vzdelávanie – jeho rozhodnutia ovplyvňujú vzhľad a správanie avatara.</p>
      </Section>

      <Section title="3. Funkcie aplikácie">
        <ul>
          <li>💡 Tipy na investovanie s malým množstvom vreckového</li>
          <li>🔒 Reálne investičné možnosti (s potvrdením rodiča/zákonného zástupcu)</li>
          <li>🏆 Achievementy a questy ako motivačné prvky</li>
          <li>🎨 Kustomizácia a rozvoj virtuálneho avatara</li>
        </ul>
      </Section>

      <Section title="4. Prínos pre banku">
        <ul>
          <li>Inovatívna funkcionalita pre deti a mládež – rozšírenie služieb pre existujúcich klientov</li>
          <li>Výchova potenciálnych nových klientov so znalosťou investovania a hospodárenia</li>
          <li>Posilnenie značky banky ako lídra vo finančnom vzdelávaní</li>
        </ul>
      </Section>

      <Section title="5. Monetizácia">
        <p>Monetizácia založená na <strong>partnerstve so sponzorskou bankou</strong>, ktorá získa prístup k novej generácii klientov a odlíši sa ako moderný hráč podporujúci finančné vzdelávanie.</p>
      </Section>

      <Section title="6. Interaktívne mockupy">
        <div className="flex flex-col items-center gap-6">
          <PhoneMockup screen={screen} setScreen={setScreen} />
          <div className="text-sm opacity-80 text-center">Tip: Použi tlačidlá Shop / Save / Invest alebo interakciu v rámci mockupu. Cursor efekt reaguje na objekty na stránke.</div>
        </div>
      </Section>

      <Section title="7. Záver">
        <p>TeenFin spája <strong>hru, finančné vzdelávanie a bankové inovácie</strong> do jedného celku. Projekt má potenciál priniesť pozitívnu zmenu pre mladých ľudí, rodičov aj banky. Hľadáme partnerov, ktorí chcú podporiť budúcnosť finančného vzdelávania mladej generácie.</p>
      </Section>
    </div>
  );
}
