import { AppAdminSettings, CustomTargetImageConfig } from '../types/game';

const ADMIN_STORAGE_KEY = 'neuroreflex_admin_settings_v1';
const DEFAULT_PASSWORD = 'admin123';

export const DEFAULT_ADMIN_SETTINGS: AppAdminSettings = {
  passwordHash: DEFAULT_PASSWORD,
  lockEntireAppWithPassword: false,
  customImageMandatory: false,
  customTargetImage: {
    enabled: false,
    imageUrl: '',
    shapeFit: 'cover',
    customBorderColor: '#00d2ff',
  },
  endGameImage: {
    enabled: true,
    imageUrl: '',
    imageName: '',
    headline: 'Parabéns pelo Desafio!',
    subheadline: 'Obrigado por participar! Consulte a sua pontuação e tempo de reação abaixo.',
    ctaText: 'Começar Novamente',
  },
  sceneConfig: {
    mode: 'living_room_pests',
    customBackgroundUrl: '',
    enabledPests: {
      flea: true,
      tick: true,
      flea_egg: true,
      flea_larva: true,
    },
    showPestLabels: true,
  },
  uiCustomization: {
    appTitle: 'Kiosk Game Agimus - Arena de Reação Rápida',
    watermarkEnabled: true,
    watermarkUseCompanyLogo: true,
    watermarkUrl: '',
    watermarkOpacity: 0.08,
    showNavbar: true,
    minimalNavbar: false,
    showFramelessButton: true,
    startHeadline: '',
    startSubtitle: '',
    startButtonText: 'Começar Jogo',
    startHelperText: 'Toque no botão para iniciar',
    showStartStageMetadata: true,
    showStartPestLegend: true,
    showInstallFramelessInStart: true,
    showHudStageInfo: true,
    showHudMetrics: true,
    showHudSoundButton: true,
  },
  mobileConfig: {
    enabled: true,
    targetSizeMultiplier: 1.25,
    extraReactionTimeMs: 150,
    arenaHeightMode: 'auto',
    compactHudOnMobile: true,
    hideCrosshairOnTouch: true,
    hapticFeedback: true,
    mobileTouchGestureAdmin: true,
    recommendedOrientation: 'any',
  },
  customLevelConfigs: {},
  tournamentMode: false,
  adminDisplayName: 'Administrador Agimus',
  branding: {
    primaryColor: '#00d2ff',
    secondaryColor: '#0284c7',
    backgroundColor: '#070c18',
    headerBgColor: '#060a14',
    headerStyle: 'glass',
    backgroundPattern: 'solid',
    backgroundImageUrl: '',
    themePreset: 'agimus_blue',
  },
  logo: {
    enabled: true,
    logoUrl: '',
    companyName: 'AGIMUS',
    subTitle: 'KIOSK GAME ARENA',
  },
  registration: {
    enabled: true,
    requireName: true,
    showEmail: true,
    requireEmail: true,
    showPhone: true,
    requirePhone: false,
    showCompany: true,
    requireCompany: false,
    showCargo: true,
    requireCargo: false,
    showConsent: true,
    title: 'Inscrição no Quiosque Agimus',
    description: 'Preencha seus dados para entrar no placar oficial do evento e disputar prêmios.',
    consentText: 'Autorizo o contato da Agimus para envio de resultados e novidades do evento.',
  },
};

export function loadAdminSettings(): AppAdminSettings {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return DEFAULT_ADMIN_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_ADMIN_SETTINGS,
      ...parsed,
      endGameImage: {
        ...DEFAULT_ADMIN_SETTINGS.endGameImage,
        ...(parsed.endGameImage || {}),
      },
      sceneConfig: {
        ...DEFAULT_ADMIN_SETTINGS.sceneConfig,
        ...(parsed.sceneConfig || {}),
        enabledPests: {
          ...DEFAULT_ADMIN_SETTINGS.sceneConfig.enabledPests,
          ...(parsed.sceneConfig?.enabledPests || {}),
        },
      },
      uiCustomization: {
        ...DEFAULT_ADMIN_SETTINGS.uiCustomization,
        ...(parsed.uiCustomization || {}),
      },
      mobileConfig: {
        ...DEFAULT_ADMIN_SETTINGS.mobileConfig,
        ...(parsed.mobileConfig || {}),
      },
      branding: {
        ...DEFAULT_ADMIN_SETTINGS.branding,
        ...(parsed.branding || {}),
      },
      logo: {
        ...DEFAULT_ADMIN_SETTINGS.logo,
        ...(parsed.logo || {}),
      },
      registration: {
        ...DEFAULT_ADMIN_SETTINGS.registration,
        ...(parsed.registration || {}),
      },
    };
  } catch {
    return DEFAULT_ADMIN_SETTINGS;
  }
}

export function saveAdminSettings(settings: AppAdminSettings): void {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

export function verifyAdminPassword(password: string): boolean {
  const current = loadAdminSettings();
  const target = current.passwordHash || DEFAULT_PASSWORD;
  return password === target;
}

export function updateAdminPassword(newPassword: string): void {
  const current = loadAdminSettings();
  current.passwordHash = newPassword;
  saveAdminSettings(current);
}

export function resetAdminToDefaults(): AppAdminSettings {
  saveAdminSettings(DEFAULT_ADMIN_SETTINGS);
  return DEFAULT_ADMIN_SETTINGS;
}
