import React, { useEffect, useRef, useState } from 'react';

interface CatConfig {
  id: string;
  bodyColor: string;
  stripeColor: string;
  bellyColor: string;
  earInnerColor: string;
  collarColor: string;
  yPercent: number;
  xMin: number;
  xMax: number;
  initialX: number;
  initialDir: 1 | -1;
  speedPctPerSec: number;
  scale: number;
  strideOffset: number;
}

const CAT_CONFIGS: CatConfig[] = [
  {
    id: 'cat-tabby',
    bodyColor: '#d97706',
    stripeColor: '#92400e',
    bellyColor: '#fef3c7',
    earInnerColor: '#fda4af',
    collarColor: '#06b6d4',
    yPercent: 68,
    xMin: 14,
    xMax: 84,
    initialX: 26,
    initialDir: 1,
    speedPctPerSec: 4.8,
    scale: 0.78,
    strideOffset: 0,
  },
  {
    id: 'cat-tuxedo',
    bodyColor: '#1e293b',
    stripeColor: '#0f172a',
    bellyColor: '#f8fafc',
    earInnerColor: '#fda4af',
    collarColor: '#ef4444',
    yPercent: 79,
    xMin: 8,
    xMax: 91,
    initialX: 74,
    initialDir: -1,
    speedPctPerSec: 5.8,
    scale: 0.94,
    strideOffset: 2.1,
  },
  {
    id: 'cat-grey',
    bodyColor: '#94a3b8',
    stripeColor: '#475569',
    bellyColor: '#f1f5f9',
    earInnerColor: '#fecdd3',
    collarColor: '#a855f7',
    yPercent: 89,
    xMin: 16,
    xMax: 86,
    initialX: 48,
    initialDir: 1,
    speedPctPerSec: 6.4,
    scale: 1.06,
    strideOffset: 4.2,
  },
];

interface CatRuntimeState {
  x: number;
  dir: 1 | -1;
  phase: number;
  pauseUntil: number;
}

interface WalkingCatsProps {
  active?: boolean;
}

