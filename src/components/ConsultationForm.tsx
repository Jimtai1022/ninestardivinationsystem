import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConsultation } from '../context/ConsultationContext';
import { getTranslation } from '../lib/i18n';

interface ConsultationFormProps {
  onSuccessNavigate?: (consultationId: string) => void;
  onOpenAuthModal: () => void;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({
  onSuccessNavigate,
  onOpenAuthModal,
}) => {
  const { user, language } = useAuth();
  const { submitConsultation } = useConsultation();
  const t = getTranslation(language);

  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phone?.replace('+60 ', '') || '12-882 9134');
  const [question, setQuestion] = useState(
    '近期筹备在吉隆坡开展新合伙事业，但面临两家投资方选择与合伙人心态摇摆，想问测今年事业走向与最佳决策月份？'
  );
  const [agreed, setAgreed] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdId, setCreatedId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      onOpenAuthModal();
      return;
    }

    if (!agreed) {
      alert(language === 'zh' ? '请勾选同意隐私政策与服务条款' : 'Please agree to the privacy policy.');
      return;
    }

    if (question.length < 10) {
      alert(language === 'zh' ? '请至少输入 10 个字以详述问测背景' : 'Please provide at least 10 characters.');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = phone.startsWith('+60') ? phone : `+60 ${phone.trim()}`;
      const newId = await submitConsultation(name, fullPhone, question);
      setCreatedId(newId);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    setQuestion('');
  };

  return (
    <div
      id="consultation-form-card"
      className="relative bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-[#bec8cb]/20"
    >
      {/* Top Gradient Ambient Accent */}
      <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-[#006673]/30 via-[#006673] to-[#006673]/30 rounded-full"></div>

      {/* Card Header */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#bec8cb]/15">
        <div>
          <h2 className="text-[24px] font-bold text-[#0d1e25] tracking-tight">{t.startConsultation}</h2>
          <p className="text-[12px] text-[#3e484b] mt-0.5">{t.intakeSub}</p>
        </div>
        <span className="px-2.5 py-1 rounded-md bg-[#dff1fb] text-[#006673] text-[12px] font-semibold">
          {t.realtimeAccepting}
        </span>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Field 1: Name */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center justify-between text-[14px] font-medium text-[#0d1e25]" htmlFor="user-name">
            <span>
              {t.nameLabel} <span className="text-[#ba1a1a]">*</span>
            </span>
            <span className="text-[12px] text-[#6e797b]">{t.nameHint}</span>
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3e484b] text-[20px]">
              badge
            </span>
            <input
              id="user-name"
              type="text"
              required
              minLength={2}
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              className="w-full pl-11 pr-4 py-3 bg-[#f4faff] text-[#0d1e25] rounded-lg text-[15px] border border-[#bec8cb]/40 focus:border-[#006673] focus:bg-white outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Field 2: Malaysian Phone Number */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center justify-between text-[14px] font-medium text-[#0d1e25]" htmlFor="user-phone">
            <span>
              {t.phoneLabel} <span className="text-[#ba1a1a]">*</span>
            </span>
            <span className="text-[12px] text-[#6e797b]">{t.phoneHint}</span>
          </label>
          <div className="flex items-stretch rounded-lg border border-[#bec8cb]/40 focus-within:border-[#006673] overflow-hidden bg-[#f4faff] shadow-sm">
            <div className="flex items-center gap-1.5 px-3.5 py-3 bg-[#dff1fb] text-[#0d1e25] text-[15px] font-semibold shrink-0 select-none border-r border-[#bec8cb]/30">
              <span className="text-[14px]">🇲🇾</span>
              <span>+60</span>
            </div>
            <input
              id="user-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              className="w-full px-4 py-3 bg-transparent text-[#0d1e25] text-[15px] outline-none"
            />
          </div>
        </div>

        {/* Field 3: Consultation Question */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[14px] font-medium text-[#0d1e25]">
            <label htmlFor="user-question">
              {t.questionLabel} <span className="text-[#ba1a1a]">*</span>
            </label>
            <span className="text-[12px] text-[#6e797b] font-mono">
              {question.length} / 1000
            </span>
          </div>
          <div className="relative">
            <textarea
              id="user-question"
              required
              minLength={10}
              maxLength={1000}
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t.questionPlaceholder}
              className="w-full p-3.5 bg-[#f4faff] text-[#0d1e25] rounded-lg text-[15px] border border-[#bec8cb]/40 focus:border-[#006673] focus:bg-white outline-none transition-all resize-none shadow-sm leading-relaxed"
            ></textarea>
          </div>
        </div>

        {/* PDPA Consent Checkbox */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id="pdpa-consent"
            required
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded accent-[#006673] cursor-pointer"
          />
          <label htmlFor="pdpa-consent" className="text-[12px] text-[#3e484b] leading-relaxed select-none cursor-pointer">
            {t.pdpaConsentText}
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full py-3.5 px-6 rounded-xl bg-[#006673] hover:bg-[#1d808f] text-white font-semibold text-[16px] shadow-md transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer disabled:opacity-70 group"
        >
          <div className="flex items-center gap-2">
            <span>{loading ? '正在排盘验算中...' : t.submitBtnText}</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
          <span className="text-[12px] text-[#9eefff] font-normal opacity-90">{t.submitBtnSub}</span>
        </button>
      </form>

      {/* Success State Overlay */}
      {submitted && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center justify-center text-center animate-fadeIn z-20">
          <div className="w-16 h-16 rounded-full bg-[#dff1fb] flex items-center justify-center text-[#006673] mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>
          <h3 className="text-[22px] font-bold text-[#0d1e25] mb-2">{t.successTitle}</h3>
          <p className="text-[14px] text-[#3e484b] max-w-sm mb-6 leading-relaxed">
            {t.successDesc}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={() => {
                if (onSuccessNavigate) onSuccessNavigate(createdId);
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#006673] text-white font-medium text-[14px] shadow-sm hover:bg-[#1d808f] transition-colors"
            >
              {t.viewDossierNow}
            </button>
            <button
              onClick={handleReset}
              className="py-2.5 px-4 rounded-xl bg-[#e7f6ff] text-[#006673] font-medium text-[14px] hover:bg-[#c3e8ff] transition-colors"
            >
              {t.newReading}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
