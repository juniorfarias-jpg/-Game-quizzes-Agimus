import React, { useState, useRef, useEffect } from 'react';
import { 
  AppAdminSettings, 
  LevelConfig, 
  CustomTargetImageConfig, 
  LeaderboardEntry,
  PlayerRegistration,
  BrandingColorsConfig,
  CompanyLogoConfig,
  RegistrationFormConfig,
  PestKind
} from '../types/game';
import { LEVELS } from '../utils/levels';
import { updateAdminPassword } from '../utils/adminStorage';
import { THEME_PRESETS } from '../utils/brandingPresets';
import { PestSprite, PEST_META } from './PestSprite';
import livingRoomCatImg from '../assets/images/living_room_cat_scene_1795453020672.jpg';
import { 
  ShieldCheck, 
  Settings, 
  Layers, 
  Image as ImageIcon, 
  Trophy, 
  Key, 
  Trash2, 
  RotateCcw, 
  Save, 
  Check, 
  X, 
  Sliders, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Upload, 
  Link as LinkIcon, 
  AlertTriangle,
  Sparkles,
  Palette,
  Users,
  Download,
  Building,
  Mail,
  Phone,
  Briefcase,
  FileSpreadsheet,
  CheckCircle2,
  Award,
  LayoutTemplate,
  PanelTop,
  Grid3X3,
  CircleDot,
  Square,
  Zap,
  Smartphone,
  Tablet
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  adminSettings: AppAdminSettings;
  onSaveAdminSettings: (settings: AppAdminSettings) => void;
  leaderboardEntries: LeaderboardEntry[];
  onDeleteLeaderboardEntry: (id: string) => void;
  onClearLeaderboard: () => void;
  onRestoreLeaderboard: () => void;
  registrations?: PlayerRegistration[];
  onDeleteRegistration?: (id: string) => void;
  onClearRegistrations?: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  adminSettings,
  onSaveAdminSettings,
  leaderboardEntries,
  onDeleteLeaderboardEntry,
  onClearLeaderboard,
  onRestoreLeaderboard,
  registrations = [],
  onDeleteRegistration,
  onClearRegistrations,
}) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'layout' | 'mobile' | 'registration' | 'levels' | 'image' | 'endgame' | 'leaderboard' | 'security'>('branding');
  const [settingsDraft, setSettingsDraft] = useState<AppAdminSettings>(adminSettings);
  const [notification, setNotification] = useState<string | null>(null);
  const [mobilePreviewOrientation, setMobilePreviewOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // Sync draft whenever adminSettings changes (e.g. from cloud)
  useEffect(() => {
    setSettingsDraft(adminSettings);
  }, [adminSettings]);

  // Password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  // Target image file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');

  // Logo file input
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoUrlInput, setLogoUrlInput] = useState('');

  // Watermark file input
  const watermarkInputRef = useRef<HTMLInputElement>(null);
  const [watermarkUrlInput, setWatermarkUrlInput] = useState('');

  // End Game image file input
  const endGameFileInputRef = useRef<HTMLInputElement>(null);
  const [endGameUrlInput, setEndGameUrlInput] = useState('');

  // App Background image file input
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const [bgImageUrlInput, setBgImageUrlInput] = useState('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSettingsDraft((prev) => ({
          ...prev,
          uiCustomization: {
            ...prev.uiCustomization,
            watermarkEnabled: true,
            watermarkUseCompanyLogo: false,
            watermarkUrl: reader.result as string,
          },
        }));
        showToast('Imagem de marca d\'água carregada!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAppBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Selecione uma imagem válida (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSettingsDraft((prev) => ({
          ...prev,
          branding: {
            ...prev.branding,
            backgroundPattern: 'image',
            backgroundImageUrl: reader.result as string,
          },
        }));
        showToast('Imagem de fundo do aplicativo carregada!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyAppBgUrl = () => {
    if (!bgImageUrlInput.trim()) return;
    try {
      new URL(bgImageUrlInput);
      setSettingsDraft((prev) => ({
        ...prev,
        branding: {
          ...prev.branding,
          backgroundPattern: 'image',
          backgroundImageUrl: bgImageUrlInput.trim(),
        },
      }));
      setBgImageUrlInput('');
      showToast('URL da imagem de fundo aplicada!');
    } catch {
      showToast('URL inválida.');
    }
  };

  const handleApplyFestivalPreset = () => {
    setSettingsDraft((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        primaryColor: '#00d2ff',
        secondaryColor: '#0284c7',
        backgroundColor: '#040915',
        themePreset: 'agimus_blue',
      },
      sceneConfig: {
        ...prev.sceneConfig,
        mode: 'classic',
      },
      uiCustomization: {
        ...prev.uiCustomization,
        watermarkEnabled: true,
        watermarkUseCompanyLogo: true,
        watermarkOpacity: 0.08,
        showNavbar: true,
        minimalNavbar: true,
        showFramelessButton: true,
        startHeadline: 'PET FESTIVAL 2027',
        startSubtitle: 'Acerte as figuras que surgem no ecrã o mais rápido possível para pontuar pelo seu tempo de reação!',
        startButtonText: 'START',
        startHelperText: 'Toque no botão para iniciar a contagem regressiva',
        showStartStageMetadata: false,
        showStartPestLegend: false,
        showInstallFramelessInStart: true,
        showHudStageInfo: true,
        showHudMetrics: true,
        showHudSoundButton: true,
      },
    }));
    showToast('Layout Minimalista / Festival aplicado! Clique em "Salvar na Nuvem" para confirmar.');
  };

  const handleApplyLivingRoomPreset = () => {
    setSettingsDraft((prev) => ({
      ...prev,
      sceneConfig: {
        ...prev.sceneConfig,
        mode: 'living_room_pests',
      },
      uiCustomization: {
        ...prev.uiCustomization,
        minimalNavbar: false,
        startHeadline: 'ELIMINE AS PRAGAS DA SALA',
        startSubtitle: 'Pulgas, carraças, ovos e larvas começaram a surgir nos sofás, cadeirões, tapete e perto do gato. Clique rápido para eliminar!',
        startButtonText: 'COMEÇAR JOGO',
        startHelperText: 'Toque no botão para iniciar',
        showStartStageMetadata: true,
        showStartPestLegend: true,
      },
    }));
    showToast('Layout Sala com Gato & Pragas aplicado! Clique em "Salvar na Nuvem" para confirmar.');
  };

  const handleSaveAll = () => {
    onSaveAdminSettings(settingsDraft);
    showToast('Configurações salvas e sincronizadas na nuvem em tempo real!');
  };

  // Preset theme selector
  const handleApplyPreset = (presetId: BrandingColorsConfig['themePreset']) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSettingsDraft((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        themePreset: preset.id,
        primaryColor: preset.primary,
        secondaryColor: preset.secondary,
        backgroundColor: preset.background,
      },
    }));
    showToast(`Tema visual "${preset.name}" aplicado!`);
  };

  // Level config updater
  const handleUpdateLevelField = (levelId: number, field: keyof LevelConfig, value: unknown) => {
    setSettingsDraft((prev) => {
      const existing = prev.customLevelConfigs[levelId] || {};
      const updated = {
        ...prev,
        customLevelConfigs: {
          ...prev.customLevelConfigs,
          [levelId]: {
            ...existing,
            [field]: value,
          },
        },
      };
      return updated;
    });
  };

  // Reset single level
  const handleResetLevel = (levelId: number) => {
    setSettingsDraft((prev) => {
      const updatedConfigs = { ...prev.customLevelConfigs };
      delete updatedConfigs[levelId];
      return { ...prev, customLevelConfigs: updatedConfigs };
    });
    showToast(`Fase ${levelId} restaurada para os valores padrão.`);
  };

  // Change Admin Password handler
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (currentPassword !== adminSettings.passwordHash) {
      setPasswordError('Senha atual incorreta.');
      return;
    }

    if (newPassword.length < 4) {
      setPasswordError('A nova senha deve ter pelo menos 4 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas digitadas não coincidem.');
      return;
    }

    updateAdminPassword(newPassword);
    const updated = { ...settingsDraft, passwordHash: newPassword };
    setSettingsDraft(updated);
    onSaveAdminSettings(updated);
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Senha de administrador alterada com sucesso!');
  };

  // File upload for admin custom image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setSettingsDraft((prev) => ({
          ...prev,
          customTargetImage: {
            ...prev.customTargetImage,
            enabled: true,
            imageUrl: result,
            imageName: file.name,
          },
        }));
        showToast('Imagem carregada pelo administrador!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    try {
      new URL(urlInput);
      setSettingsDraft((prev) => ({
        ...prev,
        customTargetImage: {
          ...prev.customTargetImage,
          enabled: true,
          imageUrl: urlInput.trim(),
          imageName: 'Imagem da Web (Admin)',
        },
      }));
      setUrlInput('');
      showToast('URL de imagem aplicada pelo administrador!');
    } catch {
      showToast('URL inválida.');
    }
  };

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setSettingsDraft((prev) => ({
          ...prev,
          logo: {
            ...prev.logo,
            enabled: true,
            logoUrl: result,
          },
        }));
        showToast('Logotipo da empresa carregado!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyLogoUrl = () => {
    if (!logoUrlInput.trim()) return;
    try {
      new URL(logoUrlInput);
      setSettingsDraft((prev) => ({
        ...prev,
        logo: {
          ...prev.logo,
          enabled: true,
          logoUrl: logoUrlInput.trim(),
        },
      }));
      setLogoUrlInput('');
      showToast('URL do Logotipo aplicada!');
    } catch {
      showToast('URL do Logotipo inválida.');
    }
  };

  // End Game image handlers
  const handleEndGameFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor, selecione um arquivo de imagem válido (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      showToast('Imagem muito grande (máximo 4MB recomendado).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSettingsDraft((prev) => ({
          ...prev,
          endGameImage: {
            ...prev.endGameImage,
            enabled: true,
            imageUrl: reader.result as string,
            imageName: file.name,
          },
        }));
        showToast('Imagem de fim de jogo carregada!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyEndGameUrl = () => {
    if (!endGameUrlInput.trim()) return;
    try {
      new URL(endGameUrlInput);
      setSettingsDraft((prev) => ({
        ...prev,
        endGameImage: {
          ...prev.endGameImage,
          enabled: true,
          imageUrl: endGameUrlInput.trim(),
          imageName: 'Imagem via URL',
        },
      }));
      setEndGameUrlInput('');
      showToast('URL da imagem de fim de jogo aplicada!');
    } catch {
      showToast('URL da imagem de fim de jogo inválida.');
    }
  };

  // Export registrations as CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) return;

    const headers = ['ID', 'Nome', 'Email', 'Telefone', 'Empresa', 'Cargo', 'Data de Inscrição', 'Pontuação Máxima', 'Melhor Tempo (ms)'];
    const rows = registrations.map((r) => [
      r.id,
      `"${r.playerName.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `"${r.phone.replace(/"/g, '""')}"`,
      `"${r.company.replace(/"/g, '""')}"`,
      `"${r.cargo.replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString('pt-PT')}"`,
      r.bestScore || 0,
      r.bestReactionMs || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_quiosque_agimus_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-5 bg-slate-950/90 backdrop-blur-md">
      <div 
        className="relative w-full max-w-5xl bg-[#090e1a] border-0 sm:border-2 rounded-none sm:rounded-2xl shadow-[0_0_50px_rgba(0,210,255,0.25)] flex flex-col h-[100dvh] sm:h-auto sm:max-h-[92vh] overflow-hidden"
        style={{ borderColor: `${settingsDraft.branding.primaryColor}88` }}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: settingsDraft.branding.primaryColor }}
            >
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-display font-black text-white tracking-wide">
                  Central do Modo Administrador
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/60 text-[10px] font-mono-code font-bold text-emerald-400">
                  NUVEM SINCRONIZADA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personalização de cores, logotipo da empresa, cadastro de leads, fases e banco de dados.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 flex items-center gap-1.5 text-xs font-bold text-white rounded-lg transition shadow-md active:scale-95"
              style={{
                backgroundColor: settingsDraft.branding.primaryColor,
                boxShadow: `0 0 15px ${settingsDraft.branding.primaryColor}55`,
              }}
            >
              <Save className="w-3.5 h-3.5 text-slate-950" />
              <span className="text-slate-950 font-bold">Salvar na Nuvem</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 rounded-lg transition"
              title="Sair do Modo Administrador"
            >
              Sair
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="mx-4 mt-3 p-2.5 bg-emerald-950/90 border border-emerald-500/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-4 pt-3 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto bg-slate-950/40">
          <button
            onClick={() => setActiveTab('branding')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'branding'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Cores & Logotipo</span>
          </button>

          <button
            onClick={() => setActiveTab('layout')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'layout'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            <span>Textos & Layout Total</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'mobile'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Dispositivos Móveis</span>
          </button>

          <button
            onClick={() => setActiveTab('registration')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'registration'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Inscrição & Leads ({registrations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('levels')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'levels'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Editor de Fases (1 a 6)</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'image'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Cenário & Alvos</span>
          </button>

          <button
            onClick={() => setActiveTab('endgame')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'endgame'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Imagem Fim de Jogo</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Gestão do Ranking</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Segurança & Senha</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* TAB 1: CORES & LOGOTIPO DA EMPRESA */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              {/* Theme presets */}
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display mb-1 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  <span>Paletas de Cores Prontas (Presets de Marca)</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Escolha um tema ou personalize livremente as cores hexadecimais para coincidir com a identidade da sua empresa.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {THEME_PRESETS.map((p) => {
                    const isSelected = settingsDraft.branding.themePreset === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleApplyPreset(p.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-900 border-2 shadow-lg scale-[1.02]'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                        }`}
                        style={{
                          borderColor: isSelected ? p.primary : undefined,
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-white font-display">
                            {p.name}
                          </span>
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold uppercase"
                            style={{ backgroundColor: `${p.primary}33`, color: p.primary }}
                          >
                            {p.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-3">{p.description}</p>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                            style={{ backgroundColor: p.primary }}
                            title="Cor Primária"
                          />
                          <div
                            className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                            style={{ backgroundColor: p.secondary }}
                            title="Cor Secundária"
                          />
                          <div
                            className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                            style={{ backgroundColor: p.background }}
                            title="Cor de Fundo"
                          />
                          {isSelected && (
                            <span className="ml-auto text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                              <Check className="w-3 h-3" /> ATIVO
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                  Cores Personalizadas (Hexadecimal)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Primary Color */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                      Cor Primária (Botões, Destaques):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settingsDraft.branding.primaryColor}
                        onChange={(e) =>
                          setSettingsDraft((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              primaryColor: e.target.value,
                              themePreset: 'custom',
                            },
                          }))
                        }
                        className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 shrink-0"
                      />
                      <input
                        type="text"
                        value={settingsDraft.branding.primaryColor}
                        onChange={(e) =>
                          setSettingsDraft((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              primaryColor: e.target.value,
                              themePreset: 'custom',
                            },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono-code"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                      Cor Secundária (Bordas, Gradientes):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settingsDraft.branding.secondaryColor}
                        onChange={(e) =>
                          setSettingsDraft((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              secondaryColor: e.target.value,
                              themePreset: 'custom',
                            },
                          }))
                        }
                        className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 shrink-0"
                      />
                      <input
                        type="text"
                        value={settingsDraft.branding.secondaryColor}
                        onChange={(e) =>
                          setSettingsDraft((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              secondaryColor: e.target.value,
                              themePreset: 'custom',
                            },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono-code"
                      />
                    </div>
                  </div>

                  {/* Background Color */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                      Cor de Fundo da Aplicação:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settingsDraft.branding.backgroundColor}
                        onChange={(e) =>
                          setSettingsDraft((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              backgroundColor: e.target.value,
                              themePreset: 'custom',
                            },
                          }))
                        }
                        className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 shrink-0"
                      />
                      <input
                        type="text"
                        value={settingsDraft.branding.backgroundColor}
                        onChange={(e) =>
                          setSettingsDraft((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              backgroundColor: e.target.value,
                              themePreset: 'custom',
                            },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono-code"
                      />
                    </div>
                  </div>

                  {/* Header Background Color */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                      Cor de Fundo do Cabeçalho:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settingsDraft.branding.headerBgColor || '#060a14'}
                        onChange={(e) =>
                          setSettingsDraft((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              headerBgColor: e.target.value,
                            },
                          }))
                        }
                        className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 shrink-0"
                      />
                      <input
                        type="text"
                        value={settingsDraft.branding.headerBgColor || '#060a14'}
                        onChange={(e) =>
                          setSettingsDraft((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              headerBgColor: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono-code"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PERSONALIZAÇÃO DO CABEÇALHO (BARRA SUPERIOR / TOPO) */}
              <div className="p-4 sm:p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <PanelTop className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                    Personalização do Cabeçalho (Barra Superior / Topo)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'glass' as const,
                      title: 'Translúcido com Desfoque',
                      desc: 'Glassmorphism com efeito blur e transparência moderna.',
                    },
                    {
                      id: 'solid' as const,
                      title: 'Cor Sólida Opaca',
                      desc: 'Fundo 100% preenchido pela cor selecionada.',
                    },
                    {
                      id: 'neon_gradient' as const,
                      title: 'Gradiente Fluido Neon',
                      desc: 'Mistura fluida com a cor primária de destaque.',
                    },
                  ].map((option) => {
                    const currentStyle = settingsDraft.branding.headerStyle || 'glass';
                    const isSelected = currentStyle === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          setSettingsDraft((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              headerStyle: option.id,
                            },
                          }))
                        }
                        className={`text-left p-3.5 rounded-xl border transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-900/95 shadow-lg'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                        }`}
                        style={{
                          borderColor: isSelected ? settingsDraft.branding.primaryColor : undefined,
                          boxShadow: isSelected
                            ? `0 0 18px ${settingsDraft.branding.primaryColor}22`
                            : undefined,
                        }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-white">{option.title}</span>
                          {isSelected && (
                            <Check
                              className="w-4 h-4 shrink-0"
                              style={{ color: settingsDraft.branding.primaryColor }}
                            />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{option.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Live Header Preview */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-semibold text-slate-300">
                    Pré-visualização do Cabeçalho:
                  </div>
                  {(() => {
                    const pColor = settingsDraft.branding.primaryColor || '#00d2ff';
                    const hBg = settingsDraft.branding.headerBgColor || '#060a14';
                    const hStyle = settingsDraft.branding.headerStyle || 'glass';
                    const previewStyle: React.CSSProperties =
                      hStyle === 'solid'
                        ? {
                            backgroundColor: hBg,
                            borderColor: `${pColor}44`,
                          }
                        : hStyle === 'neon_gradient'
                        ? {
                            backgroundColor: hBg,
                            backgroundImage: `linear-gradient(90deg, ${hBg} 0%, ${pColor}33 50%, ${hBg} 100%)`,
                            borderColor: `${pColor}66`,
                          }
                        : {
                            backgroundColor: `${hBg}d9`,
                            backdropFilter: 'blur(12px)',
                            borderColor: 'rgba(51, 65, 85, 0.7)',
                          };

                    return (
                      <div
                        className="w-full px-4 py-3 rounded-xl border flex items-center justify-between gap-3 transition-all"
                        style={previewStyle}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {settingsDraft.logo.enabled && settingsDraft.logo.logoUrl ? (
                            <img
                              src={settingsDraft.logo.logoUrl}
                              alt="Logo Preview"
                              className="h-8 max-w-[120px] object-contain rounded"
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ backgroundColor: pColor }}
                            >
                              <Zap className="w-4 h-4 text-slate-950" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-xs font-display font-black text-white tracking-wider truncate">
                              {settingsDraft.logo.companyName || 'AGIMUS'}
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono-code truncate uppercase">
                              {settingsDraft.logo.subTitle || 'QUIOSQUE DE REAÇÃO RÁPIDA'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className="px-3 py-1 rounded-md text-[11px] font-bold text-slate-950"
                            style={{ backgroundColor: pColor }}
                          >
                            Jogar
                          </span>
                          <span className="px-3 py-1 rounded-md text-[11px] font-semibold text-slate-300 bg-slate-900/80 border border-slate-700">
                            Ranking
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* FUNDO DO APLICATIVO (PADRÃO VISUAL & IMAGEM DE FUNDO) */}
              <div className="p-4 sm:p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                    Fundo do Aplicativo (Padrão Visual &amp; Imagem de Fundo)
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {[
                    { id: 'grid' as const, label: 'Grelha Sci-Fi', icon: Grid3X3 },
                    { id: 'dots' as const, label: 'Pontos Tech', icon: CircleDot },
                    { id: 'aurora' as const, label: 'Brilho Aurora', icon: Sparkles },
                    { id: 'solid' as const, label: 'Sólido Limpo', icon: Square },
                    { id: 'image' as const, label: 'Foto / Imagem', icon: Upload },
                  ].map((pat) => {
                    const Icon = pat.icon;
                    const currentPattern = settingsDraft.branding.backgroundPattern || 'solid';
                    const isSelected = currentPattern === pat.id;
                    return (
                      <button
                        key={pat.id}
                        type="button"
                        onClick={() =>
                          setSettingsDraft((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              backgroundPattern: pat.id,
                            },
                          }))
                        }
                        className={`p-3.5 rounded-xl border transition flex flex-col items-center justify-center gap-2 text-center ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-lg'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                        style={{
                          borderColor: isSelected ? settingsDraft.branding.primaryColor : undefined,
                          color: isSelected ? settingsDraft.branding.primaryColor : undefined,
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-bold">{pat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {(settingsDraft.branding.backgroundPattern || 'solid') === 'image' && (
                  <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-white">
                          Imagem de Fundo Personalizada
                        </div>
                        <div className="text-[11px] text-slate-400">
                          A imagem será exibida em tela inteira atrás da arena e menus.
                        </div>
                      </div>
                      {settingsDraft.branding.backgroundImageUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setSettingsDraft((prev) => ({
                              ...prev,
                              branding: { ...prev.branding, backgroundImageUrl: '' },
                            }))
                          }
                          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remover Imagem</span>
                        </button>
                      )}
                    </div>

                    {settingsDraft.branding.backgroundImageUrl && (
                      <div className="w-full h-28 rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                        <img
                          src={settingsDraft.branding.backgroundImageUrl}
                          alt="Prévia do Fundo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          ref={bgImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAppBgImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => bgImageInputRef.current?.click()}
                          className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2 transition"
                        >
                          <Upload className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Carregar Imagem de Fundo</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bgImageUrlInput}
                          onChange={(e) => setBgImageUrlInput(e.target.value)}
                          placeholder="Ou cole a URL da imagem..."
                          className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                        />
                        <button
                          type="button"
                          onClick={handleApplyAppBgUrl}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-cyan-400"
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* COMPANY LOGO SECTION */}
              <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Logotipo da Empresa & Marca no Topo
                    </h4>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <span>Exibir Logo no Cabeçalho:</span>
                    <input
                      type="checkbox"
                      checked={settingsDraft.logo.enabled}
                      onChange={(e) =>
                        setSettingsDraft((prev) => ({
                          ...prev,
                          logo: { ...prev.logo, enabled: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 accent-cyan-400 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Nome da Empresa / Marca:
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.logo.companyName}
                      onChange={(e) =>
                        setSettingsDraft((prev) => ({
                          ...prev,
                          logo: { ...prev.logo, companyName: e.target.value },
                        }))
                      }
                      placeholder="Ex: AGIMUS"
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-display"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Subtítulo / Descrição Curta:
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.logo.subTitle || ''}
                      onChange={(e) =>
                        setSettingsDraft((prev) => ({
                          ...prev,
                          logo: { ...prev.logo, subTitle: e.target.value },
                        }))
                      }
                      placeholder="Ex: QUIOSQUE OFICIAL"
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                {/* Logo Preview and Actions */}
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-14 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center p-1 overflow-hidden">
                      {settingsDraft.logo.logoUrl ? (
                        <img
                          src={settingsDraft.logo.logoUrl}
                          alt="Logo Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-[9px] text-slate-500 font-mono-code text-center">
                          Sem Logo
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Visualização do Logotipo</div>
                      <div className="text-[11px] text-slate-400">
                        {settingsDraft.logo.logoUrl ? 'Imagem carregada' : 'Usando badge textual padrão'}
                      </div>
                    </div>
                  </div>

                  {settingsDraft.logo.logoUrl && (
                    <button
                      onClick={() =>
                        setSettingsDraft((prev) => ({
                          ...prev,
                          logo: { ...prev.logo, logoUrl: '' },
                        }))
                      }
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remover Logo
                    </button>
                  )}
                </div>

                {/* Upload or Link for Logo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full py-2 px-3 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center gap-1.5 transition"
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Upload do Arquivo do Logo</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={logoUrlInput}
                      onChange={(e) => setLogoUrlInput(e.target.value)}
                      placeholder="Ou cole a URL do Logo..."
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                    />
                    <button
                      onClick={handleApplyLogoUrl}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TEXTOS, MARCA D'ÁGUA & LAYOUT TOTAL DO APP */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              {/* 1-Click Presets */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
                    <LayoutTemplate className="w-4 h-4 text-cyan-400" />
                    <span>Modelos Prontos (1 Clique)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Aplique instantaneamente o visual minimalista de evento (com marca d&apos;água, barra limpa e botão START) ou o modo Sala com Gato & Pragas, e depois ajuste qualquer detalhe abaixo.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleApplyFestivalPreset}
                    className="p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-950/50 text-left transition"
                  >
                    <div className="text-xs font-bold text-cyan-300">
                      Estilo Minimalista / Evento (Como Imagem)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Marca d&apos;água gigante no fundo, barra superior só com logo + &quot;Sem Barra&quot;, título customizado e botão START.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyLivingRoomPreset}
                    className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-950/25 hover:bg-amber-950/45 text-left transition"
                  >
                    <div className="text-xs font-bold text-amber-300">
                      Estilo Sala com Gato & Pragas
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Cenário doméstico com sofás, cadeirões, gatos andando e eliminação de pulgas, carraças, ovos e larvas.
                    </div>
                  </button>
                </div>
              </div>

              {/* App Title & Start Screen Texts */}
              <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                  Textos da Aplicação & Tela Inicial
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Título da Janela / Navegador:
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.uiCustomization?.appTitle || ''}
                      onChange={(e) =>
                        setSettingsDraft((prev) => ({
                          ...prev,
                          uiCustomization: { ...prev.uiCustomization, appTitle: e.target.value },
                        }))
                      }
                      placeholder="Ex: Kiosk Game - Pet Festival 2027"
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Título Principal da Tela Inicial (deixe vazio para automático):
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.uiCustomization?.startHeadline || ''}
                      onChange={(e) =>
                        setSettingsDraft((prev) => ({
                          ...prev,
                          uiCustomization: { ...prev.uiCustomization, startHeadline: e.target.value },
                        }))
                      }
                      placeholder="Ex: PET FESTIVAL 2027"
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-display"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Subtítulo / Instrução na Tela Inicial (deixe vazio para automático):
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.uiCustomization?.startSubtitle || ''}
                      onChange={(e) =>
                        setSettingsDraft((prev) => ({
                          ...prev,
                          uiCustomization: { ...prev.uiCustomization, startSubtitle: e.target.value },
                        }))
                      }
                      placeholder="Ex: Acerte as figuras que surgem no ecrã o mais rápido possível para pontuar pelo seu tempo de reação!"
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Texto do Botão Principal:
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.uiCustomization?.startButtonText || ''}
                      onChange={(e) =>
                        setSettingsDraft((prev) => ({
                          ...prev,
                          uiCustomization: { ...prev.uiCustomization, startButtonText: e.target.value },
                        }))
                      }
                      placeholder="Ex: START ou COMEÇAR JOGO"
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-display font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Texto Auxiliar Abaixo do Botão (vazio para ocultar):
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.uiCustomization?.startHelperText ?? ''}
                      onChange={(e) =>
                        setSettingsDraft((prev) => ({
                          ...prev,
                          uiCustomization: { ...prev.uiCustomization, startHelperText: e.target.value },
                        }))
                      }
                      placeholder="Ex: Toque no botão para iniciar a contagem regressiva"
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Background Watermark */}
              <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Marca d&apos;Água Gigante no Fundo da Página
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Exibe o logotipo da empresa (ou outra imagem) centralizado e translúcido atrás de toda a tela.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(settingsDraft.uiCustomization?.watermarkEnabled)}
                    onChange={(e) =>
                      setSettingsDraft((prev) => ({
                        ...prev,
                        uiCustomization: { ...prev.uiCustomization, watermarkEnabled: e.target.checked },
                      }))
                    }
                    className="w-5 h-5 accent-cyan-400 cursor-pointer"
                  />
                </div>

                {settingsDraft.uiCustomization?.watermarkEnabled && (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsDraft.uiCustomization?.watermarkUseCompanyLogo !== false}
                          onChange={(e) =>
                            setSettingsDraft((prev) => ({
                              ...prev,
                              uiCustomization: {
                                ...prev.uiCustomization,
                                watermarkUseCompanyLogo: e.target.checked,
                              },
                            }))
                          }
                          className="accent-cyan-400"
                        />
                        <span>Usar o mesmo Logotipo configurado em &quot;Cores & Logotipo&quot;</span>
                      </label>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          Opacidade: {Math.round((settingsDraft.uiCustomization?.watermarkOpacity ?? 0.08) * 100)}%
                        </span>
                        <input
                          type="range"
                          min={2}
                          max={35}
                          value={Math.round((settingsDraft.uiCustomization?.watermarkOpacity ?? 0.08) * 100)}
                          onChange={(e) =>
                            setSettingsDraft((prev) => ({
                              ...prev,
                              uiCustomization: {
                                ...prev.uiCustomization,
                                watermarkOpacity: Number(e.target.value) / 100,
                              },
                            }))
                          }
                          className="w-28 accent-cyan-400"
                        />
                      </div>
                    </div>

                    {settingsDraft.uiCustomization?.watermarkUseCompanyLogo === false && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input
                            ref={watermarkInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleWatermarkUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => watermarkInputRef.current?.click()}
                            className="w-full py-2 px-3 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center gap-1.5 transition"
                          >
                            <Upload className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Carregar Imagem para Marca d&apos;Água</span>
                          </button>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={watermarkUrlInput}
                            onChange={(e) => setWatermarkUrlInput(e.target.value)}
                            placeholder="Ou cole a URL da imagem de fundo..."
                            className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!watermarkUrlInput.trim()) return;
                              setSettingsDraft((prev) => ({
                                ...prev,
                                uiCustomization: {
                                  ...prev.uiCustomization,
                                  watermarkUrl: watermarkUrlInput.trim(),
                                },
                              }));
                              setWatermarkUrlInput('');
                              showToast('URL da marca d\'água aplicada!');
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
                          >
                            Aplicar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Visibility Toggles for Entire App */}
              <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                  Visibilidade dos Elementos da Interface
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {(
                    [
                      ['showNavbar', 'Exibir Barra Superior (Cabeçalho)'],
                      ['minimalNavbar', 'Cabeçalho Minimalista (só Logo + Sem Barra)'],
                      ['showFramelessButton', 'Botão "Sem Barra" no Cabeçalho'],
                      ['showInstallFramelessInStart', 'Botão "Instalar App / Modo Sem Barra" no Início'],
                      ['showStartStageMetadata', 'Exibir Fase e Alvos na Tela Inicial'],
                      ['showStartPestLegend', 'Exibir Miniaturas das Pragas na Tela Inicial'],
                      ['showHudStageInfo', 'Exibir Info da Fase no Topo da Arena'],
                      ['showHudMetrics', 'Exibir Reação, Combo, Precisão e Pontos'],
                      ['showHudSoundButton', 'Exibir Botão de Áudio no Topo da Arena'],
                    ] as const
                  ).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center justify-between gap-3 p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700"
                    >
                      <span className="text-slate-200">{label}</span>
                      <input
                        type="checkbox"
                        checked={Boolean(settingsDraft.uiCustomization?.[key])}
                        onChange={(e) =>
                          setSettingsDraft((prev) => ({
                            ...prev,
                            uiCustomization: {
                              ...prev.uiCustomization,
                              [key]: e.target.checked,
                            },
                          }))
                        }
                        className="w-4 h-4 accent-cyan-400 cursor-pointer shrink-0"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: DISPOSITIVOS MÓVEIS (CELULARES & TABLETS) */}
          {activeTab === 'mobile' && (
            <div className="space-y-6">
              {/* Master Mobile Optimization Toggle */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span>Configuração para Celulares e Tablets</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ajuste o tamanho dos alvos para toque com o dedo, tolerância extra, HUD compacto, vibração tátil e atalho secreto do Admin sem teclado.
                  </p>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-xs font-bold text-white">
                    {settingsDraft.mobileConfig?.enabled !== false ? 'Ativo' : 'Desativado'}
                  </span>
                  <input
                    type="checkbox"
                    checked={settingsDraft.mobileConfig?.enabled !== false}
                    onChange={(e) =>
                      setSettingsDraft((prev) => ({
                        ...prev,
                        mobileConfig: {
                          ...prev.mobileConfig,
                          enabled: e.target.checked,
                        },
                      }))
                    }
                    className="w-5 h-5 accent-cyan-400 cursor-pointer"
                  />
                </label>
              </div>

              {/* 1-Click Mobile Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSettingsDraft((prev) => ({
                      ...prev,
                      mobileConfig: {
                        ...prev.mobileConfig,
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
                    }));
                    setMobilePreviewOrientation('portrait');
                    showToast('Predefinição Smartphone Retrato aplicada!');
                  }}
                  className="p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-950/25 hover:bg-cyan-950/45 text-left transition flex items-start gap-3"
                >
                  <Smartphone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-cyan-300">
                      Perfil Smartphone (Retrato / 1 Mão)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Alvos +25% maiores, +150ms no toque, HUD compacto, vibração e altura adaptativa.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSettingsDraft((prev) => ({
                      ...prev,
                      mobileConfig: {
                        ...prev.mobileConfig,
                        enabled: true,
                        targetSizeMultiplier: 1.15,
                        extraReactionTimeMs: 100,
                        arenaHeightMode: 'auto',
                        compactHudOnMobile: true,
                        hideCrosshairOnTouch: true,
                        hapticFeedback: true,
                        mobileTouchGestureAdmin: true,
                        recommendedOrientation: 'landscape',
                      },
                    }));
                    setMobilePreviewOrientation('landscape');
                    showToast('Predefinição Tablet / Paisagem aplicada!');
                  }}
                  className="p-3.5 rounded-xl border border-indigo-500/40 bg-indigo-950/25 hover:bg-indigo-950/45 text-left transition flex items-start gap-3"
                >
                  <Tablet className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-indigo-300">
                      Perfil Tablet / Paisagem (Recomendado p/ Sala)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Alvos +15%, +100ms e aviso amigável para girar o celular na horizontal.
                    </div>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left Column: Sliders & Toggles */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Touch Target Size & Timing */}
                  <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Precisão de Toque &amp; Velocidade no Celular
                    </h4>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-300 font-semibold">
                          Escala dos Alvos no Toque:
                        </span>
                        <span className="font-mono-code font-bold text-cyan-400">
                          {Math.round((settingsDraft.mobileConfig?.targetSizeMultiplier ?? 1.25) * 100)}% (
                          {(settingsDraft.mobileConfig?.targetSizeMultiplier ?? 1.25).toFixed(2)}x)
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={1.6}
                        step={0.05}
                        value={settingsDraft.mobileConfig?.targetSizeMultiplier ?? 1.25}
                        onChange={(e) =>
                          setSettingsDraft((prev) => ({
                            ...prev,
                            mobileConfig: {
                              ...prev.mobileConfig,
                              targetSizeMultiplier: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono-code">
                        <span>1.0x (Original)</span>
                        <span>1.25x (Recomendado)</span>
                        <span>1.6x (Extra Grande)</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-300 font-semibold">
                          Tolerância Extra de Tempo no Celular:
                        </span>
                        <span className="font-mono-code font-bold text-emerald-400">
                          +{settingsDraft.mobileConfig?.extraReactionTimeMs ?? 150}ms
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={500}
                        step={50}
                        value={settingsDraft.mobileConfig?.extraReactionTimeMs ?? 150}
                        onChange={(e) =>
                          setSettingsDraft((prev) => ({
                            ...prev,
                            mobileConfig: {
                              ...prev.mobileConfig,
                              extraReactionTimeMs: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full accent-emerald-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono-code">
                        <span>0ms (Igual Desktop)</span>
                        <span>+150ms</span>
                        <span>+500ms</span>
                      </div>
                    </div>
                  </div>

                  {/* Layout & Orientation */}
                  <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Tela &amp; Orientação no Dispositivo Móvel
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                          Altura da Arena (Tela Inicial):
                        </label>
                        <select
                          value={settingsDraft.mobileConfig?.arenaHeightMode || 'auto'}
                          onChange={(e) =>
                            setSettingsDraft((prev) => ({
                              ...prev,
                              mobileConfig: {
                                ...prev.mobileConfig,
                                arenaHeightMode: e.target.value as 'auto' | 'compact' | 'tall',
                              },
                            }))
                          }
                          className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                        >
                          <option value="auto">Automática (Preenche a Tela)</option>
                          <option value="compact">Compacta (400px)</option>
                          <option value="tall">Alta (540px)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                          Orientação Recomendada:
                        </label>
                        <select
                          value={settingsDraft.mobileConfig?.recommendedOrientation || 'any'}
                          onChange={(e) =>
                            setSettingsDraft((prev) => ({
                              ...prev,
                              mobileConfig: {
                                ...prev.mobileConfig,
                                recommendedOrientation: e.target.value as 'any' | 'portrait' | 'landscape',
                              },
                            }))
                          }
                          className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                        >
                          <option value="any">Qualquer (Retrato ou Paisagem)</option>
                          <option value="portrait">Vertical (Retrato)</option>
                          <option value="landscape">Horizontal (Paisagem)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
                      {(
                        [
                          ['compactHudOnMobile', 'HUD Compacto durante o jogo'],
                          ['hideCrosshairOnTouch', 'Ocultar mira ao tocar na tela'],
                          ['hapticFeedback', 'Vibração tátil nos acertos'],
                          ['mobileTouchGestureAdmin', 'Abrir Admin ao segurar/tocar 5x logo'],
                        ] as const
                      ).map(([key, label]) => (
                        <label
                          key={key}
                          className="flex items-center justify-between gap-2 p-2.5 bg-slate-900/70 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700"
                        >
                          <span className="text-slate-200 text-[11px]">{label}</span>
                          <input
                            type="checkbox"
                            checked={settingsDraft.mobileConfig?.[key] !== false}
                            onChange={(e) =>
                              setSettingsDraft((prev) => ({
                                ...prev,
                                mobileConfig: {
                                  ...prev.mobileConfig,
                                  [key]: e.target.checked,
                                },
                              }))
                            }
                            className="w-4 h-4 accent-cyan-400 cursor-pointer shrink-0"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Mobile Device Preview */}
                <div className="lg:col-span-5 p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col items-center justify-between gap-3">
                  <div className="w-full flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white font-display uppercase tracking-wider">
                      Prévia Mobile
                    </span>
                    <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setMobilePreviewOrientation('portrait')}
                        className={`px-2 py-1 text-[10px] font-semibold rounded transition ${
                          mobilePreviewOrientation === 'portrait'
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Retrato
                      </button>
                      <button
                        type="button"
                        onClick={() => setMobilePreviewOrientation('landscape')}
                        className={`px-2 py-1 text-[10px] font-semibold rounded transition ${
                          mobilePreviewOrientation === 'landscape'
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Paisagem
                      </button>
                    </div>
                  </div>

                  {/* Phone Mockup */}
                  <div
                    className={`border-[3px] border-slate-700 rounded-[24px] overflow-hidden shadow-2xl flex flex-col transition-all ${
                      mobilePreviewOrientation === 'portrait' ? 'w-[220px] h-[390px]' : 'w-full max-w-[330px] h-[205px]'
                    }`}
                    style={{ backgroundColor: settingsDraft.branding.backgroundColor || '#070c18' }}
                  >
                    {/* Simulated Mobile Header */}
                    <div
                      className="px-3 py-2 border-b border-slate-800/80 flex items-center justify-between shrink-0"
                      style={{
                        backgroundColor: settingsDraft.branding.headerBgColor || '#060a14',
                      }}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {settingsDraft.logo.enabled && settingsDraft.logo.logoUrl ? (
                          <img
                            src={settingsDraft.logo.logoUrl}
                            alt="Logo"
                            className="h-4 max-w-[70px] object-contain"
                          />
                        ) : (
                          <div
                            className="w-4 h-4 rounded flex items-center justify-center text-[8px] font-black text-slate-950 shrink-0"
                            style={{ backgroundColor: settingsDraft.branding.primaryColor }}
                          >
                            A
                          </div>
                        )}
                        <span className="text-[10px] font-bold text-white truncate">
                          {settingsDraft.logo.companyName || 'AGIMUS'}
                        </span>
                      </div>
                      <span
                        className="text-[8px] px-1.5 py-0.5 rounded border font-semibold"
                        style={{
                          color: settingsDraft.branding.primaryColor,
                          borderColor: `${settingsDraft.branding.primaryColor}55`,
                        }}
                      >
                        Sem Barra
                      </span>
                    </div>

                    {/* Simulated Mobile Arena Ready Screen */}
                    <div className="relative flex-1 p-3 flex flex-col items-center justify-center text-center overflow-hidden">
                      {settingsDraft.sceneConfig?.mode === 'living_room_pests' && (
                        <img
                          src={settingsDraft.sceneConfig.customBackgroundUrl || livingRoomCatImg}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-35"
                        />
                      )}
                      <div className="relative z-10 flex flex-col items-center gap-1.5">
                        <div className="text-[11px] font-display font-black text-white leading-tight">
                          {settingsDraft.uiCustomization?.startHeadline?.trim() ||
                            (settingsDraft.sceneConfig?.mode === 'living_room_pests'
                              ? 'ELIMINE AS PRAGAS DA SALA'
                              : 'ARENA DE REFLEXOS')}
                        </div>
                        <div
                          className="mt-1 px-4 py-1.5 rounded-lg text-[10px] font-display font-black text-slate-950 shadow"
                          style={{ backgroundColor: settingsDraft.branding.primaryColor }}
                        >
                          {settingsDraft.uiCustomization?.startButtonText?.trim() || 'Começar Jogo'}
                        </div>
                        <div className="text-[8px] text-slate-300 font-mono-code mt-0.5">
                          Alvo {Math.round((settingsDraft.mobileConfig?.targetSizeMultiplier ?? 1.25) * 100)}% · +
                          {settingsDraft.mobileConfig?.extraReactionTimeMs ?? 150}ms
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 text-center leading-relaxed">
                    No celular sem teclado, segure o logotipo por <strong>1,5s</strong> ou toque <strong>5x rápidas</strong> para abrir este painel.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSCRIÇÕES & FORMULÁRIO DE LEADS */}
          {activeTab === 'registration' && (
            <div className="space-y-6">
              {/* Gate toggle */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Exigir Cadastro de Jogador Antes de Iniciar a Partida</span>
                    {settingsDraft.registration.enabled && (
                      <span className="px-1.5 py-0.2 bg-cyan-400 text-slate-950 text-[9px] font-bold rounded">
                        ATIVO NO QUIOSQUE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Quando ativado, cada participante deve preencher o formulário antes de jogar.
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={settingsDraft.registration.enabled}
                  onChange={(e) =>
                    setSettingsDraft((prev) => ({
                      ...prev,
                      registration: { ...prev.registration, enabled: e.target.checked },
                    }))
                  }
                  className="w-5 h-5 accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Form config settings */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                  Configuração dos Textos e Campos do Formulário
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Título do Formulário:
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.registration.title}
                      onChange={(e) =>
                        setSettingsDraft((prev) => ({
                          ...prev,
                          registration: { ...prev.registration, title: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Subtítulo / Instrução:
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.registration.description}
                      onChange={(e) =>
                        setSettingsDraft((prev) => ({
                          ...prev,
                          registration: { ...prev.registration, description: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                {/* Fields toggle grid */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-[11px] font-bold text-slate-300 uppercase">
                    Campos Habilitados no Cadastro
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-900 text-xs">
                    <span className="text-slate-300">E-mail corporativo / pessoal</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsDraft.registration.showEmail}
                          onChange={(e) =>
                            setSettingsDraft((prev) => ({
                              ...prev,
                              registration: { ...prev.registration, showEmail: e.target.checked },
                            }))
                          }
                          className="accent-cyan-400"
                        />
                        <span>Exibir</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsDraft.registration.requireEmail}
                          onChange={(e) =>
                            setSettingsDraft((prev) => ({
                              ...prev,
                              registration: { ...prev.registration, requireEmail: e.target.checked },
                            }))
                          }
                          className="accent-cyan-400"
                        />
                        <span>Obrigatório</span>
                      </label>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-900 text-xs">
                    <span className="text-slate-300">Telefone / WhatsApp</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsDraft.registration.showPhone}
                          onChange={(e) =>
                            setSettingsDraft((prev) => ({
                              ...prev,
                              registration: { ...prev.registration, showPhone: e.target.checked },
                            }))
                          }
                          className="accent-cyan-400"
                        />
                        <span>Exibir</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsDraft.registration.requirePhone}
                          onChange={(e) =>
                            setSettingsDraft((prev) => ({
                              ...prev,
                              registration: { ...prev.registration, requirePhone: e.target.checked },
                            }))
                          }
                          className="accent-cyan-400"
                        />
                        <span>Obrigatório</span>
                      </label>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-900 text-xs">
                    <span className="text-slate-300">Empresa / Organização</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsDraft.registration.showCompany}
                          onChange={(e) =>
                            setSettingsDraft((prev) => ({
                              ...prev,
                              registration: { ...prev.registration, showCompany: e.target.checked },
                            }))
                          }
                          className="accent-cyan-400"
                        />
                        <span>Exibir</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsDraft.registration.requireCompany}
                          onChange={(e) =>
                            setSettingsDraft((prev) => ({
                              ...prev,
                              registration: { ...prev.registration, requireCompany: e.target.checked },
                            }))
                          }
                          className="accent-cyan-400"
                        />
                        <span>Obrigatório</span>
                      </label>
                    </div>
                  </div>

                  {/* Cargo */}
                  <div className="flex items-center justify-between py-1 text-xs">
                    <span className="text-slate-300">Cargo / Função</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsDraft.registration.showCargo}
                          onChange={(e) =>
                            setSettingsDraft((prev) => ({
                              ...prev,
                              registration: { ...prev.registration, showCargo: e.target.checked },
                            }))
                          }
                          className="accent-cyan-400"
                        />
                        <span>Exibir</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsDraft.registration.requireCargo}
                          onChange={(e) =>
                            setSettingsDraft((prev) => ({
                              ...prev,
                              registration: { ...prev.registration, requireCargo: e.target.checked },
                            }))
                          }
                          className="accent-cyan-400"
                        />
                        <span>Obrigatório</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collected Leads Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Leads e Participantes Coletados ({registrations.length})
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Sincronizados na base de dados na nuvem para download e acompanhamento.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportCSV}
                      disabled={registrations.length === 0}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 transition disabled:opacity-40"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exportar CSV</span>
                    </button>

                    {onClearRegistrations && (
                      <button
                        onClick={() => {
                          if (confirm('Deseja excluir todos os leads gravados?')) {
                            onClearRegistrations();
                            showToast('Lista de participantes zerada.');
                          }
                        }}
                        className="px-2.5 py-1.5 text-xs text-rose-300 bg-rose-950/70 border border-rose-800 rounded-lg hover:bg-rose-900"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>

                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/70">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-mono-code uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Nome</th>
                        <th className="py-2.5 px-3">Contato</th>
                        <th className="py-2.5 px-3">Empresa / Cargo</th>
                        <th className="py-2.5 px-3 text-right">Data</th>
                        {onDeleteRegistration && <th className="py-2.5 px-3 text-center">Ação</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {registrations.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-500">
                            Nenhum participante registrado até o momento.
                          </td>
                        </tr>
                      ) : (
                        registrations.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-900/50">
                            <td className="py-2 px-3 font-semibold text-white">
                              {r.playerName}
                            </td>
                            <td className="py-2 px-3 text-slate-300 font-mono-code text-[11px]">
                              {r.email && <div>{r.email}</div>}
                              {r.phone && <div className="text-slate-400">{r.phone}</div>}
                            </td>
                            <td className="py-2 px-3 text-slate-300">
                              {r.company && <div>{r.company}</div>}
                              {r.cargo && <div className="text-slate-400 text-[11px]">{r.cargo}</div>}
                            </td>
                            <td className="py-2 px-3 text-right text-slate-400 font-mono-code text-[11px]">
                              {new Date(r.createdAt).toLocaleDateString('pt-PT')}
                            </td>
                            {onDeleteRegistration && (
                              <td className="py-2 px-3 text-center">
                                <button
                                  onClick={() => {
                                    onDeleteRegistration(r.id);
                                    showToast(`Participante ${r.playerName} removido.`);
                                  }}
                                  className="p-1 text-rose-400 hover:text-rose-200"
                                  title="Remover"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Editor de Fases */}
          {activeTab === 'levels' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                    Configuração de Dificuldade de Cada Fase
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ajuste o tempo de permanência, tamanho, quantidade de alvos e taxa de armadilhas.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSettingsDraft((prev) => ({ ...prev, customLevelConfigs: {} }));
                    showToast('Todas as fases foram restauradas para os padrões originais.');
                  }}
                  className="px-3 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                >
                  Restaurar Todas as Fases
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LEVELS.map((lvl) => {
                  const custom = settingsDraft.customLevelConfigs[lvl.id] || {};
                  const duration = custom.baseDurationMs ?? lvl.baseDurationMs;
                  const size = custom.targetSize ?? lvl.targetSize;
                  const count = custom.targetCount ?? lvl.targetCount;
                  const trapChance = custom.trapChance ?? lvl.trapChance;
                  const moving = custom.movingTargets ?? lvl.movingTargets;

                  const isModified = Boolean(settingsDraft.customLevelConfigs[lvl.id]);

                  return (
                    <div
                      key={lvl.id}
                      className={`p-4 rounded-xl border transition ${
                        isModified
                          ? 'bg-slate-900/90 border-cyan-500/50 shadow-md'
                          : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-800 flex items-center justify-center text-xs font-bold font-mono-code text-cyan-400">
                            {lvl.id}
                          </span>
                          <span className="text-xs font-bold text-white font-display">
                            {lvl.name}
                          </span>
                        </div>

                        {isModified && (
                          <button
                            onClick={() => handleResetLevel(lvl.id)}
                            className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Padrão
                          </button>
                        )}
                      </div>

                      {/* Sliders Grid */}
                      <div className="space-y-3 text-xs">
                        {/* Duration Slider */}
                        <div>
                          <div className="flex justify-between text-slate-300 mb-1">
                            <span>Tempo de Exposição:</span>
                            <span className="font-mono-code font-bold text-cyan-400">{duration}ms</span>
                          </div>
                          <input
                            type="range"
                            min="250"
                            max="2000"
                            step="25"
                            value={duration}
                            onChange={(e) =>
                              handleUpdateLevelField(lvl.id, 'baseDurationMs', Number(e.target.value))
                            }
                            className="w-full accent-cyan-400 cursor-pointer"
                          />
                        </div>

                        {/* Size Slider */}
                        <div>
                          <div className="flex justify-between text-slate-300 mb-1">
                            <span>Tamanho dos Alvos:</span>
                            <span className="font-mono-code font-bold text-emerald-400">{size}px</span>
                          </div>
                          <input
                            type="range"
                            min="35"
                            max="110"
                            step="2"
                            value={size}
                            onChange={(e) =>
                              handleUpdateLevelField(lvl.id, 'targetSize', Number(e.target.value))
                            }
                            className="w-full accent-emerald-400 cursor-pointer"
                          />
                        </div>

                        {/* Count & Traps */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div>
                            <span className="text-[11px] text-slate-400 block mb-1">Qtd. Alvos:</span>
                            <input
                              type="number"
                              min="5"
                              max="60"
                              value={count}
                              onChange={(e) =>
                                handleUpdateLevelField(lvl.id, 'targetCount', Number(e.target.value))
                              }
                              className="w-full px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono-code"
                            />
                          </div>

                          <div>
                            <span className="text-[11px] text-slate-400 block mb-1">Armadilhas:</span>
                            <select
                              value={Math.round(trapChance * 100)}
                              onChange={(e) =>
                                handleUpdateLevelField(lvl.id, 'trapChance', Number(e.target.value) / 100)
                              }
                              className="w-full px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono-code"
                            >
                              <option value="0">0% (Sem Bombas)</option>
                              <option value="10">10%</option>
                              <option value="20">20%</option>
                              <option value="30">30%</option>
                              <option value="40">40%</option>
                              <option value="50">50%</option>
                            </select>
                          </div>
                        </div>

                        {/* Moving toggle */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-400">Alvos em Movimento:</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateLevelField(lvl.id, 'movingTargets', !moving)}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              moving
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {moving ? 'Ativado' : 'Desativado'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Cenário da Divisão & Alvos */}
          {activeTab === 'image' && (
            <div className="space-y-5">
              {/* Arena Scene Mode Selector */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider font-display">
                    Cenário do Jogo na Arena
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Escolha entre a divisão da casa com pragas (sofás, cadeirões, gato, pulgas, carraças, ovos e larvas) ou a arena clássica.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSettingsDraft((prev) => ({
                        ...prev,
                        sceneConfig: {
                          ...prev.sceneConfig,
                          mode: 'living_room_pests',
                        },
                      }))
                    }
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                      settingsDraft.sceneConfig?.mode === 'living_room_pests'
                        ? 'bg-cyan-950/50 border-cyan-400 shadow-md'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={settingsDraft.sceneConfig?.customBackgroundUrl || livingRoomCatImg}
                      alt="Sala com gato"
                      className="w-16 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">
                        Sala com Gato & Pragas
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Pulgas, carraças, ovos e larvas aparecem nos sofás, cadeirões e perto do gato.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSettingsDraft((prev) => ({
                        ...prev,
                        sceneConfig: {
                          ...prev.sceneConfig,
                          mode: 'classic',
                        },
                      }))
                    }
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                      settingsDraft.sceneConfig?.mode === 'classic'
                        ? 'bg-cyan-950/50 border-cyan-400 shadow-md'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-16 h-12 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-cyan-400 font-display font-black text-xs">
                      NEON
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        Arena Clássica / Alvo Livre
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Alvos geométricos neon ou imagem personalizada carregada abaixo.
                      </div>
                    </div>
                  </button>
                </div>

                {/* Living room pest options */}
                {settingsDraft.sceneConfig?.mode === 'living_room_pests' && (
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">
                        Pragas ativas para eliminar na sala:
                      </span>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsDraft.sceneConfig?.showPestLabels !== false}
                          onChange={(e) =>
                            setSettingsDraft((prev) => ({
                              ...prev,
                              sceneConfig: {
                                ...prev.sceneConfig,
                                showPestLabels: e.target.checked,
                              },
                            }))
                          }
                          className="accent-cyan-400"
                        />
                        <span>Mostrar nome da praga no alvo</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['flea', 'tick', 'flea_egg', 'flea_larva'] as PestKind[]).map((kind) => {
                        const active = settingsDraft.sceneConfig?.enabledPests?.[kind] !== false;
                        return (
                          <label
                            key={kind}
                            className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition ${
                              active
                                ? 'bg-slate-900 border-cyan-500/50 text-white'
                                : 'bg-slate-950/60 border-slate-800 text-slate-500'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={(e) =>
                                setSettingsDraft((prev) => ({
                                  ...prev,
                                  sceneConfig: {
                                    ...prev.sceneConfig,
                                    enabledPests: {
                                      ...prev.sceneConfig.enabledPests,
                                      [kind]: e.target.checked,
                                    },
                                  },
                                }))
                              }
                              className="accent-cyan-400"
                            />
                            <div className="w-6 h-6 shrink-0">
                              <PestSprite pestKind={kind} showLabel={false} />
                            </div>
                            <span className="text-[11px] font-semibold truncate">
                              {PEST_META[kind].label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Substituir Alvos por Imagem Personalizada</span>
                    {settingsDraft.customImageMandatory && (
                      <span className="px-1.5 py-0.2 bg-cyan-400 text-slate-950 text-[9px] font-bold rounded">
                        OBRIGATÓRIA
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Quando ativado, todos os usuários jogarão com a imagem definida pelo administrador.
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={settingsDraft.customImageMandatory}
                  onChange={(e) =>
                    setSettingsDraft((prev) => ({ ...prev, customImageMandatory: e.target.checked }))
                  }
                  className="w-5 h-5 accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Preview */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-4">
                <div
                  className="relative w-20 h-20 rounded-full overflow-hidden flex items-center justify-center border-2 shadow-xl"
                  style={{
                    borderColor: settingsDraft.customTargetImage.customBorderColor || '#22d3ee',
                    boxShadow: `0 0 20px ${settingsDraft.customTargetImage.customBorderColor || '#22d3ee'}88`,
                    backgroundColor: '#050b14',
                  }}
                >
                  {settingsDraft.customTargetImage.imageUrl ? (
                    <img
                      src={settingsDraft.customTargetImage.imageUrl}
                      alt="Alvo do Admin"
                      className={`w-full h-full ${
                        settingsDraft.customTargetImage.shapeFit === 'contain' ? 'object-contain p-1' : 'object-cover'
                      }`}
                    />
                  ) : (
                    <span className="text-[10px] text-slate-500 text-center font-mono-code">
                      Sem Imagem
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-xs font-bold text-white">Imagem Atual do Alvo Master</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {settingsDraft.customTargetImage.imageUrl
                      ? settingsDraft.customTargetImage.imageName || 'Imagem Carregada'
                      : 'Nenhuma imagem configurada.'}
                  </div>
                  {settingsDraft.customTargetImage.imageUrl && (
                    <button
                      onClick={() =>
                        setSettingsDraft((prev) => ({
                          ...prev,
                          customTargetImage: {
                            ...prev.customTargetImage,
                            imageUrl: '',
                            enabled: false,
                          },
                        }))
                      }
                      className="mt-2 text-rose-400 text-xs hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remover Imagem
                    </button>
                  )}
                </div>
              </div>

              {/* Upload file */}
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
                <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Upload de Arquivo Local para o Alvo</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-4 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition border border-cyan-400/40"
                >
                  Selecionar Foto / Imagem do Computador
                </button>
              </div>

              {/* Paste URL */}
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
                <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span>Definir Imagem por Link (URL da Web)</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://exemplo.com/alvo.png"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                  <button
                    onClick={handleApplyUrl}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Imagem de Fim de Jogo */}
          {activeTab === 'endgame' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Imagem e Banner de Fim de Jogo (Tela de Encerramento)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Esta imagem é exibida com destaque quando a partida termina, acompanhada da pontuação, tempo de reação alcançado e botão para começar de novo.
                </p>
              </div>

              {/* Toggle Enable */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Exibir Imagem Personalizada no Fim de Jogo</span>
                    {settingsDraft.endGameImage.enabled && (
                      <span className="px-1.5 py-0.2 bg-emerald-400 text-slate-950 text-[9px] font-bold rounded">
                        ATIVADA
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Quando ativado, a imagem configurada será apresentada na tela de encerramento para todos os jogadores.
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={settingsDraft.endGameImage.enabled}
                  onChange={(e) =>
                    setSettingsDraft((prev) => ({
                      ...prev,
                      endGameImage: {
                        ...prev.endGameImage,
                        enabled: e.target.checked,
                      },
                    }))
                  }
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Live Preview Card */}
              <div className="p-5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono-code uppercase font-bold text-slate-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Pré-Visualização ao Vivo da Tela de Fim de Jogo</span>
                  </div>
                  {settingsDraft.endGameImage.imageUrl && (
                    <button
                      onClick={() => {
                        setSettingsDraft((prev) => ({
                          ...prev,
                          endGameImage: {
                            ...prev.endGameImage,
                            imageUrl: '',
                            imageName: '',
                          },
                        }));
                        showToast('Imagem de fim de jogo removida.');
                      }}
                      className="text-xs text-rose-400 hover:text-rose-200 flex items-center gap-1 hover:underline"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remover Imagem</span>
                    </button>
                  )}
                </div>

                <div 
                  className="p-5 rounded-xl border border-slate-700/80 bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-xl max-w-lg mx-auto flex flex-col items-center text-center space-y-3"
                  style={{
                    boxShadow: `0 0 30px ${settingsDraft.branding.primaryColor}25`,
                  }}
                >
                  {/* Image display */}
                  {settingsDraft.endGameImage.imageUrl ? (
                    <div className="w-full relative rounded-xl overflow-hidden border border-slate-700 max-h-56 bg-slate-950 flex items-center justify-center shadow-lg">
                      <img
                        src={settingsDraft.endGameImage.imageUrl}
                        alt="Fim de jogo"
                        className="w-full h-auto max-h-56 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center p-4 bg-slate-900/40 text-slate-500">
                      <ImageIcon className="w-8 h-8 mb-1 text-slate-600" />
                      <span className="text-xs font-semibold">Nenhuma imagem carregada</span>
                      <span className="text-[10px] text-slate-600">Carregue um banner ou foto abaixo</span>
                    </div>
                  )}

                  {/* Headline */}
                  <div className="text-base font-display font-black text-white">
                    {settingsDraft.endGameImage.headline || 'Parabéns pelo Desafio!'}
                  </div>

                  {/* Subheadline */}
                  <div className="text-xs text-slate-400 max-w-xs">
                    {settingsDraft.endGameImage.subheadline || 'Obrigado por participar! Veja a sua pontuação e tempo de reação abaixo.'}
                  </div>

                  {/* Dummy Stats Preview */}
                  <div className="grid grid-cols-2 gap-2 w-full pt-1">
                    <div className="p-2 bg-slate-950/70 border border-slate-800 rounded-lg text-center">
                      <div className="text-[9px] uppercase font-mono-code text-slate-400">Tempo Médio</div>
                      <div className="text-sm font-bold text-cyan-400 font-mono-code">218ms</div>
                    </div>
                    <div className="p-2 bg-slate-950/70 border border-slate-800 rounded-lg text-center">
                      <div className="text-[9px] uppercase font-mono-code text-slate-400">Pontuação</div>
                      <div className="text-sm font-bold text-amber-400 font-display">24.500</div>
                    </div>
                  </div>

                  {/* Dummy CTA button */}
                  <button 
                    type="button"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold font-display uppercase tracking-wider text-slate-950 shadow-md transition"
                    style={{ backgroundColor: settingsDraft.branding.primaryColor }}
                  >
                    {settingsDraft.endGameImage.ctaText || 'Começar Novamente'}
                  </button>
                </div>
              </div>

              {/* Upload image controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Upload */}
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Upload de Arquivo (PNG, JPG, WebP)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Selecione um arquivo de imagem do seu computador ou dispositivo.
                  </p>
                  <input
                    ref={endGameFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleEndGameFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => endGameFileInputRef.current?.click()}
                    className="w-full py-2 px-4 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition border border-cyan-400/40"
                  >
                    Selecionar Imagem do Computador
                  </button>
                </div>

                {/* Direct URL */}
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span>Definir Imagem por Link (URL)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Insira a URL direta da imagem hospedada na web.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={endGameUrlInput}
                      onChange={(e) => setEndGameUrlInput(e.target.value)}
                      placeholder="https://exemplo.com/fim-de-jogo.png"
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                    />
                    <button
                      type="button"
                      onClick={handleApplyEndGameUrl}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>

              {/* Text Customization Fields */}
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider font-display">
                  Textos da Tela de Encerramento
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Título Principal (Headline):</label>
                    <input
                      type="text"
                      value={settingsDraft.endGameImage.headline ?? ''}
                      onChange={(e) =>
                        setSettingsDraft((prev) => ({
                          ...prev,
                          endGameImage: {
                            ...prev.endGameImage,
                            headline: e.target.value,
                          },
                        }))
                      }
                      placeholder="Ex: Parabéns pelo Desafio!"
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Texto do Botão de Reiniciar (CTA):</label>
                    <input
                      type="text"
                      value={settingsDraft.endGameImage.ctaText ?? ''}
                      onChange={(e) =>
                        setSettingsDraft((prev) => ({
                          ...prev,
                          endGameImage: {
                            ...prev.endGameImage,
                            ctaText: e.target.value,
                          },
                        }))
                      }
                      placeholder="Ex: Jogar Novamente / Começar"
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Subtítulo / Mensagem para o Jogador:</label>
                  <textarea
                    rows={2}
                    value={settingsDraft.endGameImage.subheadline ?? ''}
                    onChange={(e) =>
                      setSettingsDraft((prev) => ({
                        ...prev,
                        endGameImage: {
                          ...prev.endGameImage,
                          subheadline: e.target.value,
                        },
                      }))
                    }
                    placeholder="Ex: Obrigado por participar! Consulte a sua pontuação e tempo de reação."
                    className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Gestão do Ranking */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                    Gerenciador de Placar & Recordes Mundiais
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Modere recordes, remova trapaceiros ou reinicie o ranking para um novo campeonato.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm('Zerar todas as pontuações e iniciar um novo torneio do zero?')) {
                        onClearLeaderboard();
                        showToast('Ranking global zerado para novo torneio!');
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/70 border border-rose-800 hover:bg-rose-900 rounded-lg transition"
                  >
                    Zerar Todo o Ranking
                  </button>

                  <button
                    onClick={() => {
                      onRestoreLeaderboard();
                      showToast('Recordes padrão restaurados com sucesso.');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                  >
                    Restaurar Padrão
                  </button>
                </div>
              </div>

              {/* Table of entries */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/70">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-mono-code uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Jogador</th>
                      <th className="py-2.5 px-3 text-right">Pontuação</th>
                      <th className="py-2.5 px-3 text-right">Tempo Médio</th>
                      <th className="py-2.5 px-3 text-center">Fase</th>
                      <th className="py-2.5 px-3 text-center">Data</th>
                      <th className="py-2.5 px-3 text-center">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {leaderboardEntries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-500">
                          Nenhum recorde registrado no momento.
                        </td>
                      </tr>
                    ) : (
                      leaderboardEntries.map((e) => (
                        <tr key={e.id} className="hover:bg-slate-900/50">
                          <td className="py-2 px-3 font-semibold text-white flex items-center gap-2">
                            <span>{e.country}</span>
                            <span>{e.playerName}</span>
                            {e.isUser && (
                              <span className="text-[9px] bg-cyan-950 text-cyan-400 px-1 rounded border border-cyan-800">
                                VOCÊ
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-display font-bold text-white">
                            {e.score.toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-right font-mono-code text-cyan-400">
                            {e.averageReactionMs}ms
                          </td>
                          <td className="py-2 px-3 text-center font-mono-code text-slate-400">
                            {e.levelId === 'all' ? 'Geral' : `Fase ${e.levelId}`}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-400 font-mono-code">
                            {e.date}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => {
                                onDeleteLeaderboardEntry(e.id);
                                showToast(`Recorde de ${e.playerName} excluído.`);
                              }}
                              className="p-1 text-rose-400 hover:text-rose-200 hover:bg-rose-950/80 rounded transition"
                              title="Excluir recorde"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: Segurança & Senha Mestra */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              {/* Lock Entire App with Password */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Bloquear Todo o Aplicativo com Senha (Modo Kiosk)</span>
                    {settingsDraft.lockEntireAppWithPassword && (
                      <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 text-[9px] font-bold rounded">
                        BLOQUEIO ATIVO
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Exige que qualquer pessoa insira a senha mestra para jogar ou visualizar o app.
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={settingsDraft.lockEntireAppWithPassword}
                  onChange={(e) =>
                    setSettingsDraft((prev) => ({
                      ...prev,
                      lockEntireAppWithPassword: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Tournament Mode */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Modo Torneio Competitivo Oficial</span>
                    {settingsDraft.tournamentMode && (
                      <span className="px-1.5 py-0.2 bg-cyan-400 text-slate-950 text-[9px] font-bold rounded">
                        TORNEIO ATIVO
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Desativa cheats de sandbox durante partidas para garantir integridade competitiva.
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={settingsDraft.tournamentMode}
                  onChange={(e) =>
                    setSettingsDraft((prev) => ({
                      ...prev,
                      tournamentMode: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Change Password Form */}
              <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5 font-display">
                  <Key className="w-4 h-4 text-cyan-400" />
                  <span>Alterar Senha Mestra do Administrador</span>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Senha Atual:</label>
                    <div className="relative">
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Digite a senha atual..."
                        className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Nova Senha:</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 4 caracteres..."
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Confirmar Nova Senha:</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a nova senha..."
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  {passwordError && (
                    <div className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="text-xs text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Senha atualizada com sucesso!</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
                  >
                    Atualizar Senha Mestra
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2 text-xs pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <span className="text-slate-400 font-mono-code text-[10px] sm:text-[11px]">
            Atalho: <strong className="text-cyan-400">ALT + C</strong> · Mobile:{' '}
            <strong className="text-cyan-400">5 toques / segurar logo</strong>
          </span>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition"
            >
              Fechar Painel
            </button>
            <button
              onClick={handleSaveAll}
              className="px-5 py-2 font-bold text-slate-950 rounded-xl transition shadow-lg active:scale-95"
              style={{
                backgroundColor: settingsDraft.branding.primaryColor,
                boxShadow: `0 0 15px ${settingsDraft.branding.primaryColor}55`,
              }}
            >
              Salvar Tudo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