export const WalkingCats: React.FC<WalkingCatsProps> = ({ active = true }) => {
  const [catStates, setCatStates] = useState<CatRuntimeState[]>(() =>
    CAT_CONFIGS.map((c) => ({
      x: c.initialX,
      dir: c.initialDir,
      phase: c.strideOffset,
      pauseUntil: 0,
    }))
  );

  const statesRef = useRef<CatRuntimeState[]>(catStates);

  useEffect(() => {
    if (!active) return;

    let animId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const next = statesRef.current.map((st, idx) => {
        const cfg = CAT_CONFIGS[idx];
        if (now < st.pauseUntil) {
          // Gently sway tail while resting briefly
          return {
            ...st,
            phase: st.phase + dt * 2.2,
          };
        }

        let nx = st.x + st.dir * cfg.speedPctPerSec * dt;
        let ndir = st.dir;
        let npause = st.pauseUntil;

        if (nx >= cfg.xMax) {
          nx = cfg.xMax;
          ndir = -1;
          npause = now + 700 + Math.random() * 900;
        } else if (nx <= cfg.xMin) {
          nx = cfg.xMin;
          ndir = 1;
          npause = now + 700 + Math.random() * 900;
        }

        return {
          x: nx,
          dir: ndir,
          phase: st.phase + dt * 7.5,
          pauseUntil: npause,
        };
      });

      statesRef.current = next;
      setCatStates(next);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [active]);

  const now = performance.now();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">
      {CAT_CONFIGS.map((cfg, idx) => {
        const st = catStates[idx];
        const isPaused = now < st.pauseUntil;
        const legSwingA = isPaused ? 0 : Math.sin(st.phase) * 20;
        const legSwingB = isPaused ? 0 : Math.sin(st.phase + Math.PI) * 20;
        const bodyBob = isPaused ? 0 : Math.abs(Math.sin(st.phase)) * 2.2;
        const tailSway = Math.sin(st.phase * 0.65) * 14;

        return (
          <div
            key={cfg.id}
            className="absolute"
            style={{
              left: `${st.x}%`,
              top: `${cfg.yPercent}%`,
              width: `${Math.round(92 * cfg.scale)}px`,
              height: `${Math.round(66 * cfg.scale)}px`,
              transform: `translate(-50%, -85%) scaleX(${st.dir})`,
              willChange: 'transform, left',
            }}
          >
            {/* Floor contact shadow */}
            <div
              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-[72%] h-2.5 rounded-full bg-slate-950/45 blur-[2px]"
            />

            <svg
              viewBox="0 0 110 78"
              className="w-full h-full drop-shadow-[0_3px_6px_rgba(0,0,0,0.45)]"
              style={{ transform: `translateY(${-bodyBob}px)` }}
            >
              {/* Back-side legs (darker shade for depth) */}
              <g style={{ transformOrigin: '34px 48px', transform: `rotate(${legSwingB}deg)` }}>
                <rect x="30" y="45" width="7" height="24" rx="3.5" fill={cfg.stripeColor} />
                <ellipse cx="34" cy="69" rx="4.5" ry="2.6" fill={cfg.bellyColor} />
              </g>
              <g style={{ transformOrigin: '66px 48px', transform: `rotate(${legSwingA}deg)` }}>
                <rect x="62" y="45" width="7" height="24" rx="3.5" fill={cfg.stripeColor} />
                <ellipse cx="66" cy="69" rx="4.5" ry="2.6" fill={cfg.bellyColor} />
              </g>

              {/* Animated Wagging Tail */}
              <g style={{ transformOrigin: '26px 39px', transform: `rotate(${tailSway}deg)` }}>
                <path
                  d="M27 39 C15 36, 9 23, 14 14 C16 10, 21 11, 20 16 C18 22, 22 30, 30 34"
                  stroke={cfg.bodyColor}
                  strokeWidth="7.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="15" cy="14" r="3.6" fill={cfg.bellyColor} />
              </g>

              {/* Main Torso */}
              <ellipse cx="49" cy="41" rx="23" ry="13.5" fill={cfg.bodyColor} stroke="#0f172a" strokeWidth="1.8" />
              {/* Belly patch */}
              <ellipse cx="50" cy="48.5" rx="15" ry="5.5" fill={cfg.bellyColor} fillOpacity="0.88" />
              {/* Subtle tabby stripes */}
              <path
                d="M38 30 Q40 36 39 40 M46 29 Q48 35 47 40 M54 29 Q56 35 55 40"
                stroke={cfg.stripeColor}
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
                opacity="0.7"
              />

              {/* Front-side legs */}
              <g style={{ transformOrigin: '36px 48px', transform: `rotate(${legSwingA}deg)` }}>
                <rect x="33" y="45" width="7.5" height="25" rx="3.5" fill={cfg.bodyColor} stroke="#0f172a" strokeWidth="1.4" />
                <ellipse cx="37" cy="70" rx="4.6" ry="2.6" fill={cfg.bellyColor} />
              </g>
              <g style={{ transformOrigin: '64px 48px', transform: `rotate(${legSwingB}deg)` }}>
                <rect x="61" y="45" width="7.5" height="25" rx="3.5" fill={cfg.bodyColor} stroke="#0f172a" strokeWidth="1.4" />
                <ellipse cx="65" cy="70" rx="4.6" ry="2.6" fill={cfg.bellyColor} />
              </g>

              {/* Collar */}
              <path
                d="M66 33 Q73 39 69 47"
                stroke={cfg.collarColor}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="72" cy="45" r="2.6" fill="#fbbf24" stroke="#0f172a" strokeWidth="0.8" />

              {/* Head & Ears */}
              <g transform="translate(74, 24)">
                {/* Back ear */}
                <polygon points="-2,-6 4,-17 10,-6" fill={cfg.stripeColor} stroke="#0f172a" strokeWidth="1.4" />
                {/* Main head */}
                <circle cx="7" cy="4" r="12.5" fill={cfg.bodyColor} stroke="#0f172a" strokeWidth="1.8" />
                {/* Front ear */}
                <polygon points="-8,-4 -5,-17 3,-7" fill={cfg.bodyColor} stroke="#0f172a" strokeWidth="1.5" />
                <polygon points="-6,-6 -4.5,-13.5 0.5,-7.5" fill={cfg.earInnerColor} />
                {/* Muzzle / cheeks */}
                <ellipse cx="12" cy="7.5" rx="6.5" ry="4.8" fill={cfg.bellyColor} />
                {/* Eye */}
                <circle cx="11.5" cy="2" r="2.2" fill="#0f172a" />
                <circle cx="12.2" cy="1.2" r="0.8" fill="#ffffff" />
                {/* Pink nose */}
                <polygon points="16.5,5.5 19.2,5.5 17.8,7.4" fill="#fb7185" />
                {/* Whiskers */}
                <g stroke="#e2e8f0" strokeWidth="1" opacity="0.85">
                  <line x1="15" y1="7" x2="23" y2="5" />
                  <line x1="15" y1="8.5" x2="23" y2="9.5" />
                </g>
              </g>
            </svg>
          </div>
        );
      })}
    </div>
  );
};
