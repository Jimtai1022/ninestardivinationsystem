import React, { useState } from 'react';
import { PlayingCard, HexagramData } from '../types';
import {
  SUIT_MEANINGS,
  RANK_MEANINGS,
  STAR_CATEGORIES,
  EIGHT_PALACES_SPEC,
  getDailySlotSchedule,
} from '../lib/knowledgeBase';
import {
  analyzeAnnualCard,
  analyzeSeasonSpread,
  analyzeMonthlySpread,
  analyzePalaceSpread,
} from '../lib/cardEngine';

interface NineStar36CardBoardProps {
  cards: PlayingCard[];
  benGua?: HexagramData;
  bianGua?: HexagramData;
  movingLineIndex?: number;
  onShuffle?: () => void;
  isShuffling?: boolean;
}

export const NineStar36CardBoard: React.FC<NineStar36CardBoardProps> = ({
  cards,
  benGua,
  bianGua,
  movingLineIndex = 3,
  onShuffle,
  isShuffling = false,
}) => {
  const [selectedCard, setSelectedCard] = useState<PlayingCard | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'seasons' | 'months' | 'daily' | 'list'>('board');
  const [selectedPalace, setSelectedPalace] = useState<string | null>(null);
  const [selectedDailyMonth, setSelectedDailyMonth] = useState<number>(1);
  const [shufflingAnim, setShufflingAnim] = useState<boolean>(false);
  const [shuffleToast, setShuffleToast] = useState<string | null>(null);

  const handleTriggerShuffle = () => {
    if (!onShuffle) return;
    setShufflingAnim(true);
    setShuffleToast('正在洗牌重排 36 张时空牌卦...');
    setTimeout(() => {
      onShuffle();
      setShufflingAnim(false);
      setShuffleToast('✓ 36 张牌卦已全新洗牌起卦！流年基石牌与动爻已重新定位。');
      setTimeout(() => setShuffleToast(null), 3500);
    }, 450);
  };

  // Helper to find card by position (1 to 36)
  const getCard = (pos: number): PlayingCard => {
    return (
      cards.find((c) => c.position === pos) || {
        position: pos,
        suit: 'spade',
        rank: 'A',
        label: `Card ${pos}`,
        nameZh: `位置 ${pos}`,
        nameEn: `Position ${pos}`,
      }
    );
  };

  // Color theme mapping matching the master's diagram
  const getCardTheme = (pos: number) => {
    if (pos === 1) {
      return { bg: 'bg-[#22333a]', border: 'border-[#7ed3e3]', text: 'text-white', badgeBg: 'bg-[#22333a]', numColor: 'text-[#ffd700]' };
    }
    // 2, 7, 6: Green theme
    if (pos === 2 || pos === 7 || pos === 6) {
      return { bg: 'bg-[#2d7d46]', border: 'border-[#4ade80]', text: 'text-white', badgeBg: 'bg-[#2d7d46]', numColor: 'text-[#ffd700]' };
    }
    // 3, 9, 10: Red/Orange theme
    if (pos === 3 || pos === 9 || pos === 10) {
      return { bg: 'bg-[#c2410c]', border: 'border-[#fb923c]', text: 'text-white', badgeBg: 'bg-[#c2410c]', numColor: 'text-[#ffd700]' };
    }
    // 4, 12, 13: Gold/Yellow theme
    if (pos === 4 || pos === 12 || pos === 13) {
      return { bg: 'bg-[#b45309]', border: 'border-[#fde047]', text: 'text-white', badgeBg: 'bg-[#b45309]', numColor: 'text-[#ffd700]' };
    }
    // 5, 15, 16: Blue theme
    if (pos === 5 || pos === 15 || pos === 16) {
      return { bg: 'bg-[#1d4ed8]', border: 'border-[#60a5fa]', text: 'text-white', badgeBg: 'bg-[#1d4ed8]', numColor: 'text-[#ffd700]' };
    }
    // 8, 11, 14, 17: Brown/Earth theme
    if (pos === 8 || pos === 11 || pos === 14 || pos === 17) {
      return { bg: 'bg-[#5c3a21]', border: 'border-[#a87148]', text: 'text-white', badgeBg: 'bg-[#5c3a21]', numColor: 'text-[#ffd700]' };
    }
    // 18 to 36: Black cards with bright yellow text
    return { bg: 'bg-[#0f172a]', border: 'border-[#334155]', text: 'text-white', badgeBg: 'bg-[#000000]', numColor: 'text-[#facc15]' };
  };

  // 12 clock radial positions for (Middle 6..17) and (Outer 18..29)
  // Matching the diagram:
  // 10 is at Top (12:00, angle -90°)
  // 11 is at 1:00 (-60°)
  // 12 is at 2:00 (-30°)
  // 13 is at 3:00 (0°, East/Right)
  // 14 is at 4:00 (30°)
  // 15 is at 5:00 (60°)
  // 16 is at 6:00 (90°, South/Bottom)
  // 17 is at 7:00 (120°)
  // 6  is at 8:00 (150°)
  // 7  is at 9:00 (180°, West/Left)
  // 8  is at 10:00 (210°)
  // 9  is at 11:00 (240°)
  const SPOKE_CONFIGS = [
    { middlePos: 10, outerPos: 22, angleDeg: -90, labelZh: '五月★ (午位)' },
    { middlePos: 11, outerPos: 23, angleDeg: -60, labelZh: '六月 (未位)' },
    { middlePos: 12, outerPos: 24, angleDeg: -30, labelZh: '七月★ (申位)' },
    { middlePos: 13, outerPos: 25, angleDeg: 0, labelZh: '八月▲ (酉位)' },
    { middlePos: 14, outerPos: 26, angleDeg: 30, labelZh: '九月★ (戌位)' },
    { middlePos: 15, outerPos: 27, angleDeg: 60, labelZh: '十月 (亥位)' },
    { middlePos: 16, outerPos: 28, angleDeg: 90, labelZh: '冬月 (子位)' },
    { middlePos: 17, outerPos: 29, angleDeg: 120, labelZh: '腊月 (丑位)' },
    { middlePos: 6, outerPos: 18, angleDeg: 150, labelZh: '正月 (寅位)' },
    { middlePos: 7, outerPos: 19, angleDeg: 180, labelZh: '二月 (卯位)' },
    { middlePos: 8, outerPos: 20, angleDeg: 210, labelZh: '三月 (辰位)' },
    { middlePos: 9, outerPos: 21, angleDeg: 240, labelZh: '四月 (巳位)' },
  ];

  // Center coordinate in 800x800 container: (360, 400)
  const CX = 360;
  const CY = 400;
  const R_INNER = 100;
  const R_MIDDLE = 195;
  const R_OUTER = 295;

  // Single Card Tile Component matching the visual in image.png
  const RenderCardTile = ({
    pos,
    x,
    y,
    rotation = 0,
    width = 54,
    height = 68,
  }: {
    pos: number;
    x: number;
    y: number;
    rotation?: number;
    width?: number;
    height?: number;
  }) => {
    const card = getCard(pos);
    const theme = getCardTheme(pos);
    const isRed = card.suit === 'diamond' || card.suit === 'heart';
    const isSelected = selectedCard?.position === pos;
    const isPalaceHighlighted =
      selectedPalace &&
      EIGHT_PALACES_SPEC[selectedPalace]?.cardPositions.includes(pos);

    return (
      <div
        onClick={() => setSelectedCard(card)}
        style={{
          left: `${x - width / 2}px`,
          top: `${y - height / 2}px`,
          width: `${width}px`,
          height: `${height}px`,
          transform: `rotate(${rotation}deg)`,
        }}
        className={`absolute rounded-lg border-2 shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between p-1 select-none ${
          theme.bg
        } ${theme.border} ${
          isPalaceHighlighted
            ? 'border-[#dc2626] ring-4 ring-[#dc2626] shadow-[0_0_20px_rgba(220,38,38,0.85)] scale-110 z-30'
            : isSelected
            ? 'ring-4 ring-[#ffd700] scale-110 z-30'
            : 'hover:scale-105 z-10'
        } ${
          shufflingAnim ? 'scale-90 opacity-60 rotate-6 transition-all duration-300' : ''
        }`}
        title={`Card ${pos}: ${card.nameZh} (${card.roleTitleZh || ''})`}
      >
        {/* Top position number badge like the image */}
        <div className="flex items-center justify-between">
          <span
            className={`text-[12px] font-black leading-none px-1 rounded ${theme.numColor} font-mono`}
          >
            {pos}
          </span>
          <span
            className={`text-[11px] font-bold ${
              isRed ? 'text-[#ff4d4f]' : 'text-white'
            }`}
          >
            {card.label?.split(' ')[0]}
          </span>
        </div>

        {/* Center Card Value */}
        <div className="text-center my-auto">
          <span
            className={`text-[15px] font-black leading-none block ${
              isRed ? 'text-[#ff7875]' : 'text-white'
            }`}
          >
            {card.rank}
          </span>
        </div>

        {/* Bottom subtle role tag */}
        <div className="text-[8px] text-center text-white/80 truncate font-sans scale-90">
          {card.roleTitleZh?.split(' ')[0] || `位${pos}`}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#fcfaf6] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e2d9cc] relative overflow-hidden">
      {/* Background traditional parchment aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#f3ece0]/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Header bar matching the user's diagram */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-6 border-b border-[#e5dcd0] gap-4 relative z-10">
        <div className="flex flex-wrap items-center gap-3">
          {/* Brown bordered title box matching image */}
          <div className="px-4 py-2 rounded-lg border-2 border-[#854d0e] bg-[#fefce8] text-[#854d0e] font-black text-[18px] sm:text-[20px] shadow-sm tracking-wide">
            九星牌卦 36张牌开牌顺序
          </div>

          <div className="flex flex-col">
            <span className="text-[16px] font-black text-[#dc2626]">
              第一部分 17张
            </span>
            <span className="text-[12px] text-[#4b5563]">
              第1至17张牌是需要顺序1号 至 17号来开牌。
            </span>
          </div>
        </div>

        {/* Action controls: Shuffle & View Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {onShuffle && (
            <button
              onClick={handleTriggerShuffle}
              disabled={isShuffling || shufflingAnim}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006673] hover:bg-[#1d808f] text-white font-bold text-[13px] shadow-md transition-all cursor-pointer group disabled:opacity-50"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  shufflingAnim || isShuffling ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'
                }`}
              >
                casino
              </span>
              <span>{shufflingAnim || isShuffling ? '正在重排牌阵...' : '每问重新洗牌开盘 (Shuffle)'}</span>
            </button>
          )}

          <div className="flex flex-wrap items-center bg-[#f1ede4] p-1 rounded-xl text-[12px] border border-[#d6cbba] gap-1">
            <button
              onClick={() => setViewMode('board')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white text-[#006673] shadow-sm'
                  : 'text-[#4b5563] hover:text-[#111827]'
              }`}
            >
              盘阵原图透视
            </button>
            <button
              onClick={() => setViewMode('seasons')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'seasons'
                  ? 'bg-white text-[#006673] shadow-sm'
                  : 'text-[#4b5563] hover:text-[#111827]'
              }`}
            >
              四季牌卦 (1+2..5)
            </button>
            <button
              onClick={() => setViewMode('months')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'months'
                  ? 'bg-white text-[#006673] shadow-sm'
                  : 'text-[#4b5563] hover:text-[#111827]'
              }`}
            >
              十二流月 (2+6..5+17)
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'daily'
                  ? 'bg-white text-[#006673] shadow-sm'
                  : 'text-[#4b5563] hover:text-[#111827]'
              }`}
            >
              流日时辰 (18~29)
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[#006673] shadow-sm'
                  : 'text-[#4b5563] hover:text-[#111827]'
              }`}
            >
              36 牌清单明细
            </button>
          </div>
        </div>
      </div>

      {/* Shuffling Toast Feedback */}
      {shuffleToast && (
        <div className="mb-4 px-4 py-2.5 rounded-xl bg-[#006673] text-white text-[13px] font-semibold flex items-center gap-2 shadow-md animate-fadeIn">
          <span className="material-symbols-outlined text-[18px] text-[#7ed3e3]">auto_mode</span>
          <span>{shuffleToast}</span>
        </div>
      )}

      {/* The 3-Part Layout Rule Architecture Guide matching Master's Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 p-3.5 bg-[#f4eee5] rounded-2xl border border-[#ded3c3] text-[12px]">
        <div className="flex items-start gap-2.5">
          <span className="w-5 h-5 rounded-full bg-[#dc2626] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
            1
          </span>
          <div>
            <strong className="text-[#991b1b] block">第一部分 17张（顺序开牌）</strong>
            <span className="text-[#5c5449] leading-tight block mt-0.5">
              第 1 至 17 号：1号中心基石牌，2~5号四正季节牌，6~17号十二流月主盘。
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <span className="w-5 h-5 rounded-full bg-[#854d0e] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
            2
          </span>
          <div>
            <strong className="text-[#854d0e] block">第二部分 12张（外环牌照）</strong>
            <span className="text-[#5c5449] leading-tight block mt-0.5">
              第 18 至 29 号：环列于 6~17 号外圈，顺应当前农历月流转，主断流日与时辰。
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <span className="w-5 h-5 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
            3
          </span>
          <div>
            <strong className="text-[#1e293b] block">第三部分 7张（易卦与动爻）</strong>
            <span className="text-[#5c5449] leading-tight block mt-0.5">
              第 30 至 35 号自下而上立六爻成卦；Card 36 依牌面点数锁定动爻定变卦。
            </span>
          </div>
        </div>
      </div>

      {/* Eight Palaces Coordinate Visualizer (Document 2 Page 1-8) */}
      <div className="mb-6 p-4 bg-white rounded-2xl border border-[#ded3c3] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <span className="text-[13px] font-black text-[#854d0e] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">explore</span>
            <span>九星牌卦八宫坐标探查（原书真传红框对照）:</span>
          </span>
          {selectedPalace && (
            <button
              onClick={() => setSelectedPalace(null)}
              className="text-[12px] text-[#dc2626] hover:underline font-bold cursor-pointer"
            >
              ✕ 清除红框高亮
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(EIGHT_PALACES_SPEC).map(([key, spec]) => (
            <button
              key={key}
              onClick={() => setSelectedPalace(selectedPalace === key ? null : key)}
              className={`px-3 py-1 rounded-xl text-[12px] font-bold border transition-all cursor-pointer ${
                selectedPalace === key
                  ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-md scale-105'
                  : 'bg-[#fcfaf6] text-[#4b5563] border-[#d6cbba] hover:border-[#854d0e]'
              }`}
            >
              {spec.nameZh} ({spec.compassDirZh.split('（')[0]} · {spec.cardPositions.join(', ')}号)
            </button>
          ))}
        </div>
        {selectedPalace && (
          <div className="mt-3 p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[12px] text-[#991b1b] animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold mb-1">
              <span>
                【{EIGHT_PALACES_SPEC[selectedPalace].nameZh}】对应卡牌：
                {EIGHT_PALACES_SPEC[selectedPalace].cardPositions.join('号、')}号牌
                （{EIGHT_PALACES_SPEC[selectedPalace].compassDirZh}）
              </span>
              <span className="px-2 py-0.5 rounded bg-[#fee2e2] text-[#dc2626] text-[11px]">
                盘中已加红框高亮显示
              </span>
            </div>
            <div className="text-[#7f1d1d] leading-relaxed">
              <strong>领域范畴：</strong>
              {EIGHT_PALACES_SPEC[selectedPalace].scopeZh}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area switched by viewMode */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center justify-center relative z-10 overflow-x-auto py-2">
          {/* Left: The 29-Card Celestial Compass Array (Col 8) */}
          <div className="xl:col-span-8 flex justify-center items-center">
            <div
              className="relative w-[720px] h-[780px] bg-[#fbf9f4] rounded-full border border-[#e5dcd0] shadow-inner mx-auto shrink-0"
              style={{
                background:
                  'radial-gradient(circle, rgba(254, 252, 232, 0.9) 0%, rgba(243, 236, 224, 0.5) 50%, rgba(235, 224, 206, 0.2) 100%)',
              }}
            >
              {/* Radial guides & concentric orbit rings */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full absolute inset-0">
                  {/* Concentric guide circles */}
                  <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="#d6cbba" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  <circle cx={CX} cy={CY} r={R_MIDDLE} fill="none" stroke="#b8ab96" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="#9c8e78" strokeWidth="1.5" opacity="0.4" />

                  {/* 12 Celestial Spoke Rays connecting inner to outer */}
                  {SPOKE_CONFIGS.map((spoke, idx) => {
                    const rad = (spoke.angleDeg * Math.PI) / 180;
                    const x1 = CX + (R_INNER + 30) * Math.cos(rad);
                    const y1 = CY + (R_INNER + 30) * Math.sin(rad);
                    const x2 = CX + (R_OUTER + 40) * Math.cos(rad);
                    const y2 = CY + (R_OUTER + 40) * Math.sin(rad);
                    return (
                      <line
                        key={`spoke-${idx}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#b8ab96"
                        strokeWidth="1"
                        strokeDasharray="2 3"
                        opacity="0.5"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* 1. Center Card: Position 1 (Annual Master Card) */}
              <RenderCardTile pos={1} x={CX} y={CY} width={58} height={74} />
              <div
                style={{ left: `${CX}px`, top: `${CY + 45}px` }}
                className="absolute -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#22333a] text-[#ffd700] text-[9px] font-black pointer-events-none z-20 shadow-xs whitespace-nowrap"
              >
                1号中心基石
              </div>

              {/* 2. Four Cardinal Season Cards (2, 3, 4, 5) around center */}
              {/* Position 2 (West / Left, 9 o'clock) */}
              <RenderCardTile pos={2} x={CX - R_INNER} y={CY} width={54} height={68} />
              <div
                style={{ left: `${CX - R_INNER}px`, top: `${CY + 42}px` }}
                className="absolute -translate-x-1/2 px-1 rounded bg-[#2d7d46] text-[#ffd700] text-[9px] font-bold pointer-events-none z-20 whitespace-nowrap"
              >
                2号 · 卯 (春)
              </div>

              {/* Position 3 (North / Top, 12 o'clock) */}
              <RenderCardTile pos={3} x={CX} y={CY - R_INNER} width={54} height={68} />
              <div
                style={{ left: `${CX}px`, top: `${CY - R_INNER - 42}px` }}
                className="absolute -translate-x-1/2 px-1 rounded bg-[#c2410c] text-[#ffd700] text-[9px] font-bold pointer-events-none z-20 whitespace-nowrap"
              >
                3号 · 午 (夏)
              </div>

              {/* Position 4 (East / Right, 3 o'clock) */}
              <RenderCardTile pos={4} x={CX + R_INNER} y={CY} width={54} height={68} />
              <div
                style={{ left: `${CX + R_INNER}px`, top: `${CY + 42}px` }}
                className="absolute -translate-x-1/2 px-1 rounded bg-[#b45309] text-[#ffd700] text-[9px] font-bold pointer-events-none z-20 whitespace-nowrap"
              >
                4号 · 酉 (秋)
              </div>

              {/* Position 5 (South / Bottom, 6 o'clock) */}
              <RenderCardTile pos={5} x={CX} y={CY + R_INNER} width={54} height={68} />
              <div
                style={{ left: `${CX}px`, top: `${CY + R_INNER + 42}px` }}
                className="absolute -translate-x-1/2 px-1 rounded bg-[#1d4ed8] text-[#ffd700] text-[9px] font-bold pointer-events-none z-20 whitespace-nowrap"
              >
                5号 · 子 (冬)
              </div>

              {/* 3. The 12 Spoke Cards (Middle: 6..17, Outer: 18..29) */}
              {SPOKE_CONFIGS.map((spoke, idx) => {
                const rad = (spoke.angleDeg * Math.PI) / 180;
                // Middle card coordinate
                const mx = CX + R_MIDDLE * Math.cos(rad);
                const my = CY + R_MIDDLE * Math.sin(rad);

                // Outer card coordinate
                const ox = CX + R_OUTER * Math.cos(rad);
                const oy = CY + R_OUTER * Math.sin(rad);

                // Spoke month label badge midway between middle and outer card
                const labelR = (R_MIDDLE + R_OUTER) / 2;
                const lx = CX + labelR * Math.cos(rad);
                const ly = CY + labelR * Math.sin(rad);

                // Subtle radial rotation for authentic mandala spoke effect
                const rot = spoke.angleDeg + 90;

                return (
                  <React.Fragment key={idx}>
                    {/* Spoke Month & Branch Indicator Tag */}
                    <div
                      style={{ left: `${lx}px`, top: `${ly}px` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-full bg-[#fefce8] border border-[#ca8a04]/40 text-[9px] font-black text-[#854d0e] shadow-xs select-none pointer-events-none z-20 whitespace-nowrap"
                    >
                      {spoke.labelZh.split(' ')[0]}
                    </div>

                    {/* Middle Card (6 to 17) */}
                    <RenderCardTile
                      pos={spoke.middlePos}
                      x={mx}
                      y={my}
                      rotation={rot}
                      width={52}
                      height={66}
                    />
                    {/* Outer Card (18 to 29) */}
                    <RenderCardTile
                      pos={spoke.outerPos}
                      x={ox}
                      y={oy}
                      rotation={rot}
                      width={54}
                      height={68}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Right: The Hexagram Column Cards 30 to 36 (Col 4) */}
          <div className="xl:col-span-4 flex flex-col items-center justify-center p-6 bg-white/70 rounded-2xl border border-[#e5dcd0] shadow-sm">
            <div className="text-center mb-6">
              <span className="text-[12px] font-bold text-[#854d0e] uppercase tracking-wider block">
                易经六十四卦本变之阵
              </span>
              <h3 className="text-[18px] font-black text-[#111827] mt-1">
                六爻排位 (Cards 30 - 35) & 动爻 (Card 36)
              </h3>
              <p className="text-[12px] text-[#6b7280] mt-1">
                方块/红心为阳爻（—），黑桃/梅花为阴爻（- -）
              </p>
            </div>

            {/* Vertical Stack from 35 (top) down to 30 (bottom), with 36 alongside moving line */}
            <div className="relative flex flex-col items-center gap-3.5 w-full max-w-[280px]">
              {[35, 34, 33, 32, 31, 30].map((pos) => {
                const lineIndex = pos - 29; // 30->1, 31->2, 32->3, 33->4, 34->5, 35->6
                const card = getCard(pos);
                const isYang = card.suit === 'diamond' || card.suit === 'heart';
                const isMoving = lineIndex === movingLineIndex;
                const isSelected = selectedCard?.position === pos;

                return (
                  <div key={pos} className="relative flex items-center justify-center w-full">
                    {/* Line Index Label */}
                    <span className="absolute -left-12 text-[12px] font-bold text-[#6b7280] font-mono">
                      爻 {lineIndex}
                    </span>

                    {/* Card 30..35 Tile */}
                    <div
                      onClick={() => setSelectedCard(card)}
                      className={`w-32 h-14 rounded-xl border-2 flex items-center justify-between px-3 cursor-pointer transition-all shadow-sm ${
                        isMoving
                          ? 'bg-[#1e1b4b] border-[#ef4444] ring-2 ring-[#ef4444] scale-105'
                          : 'bg-[#0f172a] border-[#334155] hover:border-[#64748b]'
                      } ${isSelected ? 'ring-4 ring-[#ffd700]' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[18px] font-black text-[#facc15] font-mono">
                          {pos}
                        </span>
                        <span
                          className={`text-[14px] font-bold ${
                            card.suit === 'diamond' || card.suit === 'heart'
                              ? 'text-[#ff4d4f]'
                              : 'text-white'
                          }`}
                        >
                          {card.label}
                        </span>
                      </div>

                      {/* Line symbol */}
                      <div className="text-right">
                        <span
                          className={`text-[12px] font-bold px-2 py-0.5 rounded ${
                            isYang
                              ? 'bg-[#006673] text-white'
                              : 'bg-[#3f6376] text-white'
                          }`}
                        >
                          {isYang ? '阳 ⚊' : '阴 ⚋'}
                        </span>
                      </div>
                    </div>

                    {/* Beside the Moving Line: Place Card 36 with Pointer Indicator! */}
                    {isMoving && (
                      <div className="absolute -right-24 flex items-center gap-2 animate-bounce">
                        <span className="text-[18px] text-[#dc2626]">◀</span>
                        <div
                          onClick={() => setSelectedCard(getCard(36))}
                          className={`w-16 h-14 rounded-xl border-2 border-[#ef4444] bg-[#450a0a] flex flex-col items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform ${
                            selectedCard?.position === 36 ? 'ring-4 ring-[#ffd700]' : ''
                          }`}
                          title="Card 36 动爻牌"
                        >
                          <span className="text-[16px] font-black text-[#facc15] font-mono leading-none">
                            36
                          </span>
                          <span className="text-[11px] font-bold text-[#ff7875] mt-0.5">
                            {getCard(36).label}
                          </span>
                          <span className="text-[8px] text-white/90">动爻</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Hexagram Outcome Pill */}
            {benGua && bianGua && (
              <div className="mt-8 p-3.5 bg-[#fefce8] rounded-xl border border-[#fef08a] text-center w-full">
                <div className="text-[13px] font-bold text-[#854d0e]">
                  本卦【{benGua.nameZh}】 ➔ 变卦【{bianGua.nameZh}】
                </div>
                <div className="text-[11px] text-[#713f12] mt-1">
                  第 {movingLineIndex} 爻动，Card 36 [{getCard(36).label}] 定盘
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Mode: Seasons Spread (Document 1 Page 3-4) */}
      {viewMode === 'seasons' && (
        <div className="space-y-4 py-2">
          <div className="p-3 bg-[#e7f6ff] rounded-xl border border-[#b8e2f8] text-[13px] text-[#006673] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">wb_sunny</span>
            <span>
              <strong>季节运势规制（原书 Page 4）：</strong>每个季节吉凶需要根据“1号牌”分别与 2号(春)、3号(夏)、4号(秋)、5号(冬)的牌卦组合进行分析。
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyzeSeasonSpread(cards).map((s, idx) => {
              const star = STAR_CATEGORIES[s.evalResult.starType];
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-[#ded3c3] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#eee] mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-[#f4eee5] font-black text-[#854d0e] text-[14px]">
                          {s.seasonZh.split(' ')[0]}
                        </span>
                        <span className="text-[12px] text-[#6b7280]">
                          1号【{s.pairCards[0].label}】+ {s.cardSeasonPos}号【{s.pairCards[1].label}】
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${star.badgeClass}`}>
                        {star.nameZh} {star.tier}
                      </span>
                    </div>

                    <h4 className="text-[16px] font-black text-[#0d1e25] mb-2">
                      {s.evalResult.titleZh}
                    </h4>
                    <p className="text-[13px] text-[#4b5563] leading-relaxed mb-3">
                      {s.interpretationZh}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#f4f4f4] grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-[#f8fafc]">
                      <strong className="text-[#0d1e25] block">事业断语：</strong>
                      <span className="text-[#475569]">{s.evalResult.careerZh}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#f8fafc]">
                      <strong className="text-[#0d1e25] block">财运断语：</strong>
                      <span className="text-[#475569]">{s.evalResult.wealthZh}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View Mode: Monthly Spread (Document 1 Page 5-6) */}
      {viewMode === 'months' && (
        <div className="space-y-4 py-2">
          <div className="p-3 bg-[#e7f6ff] rounded-xl border border-[#b8e2f8] text-[13px] text-[#006673] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            <span>
              <strong>十二流月运势规制（原书 Page 6）：</strong>农历正月至三月以 2 号春令牌组合(2+6, 2+7, 2+8)；四月至六月以 3 号夏令牌组合(3+9, 3+10, 3+11)；七月至九月以 4 号秋令牌组合(4+12, 4+13, 4+14)；十月至腊月以 5 号冬令牌组合(5+15, 5+16, 5+17)。
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {analyzeMonthlySpread(cards).map((m, idx) => {
              const star = STAR_CATEGORIES[m.evalResult.starType];
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white border border-[#ded3c3] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-[#0d1e25] text-[14px]">
                        {m.monthNameZh}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${star.badgeClass}`}>
                        {star.nameZh}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[12px] font-mono text-[#6b7280] mb-2 p-1.5 rounded bg-[#f9fafb]">
                      <span>{m.seasonCardPos}号【{m.cSeason.label}】</span>
                      <span>+</span>
                      <span>{m.monthCardPos}号【{m.cMonth.label}】</span>
                    </div>

                    <div className="font-bold text-[13px] text-[#854d0e] mb-1">
                      {m.evalResult.titleZh}
                    </div>
                    <p className="text-[12px] text-[#4b5563] leading-relaxed line-clamp-3">
                      {m.summaryZh}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#f1f1f1] text-[11px] text-[#64748b]">
                    <strong>谋策：</strong>{m.evalResult.careerZh}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View Mode: Daily Slots Schedule (Document 1 Page 7-18) */}
      {viewMode === 'daily' && (
        <div className="space-y-4 py-2">
          <div className="p-4 bg-white rounded-2xl border border-[#ded3c3] shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-[16px] font-black text-[#0d1e25]">
                  九星牌卦流日时辰开牌对照表（原书 Page 7-18）
                </h4>
                <p className="text-[12px] text-[#6b7280] mt-0.5">
                  第 18 至 29 张牌顺应当前农历月份顺时针排起，精准对应每日逢初一/十三/二十五等日子及十二时辰。
                </p>
              </div>

              {/* Month selector 1..12 */}
              <div className="flex items-center gap-1 overflow-x-auto p-1 bg-[#f4eee5] rounded-xl text-[12px]">
                <span className="px-2 font-bold text-[#854d0e] text-[11px]">切换农历月：</span>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedDailyMonth(m)}
                    className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedDailyMonth === m
                        ? 'bg-[#006673] text-white shadow-xs'
                        : 'text-[#4b5563] hover:text-[#000]'
                    }`}
                  >
                    {m === 1 ? '正月' : m === 11 ? '冬月' : m === 12 ? '腊月' : `${m}月`}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#e5dcd0] text-[#6b7280] text-[11px] uppercase">
                    <th className="py-2.5 px-3">顺次</th>
                    <th className="py-2.5 px-3">外环牌号</th>
                    <th className="py-2.5 px-3">当前盘牌面</th>
                    <th className="py-2.5 px-3">对应农历流日</th>
                    <th className="py-2.5 px-3">对应时辰</th>
                    <th className="py-2.5 px-3">时辰区间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3ede3]">
                  {getDailySlotSchedule(selectedDailyMonth).map((slot) => {
                    const card = getCard(slot.cardPos);
                    const isRed = card.suit === 'diamond' || card.suit === 'heart';
                    return (
                      <tr key={slot.slotIndex} className="hover:bg-[#fbf9f4] transition-colors">
                        <td className="py-2 px-3 font-mono font-bold text-[#6b7280]">
                          第 {slot.slotIndex} 张
                        </td>
                        <td className="py-2 px-3 font-bold font-mono text-[#854d0e]">
                          {slot.cardPos} 号牌
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded font-black font-mono text-[12px] ${
                              isRed ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {card.label} ({card.nameZh})
                          </span>
                        </td>
                        <td className="py-2 px-3 font-semibold text-[#0d1e25]">
                          {slot.daysZh}
                        </td>
                        <td className="py-2 px-3 font-bold text-[#006673]">
                          {slot.branchZh}
                        </td>
                        <td className="py-2 px-3 text-[#64748b] font-mono text-[12px]">
                          {slot.timeRange}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View Mode: List Mode */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3 py-2">
          {cards.map((c) => {
            const theme = getCardTheme(c.position);
            const isRed = c.suit === 'diamond' || c.suit === 'heart';
            return (
              <div
                key={c.position}
                onClick={() => setSelectedCard(c)}
                className={`p-3 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all shadow-sm hover:scale-105 ${theme.bg} ${theme.border}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[14px] font-black font-mono ${theme.numColor}`}>
                    {c.position}
                  </span>
                  <span className="text-[11px] text-white/70">{c.roleTitleZh}</span>
                </div>
                <div className="text-center my-2">
                  <span
                    className={`text-[20px] font-black ${
                      isRed ? 'text-[#ff4d4f]' : 'text-white'
                    }`}
                  >
                    {c.label}
                  </span>
                </div>
                <div className="text-[10px] text-white/80 text-center truncate">
                  {c.nameZh}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Card Modal / Master Knowledge Inspector */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#bec8cb]/30 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#bec8cb]/20 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-[#006673] text-white flex items-center justify-center font-black text-[15px] font-mono shadow-sm">
                  {selectedCard.position}
                </span>
                <div>
                  <h4 className="text-[18px] font-bold text-[#0d1e25]">
                    {selectedCard.nameZh} · {selectedCard.label}
                  </h4>
                  <span className="text-[12px] text-[#6b7280]">
                    第 {selectedCard.position} 号牌位（{selectedCard.roleTitleZh}）
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="text-[#6e797b] hover:text-[#0d1e25] font-bold text-[20px] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-[13px] text-[#3e484b]">
              {/* Suit Meaning (Document 2 Page 9-10) */}
              <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <strong className="text-[#0d1e25] flex items-center gap-1.5 text-[14px] mb-1">
                  <span>花色象意（原书 Page 9-10）：</span>
                  <span className="text-[#006673]">{SUIT_MEANINGS[selectedCard.suit]?.nameZh}</span>
                </strong>
                <div className="space-y-1 text-[12px]">
                  <p className="text-emerald-700">
                    <strong>吉兆显现：</strong>{SUIT_MEANINGS[selectedCard.suit]?.auspiciousZh.join('、')}
                  </p>
                  <p className="text-rose-700">
                    <strong>凶兆防范：</strong>{SUIT_MEANINGS[selectedCard.suit]?.inauspiciousZh.join('、')}
                  </p>
                  <p className="text-slate-600 mt-1 italic">
                    {SUIT_MEANINGS[selectedCard.suit]?.summaryZh}
                  </p>
                </div>
              </div>

              {/* Rank Meaning (Document 2 Page 11-12) */}
              <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <strong className="text-[#0d1e25] flex items-center gap-1.5 text-[14px] mb-1">
                  <span>牌豪点数象意（原书 Page 11-12）：</span>
                  <span className="text-[#006673]">{RANK_MEANINGS[selectedCard.rank]?.nameZh} ({selectedCard.rank})</span>
                </strong>
                <p className="text-[12px] text-[#475569] leading-relaxed">
                  {RANK_MEANINGS[selectedCard.rank]?.significanceZh}
                </p>
              </div>

              {/* Palace affiliation */}
              {Object.entries(EIGHT_PALACES_SPEC).find(([_, p]) => p.cardPositions.includes(selectedCard.position)) && (
                <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[12px]">
                  {(() => {
                    const match = Object.entries(EIGHT_PALACES_SPEC).find(([_, p]) => p.cardPositions.includes(selectedCard.position))!;
                    return (
                      <div>
                        <strong className="text-[#991b1b]">所属八宫坐标：【{match[1].nameZh}】（{match[1].compassDirZh}）</strong>
                        <p className="text-[#7f1d1d] mt-1">{match[1].scopeZh}</p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Special logic if Card 36 (Document 1 Page 24) */}
              {selectedCard.position === 36 && (
                <div className="p-3.5 rounded-xl bg-[#fefce8] border border-[#fde047] text-[12px] text-[#854d0e]">
                  <strong className="text-[13px] block mb-1">
                    动爻定位对照表（原书 Page 24 秘传）：
                  </strong>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] mb-2">
                    <div>10, 7 ➔ 初爻 (30号牌)</div>
                    <div>J, 8 ➔ 二爻 (31号牌)</div>
                    <div>Q, 9 ➔ 三爻 (32号牌)</div>
                    <div>K ➔ 四爻 (33号牌)</div>
                    <div>Ace ➔ 五爻 (34号牌)</div>
                    <div>6 ➔ 上爻 (35号牌)</div>
                  </div>
                  <p className="leading-relaxed text-[#713f12]">
                    当前第 36 张牌点数为【{selectedCard.rank}】，依据秘传法则精准锁定第 {movingLineIndex} 爻动。阳爻动变阴，阴爻动变阳，定准变卦时空应期！
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedCard(null)}
                className="px-5 py-2 rounded-xl bg-[#006673] text-white text-[13px] font-bold shadow-sm hover:bg-[#1d808f] cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
