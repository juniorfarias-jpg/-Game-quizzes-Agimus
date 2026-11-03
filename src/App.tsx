import React, { useState, useEffect, useCallback } from 'react';
import { 
  LevelConfig, 
  PlayerStats, 
  HitRecord, 
  LeaderboardEntry, 
  CrosshairType, 
  FigureTheme, 
  PrizeReward,
  CustomTargetImageConfig,
  DevControlOverrides,
  AppAdminSettings
} from './types/game';
import { LEVELS, calculateTier, calculateStars, getMergedLevels } from './utils/levels';
import { sound } from './utils/sound';
import { 
  loadPlayerStats, 
  savePlayerStats, 
  updateEquippedCrosshair, 
  updateEquippedTheme,
  DEFAULT_PLAYER_STATS
} from './utils/playerStorage';
import { 
  getStoredLeaderboard, 
  saveLeaderboardEntry, 
  deleteLeaderboardEntry, 
  clearAllLeaderboard, 
  restoreDefaultLeaderboard 
} from './utils/leaderboard';
import { 
  loadAdminSettings, 
  saveAdminSettings 
} from './utils/adminStorage';
import { Navbar } from './components/Navbar';
import { Arena } from './components/Arena';
import { LevelSelect } from './components/LevelSelect';
import { LeaderboardView } from './components/LeaderboardView';
import { PrizeGallery } from './components/PrizeGallery';
import { StageResultModal } from './components/StageResultModal';
import { ReflexCertificateModal } from './components/ReflexCertificateModal';
import { HiddenControlPanel } from './components/HiddenControlPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { Sliders, ShieldCheck, Lock } from 'lucide-react';

const CUSTOM_IMAGE_STORAGE_KEY = 'neuroreflex_custom_image_v1';

const DEFAULT_CUSTOM_IMAGE: CustomTargetImageConfig = {
  enabled: false,
  imageUrl: '',
  shapeFit: 'cover',
  customBorderColor: '#22d3ee',
};

