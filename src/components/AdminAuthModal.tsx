import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminSlotConfig } from '../types';
import {
  getAdminSlotConfig,
  claimAdminSlot,
  loginAdminWithEmailPassword,
  loginAdminWithGoogle,
} from '../lib/adminService';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { setUserProfile, language } = useAuth();
  const [slotConfig, setSlotConfig] = useState<AdminSlotConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+60 12-');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load slot configuration whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setLoadingConfig(true);
      getAdminSlotConfig()
        .then((config) => {
          setSlotConfig(config);
          // If slot is unclaimed, automatically default to the registration tab so they can claim their slot!
          if (!config.isClaimed) {
            setActiveTab('register');
          } else {
            setActiveTab('login');
            if (config.adminEmail) {
              setLoginEmail(config.adminEmail);
            }
          }
        })
        .catch((err) => {
          console.warn('Load slot config error:', err);
        })
        .finally(() => {
          setLoadingConfig(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle single-slot admin registration
  const handleClaimSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Strict validation
    if (slotConfig?.isClaimed) {
      setErrorMessage('系统唯一管理员席位已被占用，不再接受任何新的管理员注册申请！');
      return;
    }
    if (!regName.trim()) {
      setErrorMessage('请输入管理员真实姓名或督导称谓。');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('请输入有效的管理员电子邮箱。');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('管理员密码长度至少需 6 位字符以确保安全。');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('两次输入的密码不一致，请重新核对。');
      return;
    }

    setSubmitting(true);
    try {
      const res = await claimAdminSlot({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
      });

      setUserProfile(res.user);
      setSlotConfig(res.config);
      setSuccessMessage('🎉 恭喜！您已成功激活并绑定系统唯一管理员席位。注册通道已永久锁定。');

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || '创建管理员账号失败，请重试。');
    } finally {
      setSubmitting(false);
    }
  };

  // Google OAuth slot activation
  const handleGoogleClaimSlot = async () => {
    setErrorMessage(null);
    if (slotConfig?.isClaimed) {
      setErrorMessage('系统唯一管理员席位已被占用，禁止重复注册！');
      return;
    }
    setSubmitting(true);
    try {
      const res = await claimAdminSlot({
        name: '系统最高管理员',
        email: 'khimfatttai@gmail.com',
        phone: regPhone || '+60 12-888 8888',
        isGoogle: true,
      });
      setUserProfile(res.user);
      setSlotConfig(res.config);
      setSuccessMessage('🎉 唯一管理员席位激活成功！正在进入后台...');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google 激活失败，请尝试密码注册。');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail.trim()) {
      setErrorMessage('请输入管理员邮箱。');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('请输入管理员密码。');
      return;
    }

    setSubmitting(true);
    try {
      const adminUser = await loginAdminWithEmailPassword(loginEmail, loginPassword);
      setUserProfile(adminUser);
      setSuccessMessage('身份验证通过，正在载入管理工作台...');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || '管理员登录失败，请检查账号密码。');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Google Admin Login
  const handleGoogleAdminLogin = async () => {
    setErrorMessage(null);
    setSubmitting(true);
    try {
      const adminUser = await loginAdminWithGoogle();
      setUserProfile(adminUser);
      setSuccessMessage('Google 管理员认证成功，正在载入工作台...');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google 管理员验证未通过。');
    } finally {
      setSubmitting(false);
    }
  };

  const isSlotClaimed = slotConfig?.isClaimed ?? false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1e25]/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-[#bec8cb]/30 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Top Gold & Teal Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#006673] via-[#e5a93c] to-[#006673]"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f4faff] hover:bg-[#d9ebf5] flex items-center justify-center text-[#3e484b] hover:text-[#0d1e25] transition-colors"
          title="关闭"
        >
          ✕
        </button>

        {/* Header Badge */}
        <div className="text-center mb-5 mt-1">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#004f59] to-[#006673] text-white shadow-md mx-auto mb-3">
            <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
          </div>
          <h2 className="text-[22px] md:text-[24px] font-bold text-[#0d1e25] tracking-tight">
            九星牌卦 · 系统管理中心
          </h2>
          <p className="text-[12px] md:text-[13px] text-[#3e484b] mt-1">
            管理员专席认证通道 · 查看与管理全量用户档案
          </p>
        </div>

        {/* Single Slot Status Indicator Box */}
        <div className="mb-6 rounded-2xl p-4 border transition-all duration-200">
          {loadingConfig ? (
            <div className="flex items-center justify-center gap-2 py-1 text-[13px] text-[#3e484b]">
              <span className="animate-spin w-4 h-4 border-2 border-[#006673] border-t-transparent rounded-full"></span>
              <span>正在核验管理员席位状态...</span>
            </div>
          ) : !isSlotClaimed ? (
            <div className="bg-[#eff9f0] border border-[#a1dbb2] rounded-xl p-3.5 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#1b7e3f] text-[22px] shrink-0 mt-0.5">
                verified
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#1b7e3f]">
                    👑 唯一管理员席位：开放申请中 (1/1 席可用)
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#1b7e3f] text-white">
                    待激活
                  </span>
                </div>
                <p className="text-[11px] text-[#285e3a] mt-1 leading-relaxed">
                  系统当前尚未绑定管理员。您拥有专属资格注册成为<strong>系统唯一最高管理员</strong>。一旦完成注册，系统将即刻永久关闭注册通道，后续任何人都无法再创建管理员账号。
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-[#fff8ed] border border-[#f5c982] rounded-xl p-3.5 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#b47514] text-[22px] shrink-0 mt-0.5">
                lock
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#925c0e]">
                    🔒 管理员席位已锁定 (0 席可用)
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#b47514] text-white">
                    已锁死
                  </span>
                </div>
                <p className="text-[11px] text-[#794f10] mt-1 leading-relaxed">
                  系统已存在唯一管理员
                  {slotConfig?.adminEmail && (
                    <span className="font-mono font-semibold ml-1 underline">
                      ({slotConfig.adminEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3')})
                    </span>
                  )}
                  。系统遵循严格的单一管理员安全规则，已<strong>永久拒绝并关闭所有新管理员注册</strong>。仅限已授权管理员登录。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex rounded-xl bg-[#dff1fb] p-1 mb-6 text-[13px] font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-[#006673] font-bold shadow-sm'
                : 'text-[#3e484b] hover:text-[#0d1e25]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span>管理员登录</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (isSlotClaimed) {
                alert('系统唯一管理员席位已被占用，且系统已永久关闭注册！请使用已绑定的管理员账号登录。');
                return;
              }
              setActiveTab('register');
            }}
            className={`flex-1 py-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 ${
              isSlotClaimed
                ? 'text-[#859296] cursor-not-allowed opacity-60'
                : activeTab === 'register'
                ? 'bg-white text-[#006673] font-bold shadow-sm cursor-pointer'
                : 'text-[#3e484b] hover:text-[#0d1e25] cursor-pointer'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isSlotClaimed ? 'lock' : 'person_add'}
            </span>
            <span>{isSlotClaimed ? '注册通道已关闭 (0/1)' : '激活唯一席位 (1/1)'}</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#ffdad6] border border-[#ffb4ab] text-[#93000a] text-[12px] flex items-start gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#eff9f0] border border-[#a1dbb2] text-[#1b7e3f] text-[12px] flex items-start gap-2 animate-fadeIn font-medium">
            <span className="material-symbols-outlined text-[18px] shrink-0">check_circle</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab 1: Admin Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-[#0d1e25] mb-1.5">
                管理员账号邮箱 (Admin Email)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#6e797b]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@ninestar.my 或 Khimfatttai@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#bec8cb]/50 focus:border-[#006673] focus:ring-2 focus:ring-[#006673]/20 text-[14px] text-[#0d1e25] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#0d1e25] mb-1.5">
                管理员安全密码 (Password)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#6e797b]">
                  key
                </span>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#bec8cb]/50 focus:border-[#006673] focus:ring-2 focus:ring-[#006673]/20 text-[14px] text-[#0d1e25] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-[#006673] hover:bg-[#1d808f] text-white font-bold text-[14px] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>{submitting ? '正在验证管理员身份...' : '验证并进入管理后台'}</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#bec8cb]/30"></div>
              <span className="flex-shrink mx-3 text-[11px] text-[#6e797b] uppercase tracking-wider">
                或使用 OAuth 认证
              </span>
              <div className="flex-grow border-t border-[#bec8cb]/30"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAdminLogin}
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl border border-[#bec8cb]/50 hover:border-[#006673] bg-white hover:bg-[#f4faff] text-[#0d1e25] font-semibold text-[13px] shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>使用 Google 管理员账号快速认证</span>
            </button>
          </form>
        )}

        {/* Tab 2: Single-Slot Registration Form */}
        {activeTab === 'register' && (
          <div>
            {isSlotClaimed ? (
              <div className="py-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#fff0ed] text-[#ba1a1a] flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-[26px]">block</span>
                </div>
                <h3 className="text-[16px] font-bold text-[#0d1e25]">
                  注册通道已彻底关闭
                </h3>
                <p className="text-[12px] text-[#3e484b] max-w-sm mx-auto mt-2 leading-relaxed">
                  系统已被配置为仅支持单一最高管理员。当前席位已被绑定，无法创建第二个管理员账号。
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="mt-5 px-5 py-2 rounded-xl bg-[#006673] text-white text-[13px] font-bold shadow-sm hover:bg-[#1d808f]"
                >
                  前往管理员登录
                </button>
              </div>
            ) : (
              <form onSubmit={handleClaimSlot} className="space-y-3.5">
                <div>
                  <label className="block text-[12px] font-bold text-[#0d1e25] mb-1">
                    管理员姓名 / 称呼 (Full Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="如：陈总 / Master Lin"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#bec8cb]/50 focus:border-[#006673] focus:ring-2 focus:ring-[#006673]/20 text-[13px] text-[#0d1e25] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold text-[#0d1e25] mb-1">
                      管理员邮箱 (Admin Email) *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="Khimfatttai@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#bec8cb]/50 focus:border-[#006673] focus:ring-2 focus:ring-[#006673]/20 text-[13px] text-[#0d1e25] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#0d1e25] mb-1">
                      联系手机 (+60 大马格式)
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+60 12-888 8888"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#bec8cb]/50 focus:border-[#006673] focus:ring-2 focus:ring-[#006673]/20 text-[13px] text-[#0d1e25] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold text-[#0d1e25] mb-1">
                      设定安全密码 (Password) *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="至少 6 位字符"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#bec8cb]/50 focus:border-[#006673] focus:ring-2 focus:ring-[#006673]/20 text-[13px] text-[#0d1e25] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#0d1e25] mb-1">
                      确认密码 (Confirm) *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="再次确认密码"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#bec8cb]/50 focus:border-[#006673] focus:ring-2 focus:ring-[#006673]/20 text-[13px] text-[#0d1e25] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#006673] to-[#157a8a] text-white font-bold text-[14px] shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                    <span>
                      {submitting ? '正在创建并锁定席位...' : '立即激活唯一管理员账号 (锁定席位)'}
                    </span>
                  </button>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-[#bec8cb]/30"></div>
                  <span className="flex-shrink mx-3 text-[11px] text-[#6e797b]">或</span>
                  <div className="flex-grow border-t border-[#bec8cb]/30"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleClaimSlot}
                  disabled={submitting}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#bec8cb]/50 hover:border-[#006673] bg-[#f4faff] hover:bg-white text-[#0d1e25] font-semibold text-[13px] shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>使用 Google 账号激活此席位</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Security Notice Footer inside Modal */}
        <div className="mt-6 pt-4 border-t border-[#bec8cb]/20 flex items-center justify-between text-[11px] text-[#6e797b]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#006673]">security</span>
            单槽位访问控制 (Single Slot RBAC)
          </span>
          <span>Malaysian PDPA 2010 加密防护</span>
        </div>
      </div>
    </div>
  );
};
