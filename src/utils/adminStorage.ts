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
    customBorderColor: '#22d3ee',
  },
  customLevelConfigs: {},
  tournamentMode: false,
  adminDisplayName: 'Administrador Chefe',
};

export function loadAdminSettings(): AppAdminSettings {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return DEFAULT_ADMIN_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_ADMIN_SETTINGS, ...parsed };
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
