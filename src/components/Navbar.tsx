import React, { useRef } from 'react';
import { Crosshair, Trophy, Globe, Play, Volume2, VolumeX, Star, Zap, ShieldCheck, UserPlus, Maximize2, Minimize2 } from 'lucide-react';
import { PlayerStats, CompanyLogoConfig, BrandingColorsConfig, AppCustomizationConfig } from '../types/game';

interface NavbarProps {
  activeTab: 'arena' | 'levels' | 'leaderboard' | 'gallery';
  onSelectTab: (tab: 'arena' | 'levels' | 'leaderboard' | 'gallery') => void;
  stats: PlayerStats;
  soundEnabled: boolean;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
  onToggleSound: () => void;
  onOpenCertificate: () => void;
  logo?: CompanyLogoConfig;
  branding?: BrandingColorsConfig;
  uiCustomization?: AppCustomizationConfig;
  isFrameless?: boolean;
  onToggleFrameless?: () => void;
  onOpenRegistration?: () => void;
  mobileAdminGestureEnabled?: boolean;
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
  logo,
  branding,
  uiCustomization,
  isFrameless = false,
  onToggleFrameless,
  onOpenRegistration,
  mobileAdminGestureEnabled = true,
}) => {
  const totalStars = Object.values(stats.levelProgress).reduce((acc, p) => acc + p.stars, 0);
  const primaryColor = branding?.primaryColor || '#00d2ff';
  const headerBg = branding?.headerBgColor || '#060a14';
  const headerStyle = branding?.headerStyle || 'glass';
  const isMinimal = Boolean(uiCustomization?.minimalNavbar);

  // Mobile/Touch secret admin gesture (5 rapid taps OR 1.5s long-press on the brand logo)
  const tapTimestampsRef = useRef<number[]>([]);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleLogoPointerDown = () => {
    if (!mobileAdminGestureEnabled) return;
    clearLongPress();
    longPressTimerRef.current = setTimeout(() => {
      try {
        navigator.vibrate?.(35);
      } catch {}
      onOpenAdmin();
    }, 1500);
  };

  const handleLogoClick = () => {
    onSelectTab('arena');
    if (!mobileAdminGestureEnabled) return;

    const now = Date.now();
    const recent = tapTimestampsRef.current.filter((t) => now - t < 2500);
    recent.push(now);
    tapTimestampsRef.current = recent;

    if (recent.length >= 5) {
      tapTimestampsRef.current = [];
      try {
        navigator.vibrate?.(35);
      } catch {}
      onOpenAdmin();
    }
  };

  const headerInlineStyle: React.CSSProperties =
    headerStyle === 'solid'
      ? {
          backgroundColor: headerBg,
          borderBottomColor: `${primaryColor}33`,
        }
      : headerStyle === 'neon_gradient'
      ? {
          backgroundColor: headerBg,
          backgroundImage: `linear-gradient(90deg, ${headerBg} 0%, ${primaryColor}2b 50%, ${headerBg} 100%)`,
          borderBottomColor: `${primaryColor}55`,
        }
      : {
          backgroundColor: `${headerBg}d9`,
          backdropFilter: 'blur(12px)',
          borderBottomColor: 'rgba(30, 41, 59, 0.8)',
        };

  return (
    <header
      className="w-full border-b sticky top-0 z-40 transition-colors duration-300 pt-[env(safe-area-inset-top)]"
      style={headerInlineStyle}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand / Logo (5 taps or 1.5s hold opens Admin on mobile touch devices) */}
        <div 
          onClick={handleLogoClick}
          onPointerDown={handleLogoPointerDown}
          onPointerUp={clearLongPress}
          onPointerCancel={clearLongPress}
          onPointerLeave={clearLongPress}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0 select-none"
        >
          {logo?.enabled && logo?.logoUrl ? (
            <div className="flex items-center gap-2 sm:gap-2.5">
              <img
                src={logo.logoUrl}
                alt={logo.companyName || 'Logo'}
                className="h-8 sm:h-9 max-w-[115px] sm:max-w-[180px] object-contain rounded-lg p-0.5 group-hover:scale-105 transition-transform"
              />
              {!isMinimal && (
                <div className="hidden sm:block">
                  <div className="font-display font-black text-sm text-white tracking-wider flex items-center gap-1.5">
                    <span>{logo.companyName || 'AGIMUS'}</span>
                    <span 
                      className="text-[9px] px-1.5 py-0.2 rounded font-mono-code font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${primaryColor}25`, color: primaryColor }}
                    >
                      {logo.subTitle || 'REFLEX'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono-code">
                    QUIOSQUE DE REAÇÃO RÁPIDA
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0"
                style={{
                  backgroundColor: primaryColor,
                  boxShadow: `0 0 15px ${primaryColor}66`,
                }}
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-black text-sm sm:text-lg text-white tracking-wider flex items-center gap-1">
                  <span className="truncate max-w-[110px] sm:max-w-none">
                    {logo?.companyName ? logo.companyName.toUpperCase() : 'AGIMUS'}
                  </span>
                  <span style={{ color: primaryColor }}>REFLEX</span>
                </div>
                <div className="hidden xs:block sm:block text-[9px] sm:text-[10px] text-slate-400 -mt-0.5 sm:-mt-1 font-mono-code truncate max-w-[140px] sm:max-w-none">
                  {logo?.subTitle || 'ARENA DE REAÇÃO RÁPIDA'}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Desktop Primary Navigation Tabs (Only visible when Admin is logged in) */}
        {isAdminLoggedIn && (
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => onSelectTab('arena')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                activeTab === 'arena'
                  ? 'text-slate-950 shadow font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={activeTab === 'arena' ? { backgroundColor: primaryColor } : undefined}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Jogar</span>
            </button>

            <button
              onClick={() => onSelectTab('levels')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                activeTab === 'levels'
                  ? 'text-slate-950 shadow font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={activeTab === 'levels' ? { backgroundColor: primaryColor } : undefined}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Fases</span>
            </button>

            <button
              onClick={() => onSelectTab('leaderboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                activeTab === 'leaderboard'
                  ? 'text-slate-950 shadow font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={activeTab === 'leaderboard' ? { backgroundColor: primaryColor } : undefined}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Ranking</span>
            </button>

            <button
              onClick={() => onSelectTab('gallery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                activeTab === 'gallery'
                  ? 'text-slate-950 shadow font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={activeTab === 'gallery' ? { backgroundColor: primaryColor } : undefined}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Prêmios</span>
            </button>
          </nav>
        )}

        {/* Right Status / Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Quick Registration Button (Only when Admin is logged in) */}
          {isAdminLoggedIn && onOpenRegistration && (
            <button
              onClick={onOpenRegistration}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 transition"
              title="Formulário de Inscrição do Jogador"
            >
              <UserPlus className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>Inscrição</span>
            </button>
          )}

          {/* Stars Count (Hidden in Minimal Mode unless Admin) */}
          {(!isMinimal || isAdminLoggedIn) && (
            <div 
              onClick={onOpenCertificate}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs cursor-pointer hover:border-amber-400/50 transition"
              title="Ver Certificado de Piloto"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-mono-code font-bold text-amber-300">{totalStars}★</span>
            </div>
          )}

          {/* Sound Toggle (Hidden in Minimal Mode unless Admin) */}
          {(!isMinimal || isAdminLoggedIn) && (
            <button
              onClick={onToggleSound}
              className="min-h-[38px] min-w-[38px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
              title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Áudio'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" style={{ color: primaryColor }} />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
          )}

          {/* Frameless / "Sem Barra" Button */}
          {uiCustomization?.showFramelessButton !== false && onToggleFrameless && (
            <button
              onClick={onToggleFrameless}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[38px] sm:min-h-[36px] rounded-lg text-[11px] sm:text-xs font-semibold border transition whitespace-nowrap"
              style={{
                borderColor: `${primaryColor}55`,
                backgroundColor: `${primaryColor}14`,
                color: primaryColor,
              }}
              title="Alternar Modo Sem Barra / Tela Cheia"
            >
              {isFrameless ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
              <span>{isFrameless ? 'Mostrar Barra' : 'Sem Barra'}</span>
            </button>
          )}

          {/* Admin Mode Button (Only visible if Admin is logged in) */}
          {isAdminLoggedIn && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[38px] sm:min-h-[36px] rounded-lg text-xs font-semibold border bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition"
              title="Modo Administrador Ativo (Clique para abrir painel)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono-code font-bold text-[11px] hidden sm:inline">
                ADMIN
              </span>
            </button>
          )}

          {/* Player Badge (Hidden in Minimal Mode unless Admin) */}
          {(!isMinimal || isAdminLoggedIn) && (
            <div 
              onClick={onOpenCertificate}
              className="flex items-center gap-2 px-2 sm:px-2.5 py-1 min-h-[38px] sm:min-h-[36px] bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:border-cyan-400/50 transition"
              title="Clique para ver o Certificado do Jogador"
            >
              <span className="text-base">{stats.country}</span>
              <span className="text-xs font-semibold text-white max-w-[70px] sm:max-w-[110px] truncate hidden sm:inline">
                {stats.playerName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Admin Navigation Strip (prevents header overflow on smartphones) */}
      {isAdminLoggedIn && (
        <nav className="md:hidden border-t border-slate-800/80 px-2 py-1.5 grid grid-cols-4 gap-1 bg-slate-950/60">
          {[
            { id: 'arena' as const, label: 'Jogar', icon: Play },
            { id: 'levels' as const, label: 'Fases', icon: Crosshair },
            { id: 'leaderboard' as const, label: 'Ranking', icon: Globe },
            { id: 'gallery' as const, label: 'Prêmios', icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center justify-center gap-1 py-2 px-1 rounded-lg text-[11px] font-semibold transition whitespace-nowrap ${
                  isActive ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                style={isActive ? { backgroundColor: primaryColor } : undefined}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};

