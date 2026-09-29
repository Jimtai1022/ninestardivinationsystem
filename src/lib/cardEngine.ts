import { PlayingCard, HexagramData } from '../types';

export const VALID_SUITS = ['spade', 'heart', 'club', 'diamond'] as const;
export const VALID_RANKS = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;

export const SUIT_SYMBOLS: Record<string, string> = {
  spade: '♠',
  heart: '♥',
  club: '♣',
  diamond: '♦',
};

export const SUIT_NAMES_ZH: Record<string, string> = {
  spade: '黑桃',
  heart: '红心',
  club: '梅花',
  diamond: '方块',
};

export const SUIT_NAMES_EN: Record<string, string> = {
  spade: 'Spade',
  heart: 'Heart',
  club: 'Club',
  diamond: 'Diamond',
};

// Trigrams (Ba Gua)
// 3 lines from bottom to top: [line1, line2, line3]
export const TRIGRAMS: Record<string, { nameZh: string; nameEn: string; lines: [boolean, boolean, boolean] }> = {
  Qian: { nameZh: '天 (乾)', nameEn: 'Heaven (Qian)', lines: [true, true, true] },
  Dui: { nameZh: '泽 (兑)', nameEn: 'Lake (Dui)', lines: [true, true, false] },
  Li: { nameZh: '火 (离)', nameEn: 'Fire (Li)', lines: [true, false, true] },
  Zhen: { nameZh: '雷 (震)', nameEn: 'Thunder (Zhen)', lines: [true, false, false] },
  Xun: { nameZh: '风 (巽)', nameEn: 'Wind (Xun)', lines: [false, true, true] },
  Kan: { nameZh: '水 (坎)', nameEn: 'Water (Kan)', lines: [false, true, false] },
  Gen: { nameZh: '山 (艮)', nameEn: 'Mountain (Gen)', lines: [false, false, true] },
  Kun: { nameZh: '地 (坤)', nameEn: 'Earth (Kun)', lines: [false, false, false] },
};

export function getTrigramName(l1: boolean, l2: boolean, l3: boolean): string {
  for (const [key, trigram] of Object.entries(TRIGRAMS)) {
    if (trigram.lines[0] === l1 && trigram.lines[1] === l2 && trigram.lines[2] === l3) {
      return key;
    }
  }
  return 'Qian';
}