const DEFAULT_DEV_OVERRIDES: DevControlOverrides = {
  customImage: DEFAULT_CUSTOM_IMAGE,
  targetDurationOverrideMs: null,
  targetSizeOverridePx: null,
  trapChanceOverride: null,
  movingTargetsOverride: null,
  slowMotionFactor: 1,
  showHitboxes: false,
  unlimitedTime: false,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'arena' | 'levels' | 'leaderboard' | 'gallery'>('arena');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [playerStats, setPlayerStats] = useState<PlayerStats>(loadPlayerStats);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(getStoredLeaderboard);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [arenaKey, setArenaKey] = useState<number>(1);

  // Admin and Master Settings
  const [adminSettings, setAdminSettings] = useState<AppAdminSettings>(loadAdminSettings);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [showAdminDashboardModal, setShowAdminDashboardModal] = useState<boolean>(false);

  // Hidden Control Panel & Custom Image states
  const [isControlPanelOpen, setIsControlPanelOpen] = useState<boolean>(false);
  const [customImage, setCustomImage] = useState<CustomTargetImageConfig>(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_IMAGE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CUSTOM_IMAGE;
    } catch {
      return DEFAULT_CUSTOM_IMAGE;
    }
  });
  const [devOverrides, setDevOverrides] = useState<DevControlOverrides>(DEFAULT_DEV_OVERRIDES);

  // Modals
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [lastStageStats, setLastStageStats] = useState<{
    levelId: number;
    score: number;
    averageMs: number;
    bestMs: number;
    accuracy: number;
    hits: number;
    misses: number;
    trapsHit: number;
    records: HitRecord[];
  } | null>(null);

  // Global Keyboard Listener for ALT + C Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Alt + C (or option + C on Mac)
      if (e.altKey && (e.key === 'c' || e.key === 'C' || e.code === 'KeyC')) {
        e.preventDefault();
        if (isAdminLoggedIn) {
          setShowAdminDashboardModal((prev) => !prev);
        } else {
          setShowAdminLoginModal(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoggedIn]);

  // Handle Admin Open
  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setShowAdminDashboardModal(true);
    } else {
      setShowAdminLoginModal(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowAdminLoginModal(false);
    setShowAdminDashboardModal(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setShowAdminDashboardModal(false);
  };

  const handleSaveAdminSettings = (newSettings: AppAdminSettings) => {
    setAdminSettings(newSettings);
    saveAdminSettings(newSettings);
    setArenaKey((k) => k + 1); // reload arena with customized levels
  };

  // Leaderboard Admin Operations
  const handleDeleteLeaderboardEntry = (id: string) => {
    const updated = deleteLeaderboardEntry(id);
    setLeaderboard(updated);
  };

  const handleClearLeaderboard = () => {
    const updated = clearAllLeaderboard();
    setLeaderboard(updated);
  };

  const handleRestoreLeaderboard = () => {
    const updated = restoreDefaultLeaderboard();
    setLeaderboard(updated);
  };

  // Persist custom image updates
  const handleUpdateCustomImage = (newConfig: CustomTargetImageConfig) => {
    setCustomImage(newConfig);
    try {
      localStorage.setItem(CUSTOM_IMAGE_STORAGE_KEY, JSON.stringify(newConfig));
    } catch {}
  };

  const handleUpdateDevOverrides = (overrides: Partial<DevControlOverrides>) => {
    setDevOverrides((prev) => ({ ...prev, ...overrides }));
  };

  // Sync sound setting
  const handleToggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // Restart current stage
  const handleRestartArena = () => {
    setShowResultModal(false);
    setArenaKey((k) => k + 1);
  };

  // Select level from Levels tab
  const handleSelectLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
    setActiveTab('arena');
    setShowResultModal(false);
    setArenaKey((k) => k + 1);
  };

  // Merge configured levels with base levels
  const effectiveLevels = getMergedLevels(adminSettings.customLevelConfigs);
  const currentLevel = effectiveLevels.find((l) => l.id === currentLevelId) || effectiveLevels[0];

  // Determine effective target image (Admin mandatory image takes precedence if enabled)
  const effectiveCustomImage: CustomTargetImageConfig = 
    adminSettings.customImageMandatory && adminSettings.customTargetImage.enabled && adminSettings.customTargetImage.imageUrl
      ? adminSettings.customTargetImage
      : customImage;

  // Handle stage completion
  const handleStageComplete = useCallback((stats: {
    levelId: number;
    score: number;
    averageMs: number;
    bestMs: number;
    accuracy: number;
    hits: number;
    misses: number;
    trapsHit: number;
    records: HitRecord[];
  }) => {
    setLastStageStats(stats);
    setShowResultModal(true);

    const level = LEVELS.find((l) => l.id === stats.levelId) || LEVELS[0];
    const tier = calculateTier(stats.averageMs, stats.accuracy);
    const stars = calculateStars(tier);

    // Update persistent player progress
    setPlayerStats((prev) => {
      const prevProg = prev.levelProgress[stats.levelId];
      const newStars = Math.max(prevProg?.stars || 0, stars);
      const newBestReaction = prevProg?.bestReactionMs
        ? Math.min(prevProg.bestReactionMs, stats.bestMs)
        : stats.bestMs;
      const newBestScore = Math.max(prevProg?.bestScore || 0, stats.score);

      const updatedProgress = {
        ...prev.levelProgress,
        [stats.levelId]: {
          levelId: stats.levelId,
          completed: true,
          stars: newStars,
          bestReactionMs: newBestReaction,
          averageReactionMs: stats.averageMs,
          bestScore: newBestScore,
          accuracy: stats.accuracy,
          tier,
          completedAt: new Date().toISOString().split('T')[0],
        },
      };

      // Check unlocks for prizes
      const unlockedCrosshairs = [...prev.unlockedCrosshairs];
      const unlockedThemes = [...prev.unlockedThemes];
      const unlockedTrophies = [...prev.unlockedTrophies];

      // S+ prize
      if (tier === 'S+' && level.prizes.sPlus) {
        if (level.prizes.sPlus.type === 'crosshair' && level.prizes.sPlus.value) {
          const val = level.prizes.sPlus.value as CrosshairType;
          if (!unlockedCrosshairs.includes(val)) unlockedCrosshairs.push(val);
        }
        if (level.prizes.sPlus.type === 'trophy' && !unlockedTrophies.includes(level.prizes.sPlus.id)) {
          unlockedTrophies.push(level.prizes.sPlus.id);
        }
      }

      // Gold prize (S or A)
      if ((tier === 'S+' || tier === 'S' || tier === 'A') && level.prizes.gold) {
        if (level.prizes.gold.type === 'theme' && level.prizes.gold.value) {
          const val = level.prizes.gold.value as FigureTheme;
          if (!unlockedThemes.includes(val)) unlockedThemes.push(val);
        }
        if (level.prizes.gold.type === 'trophy' && !unlockedTrophies.includes(level.prizes.gold.id)) {
          unlockedTrophies.push(level.prizes.gold.id);
        }
      }

      const updatedStats: PlayerStats = {
        ...prev,
        totalGamesPlayed: prev.totalGamesPlayed + 1,
        totalHits: prev.totalHits + stats.hits,
        totalMisses: prev.totalMisses + stats.misses,
        bestReactionEverMs: prev.bestReactionEverMs
          ? Math.min(prev.bestReactionEverMs, stats.bestMs)
          : stats.bestMs,
        levelProgress: updatedProgress,
        unlockedCrosshairs,
        unlockedThemes,
        unlockedTrophies,
      };

      savePlayerStats(updatedStats);
      return updatedStats;
    });
  }, []);

  // Submit score to Leaderboard
  const handleSubmitScore = (playerName: string, country: string) => {
    if (!lastStageStats) return;

    // Update player profile
    setPlayerStats((prev) => {
      const updated = { ...prev, playerName, country };
      savePlayerStats(updated);
      return updated;
    });

    const tier = calculateTier(lastStageStats.averageMs, lastStageStats.accuracy);

    const updatedLeaderboard = saveLeaderboardEntry({
      playerName,
      country,
      avatar: playerStats.avatar,
      score: lastStageStats.score,
      averageReactionMs: lastStageStats.averageMs,
      bestReactionMs: lastStageStats.bestMs,
      accuracy: lastStageStats.accuracy,
      levelId: lastStageStats.levelId,
      tier,
      date: new Date().toISOString().split('T')[0],
    });

    setLeaderboard(updatedLeaderboard);
  };

  // Equip crosshair
  const handleEquipCrosshair = (crosshair: CrosshairType) => {
    const updated = updateEquippedCrosshair(crosshair);
    setPlayerStats({ ...updated });
  };

  // Equip theme
  const handleEquipTheme = (theme: FigureTheme) => {
    const updated = updateEquippedTheme(theme);
    setPlayerStats({ ...updated });
  };

  // Next level handler
  const handleNextLevel = () => {
    setShowResultModal(false);
    if (currentLevelId < effectiveLevels.length) {
      setCurrentLevelId((id) => id + 1);
    }
    setArenaKey((k) => k + 1);
  };

  // Cheat: Unlock All
  const handleUnlockAll = () => {
    const allProgress = { ...playerStats.levelProgress };
    effectiveLevels.forEach((l) => {
      allProgress[l.id] = {
        levelId: l.id,
        completed: true,
        stars: 3,
        bestReactionMs: 185,
        averageReactionMs: 210,
        bestScore: 35000,
        accuracy: 98,
        tier: 'S+',
        completedAt: new Date().toISOString().split('T')[0],
      };
    });

    const allCrosshairs: CrosshairType[] = [
      'reticle',
      'cyan_ring',
      'ninja_shuriken',
      'quantum_vortex',
      'golden_cross',
      'cyber_eye',
    ];
    const allThemes: FigureTheme[] = ['neon', 'crystals', 'arcade', 'plasma'];

    const updatedStats: PlayerStats = {
      ...playerStats,
      levelProgress: allProgress,
      unlockedCrosshairs: allCrosshairs,
      unlockedThemes: allThemes,
      bestReactionEverMs: 185,
    };

    savePlayerStats(updatedStats);
    setPlayerStats(updatedStats);
  };

  // Cheat: Reset Progress
  const handleResetProgress = () => {
    savePlayerStats(DEFAULT_PLAYER_STATS);
    setPlayerStats(DEFAULT_PLAYER_STATS);
    localStorage.removeItem(CUSTOM_IMAGE_STORAGE_KEY);
    setCustomImage(DEFAULT_CUSTOM_IMAGE);
    setDevOverrides(DEFAULT_DEV_OVERRIDES);
    setArenaKey((k) => k + 1);
  };

  // Check if App is Locked behind Kiosk Mode
  const isAppLocked = adminSettings.lockEntireAppWithPassword && !isAdminLoggedIn;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        stats={playerStats}
        soundEnabled={soundEnabled}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={handleOpenAdmin}
        onToggleSound={handleToggleSound}
        onOpenCertificate={() => setShowCertificateModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'arena' && (
          <div>
            <Arena
              key={`${currentLevelId}-${arenaKey}`}
              level={currentLevel}
              theme={playerStats.equippedTheme}
              crosshair={playerStats.equippedCrosshair}
              customImage={effectiveCustomImage}
              devOverrides={devOverrides}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onRestart={handleRestartArena}
              onOpenControlPanel={handleOpenAdmin}
              onComplete={handleStageComplete}
            />

            {/* Quick Level Switcher Below Arena */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Fase Atual:
                </span>
                <span className="text-xs font-bold text-white font-display">
                  {currentLevel.name}
                </span>
                {adminSettings.customLevelConfigs[currentLevel.id] && (
                  <span className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800 text-[10px] font-mono-code font-bold text-cyan-300">
                    MODIFICADA PELO ADMIN
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {effectiveLevels.map((lvl) => {
                  const isUnlocked =
                    lvl.id === 1 ||
                    (lvl.unlockRequirements &&
                      playerStats.levelProgress[lvl.unlockRequirements.prevLevelId]?.stars >=
                        lvl.unlockRequirements.minStars);

                  return (
                    <button
                      key={lvl.id}
                      onClick={() => isUnlocked && handleSelectLevel(lvl.id)}
                      disabled={!isUnlocked}
                      className={`w-7 h-7 rounded-lg text-xs font-bold font-display transition ${
                        lvl.id === currentLevelId
                          ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_#22d3ee]'
                          : isUnlocked
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-slate-950 text-slate-700 cursor-not-allowed border border-slate-900'
                      }`}
                    >
                      {lvl.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Admin & Secret Shortcut Callout */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono-code px-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Painel Administrador:</span>
                <span>Pressione</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-cyan-400 font-bold">ALT</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-cyan-400 font-bold">C</kbd>
                <span>para abrir com senha.</span>
              </span>

              <button
                onClick={handleOpenAdmin}
                className="text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                <span>{isAdminLoggedIn ? 'Configurar Modo Admin' : 'Entrar com Senha'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'levels' && (
          <LevelSelect
            levels={effectiveLevels}
            progress={playerStats.levelProgress}
            currentLevelId={currentLevelId}
            onSelectLevel={handleSelectLevel}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            entries={leaderboard}
            onPlayLevel={handleSelectLevel}
          />
        )}

        {activeTab === 'gallery' && (
          <PrizeGallery
            stats={playerStats}
            onEquipCrosshair={handleEquipCrosshair}
            onEquipTheme={handleEquipTheme}
            onOpenCertificate={() => setShowCertificateModal(true)}
          />
        )}
      </main>

      {/* Stage Victory & Rewards Modal */}
      {showResultModal && lastStageStats && (
        <StageResultModal
          level={currentLevel}
          stats={lastStageStats}
          onPlayAgain={handleRestartArena}
          onNextLevel={currentLevelId < effectiveLevels.length ? handleNextLevel : undefined}
          onGoToLeaderboard={() => {
            setShowResultModal(false);
            setActiveTab('leaderboard');
          }}
          onEquipReward={(prize: PrizeReward) => {
            if (prize.type === 'crosshair' && prize.value) {
              handleEquipCrosshair(prize.value as CrosshairType);
            } else if (prize.type === 'theme' && prize.value) {
              handleEquipTheme(prize.value as FigureTheme);
            }
          }}
          onSubmitScore={handleSubmitScore}
          defaultPlayerName={playerStats.playerName}
          defaultCountry={playerStats.country}
        />
      )}

      {/* Pilot Reflex Certificate Modal */}
      {showCertificateModal && (
        <ReflexCertificateModal
          stats={playerStats}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {/* Quick Hidden Control Panel */}
      <HiddenControlPanel
        isOpen={isControlPanelOpen}
        onClose={() => setIsControlPanelOpen(false)}
        customImage={customImage}
        onUpdateCustomImage={handleUpdateCustomImage}
        devOverrides={devOverrides}
        onUpdateDevOverrides={handleUpdateDevOverrides}
        onUnlockAll={handleUnlockAll}
        onResetProgress={handleResetProgress}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Admin Login Modal (Triggered via ALT+C or Admin Button) */}
      <AdminLoginModal
        isOpen={showAdminLoginModal || isAppLocked}
        onClose={() => setShowAdminLoginModal(false)}
        onSuccess={handleAdminLoginSuccess}
        isKioskLock={isAppLocked}
        title={isAppLocked ? 'Aplicativo Bloqueado pelo Administrador' : 'Acesso ao Modo Administrador'}
        subtitle={
          isAppLocked
            ? 'Este jogo foi configurado no modo restrito/kiosk. Insira a senha mestra para desbloquear.'
            : 'Insira a senha mestra para abrir o Painel de Controle e gerenciar todas as configurações do aplicativo.'
        }
      />

      {/* Full Administrator Dashboard Modal */}
      <AdminDashboardModal
        isOpen={showAdminDashboardModal}
        onClose={() => setShowAdminDashboardModal(false)}
        onLogout={handleAdminLogout}
        adminSettings={adminSettings}
        onSaveAdminSettings={handleSaveAdminSettings}
        leaderboardEntries={leaderboard}
        onDeleteLeaderboardEntry={handleDeleteLeaderboardEntry}
        onClearLeaderboard={handleClearLeaderboard}
        onRestoreLeaderboard={handleRestoreLeaderboard}
      />
    </div>
  );
}
