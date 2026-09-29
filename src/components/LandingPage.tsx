import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useConsultation } from '../context/ConsultationContext';
import { getTranslation } from '../lib/i18n';
import { ConsultationForm } from './ConsultationForm';
import { NineStar36CardBoard } from './NineStar36CardBoard';

interface LandingPageProps {
  onNavigateToReading: (id?: string) => void;
  onOpenAuthModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToReading,
  onOpenAuthModal,
}) => {
  const { language } = useAuth();
  const { castSession, shuffleCurrentCards } = useConsultation();
  const t = getTranslation(language);

  const eightPalaces = [
    {
      nameZh: '事业宫',
      nameEn: 'Career Palace',
      element: '坎一宫水',
      icon: 'corporate_fare',
      descZh: '解析职业拐点、转型时机、合伙人契合度与行业气运脉络。',
      descEn: 'Analyze career turning points, partnership synergy and industry momentum.',
    },
    {
      nameZh: '财富宫',
      nameEn: 'Wealth Palace',
      element: '坤二宫土',
      icon: 'account_balance_wallet',
      descZh: '正财与偏财聚散规律，大额投资节点预警与资金安全防守期。',
      descEn: 'Earned & investment wealth cycles, risk warnings for major capital moves.',
    },
    {
      nameZh: '组织宫',
      nameEn: 'Mind & Strategy',
      element: '震三宫木',
      icon: 'hub',
      descZh: '团队士气掌控、权力层级互动、跨部门协作与管理协同格局。',
      descEn: 'Team morale, decision hierarchies, cross-functional collaboration and leadership.',
    },
    {
      nameZh: '交际宫',
      nameEn: 'Social & Allies',
      element: '巽四宫木',
      icon: 'share',
      descZh: '贵人方位、社交网络破局、小人防范以及关键人脉引荐契机。',
      descEn: 'Benefactor alignments, network breakthroughs, and strategic introductions.',
    },
    {
      nameZh: '官禄宫',
      nameEn: 'Authority & Status',
      element: '乾六宫金',
      icon: 'military_tech',
      descZh: '社会名望、公职升迁、政策合规风向与行业权威声誉积淀。',
      descEn: 'Reputation, regulatory compliance, public standing and professional prestige.',
    },
    {
      nameZh: '感情宫',
      nameEn: 'Romance Palace',
      element: '兑七宫金',
      icon: 'favorite',
      descZh: '正缘流转周期、婚恋相处症结、情感危机化解与默契加深。',
      descEn: 'Relationship destiny cycles, interpersonal harmony and mutual alignment.',
    },
    {
      nameZh: '儿女与传承宫',
      nameEn: 'Legacy & Children',
      element: '艮八宫土',
      icon: 'child_care',
      descZh: '子嗣福分、二代教育成长路径选择、传承规划与亲子磁场。',
      descEn: 'Succession planning, talent incubation, next-gen education and heritage.',
    },
    {
      nameZh: '家庭宫',
      nameEn: 'Family Palace',
      element: '离九宫火',
      icon: 'cottage',
      descZh: '家族根基、祖宅气场、长辈安康庇护与家族向心力的凝聚。',
      descEn: 'Domestic sanctuary, elder wellbeing, feng shui harmony and household cohesion.',
    },
  ];

  return (
    <div className="w-full bg-[#f4faff]">
      {/* 1. HERO SECTION */}
      <div className="relative w-full overflow-hidden">
        {/* Subtle Zen Aura Gradients */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#006673]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/4 -right-32 w-80 h-80 bg-[#c3e8ff]/40 rounded-full blur-3xl pointer-events-none"></div>

        <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            {/* Left Hero Narrative (Col 7) */}
            <div className="lg:col-span-7 flex flex-col justify-center pt-2 lg:pt-6">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#d9ebf5] shadow-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-[#006673] animate-pulse"></span>
                <span className="text-[12px] font-medium text-[#3f6376] tracking-wide">
                  {t.heroEyebrow}
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-[38px] sm:text-[48px] font-bold text-[#0d1e25] tracking-tight leading-[1.15] mb-3">
                {t.heroTitle}
              </h1>
              <p className="text-[18px] sm:text-[20px] text-[#3f6376] font-medium mb-5 tracking-normal">
                {t.heroSubtitle}
              </p>

              {/* Core Description */}
              <p className="text-[16px] text-[#3e484b] max-w-xl leading-relaxed mb-8">
                {t.heroDesc}
              </p>

              {/* Quick Micro-Visual Dossier (Bento Trust Card) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-sm border border-[#bec8cb]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#dff1fb] flex items-center justify-center shrink-0 text-[#006673]">
                    <span className="material-symbols-outlined text-[28px]">stars</span>
                  </div>
                  <div>
                    <div className="text-[16px] font-bold text-[#0d1e25]">{t.realCalculation}</div>
                    <div className="text-[13px] text-[#3e484b]">{t.realCalculationDesc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#dff1fb] text-[#006673] text-[12px] font-semibold self-stretch sm:self-auto justify-center">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>{t.masterVerifiedBadge}</span>
                </div>
              </div>

              {/* Master Profile Avatar Strip */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-flex h-11 w-11 rounded-full ring-2 ring-white bg-[#006673] text-white items-center justify-center font-bold text-[14px] shadow-sm">
                    林
                  </div>
                  <div className="inline-flex h-11 w-11 rounded-full ring-2 ring-white bg-[#1d808f] text-white items-center justify-center font-semibold text-[12px] shadow-sm">
                    36卦
                  </div>
                  <div className="inline-flex h-11 w-11 rounded-full ring-2 ring-white bg-[#3f6376] text-white items-center justify-center font-semibold text-[12px] shadow-sm">
                    八宫
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-[#0d1e25]">{t.studioName}</span>
                  <span className="text-[12px] text-[#3e484b]">{t.studioDesc}</span>
                </div>
              </div>
            </div>

            {/* Right Hero Intake Form Card (PRD 6.2 & 10.2: The Core 3-Field Intake) */}
            <div className="lg:col-span-5">
              <ConsultationForm
                onSuccessNavigate={(id) => onNavigateToReading(id)}
                onOpenAuthModal={onOpenAuthModal}
              />
            </div>
          </div>
        </section>
      </div>

      {/* 2. TRUST MARKS ROW */}
      <section className="w-full bg-[#e7f6ff] py-8 border-y border-[#bec8cb]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#006673] shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[20px]">auto_stories</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[#0d1e25]">{t.trustTitle1}</span>
                <span className="text-[12px] text-[#3e484b]">{t.trustDesc1}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#006673] shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[20px]">calculate</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[#0d1e25]">{t.trustTitle2}</span>
                <span className="text-[12px] text-[#3e484b]">{t.trustDesc2}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#006673] shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[20px]">shield</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[#0d1e25]">{t.trustTitle3}</span>
                <span className="text-[12px] text-[#3e484b]">{t.trustDesc3}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#006673] shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[#0d1e25]">{t.trustTitle4}</span>
                <span className="text-[12px] text-[#3e484b]">{t.trustDesc4}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3-STEP RIGOROUS METHODOLOGY */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="text-[12px] uppercase tracking-wider text-[#006673] font-bold">
              {t.methodologyLabel}
            </span>
            <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0d1e25] mt-2">
              {t.methodologyTitle}
            </h2>
          </div>
          <p className="text-[15px] text-[#3e484b] max-w-md leading-relaxed">
            {t.methodologyDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 Card */}
          <div className="p-8 rounded-2xl bg-white shadow-sm border border-[#bec8cb]/30 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="w-12 h-12 rounded-xl bg-[#dff1fb] flex items-center justify-center text-[#006673] font-bold text-[20px]">
                  01
                </span>
                <span className="text-[12px] text-[#3e484b] px-2.5 py-1 rounded bg-[#f4faff]">耗时 1 分钟</span>
              </div>
              <h3 className="text-[20px] font-bold text-[#0d1e25] mb-3">{t.step1Title}</h3>
              <p className="text-[14px] text-[#3e484b] leading-relaxed mb-6">
                {t.step1Desc}
              </p>
            </div>
            <div className="pt-4 bg-[#f4faff] -mx-8 -mb-8 p-6 rounded-b-2xl flex items-center gap-2 text-[#006673] text-[13px] font-semibold border-t border-[#bec8cb]/20">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>{t.step1Tag}</span>
            </div>
          </div>

          {/* Step 2 Card */}
          <div className="p-8 rounded-2xl bg-white shadow-sm border border-[#bec8cb]/30 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="w-12 h-12 rounded-xl bg-[#dff1fb] flex items-center justify-center text-[#006673] font-bold text-[20px]">
                  02
                </span>
                <span className="text-[12px] text-[#3e484b] px-2.5 py-1 rounded bg-[#f4faff]">大师专属排盘</span>
              </div>
              <h3 className="text-[20px] font-bold text-[#0d1e25] mb-3">{t.step2Title}</h3>
              <p className="text-[14px] text-[#3e484b] leading-relaxed mb-6">
                {t.step2Desc}
              </p>
            </div>
            <div className="pt-4 bg-[#f4faff] -mx-8 -mb-8 p-6 rounded-b-2xl flex items-center gap-2 text-[#006673] text-[13px] font-semibold border-t border-[#bec8cb]/20">
              <span className="material-symbols-outlined text-[18px]">view_kanban</span>
              <span>{t.step2Tag}</span>
            </div>
          </div>

          {/* Step 3 Card */}
          <div className="p-8 rounded-2xl bg-white shadow-sm border border-[#bec8cb]/30 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="w-12 h-12 rounded-xl bg-[#dff1fb] flex items-center justify-center text-[#006673] font-bold text-[20px]">
                  03
                </span>
                <span className="text-[12px] text-[#3e484b] px-2.5 py-1 rounded bg-[#f4faff]">交付保障</span>
              </div>
              <h3 className="text-[20px] font-bold text-[#0d1e25] mb-3">{t.step3Title}</h3>
              <p className="text-[14px] text-[#3e484b] leading-relaxed mb-6">
                {t.step3Desc}
              </p>
            </div>
            <div className="pt-4 bg-[#f4faff] -mx-8 -mb-8 p-6 rounded-b-2xl flex items-center gap-2 text-[#006673] text-[13px] font-semibold border-t border-[#bec8cb]/20">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>{t.step3Tag}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EIGHT PALACES PREVIEW */}
      <section className="w-full bg-[#e7f6ff] py-20 lg:py-24 border-t border-[#bec8cb]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[12px] uppercase tracking-wider text-[#006673] font-bold">
                {t.palacesSectionLabel}
              </span>
              <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0d1e25] mt-1">
                {t.palacesSectionTitle}
              </h2>
            </div>
            <p className="text-[14px] text-[#3e484b] max-w-md leading-relaxed">
              {t.palacesSectionDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {eightPalaces.map((p, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white shadow-sm border border-[#bec8cb]/20 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-[#dff1fb] flex items-center justify-center text-[#006673]">
                      <span className="material-symbols-outlined text-[20px]">{p.icon}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f4faff] text-[#006673] text-[12px] font-semibold">
                      {p.element}
                    </span>
                  </div>
                  <h4 className="text-[16px] font-bold text-[#0d1e25] mb-2">{language === 'zh' ? p.nameZh : p.nameEn}</h4>
                  <p className="text-[13px] text-[#3e484b] leading-relaxed">
                    {language === 'zh' ? p.descZh : p.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5. NINE STAR 36-CARD MANDALA SPREAD (User Image Architecture) */}
      <section id="cards-section" className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-24">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-[12px] uppercase tracking-wider text-[#006673] font-bold">
            Nine Star 36-Card Alignment
          </span>
          <h2 className="text-[28px] sm:text-[34px] font-bold text-[#0d1e25] mt-2 mb-3">
            九星牌卦 36 张牌开牌顺序与排阵全息图
          </h2>
          <p className="text-[15px] text-[#3e484b] leading-relaxed">
            依马来西亚九星牌卦师傅原图秘传排阵：严格按 1 至 17 号顺序开牌，18 至 29 号外环流月牌照，30 至 35 号竖列六爻起卦，第 36 张牌动爻定变卦。<strong>每逢新诉求问测，均执行独立随机洗牌重排！</strong>
          </p>
        </div>

        <div className="w-full">
          <NineStar36CardBoard
            cards={castSession?.cards || []}
            benGua={castSession?.benGua}
            bianGua={castSession?.bianGua}
            movingLineIndex={castSession?.movingLineIndex || 3}
            onShuffle={shuffleCurrentCards}
          />
        </div>
      </section>

      {/* 5. PRICING TIER PREVIEW */}
      <section id="plans-section" className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[12px] uppercase tracking-wider text-[#006673] font-bold">
            {t.pricingSectionLabel}
          </span>
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0d1e25] mt-2 mb-3">
            {t.pricingSectionTitle}
          </h2>
          <p className="text-[15px] text-[#3e484b]">
            {t.pricingSectionDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier Card */}
          <div className="p-8 rounded-2xl bg-white shadow-sm border border-[#bec8cb]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[20px] font-bold text-[#0d1e25]">{t.planFreeTitle}</span>
                <span className="px-3 py-1 rounded-full bg-[#dff1fb] text-[#3f6376] text-[12px] font-semibold">体验版</span>
              </div>
              <div className="text-[36px] font-bold text-[#0d1e25] mb-2">
                {t.planFreePrice} <span className="text-[14px] text-[#3e484b] font-normal">{t.planFreeUnit}</span>
              </div>
              <p className="text-[13px] text-[#3e484b] mb-6 leading-relaxed">
                {t.planFreeDesc}
              </p>
              <ul className="flex flex-col gap-3 text-[13px] text-[#0d1e25] mb-8">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006673] text-[18px]">check</span>
                  <span>输入 3 字段极简建盘</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006673] text-[18px]">check</span>
                  <span>主宫位自动定性分析 (所属八宫归位)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006673] text-[18px]">check</span>
                  <span>本年流年总体顺逆指数 (Public Overview)</span>
                </li>
                <li className="flex items-center gap-2 text-[#6e797b]/60">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                  <span>不含 36 牌深层四季流月动爻展开</span>
                </li>
                <li className="flex items-center gap-2 text-[#6e797b]/60">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                  <span>不含大师专属文字逐字批注与追问特权</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                document.getElementById('consultation-form-card')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-3.5 rounded-xl bg-[#dff1fb] text-[#006673] font-semibold text-[14px] text-center hover:bg-[#c3e8ff] transition-colors"
            >
              {t.planFreeBtn}
            </button>
          </div>

          {/* VIP Tier Card */}
          <div className="p-8 rounded-2xl bg-white shadow-xl border-2 border-[#006673] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl bg-[#006673] text-white text-[12px] font-semibold">
              {t.planVipBadge}
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[20px] font-bold text-[#0d1e25]">{t.planVipTitle}</span>
                <span className="px-3 py-1 rounded-full bg-[#c3e8ff] text-[#006673] text-[12px] font-bold">VIP 详盘</span>
              </div>
              <div className="text-[36px] font-bold text-[#006673] mb-2">
                {t.planVipPrice} <span className="text-[14px] text-[#3e484b] font-normal">{t.planVipUnit}</span>
              </div>
              <p className="text-[13px] text-[#3e484b] mb-6 leading-relaxed">
                {t.planVipDesc}
              </p>
              <ul className="flex flex-col gap-3 text-[13px] text-[#0d1e25] mb-8">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006673] text-[18px]">verified</span>
                  <span className="font-semibold">大师亲抽 36 张九星牌卦定盘</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006673] text-[18px]">check</span>
                  <span>精细到农历 12 个月流月气运与应对</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006673] text-[18px]">check</span>
                  <span>主卦、互卦、变卦动爻逐爻剖析 (雷天大壮 → 雷泽归妹)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006673] text-[18px]">check</span>
                  <span>八宫全景深度解锁与避坑指南</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006673] text-[18px]">check</span>
                  <span>24小时内交付加密 PDF 与大师一对一追问权益</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigateToReading('NS-20250518-882')}
              className="w-full py-3.5 rounded-xl bg-[#006673] hover:bg-[#1d808f] text-white font-semibold text-[15px] text-center shadow-md transition-all cursor-pointer"
            >
              {t.planVipBtn}
            </button>
          </div>
        </div>
      </section>

      {/* 6. COMPLIANCE & DISCLAIMER BANNER */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-16">
        <div className="p-6 rounded-2xl bg-[#dff1fb] flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#bec8cb]/20">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#006673] text-[24px]">security</span>
            <p className="text-[13px] text-[#3e484b] leading-relaxed">
              <span className="font-bold text-[#0d1e25]">合规声明：</span>
              {t.disclaimer}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[12px] font-semibold text-[#006673]">PDPA 2010 Protected</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#006673]"></span>
            <span className="text-[12px] font-semibold text-[#006673]">Strict Encryption</span>
          </div>
        </div>
      </section>
    </div>
  );
};