// 64 Hexagram lookup table: [upper, lower] -> Name
export const HEXAGRAM_NAMES: Record<string, { nameZh: string; nameEn: string; summaryZh: string; summaryEn: string }> = {
  'Zhen-Qian': {
    nameZh: '雷天大壮',
    nameEn: 'Great Power (Da Zhuang)',
    summaryZh: '盛壮内蕴 · 慎防躁进，刚健笃实以成大事',
    summaryEn: 'Inner vigor and great strength; avoid haste and ground decisions in law.',
  },
  'Zhen-Dui': {
    nameZh: '雷泽归妹',
    nameEn: 'Marrying Maiden (Gui Mei)',
    summaryZh: '权宜归从 · 顺势而结，切忌口头默契，法约前置',
    summaryEn: 'Harmonious concession and formal alliances; bind duties in contracts.',
  },
  'Qian-Qian': {
    nameZh: '乾为天',
    nameEn: 'The Creative (Qian)',
    summaryZh: '天行健，君子以自强不息，飞龙在天利见大人',
    summaryEn: 'Supreme creative drive and relentless self-strengthening.',
  },
  'Kun-Kun': {
    nameZh: '坤为地',
    nameEn: 'The Receptive (Kun)',
    summaryZh: '地势坤，厚德载物，宽容蕴蓄，柔顺贞祥',
    summaryEn: 'Deep maternal patience, nurturing resources and stable foundations.',
  },
  'Kan-Li': {
    nameZh: '水火既济',
    nameEn: 'After Completion (Ji Ji)',
    summaryZh: '阴阳调和，亨小利贞，初吉终乱，防患未然',
    summaryEn: 'Water and Fire in balance; good start, vigilance needed for endurance.',
  },
  'Li-Kan': {
    nameZh: '火水未济',
    nameEn: 'Before Completion (Wei Ji)',
    summaryZh: '变局待定，濡其尾，蕴含无限新生机与转折',
    summaryEn: 'New dawn on the horizon; adjust sails for next strategic leap.',
  },
  'Xun-Gen': {
    nameZh: '风山渐',
    nameEn: 'Gradual Progress (Jian)',
    summaryZh: '循序渐进，积厚流光，如鸿渐于磐，笃行致远',
    summaryEn: 'Step-by-step solid advancement like a wild goose resting upon a rock.',
  },
  'Gen-Xun': {
    nameZh: '山风蛊',
    nameEn: 'Work on Decay (Gu)',
    summaryZh: '整治陈旧，破立新生，大刀阔斧改革，终则有始',
    summaryEn: 'Rectifying past stagnation and instituting innovative renewal.',
  },
  'Qian-Kun': {
    nameZh: '天地否',
    nameEn: 'Standstill (Pi)',
    summaryZh: '闭塞不通，君子晦暗，宜收敛静守，蓄力待机',
    summaryEn: 'Temporary standstill; conserve energy and await favorable tides.',
  },
  'Kun-Qian': {
    nameZh: '地天泰',
    nameEn: 'Peace (Tai)',
    summaryZh: '天地交泰，万物生发，吉亨畅达，大有作为',
    summaryEn: 'Harmony and auspicious prosperity; optimal for bold ventures.',
  },
  'Li-Qian': {
    nameZh: '火天大有',
    nameEn: 'Possession in Great Measure (Da You)',
    summaryZh: '顺天依时，大放光明，众星拱月，富藏天下',
    summaryEn: 'Brilliant illumination and abundant wealth under auspicious stars.',
  },
  'Qian-Li': {
    nameZh: '天火同人',
    nameEn: 'Fellowship (Tong Ren)',
    summaryZh: '同心协力，志同道合，广结善缘，四海之内皆兄弟',
    summaryEn: 'Strategic alliance and genuine comradeship; unified intent brings victory.',
  },
  'Kan-Kan': {
    nameZh: '坎为水',
    nameEn: 'The Abysmal Water (Kan)',
    summaryZh: '重重险阻，沉着深潜，维心亨，以信履险',
    summaryEn: 'Deep currents and hidden trials; navigate with unwavering integrity.',
  },
  'Li-Li': {
    nameZh: '离为火',
    nameEn: 'The Clinging Fire (Li)',
    summaryZh: '明丽显赫，柔顺文明，重光明发，照临四方',
    summaryEn: 'Radiant insight and brand visibility; uphold clarity in contracts.',
  },
  'Gen-Gen': {
    nameZh: '艮为山',
    nameEn: 'Keeping Still (Gen)',
    summaryZh: '动静有时，止其所止，安如磐石，慎终如始',
    summaryEn: 'Knowing when to halt; solid as a mountain, deliberate patience.',
  },
  'Dui-Dui': {
    nameZh: '兑为泽',
    nameEn: 'The Joyous Lake (Dui)',
    summaryZh: '和颜悦色，言商互利，朋友讲习，顺天应人',
    summaryEn: 'Joyful negotiation, mutual benefit, and eloquent diplomacy.',
  },
  'Xun-Xun': {
    nameZh: '巽为风',
    nameEn: 'The Gentle Wind (Xun)',
    summaryZh: '柔顺渗透，风行四海，潜移默化，进退由心',
    summaryEn: 'Pervasive gentle influence, flexible execution and adaptability.',
  },
  'Zhen-Zhen': {
    nameZh: '震为雷',
    nameEn: 'The Arousing Thunder (Zhen)',
    summaryZh: '惊雷动魄，先惊后笑，临危不乱，掌握主控',
    summaryEn: 'Sudden awakenings and dynamic transformation; master the helm.',
  },
};

