import React from 'react';
import { PestKind } from '../types/game';

export interface PestMetadata {
  kind: PestKind;
  label: string;
  pluralLabel: string;
  eliminatedText: string;
  color: string;
  badgeBg: string;
  bonusMultiplier: number;
}

export const PEST_META: Record<PestKind, PestMetadata> = {
  flea: {
    kind: 'flea',
    label: 'Pulga',
    pluralLabel: 'Pulgas',
    eliminatedText: 'Pulga Eliminada!',
    color: '#ef4444',
    badgeBg: 'rgba(127, 29, 29, 0.9)',
    bonusMultiplier: 1.0,
  },
  tick: {
    kind: 'tick',
    label: 'Carraça',
    pluralLabel: 'Carraças',
    eliminatedText: 'Carraça Removida!',
    color: '#a855f7',
    badgeBg: 'rgba(88, 28, 135, 0.9)',
    bonusMultiplier: 1.25,
  },
  flea_egg: {
    kind: 'flea_egg',
    label: 'Ovo de Pulga',
    pluralLabel: 'Ovos de Pulga',
    eliminatedText: 'Ovos Eliminados!',
    color: '#06b6d4',
    badgeBg: 'rgba(22, 78, 99, 0.92)',
    bonusMultiplier: 1.0,
  },
  flea_larva: {
    kind: 'flea_larva',
    label: 'Larva de Pulga',
    pluralLabel: 'Larvas de Pulga',
    eliminatedText: 'Larva Eliminada!',
    color: '#f59e0b',
    badgeBg: 'rgba(120, 53, 15, 0.92)',
    bonusMultiplier: 1.15,
  },
};

interface PestSpriteProps {
  pestKind: PestKind;
  isGolden?: boolean;
  showLabel?: boolean;
}

