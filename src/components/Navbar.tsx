import React from 'react';
import { Crosshair, Trophy, Globe, Play, Volume2, VolumeX, Star, Zap, ShieldCheck, Lock } from 'lucide-react';
import { PlayerStats } from '../types/game';

interface NavbarProps {
  activeTab: 'arena' | 'levels' | 'leaderboard' | 'gallery';
  onSelectTab: (tab: 'arena' | 'levels' | 'leaderboard' | 'gallery') => void;
  stats: PlayerStats;
  soundEnabled: boolean;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
  onToggleSound: () => void;
  onOpenCertificate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  stats,
  soundEnabled,
  isAdminLoggedIn,
  onOpenAdmin,
  onToggleSound,
  onOpenCertificate,
}) => {
  const totalStars = Object.values(stats.levelProgress).reduce((acc, p) => acc + p.stars, 0);

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div 
          onClick={() => onSelectTab('arena')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display font-black text-lg text-white tracking-wider flex items-center gap-1">
              <span>NEURO</span>
              <span className="text-cyan-400">REFLEX</span>
            </div>
            <div className="text-[10px] text-slate-400 -mt-1 font-mono-code">
              ARENA DE REAÇÃO RÁPIDA
            </div>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => onSelectTab('arena')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'arena'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Jogar</span>
          </button>

          <button
            onClick={() => onSelectTab('levels')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'levels'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Fases</span>
          </button>

          <button
            onClick={() => onSelectTab('leaderboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'leaderboard'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Ranking</span>
          </button>

          <button
            onClick={() => onSelectTab('gallery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'gallery'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Prêmios</span>
          </button>
        </nav>

        {/* Right Status / Controls */}
        <div className="flex items-center gap-3">
          {/* Stars Count */}
          <div 
            onClick={onOpenCertificate}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs cursor-pointer hover:border-amber-400/50 transition"
            title="Ver Certificado de Piloto"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-mono-code font-bold text-amber-300">{totalStars}★</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
            title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Áudio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Admin Mode Lock Button */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isAdminLoggedIn
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
            }`}
            title={isAdminLoggedIn ? 'Modo Administrador Ativo (Clique para abrir painel)' : 'Modo Administrador (Requer Senha)'}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isAdminLoggedIn ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="font-mono-code font-bold text-[11px] hidden sm:inline">
              {isAdminLoggedIn ? 'ADMIN' : 'ADMIN'}
            </span>
          </button>

          {/* Player Badge */}
          <div 
            onClick={onOpenCertificate}
            className="flex items-center gap-2 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:border-cyan-400/50 transition"
            title="Clique para ver o Certificado do Jogador"
          >
            <span className="text-base">{stats.country}</span>
            <span className="text-xs font-semibold text-white max-w-[90px] truncate hidden sm:inline">
              {stats.playerName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