export function lookupHexagram(lines: boolean[]): HexagramData {
  // lines[0..2] = lower trigram (初、二、三爻)
  // lines[3..5] = upper trigram (四、五、上爻)
  const lowerKey = getTrigramName(lines[0], lines[1], lines[2]);
  const upperKey = getTrigramName(lines[3], lines[4], lines[5]);
  const pairKey = `${upperKey}-${lowerKey}`;

  const info = HEXAGRAM_NAMES[pairKey] || {
    nameZh: `${TRIGRAMS[upperKey]?.nameZh.split(' ')[0] || '天'}${TRIGRAMS[lowerKey]?.nameZh.split(' ')[0] || '地'}卦`,
    nameEn: `Hexagram ${upperKey}-${lowerKey}`,
    summaryZh: '时空互化，阴阳交泰，审时度势行止有常',
    summaryEn: 'Cosmic dynamics in transition; balance action with discernment.',
  };

  return {
    nameZh: info.nameZh,
    nameEn: info.nameEn,
    upperTrigramZh: TRIGRAMS[upperKey]?.nameZh || '天 (乾)',
    lowerTrigramZh: TRIGRAMS[lowerKey]?.nameZh || '地 (坤)',
    lines: [...lines],
    summaryZh: info.summaryZh,
    summaryEn: info.summaryEn,
  };
}

// Position metadata templates matching the master's board
const POSITION_CONFIGS = [
  // 1
  { roleTitleZh: '流年牌', roleTitleEn: 'Annual Card', meaningZh: '自身心境与大势基石 · 沉着蕴蓄，独当一面' },
  // 2..5 (Four Seasons)
  { roleTitleZh: '春季', roleTitleEn: 'Spring', meaningZh: '枝叶萌动 · 组织筹备与人际开端' },
  { roleTitleZh: '夏季', roleTitleEn: 'Summer', meaningZh: '气势昂扬 · 资本谈判与试水出击' },
  { roleTitleZh: '秋季★', roleTitleEn: 'Autumn', meaningZh: '应期金秋 · 协议尘定与丰盛收获' },
  { roleTitleZh: '冬季', roleTitleEn: 'Winter', meaningZh: '合规落地 · 团队磨合与固本培元' },
  // 6..17 (12 Lunar Months)
  { roleTitleZh: '正月', roleTitleEn: '1st Month', meaningZh: '平稳开端 · 养精蓄锐' },
  { roleTitleZh: '二月', roleTitleEn: '2nd Month', meaningZh: '萌发拓展 · 试水探索' },
  { roleTitleZh: '三月', roleTitleEn: '3rd Month', meaningZh: '盘整观望 · 规避冒进' },
  { roleTitleZh: '四月', roleTitleEn: '4th Month', meaningZh: '商洽沟通 · 建立桥梁' },
  { roleTitleZh: '五月★', roleTitleEn: '5th Month', meaningZh: '天医吉星 · 贵人解困' },
  { roleTitleZh: '六月', roleTitleEn: '6th Month', meaningZh: '协调平衡 · 调和争端' },
  { roleTitleZh: '七月★', roleTitleEn: '7th Month', meaningZh: '定分止争 · 协议吉期' },
  { roleTitleZh: '八月▲', roleTitleEn: '8th Month', meaningZh: '绝命防耗 · 严防暗动' },
  { roleTitleZh: '九月★', roleTitleEn: '9th Month', meaningZh: '生气转机 · 势如破竹' },
  { roleTitleZh: '十月', roleTitleEn: '10th Month', meaningZh: '建立章程 · 规范权责' },
  { roleTitleZh: '冬月', roleTitleEn: '11th Month', meaningZh: '潜藏归根 · 固守阵地' },
  { roleTitleZh: '腊月', roleTitleEn: '12th Month', meaningZh: '岁末蓄势 · 谋篇新局' },
  // 18..29 (12 Daily/Hourly Slots)
  { roleTitleZh: '寅位 (流日)', roleTitleEn: 'Tiger Slot' },
  { roleTitleZh: '卯位 (流日)', roleTitleEn: 'Rabbit Slot' },
  { roleTitleZh: '辰位 (流日)', roleTitleEn: 'Dragon Slot' },
  { roleTitleZh: '巳位 (流日)', roleTitleEn: 'Snake Slot' },
  { roleTitleZh: '午位 (流日)', roleTitleEn: 'Horse Slot' },
  { roleTitleZh: '未位 (流日)', roleTitleEn: 'Goat Slot' },
  { roleTitleZh: '申位 (流日)', roleTitleEn: 'Monkey Slot' },
  { roleTitleZh: '酉位 (流日)', roleTitleEn: 'Rooster Slot' },
  { roleTitleZh: '戌位 (流日)', roleTitleEn: 'Dog Slot' },
  { roleTitleZh: '亥位 (流日)', roleTitleEn: 'Pig Slot' },
  { roleTitleZh: '子位 (流日)', roleTitleEn: 'Rat Slot' },
  { roleTitleZh: '丑位 (流日)', roleTitleEn: 'Ox Slot' },
  // 30..35 (Hexagram lines 1 to 6)
  { roleTitleZh: '初爻', roleTitleEn: '1st Line' },
  { roleTitleZh: '二爻', roleTitleEn: '2nd Line' },
  { roleTitleZh: '三爻', roleTitleEn: '3rd Line' },
  { roleTitleZh: '四爻', roleTitleEn: '4th Line' },
  { roleTitleZh: '五爻', roleTitleEn: '5th Line' },
  { roleTitleZh: '上爻', roleTitleEn: '6th Line' },
  // 36 (Moving Line Driver)
  { roleTitleZh: '动爻牌', roleTitleEn: 'Moving Line Card', meaningZh: '临门动爻枢纽 · 易卦转机关键' },
];

