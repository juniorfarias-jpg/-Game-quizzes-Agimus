import React, { useState, useRef } from 'react';
import { 
  AppAdminSettings, 
  LevelConfig, 
  CustomTargetImageConfig, 
  LeaderboardEntry 
} from '../types/game';
import { LEVELS } from '../utils/levels';
import { updateAdminPassword } from '../utils/adminStorage';
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
  Sparkles 
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
}) => {
  const [activeTab, setActiveTab] = useState<'levels' | 'image' | 'leaderboard' | 'security'>('levels');
  const [settingsDraft, setSettingsDraft] = useState<AppAdminSettings>(adminSettings);
  const [notification, setNotification] = useState<string | null>(null);

  // Password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveAll = () => {
    onSaveAdminSettings(settingsDraft);
    showToast('Configurações salvas e aplicadas em todo o aplicativo!');
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
    showToast(`Fase ${levelId} restaurada para os valores padrão de fábrica.`);
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
    setSettingsDraft((prev) => ({ ...prev, passwordHash: newPassword }));
    onSaveAdminSettings({ ...adminSettings, passwordHash: newPassword });
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#090e1a] border-2 border-cyan-500/60 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.25)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-display font-black text-white tracking-wide">
                  Central do Modo Administrador
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/60 text-[10px] font-mono-code font-bold text-emerald-400">
                  ADMIN ATIVO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configuração mestre das fases, imagem dos alvos, ranking global e segurança.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAll}
              className="px-3.5 py-1.5 flex items-center gap-1.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition shadow-[0_0_12px_rgba(34,211,238,0.3)] active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar Alterações
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 rounded-lg transition"
              title="Sair do Modo Administrador"
            >
              Sair (Logout)
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="mx-4 mt-3 p-2.5 bg-emerald-950/90 border border-emerald-500/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-pulse">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-4 pt-3 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto">
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
            <span>Imagem Global do Alvo</span>
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
            <span>Segurança & Senha Mestra</span>
          </button>
        </div>

        {/* Tab Contents (Scrollable) */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* TAB 1: Editor de Fases */}
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

          {/* TAB 2: Imagem Global do Alvo */}
          {activeTab === 'image' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Tornar Imagem Obrigatória para Todos os Jogadores</span>
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

          {/* TAB 3: Gestão do Ranking */}
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

          {/* TAB 4: Segurança & Senha Mestra */}
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
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono-code text-[11px]">
            Atalho rápido do Admin: <strong className="text-cyan-400">ALT + C</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition"
            >
              Fechar Painel
            </button>
            <button
              onClick={handleSaveAll}
              className="px-5 py-2 font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            >
              Salvar Tudo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
