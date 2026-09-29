import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConsultation } from '../context/ConsultationContext';
import { getTranslation } from '../lib/i18n';
import { NineStar36CardBoard } from './NineStar36CardBoard';

interface ReadingViewProps {
  onBack: () => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ onBack }) => {
  const { user, language } = useAuth();
  const {
    activeConsultation,
    castSession,
    palaces,
    upgradeToPaid,
    followUps,
    submitFollowUp,
    shuffleCurrentCards,
    submitConsultation,
  } = useConsultation();
  const t = getTranslation(language);

  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);
  const [starRating, setStarRating] = useState(5);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Determine if this user has VIP access (paid customer or editor, or consultation marked isVip)
  const isVipUnlocked =
    user?.role === 'paid' || user?.role === 'editor' || activeConsultation?.isVip;

  const consultation = activeConsultation || {
    id: 'NS-20250518-882',
    name: '张子涵 (Marcus Tan)',
    phone: '+60 12-882 9134',
    question:
      '近期筹备在吉隆坡开展新合伙事业，但面临两家投资方选择与合伙人心态摇摆，想问测今年事业走向与最佳决策月份？',
    primaryPalace: '事业宫 (Career)',
    secondaryPalaces: ['财富宫', '组织心法'],
    publicSummary:
      '“当前面对变局内耗偏重，但下半年藏有隐蔽贵人相助，适宜稳中求进。” 卦气显现：春季梅花 K 盘结，各方合伙理念尚未完全校准，容易因股权分配与决策权归属产生无形暗涌。入秋后（农历七月至九月）方块能量骤聚，两家投资方中带“水木”背景之机构将拿出实质性意向书，彼时落子可免除后顾之忧。',
    annualScore: 78,
    annualVerdict: '先劳后逸 · 动中有获',
    createdAt: '2025-05-18 10:42 GMT+8',
  };

  const handleUnlockFullReading = () => {
    setIsPaying(true);
    setTimeout(() => {
      upgradeToPaid(consultation.id);
      setIsPaying(false);
      alert('已成功接入 FPX / DuitNow 安全通道，八宫完整解读及每月动爻避坑策略已全面解锁！');
    }, 800);
  };

  const handleSendFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuestion.trim()) return;
    submitFollowUp(
      consultation.id,
      followUpQuestion,
      user?.displayName || consultation.name,
      user?.uid || 'user'
    );
    setFollowUpQuestion('');
    setShowFollowUpModal(false);
    alert('追问问题已提交至林清泉大师督导专席，大师将在 48 小时内亲自在此案卷中回复。');
  };

  const handleAddNewQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestionText.trim().length < 10) {
      alert('请至少输入 10 个字以详述您的新问题');
      return;
    }
    setIsSubmittingNew(true);
    try {
      await submitConsultation(
        user?.displayName || consultation.name,
        consultation.phone,
        newQuestionText
      );
      setShowNewQuestionModal(false);
      setNewQuestionText('');
      alert('新问题已成功入盘！系统已自动重新洗牌排定 36 张牌阵，并重新推算卦象。');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  return (
    <div className="w-full bg-[#f4faff] pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Case Navigation & Metadata Pill */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-[14px] font-medium text-[#3e484b] hover:text-[#006673] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>返回问测列表</span>
            </button>
            <span className="text-[#bec8cb] text-[12px]">/</span>
            <span className="text-[12px] text-[#3f6376] bg-[#d9ebf5] px-2.5 py-0.5 rounded-full font-medium">
              案卷归档 #{consultation.id}
            </span>

            {/* Quick Ask New Question Button (triggers auto-shuffle) */}
            <button
              onClick={() => setShowNewQuestionModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#006673] hover:bg-[#1d808f] text-white text-[12px] font-bold shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>问新问题 (自动重新洗牌)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-[#3e484b]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-sm text-[#006673] font-semibold border border-[#bec8cb]/20">
              <span className="w-2 h-2 rounded-full bg-[#006673] animate-pulse"></span>
              已发布至专席
            </span>
            <span className="text-[#bec8cb]">|</span>
            <span>问测历法：乙巳流年（农历）· 时空奇门卦局</span>
          </div>
        </div>

        {/* Case Header Dossier Card */}
        <div className="w-full bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#bec8cb]/20 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d9ebf5]/40 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
            {/* Customer & Question Segment */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-[#006673]/10 text-[#006673] text-[12px] font-semibold">
                  九星三十六牌原卦局
                </span>
                <span className="px-3 py-1 rounded-full bg-[#c3e8ff] text-[#46697d] text-[12px] font-medium">
                  主宫位：{consultation.primaryPalace}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#dff1fb] text-[#575d5f] text-[12px]">
                  辅宫位：财富宫 · 组织心法
                </span>
              </div>

              <h1 className="text-[26px] sm:text-[32px] font-bold text-[#0d1e25] tracking-tight mb-3">
                吉隆坡合伙事业动向与择期决疑
              </h1>

              <div className="p-4 rounded-xl bg-[#e7f6ff] mb-4 border border-[#c3e8ff]/50">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#006673] text-[20px] shrink-0 mt-0.5">
                    format_quote
                  </span>
                  <p className="text-[15px] text-[#0d1e25] italic leading-relaxed">
                    “{consultation.question}”
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[#3e484b] text-[13px]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#575d5f]">person</span>
                  <span>
                    求测人：<strong className="font-semibold text-[#0d1e25]">{consultation.name}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#575d5f]">call</span>
                  <span>认证号码：{consultation.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#575d5f]">schedule</span>
                  <span>起盘时间：2025-05-18 10:42 GMT+8</span>
                </div>
              </div>
            </div>

            {/* Master Verified Stamp & Actions */}
            <div className="lg:col-span-4 flex flex-col justify-between items-start lg:items-end h-full gap-4 pt-2 lg:pt-0">
              <div className="w-full lg:w-auto p-4 rounded-xl bg-[#dff1fb] flex items-center gap-3 border border-[#bec8cb]/20">
                <div className="w-12 h-12 rounded-full bg-[#006673] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-bold text-[#0d1e25]">林清泉 驻堂督导</span>
                  <span className="text-[12px] text-[#3e484b]">
                    马来西亚易经学会特聘顾问 · 亲笔排盘
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full lg:w-auto">
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#d9ebf5] hover:bg-[#cbdde7] text-[#0d1e25] text-[14px] font-medium transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>导出 PDF 案卷</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('已复制专属问测案卷加密凭证链接至剪贴板！');
                  }}
                  className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#006673] hover:bg-[#1d808f] text-white text-[14px] font-medium transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">share</span>
                  <span>分享专属凭证</span>
                </button>
              </div>
            </div>
          </div>

          {/* Workflow Status Tracker Bar (Dark Navy Bento Band) */}
          <div className="mt-8 pt-6 border-t border-[#bec8cb]/20">
            <div className="w-full bg-[#22333a] rounded-xl p-4 lg:p-5 shadow-sm text-[#e2f3fe]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7ed3e3] text-[20px]">timeline</span>
                  <span className="text-[13px] font-bold uppercase tracking-wider text-[#d9ebf5]">
                    全息问测进度 / Protocol Status
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-[#d3e5ef]">
                  <span>状态码: READY_VERIFIED</span>
                  <span>·</span>
                  <span className="text-[#7ed3e3] font-semibold">PDPA 端到端加密存档</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-white/10">
                  <div className="flex items-center justify-between text-[#7ed3e3] text-[13px] font-medium">
                    <span>01. 提交诉求</span>
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  </div>
                  <span className="text-[11px] text-[#cbdde7]">2025-05-18 10:15</span>
                </div>

                <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-white/10">
                  <div className="flex items-center justify-between text-[#7ed3e3] text-[13px] font-medium">
                    <span>02. 八宫初定</span>
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  </div>
                  <span className="text-[11px] text-[#cbdde7]">时空遁甲八方校准</span>
                </div>

                <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-white/10">
                  <div className="flex items-center justify-between text-[#7ed3e3] text-[13px] font-medium">
                    <span>03. 36 牌开盘</span>
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  </div>
                  <span className="text-[11px] text-[#cbdde7]">流年四季流月铺定</span>
                </div>

                <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-white/10">
                  <div className="flex items-center justify-between text-[#7ed3e3] text-[13px] font-medium">
                    <span>04. 大师审阅</span>
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  </div>
                  <span className="text-[11px] text-[#cbdde7]">爻动吉凶研判定音</span>
                </div>

                <div className="col-span-2 sm:col-span-1 flex flex-col gap-1 p-2.5 rounded-lg bg-[#1d808f] text-white shadow-sm">
                  <div className="flex items-center justify-between text-[13px] font-bold">
                    <span>05. 解读就绪</span>
                    <span className="material-symbols-outlined text-[16px] text-[#9eefff]">task_alt</span>
                  </div>
                  <span className="text-[11px] text-[#e7f6ff] font-normal">交互阅读与复盘已开放</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: 36-Card Spread & Hexagram Engine Visualization - Exact Diagram Layout */}
        <div className="w-full mb-10">
          <NineStar36CardBoard
            cards={castSession?.cards || []}
            benGua={castSession?.benGua}
            bianGua={castSession?.bianGua}
            movingLineIndex={castSession?.movingLineIndex || 3}
            onShuffle={shuffleCurrentCards}
          />
        </div>

        {/* Free Summary Dossier (Public Reading Overview) */}
        <div className="w-full bg-gradient-to-r from-[#1d808f] via-[#006673] to-[#1d808f] text-white rounded-2xl p-6 lg:p-8 shadow-md mb-12 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[#9eefff] text-[12px] font-semibold mb-3">
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>流年总览 · 基础心法指引 (Public Reading Overview)</span>
              </div>
              <h2 className="text-[22px] sm:text-[24px] font-bold text-white mb-3">
                “当前面对变局内耗偏重，但下半年藏有隐蔽贵人相助，适宜稳中求进。”
              </h2>
              <p className="text-[15px] text-[#9eefff] leading-relaxed">
                {consultation.publicSummary}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <div className="p-4 rounded-xl bg-white/10 text-center border border-white/20 min-w-[140px]">
                <span className="block text-[11px] uppercase tracking-wider text-[#d9ebf5]">流年吉凶均值</span>
                <span className="text-[44px] font-bold text-white leading-none my-1 block">
                  {consultation.annualScore}
                  <span className="text-[18px] font-normal text-[#d9ebf5]">/100</span>
                </span>
                <span className="text-[12px] text-[#e7f6ff]">{consultation.annualVerdict}</span>
              </div>
            </div>
          </div>
        </div>

        {/* The Core 8-Palace Bento Grid Reading (八宫深度解读矩阵) */}
        <div className="w-full mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-[12px] text-[#006673] uppercase tracking-widest font-bold">
                Eight Palaces Decryption
              </span>
              <h2 className="text-[28px] font-bold text-[#0d1e25]">
                八宫深度解读矩阵 (Finpay Bento Architecture)
              </h2>
            </div>
            <p className="text-[13px] text-[#3e484b] max-w-lg md:text-right">
              结合九星落位与奇门三奇六仪，全方位拆解 {consultation.name} 2025 年八大生命与事业能量场。
            </p>
          </div>

          {/* Bento Grid 8 Palaces */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            {/* 1. 事业宫 (Career Palace - 主宫位) - Span 8 columns, Unlocked */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#bec8cb]/20 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-[#bec8cb]/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#006673]/10 text-[#006673] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[17px] font-bold text-[#0d1e25]">事业宫 (Career Palace)</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#006673] text-white text-[12px] font-bold">
                        主宫位 · 已全面解锁
                      </span>
                    </div>
                    <span className="text-[12px] text-[#3e484b]">
                      对应卦爻：雷天大壮 → 雷泽归妹 · 对应牌：♠ A & ♦ K
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#006673] text-[22px]">lock_open</span>
              </div>

              <div className="space-y-4 my-4">
                <div className="p-4 rounded-xl bg-[#e7f6ff] border border-[#c3e8ff]/50">
                  <h4 className="text-[15px] font-bold text-[#006673] mb-1">合伙抉择与战局推衍</h4>
                  <p className="text-[14px] text-[#0d1e25] leading-relaxed">
                    {palaces.career?.contentZh}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#dff1fb] border border-[#bec8cb]/20">
                    <span className="text-[12px] text-[#575d5f] block mb-1">关键破局窗口</span>
                    <span className="text-[15px] text-[#0d1e25] font-bold">农历七月至九月</span>
                    <p className="text-[12px] text-[#3e484b] mt-1">秋令金旺，契约签署之吉时，两江交汇之贵人现身。</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#dff1fb] border border-[#bec8cb]/20">
                    <span className="text-[12px] text-[#575d5f] block mb-1">合伙人信任危机防范</span>
                    <span className="text-[15px] text-[#ba1a1a] font-bold">农历八月防暗动</span>
                    <p className="text-[12px] text-[#3e484b] mt-1">三爻动变逢绝命星，核心成员可能因利益产生犹豫。</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#dff1fb] border border-[#bec8cb]/20">
                    <span className="text-[12px] text-[#575d5f] block mb-1">落地战略建议</span>
                    <span className="text-[15px] text-[#006673] font-bold">权责法务先定</span>
                    <p className="text-[12px] text-[#3e484b] mt-1">在马来西亚公司法框架下设立双重表决权或防稀释条款。</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 text-[12px] text-[#3f6376] border-t border-[#bec8cb]/15">
                <span>星曜吉神：天乙贵人同临震宫</span>
                <span className="flex items-center gap-1 font-semibold text-[#006673]">
                  <span className="material-symbols-outlined text-[16px]">verified</span> 大师重点关注项
                </span>
              </div>
            </div>

            {/* 2. 财富宫 (Wealth Palace - 辅宫位) - Span 4 columns, Unlocked */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#bec8cb]/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#bec8cb]/15">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c3e8ff] text-[#46697d] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-[#0d1e25]">财富宫 (Wealth)</h3>
                      <span className="text-[12px] text-[#3e484b]">正财丰盛 · 偏财戒贪</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#006673]/10 text-[#006673] text-[12px] font-semibold">
                    已解锁
                  </span>
                </div>

                <div className="space-y-3 my-3">
                  <p className="text-[14px] text-[#3e484b] leading-relaxed">
                    {palaces.wealth?.contentZh}
                  </p>
                  <ul className="space-y-2 text-[#0d1e25] text-[13px]">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#006673] text-[18px] shrink-0 mt-0.5">check</span>
                      <span><strong>资本注入：</strong>投资款项建议分两阶段（Milestone-based）到账，防范断裂风险。</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#006673] text-[18px] shrink-0 mt-0.5">check</span>
                      <span><strong>合约细则：</strong>注意知识产权与本地牌照挂靠费用的隐性支出。</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#e7f6ff] mt-2 border border-[#c3e8ff]/50">
                <div className="flex justify-between items-center text-[12px] mb-1.5">
                  <span className="text-[#575d5f]">现金流安全指数</span>
                  <span className="text-[#006673] font-bold">85% (高安全性)</span>
                </div>
                <div className="w-full bg-[#d9ebf5] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#006673] h-full rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            {/* 3. 组织宫 (Mind & Strategy) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-[#bec8cb]/20 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-[#bec8cb]/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#dff1fb] text-[#575d5f] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[24px]">psychology</span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0d1e25]">组织宫 (Mind & Strategy)</h3>
                    <span className="text-[12px] text-[#3e484b]">心性调适 · 顶层决策模型</span>
                  </div>
                </div>
              </div>

              <div className="relative py-2">
                <div className={`${!isVipUnlocked ? 'filter blur-sm select-none pointer-events-none opacity-60' : ''} space-y-2`}>
                  <p className="text-[13px] text-[#0d1e25] leading-relaxed">{palaces.mindStrategy?.contentZh}</p>
                  <div className="p-3 bg-[#dff1fb] rounded-lg text-[12px] font-semibold text-[#006673]">
                    心法口诀：静水流深，柔以济刚
                  </div>
                </div>

                {!isVipUnlocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] rounded-xl p-4 text-center">
                    <div className="w-9 h-9 rounded-full bg-[#d9ebf5] flex items-center justify-center text-[#006673] mb-2 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                    </div>
                    <span className="text-[15px] text-[#0d1e25] font-bold">组织宫深度策论锁定</span>
                    <p className="text-[12px] text-[#3e484b] mt-1 mb-2">包含：合伙人谈判底线策略与管理心法</p>
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-between text-[12px] text-[#575d5f] border-t border-[#bec8cb]/15">
                <span>对应牌：♣ K 梅花统领</span>
                <span className={isVipUnlocked ? 'text-[#006673] font-bold' : 'text-[#ba1a1a] font-semibold'}>
                  {isVipUnlocked ? '已解锁' : 'VIP 专属'}
                </span>
              </div>
            </div>

            {/* 4. 官禄宫 (Authority & Status) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-[#bec8cb]/20 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-[#bec8cb]/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#dff1fb] text-[#575d5f] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0d1e25]">官禄宫 (Authority & Status)</h3>
                    <span className="text-[12px] text-[#3e484b]">商誉声望 · 监管合规</span>
                  </div>
                </div>
              </div>

              <div className="relative py-2">
                <div className={`${!isVipUnlocked ? 'filter blur-sm select-none pointer-events-none opacity-60' : ''} space-y-2`}>
                  <p className="text-[13px] text-[#0d1e25] leading-relaxed">{palaces.authority?.contentZh}</p>
                  <div className="p-3 bg-[#dff1fb] rounded-lg text-[12px] font-semibold text-[#006673]">
                    声誉评级：AAA 级向好
                  </div>
                </div>

                {!isVipUnlocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] rounded-xl p-4 text-center">
                    <div className="w-9 h-9 rounded-full bg-[#d9ebf5] flex items-center justify-center text-[#006673] mb-2 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                    </div>
                    <span className="text-[15px] text-[#0d1e25] font-bold">官誉牌照节点锁定</span>
                    <p className="text-[12px] text-[#3e484b] mt-1 mb-2">包含：东南亚监管过审良机与背书指引</p>
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-between text-[12px] text-[#575d5f] border-t border-[#bec8cb]/15">
                <span>对应星：天辅星正照</span>
                <span className={isVipUnlocked ? 'text-[#006673] font-bold' : 'text-[#ba1a1a] font-semibold'}>
                  {isVipUnlocked ? '已解锁' : 'VIP 专属'}
                </span>
              </div>
            </div>

            {/* 5. 交际宫 (Social & Allies) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-[#bec8cb]/20 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-[#bec8cb]/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#dff1fb] text-[#575d5f] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[24px]">groups</span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0d1e25]">交际宫 (Social & Allies)</h3>
                    <span className="text-[12px] text-[#3e484b]">真伪贵人甄别 · 防暗小人</span>
                  </div>
                </div>
              </div>

              <div className="relative py-2">
                <div className={`${!isVipUnlocked ? 'filter blur-sm select-none pointer-events-none opacity-60' : ''} space-y-2`}>
                  <p className="text-[13px] text-[#0d1e25] leading-relaxed">{palaces.social?.contentZh}</p>
                  <div className="p-3 bg-[#dff1fb] rounded-lg text-[12px] font-semibold text-[#006673]">
                    警惕生肖：巳亥相冲
                  </div>
                </div>

                {!isVipUnlocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] rounded-xl p-4 text-center">
                    <div className="w-9 h-9 rounded-full bg-[#d9ebf5] flex items-center justify-center text-[#006673] mb-2 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                    </div>
                    <span className="text-[15px] text-[#0d1e25] font-bold">合伙社交避坑详述</span>
                    <p className="text-[12px] text-[#3e484b] mt-1 mb-2">包含：两家资方对接人的命理性格剖析</p>
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-between text-[12px] text-[#575d5f] border-t border-[#bec8cb]/15">
                <span>对应牌：♠ 3 避险</span>
                <span className={isVipUnlocked ? 'text-[#006673] font-bold' : 'text-[#ba1a1a] font-semibold'}>
                  {isVipUnlocked ? '已解锁' : 'VIP 专属'}
                </span>
              </div>
            </div>

            {/* 6. 家庭宫 (Family Palace) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-[#bec8cb]/20 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-[#bec8cb]/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#dff1fb] text-[#575d5f] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[24px]">cottage</span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0d1e25]">家庭宫 (Family Palace)</h3>
                    <span className="text-[12px] text-[#3e484b]">大后方安泰 · 宅邸气场</span>
                  </div>
                </div>
              </div>

              <div className="relative py-2">
                <div className={`${!isVipUnlocked ? 'filter blur-sm select-none pointer-events-none opacity-60' : ''} space-y-2`}>
                  <p className="text-[13px] text-[#0d1e25] leading-relaxed">{palaces.family?.contentZh}</p>
                  <div className="p-3 bg-[#dff1fb] rounded-lg text-[12px] font-semibold text-[#006673]">
                    气场协调度：高
                  </div>
                </div>

                {!isVipUnlocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] rounded-xl p-4 text-center">
                    <div className="w-9 h-9 rounded-full bg-[#d9ebf5] flex items-center justify-center text-[#006673] mb-2 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                    </div>
                    <span className="text-[15px] text-[#0d1e25] font-bold">家庭堪舆指引锁定</span>
                    <p className="text-[12px] text-[#3e484b] mt-1 mb-2">包含：办公室与主卧室风水催旺布局</p>
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-between text-[12px] text-[#575d5f] border-t border-[#bec8cb]/15">
                <span>对应星：天任吉星</span>
                <span className={isVipUnlocked ? 'text-[#006673] font-bold' : 'text-[#ba1a1a] font-semibold'}>
                  {isVipUnlocked ? '已解锁' : 'VIP 专属'}
                </span>
              </div>
            </div>

            {/* 7. 感情宫 (Romance Palace) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-[#bec8cb]/20 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-[#bec8cb]/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#dff1fb] text-[#575d5f] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[24px]">favorite</span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0d1e25]">感情宫 (Romance Palace)</h3>
                    <span className="text-[12px] text-[#3e484b]">心境滋养 · 伴侣同频</span>
                  </div>
                </div>
              </div>

              <div className="relative py-2">
                <div className={`${!isVipUnlocked ? 'filter blur-sm select-none pointer-events-none opacity-60' : ''} space-y-2`}>
                  <p className="text-[13px] text-[#0d1e25] leading-relaxed">{palaces.romance?.contentZh}</p>
                  <div className="p-3 bg-[#dff1fb] rounded-lg text-[12px] font-semibold text-[#006673]">
                    同心力：强
                  </div>
                </div>

                {!isVipUnlocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] rounded-xl p-4 text-center">
                    <div className="w-9 h-9 rounded-full bg-[#d9ebf5] flex items-center justify-center text-[#006673] mb-2 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                    </div>
                    <span className="text-[15px] text-[#0d1e25] font-bold">伴侣运势互动锁定</span>
                    <p className="text-[12px] text-[#3e484b] mt-1 mb-2">包含：情绪共振点与精力平衡建议</p>
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-between text-[12px] text-[#575d5f] border-t border-[#bec8cb]/15">
                <span>对应牌：♥ 8 金秋应期</span>
                <span className={isVipUnlocked ? 'text-[#006673] font-bold' : 'text-[#ba1a1a] font-semibold'}>
                  {isVipUnlocked ? '已解锁' : 'VIP 专属'}
                </span>
              </div>
            </div>

            {/* 8. 儿女与传承宫 (Children & Legacy) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-[#bec8cb]/20 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-[#bec8cb]/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#dff1fb] text-[#575d5f] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[24px]">diversity_3</span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0d1e25]">传承宫 (Legacy & Team)</h3>
                    <span className="text-[12px] text-[#3e484b]">门生梯队 · 资产永续</span>
                  </div>
                </div>
              </div>

              <div className="relative py-2">
                <div className={`${!isVipUnlocked ? 'filter blur-sm select-none pointer-events-none opacity-60' : ''} space-y-2`}>
                  <p className="text-[13px] text-[#0d1e25] leading-relaxed">{palaces.legacy?.contentZh}</p>
                  <div className="p-3 bg-[#dff1fb] rounded-lg text-[12px] font-semibold text-[#006673]">
                    后继发展：郁郁葱葱
                  </div>
                </div>

                {!isVipUnlocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] rounded-xl p-4 text-center">
                    <div className="w-9 h-9 rounded-full bg-[#d9ebf5] flex items-center justify-center text-[#006673] mb-2 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                    </div>
                    <span className="text-[15px] text-[#0d1e25] font-bold">人才梯队赋能锁定</span>
                    <p className="text-[12px] text-[#3e484b] mt-1 mb-2">包含：关键岗位招聘生肖宜忌与赋权模式</p>
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-between text-[12px] text-[#575d5f] border-t border-[#bec8cb]/15">
                <span>对应牌：♠ 7 冬令奠基</span>
                <span className={isVipUnlocked ? 'text-[#006673] font-bold' : 'text-[#ba1a1a] font-semibold'}>
                  {isVipUnlocked ? '已解锁' : 'VIP 专属'}
                </span>
              </div>
            </div>
          </div>

          {/* VIP Upgrade Action Module (PRD FR-10) - shown if not yet unlocked */}
          {!isVipUnlocked && (
            <div className="mt-8 p-6 lg:p-8 rounded-2xl bg-[#d9ebf5]/70 shadow-sm border border-[#bec8cb]/30 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#006673] text-white flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[32px]">workspace_premium</span>
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-[#0d1e25]">
                    解锁完整八宫与每月动爻避坑策略
                  </h3>
                  <p className="text-[14px] text-[#3e484b] mt-1">
                    立即可读其余 6 个被锁宫位之详细解卦报告 + 农历八月绝命动爻应对战术法册 + 大师 15 分钟深度答疑权益。
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 w-full lg:w-auto">
                <div className="text-right hidden sm:block">
                  <span className="block text-[12px] line-through text-[#6e797b]">原价 RM 168</span>
                  <span className="text-[32px] font-bold text-[#006673]">RM 68</span>
                </div>
                <button
                  onClick={handleUnlockFullReading}
                  disabled={isPaying}
                  className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#006673] hover:bg-[#1d808f] text-white font-semibold text-[15px] transition-all shadow-md cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-[20px]">key</span>
                  <span>{isPaying ? '正在接入安全网关...' : '解锁完整解读 (RM 68)'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Master Follow-up & Interactivity Action Bar */}
        <div className="w-full bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#bec8cb]/20 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x border-[#bec8cb]/20">
            {/* Action 1: Ask Master Follow-up */}
            <div className="flex flex-col justify-between pr-0 md:pr-6">
              <div>
                <div className="flex items-center gap-2 text-[#006673] mb-2">
                  <span className="material-symbols-outlined text-[22px]">contact_support</span>
                  <span className="text-[16px] font-bold">向大师发起跟进提问</span>
                </div>
                <p className="text-[13px] text-[#3e484b] mb-4 leading-relaxed">
                  针对本案雷泽归妹动爻或吉隆坡合伙人谈判细节，您享有一次免费追问权益（48 小时内大师亲自回复）。
                </p>
              </div>
              <button
                onClick={() => setShowFollowUpModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#dff1fb] hover:bg-[#c3e8ff] text-[#006673] font-semibold text-[13px] transition-colors cursor-pointer"
              >
                <span>提交追问细节</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Action 2: PDF Full Export */}
            <div className="flex flex-col justify-between pt-6 md:pt-0 md:px-6">
              <div>
                <div className="flex items-center gap-2 text-[#3f6376] mb-2">
                  <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
                  <span className="text-[16px] font-bold">下载 PDF 完整报告</span>
                </div>
                <p className="text-[13px] text-[#3e484b] mb-4 leading-relaxed">
                  包含完整 36 张牌阵高精度盘图、六十四卦动爻分析图解与全年吉凶择日历表，便于存阅。
                </p>
              </div>
              <button
                onClick={() => setShowPdfModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#dff1fb] hover:bg-[#c3e8ff] text-[#0d1e25] font-semibold text-[13px] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                <span>生成高密案卷 (PDF)</span>
              </button>
            </div>

            {/* Action 3: Review & Feedback */}
            <div className="flex flex-col justify-between pt-6 md:pt-0 md:pl-6">
              <div>
                <div className="flex items-center gap-2 text-[#575d5f] mb-2">
                  <span className="material-symbols-outlined text-[22px]">rate_review</span>
                  <span className="text-[16px] font-bold">问测评分与体验反馈</span>
                </div>
                <p className="text-[13px] text-[#3e484b] mb-4 leading-relaxed">
                  本次排盘符合度与解读清晰度评价，帮助我们持续完善数智奇门算力与大师督导机制。
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#006673]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarRating(star)}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      <span
                        className="material-symbols-outlined text-[22px]"
                        style={{
                          fontVariationSettings: star <= starRating ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setRatingSubmitted(true);
                    alert('非常感谢您的真诚反馈！评分已记入督导档案。');
                  }}
                  disabled={ratingSubmitted}
                  className="px-3.5 py-1.5 rounded-lg bg-[#dff1fb] hover:bg-[#c3e8ff] text-[#006673] font-semibold text-[12px] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {ratingSubmitted ? '已提交' : '提交评价'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Follow-up Threads if any */}
        {followUps.length > 0 && (
          <div className="w-full bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#bec8cb]/20 mb-12">
            <h3 className="text-[18px] font-bold text-[#0d1e25] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006673]">forum</span>
              <span>大师追问互动记录 ({followUps.length})</span>
            </h3>
            <div className="space-y-4">
              {followUps.map((f) => (
                <div key={f.id} className="p-4 rounded-xl bg-[#f4faff] border border-[#bec8cb]/20">
                  <div className="flex items-center justify-between text-[12px] text-[#3e484b] mb-2">
                    <span className="font-semibold text-[#0d1e25]">{f.userName} 提问</span>
                    <span>{f.createdAt}</span>
                  </div>
                  <p className="text-[14px] text-[#0d1e25] mb-3 bg-white p-3 rounded-lg border border-[#bec8cb]/15">
                    {f.question}
                  </p>
                  {f.answer ? (
                    <div className="p-3.5 rounded-lg bg-[#e7f6ff] border border-[#c3e8ff]">
                      <div className="flex items-center justify-between text-[12px] text-[#006673] font-bold mb-1">
                        <span>林清泉 驻堂督导 回复：</span>
                        <span className="text-[11px] text-[#3f6376] font-normal">{f.answeredAt}</span>
                      </div>
                      <p className="text-[14px] text-[#0d1e25] leading-relaxed">{f.answer}</p>
                    </div>
                  ) : (
                    <div className="text-[12px] text-[#3f6376] italic flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#006673] animate-pulse"></span>
                      <span>大师正在推衍审阅中，预计 48 小时内完成批复...</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cultural Integrity & Compliance Disclaimer Note (PDPA Safe) */}
        <div className="w-full p-4 rounded-xl bg-[#e7f6ff]/70 flex items-start gap-3 text-[#3e484b] border border-[#bec8cb]/20">
          <span className="material-symbols-outlined text-[#3f6376] text-[20px] shrink-0 mt-0.5">
            security
          </span>
          <div className="space-y-1">
            <p className="text-[12px] leading-relaxed">
              <strong>传统数理与合规免责声明：</strong>
              九星问测服务严格遵守马来西亚《2010年个人资料保护法》（PDPA）。本案例报告基于东方传统周易象数与时空奇门推衍模型，旨在为商业决策与个人生涯发展提供思维框架与传统文化参考，不构成具有法律效力的投资、财务、法律或医疗顾问意见。请用户结合商业常识与专业财务尽调独立决断。
            </p>
          </div>
        </div>
      </div>

      {/* Follow-up Inquiry Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1e25]/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#bec8cb]/30">
            <div className="flex items-center justify-between pb-3 border-b border-[#bec8cb]/20 mb-4">
              <h3 className="text-[18px] font-bold text-[#0d1e25] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006673]">contact_support</span>
                <span>向林清泉大师提交追问细节</span>
              </h3>
              <button
                onClick={() => setShowFollowUpModal(false)}
                className="text-[#6e797b] hover:text-[#0d1e25]"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSendFollowUp} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#0d1e25] mb-1">
                  追问问题描述 (针对本案雷泽归妹动爻或落地决策)
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={500}
                  value={followUpQuestion}
                  onChange={(e) => setFollowUpQuestion(e.target.value)}
                  placeholder="例如：关于八月防暗动，如果投资方在七月底要求提前签署备忘录，我该如何应对？"
                  className="w-full p-3 text-[14px] bg-[#f4faff] border border-[#bec8cb]/40 rounded-xl focus:border-[#006673] outline-none"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#f4faff] text-[#3e484b] hover:bg-[#d9ebf5] text-[13px]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#006673] hover:bg-[#1d808f] text-white font-semibold text-[13px] shadow-sm"
                >
                  确认提交追问
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Export Preview Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1e25]/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-[#bec8cb]/30">
            <div className="flex items-center justify-between pb-3 border-b border-[#bec8cb]/20 mb-4">
              <h3 className="text-[18px] font-bold text-[#0d1e25] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006673]">picture_as_pdf</span>
                <span>PDF 案卷生成中 · #{consultation.id}</span>
              </h3>
              <button
                onClick={() => setShowPdfModal(false)}
                className="text-[#6e797b] hover:text-[#0d1e25]"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-[#f4faff] rounded-xl border border-[#bec8cb]/20 text-[13px] text-[#3e484b] space-y-2 mb-4">
              <div className="flex justify-between">
                <span>案卷名称：</span>
                <span className="font-semibold text-[#0d1e25]">吉隆坡合伙事业动向与择期决疑</span>
              </div>
              <div className="flex justify-between">
                <span>求测人：</span>
                <span className="font-semibold text-[#0d1e25]">{consultation.name}</span>
              </div>
              <div className="flex justify-between">
                <span>排盘体系：</span>
                <span className="font-semibold text-[#0d1e25]">九星三十六牌阵 + 易经六十四卦</span>
              </div>
              <div className="flex justify-between">
                <span>加密规格：</span>
                <span className="font-semibold text-[#006673]">AES-256 PDPA 2010 独立密匙</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="px-4 py-2 rounded-lg bg-[#f4faff] text-[#3e484b] hover:bg-[#d9ebf5] text-[13px]"
              >
                关闭
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setShowPdfModal(false);
                }}
                className="px-5 py-2 rounded-lg bg-[#006673] hover:bg-[#1d808f] text-white font-semibold text-[13px] shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>打印 / 保存为 PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ask New Question & Auto-Shuffle Modal */}
      {showNewQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1e25]/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#bec8cb]/30">
            <div className="flex items-center justify-between pb-4 border-b border-[#bec8cb]/20 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-[#006673] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">casino</span>
                </span>
                <div>
                  <h3 className="text-[18px] font-bold text-[#0d1e25]">提出新问题 · 自动重新洗牌开盘</h3>
                  <p className="text-[12px] text-[#575d5f]">每一次新问题均会重洗 36 张时空牌阵</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewQuestionModal(false)}
                className="text-[#6e797b] hover:text-[#0d1e25] text-[18px] font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewQuestion} className="space-y-4">
              <div className="p-3 bg-[#fefce8] rounded-xl border border-[#fef08a] text-[12px] text-[#854d0e] flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] shrink-0 text-[#ca8a04]">info</span>
                <span>
                  <strong>排盘规制：</strong>提交后系统将根据新诉求自动对 36 张牌进行独立洗牌，重新排定流年基石牌、十二流月及变卦动爻。
                </span>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#0d1e25] mb-1">
                  求测人姓名与认证电话
                </label>
                <div className="px-3 py-2 bg-[#f4faff] rounded-lg border border-[#bec8cb]/40 text-[13px] text-[#3e484b]">
                  {consultation.name} · {consultation.phone}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="new-q-text" className="text-[13px] font-bold text-[#0d1e25]">
                    要问测的新问题 <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <span className="text-[11px] text-[#6e797b] font-mono">
                    {newQuestionText.length} / 1000
                  </span>
                </div>
                <textarea
                  id="new-q-text"
                  required
                  minLength={10}
                  maxLength={1000}
                  rows={4}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="例如：下个月计划与新加坡合作伙伴签署独家代理协议，但条款涉及较高对赌保证金，想问测本次签约吉凶与最佳签约月份？"
                  className="w-full p-3.5 bg-[#f4faff] text-[#0d1e25] rounded-xl text-[14px] border border-[#bec8cb]/40 focus:border-[#006673] focus:bg-white outline-none resize-none leading-relaxed shadow-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewQuestionModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#f4faff] hover:bg-[#d9ebf5] text-[#3e484b] text-[13px] font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="px-6 py-2.5 rounded-xl bg-[#006673] hover:bg-[#1d808f] text-white font-bold text-[13px] shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-[16px] ${isSubmittingNew ? 'animate-spin' : ''}`}>
                    casino
                  </span>
                  <span>{isSubmittingNew ? '正在洗牌排盘...' : '洗牌起盘 (Shuffle & Cast)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