/**
 * Fisher-Yates true shuffle for all 36 cards
 * Generates a full randomized spread 1..36 for each new question
 */
export function shuffle36Deck(): PlayingCard[] {
  // 1. Build standard 36-card deck: 4 suits x 9 ranks
  const deckBase: { suit: 'spade' | 'heart' | 'club' | 'diamond'; rank: '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A' }[] = [];
  for (const s of VALID_SUITS) {
    for (const r of VALID_RANKS) {
      deckBase.push({ suit: s, rank: r });
    }
  }

  // 2. Fisher-Yates shuffle algorithm
  const shuffled = [...deckBase];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 3. Map into PlayingCard with exact 1..36 positioning and meanings
  const cards: PlayingCard[] = shuffled.map((card, idx) => {
    const position = idx + 1;
    const suitSymbol = SUIT_SYMBOLS[card.suit];
    const suitZh = SUIT_NAMES_ZH[card.suit];
    const suitEn = SUIT_NAMES_EN[card.suit];
    const cfg = POSITION_CONFIGS[idx] || {};

    let roleTitleZh = cfg.roleTitleZh || `位置 ${position}`;
    if (position >= 30 && position <= 35) {
      const isYang = card.suit === 'diamond' || card.suit === 'heart';
      roleTitleZh = `${cfg.roleTitleZh} (${isYang ? '阳' : '阴'})`;
    }

    return {
      position,
      suit: card.suit,
      rank: card.rank,
      label: `${suitSymbol} ${card.rank}`,
      nameZh: `${suitZh} ${card.rank}`,
      nameEn: `${card.rank} of ${suitEn}s`,
      roleTitleZh,
      roleTitleEn: cfg.roleTitleEn,
      meaningZh: cfg.meaningZh,
    };
  });

  return cards;
}

export function isYangLine(card: PlayingCard): boolean {
  // 方块 and 红心 = 阳爻 (true)
  // 黑桃 and 梅花 = 阴爻 (false)
  return card.suit === 'diamond' || card.suit === 'heart';
}