export const PestSprite: React.FC<PestSpriteProps> = ({
  pestKind,
  isGolden = false,
  showLabel = true,
}) => {
  const meta = PEST_META[pestKind];

  const renderSvg = () => {
    switch (pestKind) {
      case 'flea':
        // Adult jumping flea - laterally compressed dark-mahogany body, long hind jumping legs
        return (
          <svg viewBox="0 0 64 64" className="w-[78%] h-[78%] drop-shadow-[0_3px_6px_rgba(0,0,0,0.85)]">
            {/* Hind springing legs */}
            <path
              d="M37 37 L47 45 L55 54 M44 43 L52 38"
              stroke="#451a03"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M27 37 L22 47 L16 54 M20 35 L12 43 L9 49"
              stroke="#451a03"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Abdomen & Thorax */}
            <ellipse
              cx="34"
              cy="30"
              rx="16"
              ry="10.5"
              transform="rotate(-14 34 30)"
              fill="#9a3412"
              stroke="#2a0a02"
              strokeWidth="2.4"
            />
            {/* Segment stripes */}
            <path
              d="M27 23 C28 28, 29 33, 28 38 M34 21 C35 27, 36 33, 35 38 M41 21 C42 26, 43 31, 41 36"
              stroke="#fdba74"
              strokeOpacity="0.45"
              strokeWidth="1.6"
              fill="none"
            />
            {/* Head */}
            <circle cx="17" cy="27" r="6.5" fill="#7c2d12" stroke="#2a0a02" strokeWidth="2.2" />
            {/* Eye & proboscis */}
            <circle cx="15" cy="25.5" r="1.7" fill="#fef2f2" />
            <circle cx="14.7" cy="25.5" r="0.8" fill="#0f172a" />
            <path d="M12 29 L7 34" stroke="#2a0a02" strokeWidth="2.2" strokeLinecap="round" />
            {/* Gloss highlight */}
            <ellipse cx="35" cy="24.5" rx="7" ry="2.5" transform="rotate(-14 35 24.5)" fill="#fb923c" fillOpacity="0.55" />
          </svg>
        );

      case 'tick':
        // Tick - eight-legged broad oval arachnid with dark dorsal shield (scutum)
        return (
          <svg viewBox="0 0 64 64" className="w-[80%] h-[80%] drop-shadow-[0_3px_6px_rgba(0,0,0,0.85)]">
            {/* 4 pairs of jointed legs */}
            <g stroke="#1e1b18" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M24 22 L14 14 L8 18" />
              <path d="M21 29 L10 26 L5 31" />
              <path d="M21 36 L10 40 L6 47" />
              <path d="M25 43 L16 52 L13 58" />
              <path d="M40 22 L50 14 L56 18" />
              <path d="M43 29 L54 26 L59 31" />
              <path d="M43 36 L54 40 L58 47" />
              <path d="M39 43 L48 52 L51 58" />
            </g>
            {/* Mouthparts (capitulum) */}
            <path d="M29 14 L32 8 L35 14 Z" fill="#292524" stroke="#0c0a09" strokeWidth="1.5" />
            {/* Main bloated tick body */}
            <ellipse cx="32" cy="34" rx="14.5" ry="17.5" fill="#57534e" stroke="#1c1917" strokeWidth="2.5" />
            {/* Dark dorsal scutum shield */}
            <path
              d="M23 21 C27 16, 37 16, 41 21 C41 29, 36 33, 32 33 C28 33, 23 29, 23 21 Z"
              fill="#292524"
              stroke="#0c0a09"
              strokeWidth="1.5"
            />
            {/* Subtle highlight & pattern */}
            <path d="M26 37 L28 45 M32 36 L32 47 M38 37 L36 45" stroke="#a8a29e" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="28" cy="24" rx="3" ry="1.8" fill="#d6d3d1" fillOpacity="0.3" />
          </svg>
        );

      case 'flea_egg':
        // Cluster of pearlescent white-cream flea eggs
        return (
          <svg viewBox="0 0 64 64" className="w-[78%] h-[78%] drop-shadow-[0_3px_6px_rgba(0,0,0,0.85)]">
            {/* Soft dark contrast base under eggs */}
            <ellipse cx="32" cy="34" rx="20" ry="16" fill="#0f172a" fillOpacity="0.35" />
            {/* Egg 1 (back) */}
            <ellipse cx="26" cy="26" rx="7.5" ry="10.5" transform="rotate(-24 26 26)" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <ellipse cx="24" cy="23" rx="2.5" ry="4" transform="rotate(-24 24 23)" fill="#ffffff" />
            {/* Egg 2 (right) */}
            <ellipse cx="40" cy="28" rx="7.5" ry="10.5" transform="rotate(28 40 28)" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
            <ellipse cx="38.5" cy="25" rx="2.2" ry="3.8" transform="rotate(28 38.5 25)" fill="#ffffff" />
            {/* Egg 3 (front bottom) */}
            <ellipse cx="32" cy="39" rx="8" ry="11" transform="rotate(82 32 39)" fill="#ffffff" stroke="#334155" strokeWidth="2.2" />
            <ellipse cx="29" cy="37" rx="3.5" ry="2" transform="rotate(-10 29 37)" fill="#e0f2fe" />
            {/* Egg 4 (tiny accent) */}
            <ellipse cx="22" cy="39" rx="5.5" ry="7.8" transform="rotate(-50 22 39)" fill="#f8fafc" stroke="#475569" strokeWidth="1.8" />
          </svg>
        );

      case 'flea_larva':
        // Segmented pale cream/amber flea larva worm with fine bristles
        return (
          <svg viewBox="0 0 64 64" className="w-[82%] h-[82%] drop-shadow-[0_3px_6px_rgba(0,0,0,0.85)]">
            {/* Bristles along body */}
            <g stroke="#92400e" strokeWidth="1.6" strokeLinecap="round">
              <line x1="15" y1="26" x2="11" y2="21" />
              <line x1="22" y1="22" x2="20" y2="16" />
              <line x1="30" y1="23" x2="31" y2="17" />
              <line x1="39" y1="28" x2="43" y2="22" />
              <line x1="46" y1="35" x2="52" y2="32" />
              <line x1="20" y1="37" x2="17" y2="43" />
              <line x1="29" y1="39" x2="27" y2="45" />
              <line x1="38" y1="43" x2="37" y2="49" />
            </g>
            {/* Wavy segmented body */}
            <path
              d="M13 33 C17 24, 29 23, 35 31 C40 37, 46 41, 52 38"
              stroke="#78350f"
              strokeWidth="12.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M13 33 C17 24, 29 23, 35 31 C40 37, 46 41, 52 38"
              stroke="#fef3c7"
              strokeWidth="8.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Segment rings */}
            <g stroke="#d97706" strokeWidth="1.5" fill="none">
              <path d="M19 25 Q21 29 19 34" />
              <path d="M26 24 Q27 29 25 34" />
              <path d="M33 27 Q33 32 30 36" />
              <path d="M40 33 Q39 38 36 40" />
              <path d="M47 36 Q46 41 44 42" />
            </g>
            {/* Head capsule */}
            <circle cx="12.5" cy="33.5" r="4.2" fill="#b45309" stroke="#451a03" strokeWidth="1.5" />
            <circle cx="11.2" cy="32.5" r="1" fill="#fef3c7" />
          </svg>
        );
    }
  };

  return (
    <div
      className="relative w-full h-full rounded-full flex items-center justify-center transition-transform hover:scale-105"
      style={{
        backgroundColor: isGolden ? 'rgba(251, 191, 36, 0.28)' : 'rgba(15, 23, 42, 0.62)',
        border: `2px solid ${isGolden ? '#fbbf24' : meta.color}`,
        boxShadow: isGolden
          ? '0 0 22px rgba(251, 191, 36, 0.95)'
          : `0 4px 16px rgba(0, 0, 0, 0.55), 0 0 12px ${meta.color}66`,
      }}
    >
      {renderSvg()}

      {isGolden && (
        <span className="absolute -top-3 bg-amber-400 text-amber-950 text-[9px] font-black px-1.5 py-0.5 rounded font-display tracking-tight shadow">
          3X BÔNUS
        </span>
      )}

      {showLabel && !isGolden && (
        <span
          className="absolute -bottom-3.5 px-1.5 py-0.5 rounded text-[9px] font-bold text-white tracking-tight whitespace-nowrap shadow-md border border-white/20"
          style={{ backgroundColor: meta.badgeBg }}
        >
          {meta.label}
        </span>
      )}
    </div>
  );
};
