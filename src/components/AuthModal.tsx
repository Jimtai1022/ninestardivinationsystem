import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../lib/i18n';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { registerUser, loginUser, signInWithGoogle, language } = useAuth();
  const t = getTranslation(language);

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pdpaAgreed, setPdpaAgreed] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+60 12-');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'paid'>('customer');

  if (!isOpen) return null;

  // Handle User Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail.trim()) {
      setErrorMessage(language === 'zh' ? '请输入您的注册邮箱' : 'Please enter your email');
      return;
    }
    if (!loginPassword) {
      setErrorMessage(language === 'zh' ? '请输入登录密码' : 'Please enter your password');
      return;
    }

    setLoading(true);
    try {
      await loginUser(loginEmail, loginPassword);
      setSuccessMessage(language === 'zh' ? '登录成功！正在进入...' : 'Login successful! Redirecting...');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || (language === 'zh' ? '登录失败，请检查账号密码' : 'Login failed, check credentials'));
    } finally {
      setLoading(false);
    }
  };

  // Handle User Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!pdpaAgreed) {
      setErrorMessage(language === 'zh' ? '请勾选同意隐私政策与服务条款' : 'Please agree to the privacy terms');
      return;
    }
    if (!regName.trim()) {
      setErrorMessage(language === 'zh' ? '请输入您的姓名或称谓' : 'Please enter your name');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage(language === 'zh' ? '请输入有效的电子邮箱' : 'Please enter a valid email');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage(language === 'zh' ? '密码长度至少需 6 位字符' : 'Password must be at least 6 characters');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage(language === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        role: selectedRole,
      });
      setSuccessMessage(
        language === 'zh'
          ? `注册成功！您已获得【${selectedRole === 'paid' ? '付费 VIP 专席' : '标准客户'}】权限。`
          : 'Registration successful!'
      );
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || (language === 'zh' ? '注册失败，请稍后重试' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign In / Registration
  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    if (!pdpaAgreed) {
      setErrorMessage(language === 'zh' ? '请勾选同意隐私政策与服务条款' : 'Please agree to the privacy terms');
      return;
    }
    setLoading(true);
    try {
      await signInWithGoogle(activeTab === 'register' ? selectedRole : undefined);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || (language === 'zh' ? 'Google 认证未完成' : 'Google sign-in incomplete'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1e25]/65 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-[#bec8cb]/30 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Top subtle teal accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#006673]/30 via-[#006673] to-[#006673]/30"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f4faff] hover:bg-[#d9ebf5] flex items-center justify-center text-[#3e484b] hover:text-[#0d1e25] transition-colors"
          title="关闭"
        >
          ✕
        </button>

        {/* Header Title */}
        <div className="text-center mb-5 mt-1">
          <div className="w-12 h-12 rounded-2xl bg-[#dff1fb] text-[#006673] flex items-center justify-center mx-auto mb-2.5 shadow-inner">
            <span className="material-symbols-outlined text-[28px]">lock</span>
          </div>
          <h2 className="text-[22px] font-bold text-[#0d1e25] tracking-tight">
            {language === 'zh' ? '九星牌卦 · 用户服务通道' : 'Nine Star Consult · User Portal'}
          </h2>
          <p className="text-[12px] text-[#3e484b] mt-0.5">
            {language === 'zh'
              ? '请注册或登录您的个人账号以开启端到端加密案卷与权限'
              : 'Please sign in or register to access your personal dossier'}
          </p>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex rounded-xl bg-[#dff1fb] p-1 mb-5 text-[13px] font-medium">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-[#006673] font-bold shadow-sm'
                : 'text-[#3e484b] hover:text-[#0d1e25]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span>{language === 'zh' ? '账号登录' : 'Sign In'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-[#006673] font-bold shadow-sm'
                : 'text-[#3e484b] hover:text-[#0d1e25]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>{language === 'zh' ? '注册新用户' : 'Register'}</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#ffdad6] border border-[#ffb4ab] text-[#93000a] text-[12px] flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#eff9f0] border border-[#a1dbb2] text-[#1b7e3f] text-[12px] flex items-start gap-2 font-medium">
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">check_circle</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: Real User Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-[12px] font-bold text-[#0d1e25] mb-1">
                {language === 'zh' ? '电子邮箱 (Email)' : 'Email'}
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="marcus.tan@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#bec8cb]/50 focus:border-[#006673] focus:ring-2 focus:ring-[#006673]/20 text-[13px] text-[#0d1e25] outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#0d1e25] mb-1">
                {language === 'zh' ? '登录密码 (Password)' : 'Password'}
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#bec8cb]/50 focus:border-[#006673] focus:ring-2 focus:ring-[#006673]/20 text-[13px] text-[#0d1e25] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#006673] hover:bg-[#1d808f] text-white font-bold text-[14px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
            >
              <span>{loading ? '正在验证登录...' : language === 'zh' ? '立即登录' : 'Sign In'}</span>
            </button>

            <div className="relative flex py-1.5 items-center">
              <div className="flex-grow border-t border-[#bec8cb]/30"></div>
              <span className="flex-shrink mx-3 text-[11px] text-[#6e797b]">或</span>
              <div className="flex-grow border-t border-[#bec8cb]/30"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
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
              <span>{language === 'zh' ? '使用 Google 账号直接登录' : 'Continue with Google'}</span>
            </button>
          </form>
        )}

        {/* TAB 2: Real User Registration Form with Role Assignment */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-[12px] font-bold text-[#0d1e25] mb-1">
                {language === 'zh' ? '您的真实姓名 / 称呼 *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder={language === 'zh' ? '如：张子涵 / Marcus Tan' : 'e.g. Marcus Tan'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#bec8cb]/50 focus:border-[#006673] focus:ring-2 focus:ring-[#006673]/20 text-[13px] text-[#0d1e25] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[12px] font-bold text-[#0d1e25] mb-1">
                  {language === 'zh' ? '电子邮箱 (Email) *' : 'Email *'}
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#bec8cb]/50 focus:border-[#006673] focus:ring-2 focus:ring-[#006673]/20 text-[13px] text-[#0d1e25] outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#0d1e25] mb-1">
                  {language === 'zh' ? '联系手机 (+60 大马格式)' : 'Phone (+60)'}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[12px] font-bold text-[#0d1e25] mb-1">
                  {language === 'zh' ? '设置密码 *' : 'Password *'}
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
                  {language === 'zh' ? '确认密码 *' : 'Confirm *'}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#bec8cb]/50 focus:border-[#006673] focus:ring-2 focus:ring-[#006673]/20 text-[13px] text-[#0d1e25] outline-none"
                />
              </div>
            </div>

            {/* Role Selection Box */}
            <div className="pt-1">
              <label className="block text-[12px] font-bold text-[#0d1e25] mb-1.5">
                {language === 'zh' ? '选择注册会员权限类型 (Account Role) *' : 'Select Account Role *'}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedRole('customer')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedRole === 'customer'
                      ? 'bg-[#dff1fb] border-[#006673] text-[#006673] shadow-sm'
                      : 'bg-white border-[#bec8cb]/40 text-[#3e484b] hover:bg-[#f8fbfe]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold">标准客户 (Free)</span>
                    {selectedRole === 'customer' && (
                      <span className="material-symbols-outlined text-[16px] text-[#006673]">
                        check_circle
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#3f6376] mt-1 leading-tight">
                    体验流年大势与事业/财富 2 宫简评
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('paid')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedRole === 'paid'
                      ? 'bg-[#c3e8ff] border-[#006673] text-[#006673] shadow-sm'
                      : 'bg-white border-[#bec8cb]/40 text-[#3e484b] hover:bg-[#f8fbfe]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold">付费 VIP 专席</span>
                    {selectedRole === 'paid' && (
                      <span className="material-symbols-outlined text-[16px] text-[#006673]">
                        check_circle
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#3f6376] mt-1 leading-tight">
                    解锁 8 宫全量深度、36 牌阵与追问特权
                  </p>
                </button>
              </div>
            </div>

            {/* PDPA Compliance Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="auth-pdpa"
                checked={pdpaAgreed}
                onChange={(e) => setPdpaAgreed(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 rounded accent-[#006673] cursor-pointer"
              />
              <label htmlFor="auth-pdpa" className="text-[11px] text-[#3e484b] leading-tight select-none cursor-pointer">
                {t.pdpaConsentText}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#006673] hover:bg-[#1d808f] text-white font-bold text-[14px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
            >
              <span>
                {loading
                  ? '正在创建加密档案...'
                  : language === 'zh'
                  ? `确认注册并获得【${selectedRole === 'paid' ? 'VIP' : '客户'}】权限`
                  : 'Complete Registration'}
              </span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#bec8cb]/30"></div>
              <span className="flex-shrink mx-3 text-[11px] text-[#6e797b]">或</span>
              <div className="flex-grow border-t border-[#bec8cb]/30"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-2 px-4 rounded-xl border border-[#bec8cb]/50 hover:border-[#006673] bg-[#f4faff] hover:bg-white text-[#0d1e25] font-semibold text-[12px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
              <span>{language === 'zh' ? '使用 Google 快捷注册此身份' : 'Quick register with Google'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