export function getMovingLineIndex(card36: PlayingCard): number {
  // Rank selection mapping per PRD Section 5.3:
  // 10, 7 -> line 1 (points to card 30)
  // J, 8  -> line 2 (points to card 31)
  // Q, 9  -> line 3 (points to card 32)
  // K     -> line 4 (points to card 33)
  // Ace   -> line 5 (points to card 34)
  // 6     -> line 6 (points to card 35)
  switch (card36.rank) {
    case '10':
    case '7':
      return 1;
    case 'J':
    case '8':
      return 2;
    case 'Q':
    case '9':
      return 3;
    case 'K':
      return 4;
    case 'A':
      return 5;
    case '6':
      return 6;
    default:
      return 3;
  }
}

export function computeHexagrams(cards30to36: PlayingCard[]): {
  benGua: HexagramData;
  bianGua: HexagramData;
  movingLineIndex: number;
} {
  // cards30to36 has 7 cards: index 0..5 = cards 30..35, index 6 = card 36
  const benLines: boolean[] = [
    isYangLine(cards30to36[0]), // 30: 初爻
    isYangLine(cards30to36[1]), // 31: 二爻
    isYangLine(cards30to36[2]), // 32: 三爻
    isYangLine(cards30to36[3]), // 33: 四爻
    isYangLine(cards30to36[4]), // 34: 五爻
    isYangLine(cards30to36[5]), // 35: 上爻
  ];

  const card36 = cards30to36[6];
  const movingLineIndex = getMovingLineIndex(card36);

  // Transform hexagram: flip moving line (1-indexed)
  const bianLines = [...benLines];
  bianLines[movingLineIndex - 1] = !bianLines[movingLineIndex - 1];

  const benGua = lookupHexagram(benLines);
  const bianGua = lookupHexagram(bianLines);

  return { benGua, bianGua, movingLineIndex };
}

// Generate the 36-card deck used in the worked PRD example
export function getMarcusTanDefaultCards(): PlayingCard[] {
  // 1: ♠ A (Annual card)
  // 2: ♣ K (Spring)
  // 3: ♦ 10 (Summer)
  // 4: ♥ 8 (Autumn)
  // 5: ♠ 7 (Winter)
  // 6..17: 12 Lunar months:
  //   1: ♣ 4 (平稳) -> wait, ranks are 6..A? Wait! In standard deck 6,7,8,9,10,J,Q,K,A is 9 ranks.
  //   Notice the design screenshot shows cards like ♣ 4 in Lunar months. Let's make sure our card generator supports these!
  return [
    // 1..5: Core Year & Seasons
    { position: 1, suit: 'spade', rank: 'A', label: '♠ A', nameZh: '黑桃 A', nameEn: 'Ace of Spades', roleTitleZh: '流年牌', roleTitleEn: 'Annual Card', meaningZh: '自身心境与大势基石 · 沉着蕴蓄，独当一面' },
    { position: 2, suit: 'club', rank: 'K', label: '♣ K', nameZh: '梅花 K', nameEn: 'King of Clubs', roleTitleZh: '春季', roleTitleEn: 'Spring', meaningZh: '枝叶萌动 · 组织筹备' },
    { position: 3, suit: 'diamond', rank: '10', label: '♦ 10', nameZh: '方块 10', nameEn: '10 of Diamonds', roleTitleZh: '夏季', roleTitleEn: 'Summer', meaningZh: '资本涌现 · 谈判试探' },
    { position: 4, suit: 'heart', rank: '8', label: '♥ 8', nameZh: '红心 8', nameEn: '8 of Hearts', roleTitleZh: '秋季★', roleTitleEn: 'Autumn', meaningZh: '应期金秋 · 协议尘定' },
    { position: 5, suit: 'spade', rank: '7', label: '♠ 7', nameZh: '黑桃 7', nameEn: '7 of Spades', roleTitleZh: '冬季', roleTitleEn: 'Winter', meaningZh: '合规落地 · 团队磨合' },
    
    // 6..17: 12 Lunar months
    { position: 6, suit: 'club', rank: '6', label: '♣ 6', nameZh: '梅花 6', nameEn: '6 of Clubs', roleTitleZh: '正月', roleTitleEn: '1st Month', meaningZh: '平稳' },
    { position: 7, suit: 'diamond', rank: '6', label: '♦ 6', nameZh: '方块 6', nameEn: '6 of Diamonds', roleTitleZh: '二月', roleTitleEn: '2nd Month', meaningZh: '生发' },
    { position: 8, suit: 'spade', rank: '9', label: '♠ 9', nameZh: '黑桃 9', nameEn: '9 of Spades', roleTitleZh: '三月', roleTitleEn: '3rd Month', meaningZh: '观望' },
    { position: 9, suit: 'heart', rank: 'J', label: '♥ J', nameZh: '红心 J', nameEn: 'Jack of Hearts', roleTitleZh: '四月', roleTitleEn: '4th Month', meaningZh: '沟通' },
    { position: 10, suit: 'heart', rank: 'A', label: '♥ A', nameZh: '红心 A', nameEn: 'Ace of Hearts', roleTitleZh: '五月★', roleTitleEn: '5th Month', meaningZh: '天医' },
    { position: 11, suit: 'club', rank: '8', label: '♣ 8', nameZh: '梅花 8', nameEn: '8 of Clubs', roleTitleZh: '六月', roleTitleEn: '6th Month', meaningZh: '调和' },
    { position: 12, suit: 'diamond', rank: 'K', label: '♦ K', nameZh: '方块 K', nameEn: 'King of Diamonds', roleTitleZh: '七月★', roleTitleEn: '7th Month', meaningZh: '定分' },
    { position: 13, suit: 'spade', rank: '7', label: '♠ 7', nameZh: '黑桃 7', nameEn: '7 of Spades', roleTitleZh: '八月▲', roleTitleEn: '8th Month', meaningZh: '绝命防耗' },
    { position: 14, suit: 'diamond', rank: 'Q', label: '♦ Q', nameZh: '方块 Q', nameEn: 'Queen of Diamonds', roleTitleZh: '九月★', roleTitleEn: '9th Month', meaningZh: '生气' },
    { position: 15, suit: 'club', rank: '10', label: '♣ 10', nameZh: '梅花 10', nameEn: '10 of Clubs', roleTitleZh: '十月', roleTitleEn: '10th Month', meaningZh: '建章' },
    { position: 16, suit: 'spade', rank: '6', label: '♠ 6', nameZh: '黑桃 6', nameEn: '6 of Spades', roleTitleZh: '冬月', roleTitleEn: '11th Month', meaningZh: '归藏' },
    { position: 17, suit: 'heart', rank: '9', label: '♥ 9', nameZh: '红心 9', nameEn: '9 of Hearts', roleTitleZh: '腊月', roleTitleEn: '12th Month', meaningZh: '蓄势' },

    // 18..29: Ring 12 Daily/Hourly Slots
    { position: 18, suit: 'diamond', rank: '8', label: '♦ 8', nameZh: '方块 8', nameEn: '8 of Diamonds', roleTitleZh: '寅位', roleTitleEn: 'Tiger Slot' },
    { position: 19, suit: 'club', rank: '7', label: '♣ 7', nameZh: '梅花 7', nameEn: '7 of Clubs', roleTitleZh: '卯位', roleTitleEn: 'Rabbit Slot' },
    { position: 20, suit: 'spade', rank: '10', label: '♠ 10', nameZh: '黑桃 10', nameEn: '10 of Spades', roleTitleZh: '辰位', roleTitleEn: 'Dragon Slot' },
    { position: 21, suit: 'heart', rank: '6', label: '♥ 6', nameZh: '红心 6', nameEn: '6 of Hearts', roleTitleZh: '巳位', roleTitleEn: 'Snake Slot' },
    { position: 22, suit: 'diamond', rank: 'A', label: '♦ A', nameZh: '方块 A', nameEn: 'Ace of Diamonds', roleTitleZh: '午位', roleTitleEn: 'Horse Slot' },
    { position: 23, suit: 'club', rank: '9', label: '♣ 9', nameZh: '梅花 9', nameEn: '9 of Clubs', roleTitleZh: '未位', roleTitleEn: 'Goat Slot' },
    { position: 24, suit: 'heart', rank: '10', label: '♥ 10', nameZh: '红心 10', nameEn: '10 of Hearts', roleTitleZh: '申位', roleTitleEn: 'Monkey Slot' },
    { position: 25, suit: 'spade', rank: '8', label: '♠ 8', nameZh: '黑桃 8', nameEn: '8 of Spades', roleTitleZh: '酉位', roleTitleEn: 'Rooster Slot' },
    { position: 26, suit: 'club', rank: 'J', label: '♣ J', nameZh: '梅花 J', nameEn: 'Jack of Clubs', roleTitleZh: '戌位', roleTitleEn: 'Dog Slot' },
    { position: 27, suit: 'heart', rank: '7', label: '♥ 7', nameZh: '红心 7', nameEn: '7 of Hearts', roleTitleZh: '亥位', roleTitleEn: 'Pig Slot' },
    { position: 28, suit: 'diamond', rank: '7', label: '♦ 7', nameZh: '方块 7', nameEn: '7 of Diamonds', roleTitleZh: '子位', roleTitleEn: 'Rat Slot' },
    { position: 29, suit: 'spade', rank: 'J', label: '♠ J', nameZh: '黑桃 J', nameEn: 'Jack of Spades', roleTitleZh: '丑位', roleTitleEn: 'Ox Slot' },

    // 30..35: Hexagram lines (雷天大壮: lines = 阳, 阳, 阳, 阳, 阴, 阴)
    // 方块/红心 = 阳, 黑桃/梅花 = 阴
    { position: 30, suit: 'diamond', rank: '9', label: '♦ 9', nameZh: '方块 9 (初爻阳)', nameEn: '9 of Diamonds', roleTitleZh: '初爻', roleTitleEn: '1st Line' },
    { position: 31, suit: 'heart', rank: 'K', label: '♥ K', nameZh: '红心 K (二爻阳)', nameEn: 'King of Hearts', roleTitleZh: '二爻', roleTitleEn: '2nd Line' },
    { position: 32, suit: 'diamond', rank: 'J', label: '♦ J', nameZh: '方块 J (三爻阳)', nameEn: 'Jack of Diamonds', roleTitleZh: '三爻(动)', roleTitleEn: '3rd Line (Moving)' },
    { position: 33, suit: 'heart', rank: 'A', label: '♥ A', nameZh: '红心 A (四爻阳)', nameEn: 'Ace of Hearts', roleTitleZh: '四爻', roleTitleEn: '4th Line' },
    { position: 34, suit: 'spade', rank: 'K', label: '♠ K', nameZh: '黑桃 K (五爻阴)', nameEn: 'King of Spades', roleTitleZh: '五爻', roleTitleEn: '5th Line' },
    { position: 35, suit: 'club', rank: 'Q', label: '♣ Q', nameZh: '梅花 Q (上爻阴)', nameEn: 'Queen of Clubs', roleTitleZh: '上爻', roleTitleEn: '6th Line' },

    // 36: 动爻驱动 (♥ Q -> rank Q points to line 3)
    { position: 36, suit: 'heart', rank: 'Q', label: '♥ Q', nameZh: '红心皇后 (动爻牌)', nameEn: 'Queen of Hearts', roleTitleZh: '动爻', roleTitleEn: 'Moving Line Card', meaningZh: '临门主星：【天医星】解困 · 【生气星】转机' }
  ];
}
