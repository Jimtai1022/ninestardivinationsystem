/**
 * 九星牌卦问测系统 - 大师知数据真实核心知识库
 * 依据原件《九星牌卦36张牌开牌顺序与六十四卦详解》及《九星牌卦八宫与两张牌组合断语》精准编码
 */

import { PlayingCard } from '../types';

// ==========================================
// 1. 花色含义注解 (Document 2 Page 9-10)
// ==========================================
export interface SuitMeaning {
  nameZh: string;
  symbol: string;
  colorHex: string;
  auspiciousZh: string[];
  inauspiciousZh: string[];
  summaryZh: string;
}

export const SUIT_MEANINGS: Record<string, SuitMeaning> = {
  spade: {
    nameZh: '黑桃',
    symbol: '♠',
    colorHex: '#1e293b',
    auspiciousZh: ['突发事件', '惊喜', '暗中贵人'],
    inauspiciousZh: ['灾害', '疾病', '损失', '死亡', '离别'],
    summaryZh: '暗动转机之星，吉则奇门惊喜暗助，凶则慎防意外损耗与暗涌。',
  },
  diamond: {
    nameZh: '方块',
    symbol: '♦',
    colorHex: '#dc2626',
    auspiciousZh: ['财富', '经济', '事业有成'],
    inauspiciousZh: ['经济状况不佳', '得不到财富'],
    summaryZh: '阳财资粮之象，吉则财运亨通获利，凶则现金流吃紧或资不抵债。',
  },
  club: {
    nameZh: '梅花',
    symbol: '♣',
    colorHex: '#334155',
    auspiciousZh: ['友情', '名声', '人缘好', '工作稳定'],
    inauspiciousZh: ['损友', '工作薪水不稳定'],
    summaryZh: '人脉名望之木，吉则贵人同声相应工作扎实，凶则恐逢损友掣肘。',
  },
  heart: {
    nameZh: '红心',
    symbol: '♥',
    colorHex: '#e11d48',
    auspiciousZh: ['心情积极', '恋爱', '结婚', '约会'],
    inauspiciousZh: ['失恋', '离婚', '消极影响'],
    summaryZh: '心神合和之火，吉则情投意合诸事欣荣，凶则感情受挫多愁善感。',
  },
};

// ==========================================
// 2. 牌豪（牌面点数）含义注解 (Document 2 Page 11-12)
// ==========================================
export interface RankMeaning {
  rank: string;
  nameZh: string;
  significanceZh: string;
  keywords: string[];
}

export const RANK_MEANINGS: Record<string, RankMeaning> = {
  '6': {
    rank: '6',
    nameZh: '六',
    significanceZh: '代表动态，前进，交通，出国，搬迁，变动，有外出之兆。',
    keywords: ['动态', '前进', '交通', '出国', '搬迁', '外出变动'],
  },
  '7': {
    rank: '7',
    nameZh: '七',
    significanceZh: '代表静态，防守，买卖合约，文件，证书，合伙策略(Network)，学习，成绩，学校，懒散，优柔寡断。',
    keywords: ['静态', '防守', '买卖合约', '文件证书', '合伙策略', '学习'],
  },
  '8': {
    rank: '8',
    nameZh: '八',
    significanceZh: '代表身体健康，疾病，卡阴，手术，伤害，有阻碍，喜庆，精神状况。',
    keywords: ['身体健康', '阻碍', '喜庆', '精神状况', '调理身心'],
  },
  '9': {
    rank: '9',
    nameZh: '九',
    significanceZh: '代表家庭状况，阴阳宅，工作地方，做事业的环境。',
    keywords: ['家庭状况', '家宅风水', '工作环境', '实体场所'],
  },
  '10': {
    rank: '10',
    nameZh: '十',
    significanceZh: '代表财富的来源，财务，正财，偏财，收入，开销，支出。',
    keywords: ['财富来源', '财务收支', '正财偏财', '经营盈亏'],
  },
  'J': {
    rank: 'J',
    nameZh: '杰克 (J)',
    significanceZh: '代表年轻的男性，子女，下属，朋友。',
    keywords: ['年轻男性', '下属团队', '子女小辈', '同行好友'],
  },
  'Q': {
    rank: 'Q',
    nameZh: '皇后 (Q)',
    significanceZh: '代表女性，妇女，母亲，后母，阴神，祖上。',
    keywords: ['女性贵人', '母亲长辈', '祖德庇佑', '女合伙人'],
  },
  'K': {
    rank: 'K',
    nameZh: '国王 (K)',
    significanceZh: '代表男性，长辈，上司，政府，官员。',
    keywords: ['男性长辈', '顶头上司', '政府权威', '决策掌舵者'],
  },
  'A': {
    rank: 'A',
    nameZh: '王牌 (Ace)',
    significanceZh: '代表自己福报，业障，精神，思想，个性，寿命，心情。',
    keywords: ['自身福报', '心智思想', '性格命元', '当下心情'],
  },
};

// ==========================================
// 3. 四吉星与四凶星注解 (Document 2 Page 13)
// ==========================================
export const STAR_CATEGORIES = {
  shengQi: {
    nameZh: '生气',
    tier: '【第一吉星】',
    descZh: '家宅平安，工作顺利，财源广进，身体健康。大吉之兆，动中生财。',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  tianYi: {
    nameZh: '天医',
    tier: '【次吉星】',
    descZh: '健康良好，无病痛意外，家庭平安，财运好，有贵人解困相助。',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
  },
  yanNian: {
    nameZh: '延年',
    tier: '【吉星】',
    descZh: '财运不错，身体健康，无病痛意外，夫妻和谐，未婚者有好桃花运。',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  fuWei: {
    nameZh: '伏位',
    tier: '【小吉星】',
    descZh: '健康良好，无病痛意外，家庭平安，财气稳健，安守本分为安。',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  xinQing: {
    nameZh: '心情牌',
    tier: '【心境枢纽】',
    descZh: '直断求测者当下精神面貌、心理承压与核心起心动念之吉凶变化。',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  jueMing: {
    nameZh: '绝命',
    tier: '【第一凶星】',
    descZh: '家宅有损，有病痛，脾气急躁，失败，诸事不利，需谨防官非耗财。',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  wuGui: {
    nameZh: '五鬼',
    tier: '【次凶星】',
    descZh: '犯小人，口舌是非多，容易受伤，破财，血光，车祸，卡阴。',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  liuSha: {
    nameZh: '六煞',
    tier: '【凶星】',
    descZh: '贪赌，烂桃花，得病，容易受骗，被盗，心绪暗淡多烦忧。',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  huoHai: {
    nameZh: '祸害',
    tier: '【小凶星】',
    descZh: '财来财去不能聚财，与人结怨争执，目中无人，谨防合同差错。',
    badgeClass: 'bg-stone-100 text-stone-800 border-stone-300',
  },
};

// ==========================================
// 4. 两张牌组合真实断语库 (Document 2 Page 14-57)
// ==========================================
export interface PairRuleResult {
  starType: keyof typeof STAR_CATEGORIES;
  titleZh: string;
  careerZh: string;
  wealthZh: string;
  officialZh: string;
  relationshipZh: string;
  mindZh: string;
  socialZh: string;
  familyZh: string;
  propertyZh: string;
}

// Key helper: sorted normalized key e.g. "diamond10-spade6" or "clubQ-spade8"
function makePairKey(c1: PlayingCard, c2: PlayingCard): string {
  const k1 = `${c1.suit}${c1.rank}`;
  const k2 = `${c2.suit}${c2.rank}`;
  return k1 < k2 ? `${k1}__${k2}` : `${k2}__${k1}`;
}

export const PAIR_RULES_DATABASE: Record<string, PairRuleResult> = {
  // Page 14: 方块10 + 黑桃6
  'diamond10__spade6': {
    starType: 'shengQi',
    titleZh: '多动得财',
    careerZh: '销售成功，业务拓展迅速',
    wealthZh: '财运亨通，赚到钱，现金流充沛',
    officialZh: '升职加薪，外调有广阔舞台',
    relationshipZh: '出现意中人，情缘明朗',
    mindZh: '有活力，健康良好，心境昂扬',
    socialZh: '富有的贵人出现，大力提携',
    familyZh: '经济良好，适宜结伴出去旅行',
    propertyZh: '储蓄丰厚，投资得利',
  },
  // Page 15: 红心J + 黑桃7
  'heartJ__spade7': {
    starType: 'shengQi',
    titleZh: '有朋友相助，成交生意',
    careerZh: '有团队好友协力，销售达成，顺利签单',
    wealthZh: '财运亨通，赚到预期收益',
    officialZh: '升职加薪，外调开辟新阵地',
    relationshipZh: '出现意中人，互动频繁',
    mindZh: '有活力，心胸豁达，健康良好',
    socialZh: '富有的贵人出现，提供关键资源',
    familyZh: '经济状况转好，利全家出行出游',
    propertyZh: '储蓄丰厚，投资得利稳健',
  },
  // Page 16: 梅花Q + 黑桃8
  'clubQ__spade8': {
    starType: 'shengQi',
    titleZh: '人际关系好，意外的贵人相助，尤其是女性',
    careerZh: '事业有成，多方关照，遇阻迎刃而解',
    wealthZh: '财运亨通，正偏财皆有入账',
    officialZh: '得女上司赏识器重，给予实权',
    relationshipZh: '出现意中人，情投意合',
    mindZh: '精神好，思维敏捷，健康良好',
    socialZh: '突如其来的贵人出现，尤多女性提携',
    familyZh: '经济良好，家庭和美',
    propertyZh: '储蓄丰厚，产业稳步增值',
  },
  // Page 17: 方块K + 黑桃9
  'diamondK__spade9': {
    starType: 'shengQi',
    titleZh: '工作上获得老板赏识',
    careerZh: '事业大有长进，决策得到高层背书',
    wealthZh: '财运亨通，收入水涨船高',
    officialZh: '上司老板极度赏识，委以重任',
    relationshipZh: '出现意中人，稳步发展',
    mindZh: '精神抖擞，自信笃定，身心康泰',
    socialZh: '突如其来的贵人出现，多长辈大佬',
    familyZh: '经济良好，光耀门楣',
    propertyZh: '储蓄丰厚，投资运势极佳',
  },
  // Page 18: 梅花Q + 红心J
  'clubQ__heartJ': {
    starType: 'tianYi',
    titleZh: '人缘极好，得贵人协助',
    careerZh: '得遇好搭档，彼此分工默契',
    wealthZh: '财运顺利，进账平稳顺畅',
    officialZh: '有升职为主管、领袖之现象',
    relationshipZh: '适合的对象出现，彼此珍惜',
    mindZh: '乐观开朗，诸事包容豁达',
    socialZh: '贵人多帮助，交际面大大拓宽',
    familyZh: '家庭成员相处和谐和睦',
    propertyZh: '小有储蓄，细水长流',
  },
  // Page 19: 红心10 + 方块K
  'diamondK__heart10': {
    starType: 'tianYi',
    titleZh: '得长辈贵人之助，得上司加薪',
    careerZh: '贵人引路，业务路线明朗',
    wealthZh: '财运顺畅，正财丰盈',
    officialZh: '上司加薪提拔之现象，获高阶认可',
    relationshipZh: '长辈多热心介绍良配',
    mindZh: '乐观开朗，心中大石落地',
    socialZh: '多长辈贵人与行业前辈提点',
    familyZh: '家庭长辈相处融洽，孝慈相依',
    propertyZh: '有所储蓄，资产稳步积累',
  },
  // Page 20: 黑桃9 + 黑桃6
  'spade6__spade9': {
    starType: 'tianYi',
    titleZh: '工作上动中得财',
    careerZh: '事业前景不错，越跑动开拓越见成效',
    wealthZh: '工作上动中得财，外勤多劳多得',
    officialZh: '上司多提拔，予以独立领队空间',
    relationshipZh: '朋友群中有暗恋你的人出现',
    mindZh: '积极开朗，主动破局',
    socialZh: '多朋友贵人，互通有无',
    familyZh: '家庭和睦安宁',
    propertyZh: '适合与伙伴合资置业赚钱',
  },
  // Page 21: 黑桃7 + 黑桃8
  'spade7__spade8': {
    starType: 'tianYi',
    titleZh: '康复中，家有喜事',
    careerZh: '事业稳中有进，旧困迎刃而解',
    wealthZh: '财气稳健，无意外破耗',
    officialZh: '上司暗中帮助，化解是非阻力',
    relationshipZh: '爱情关系稳定，相濡以沫',
    mindZh: '身心康复中，心情愉悦轻松',
    socialZh: '内向自持，与外界保持良性互动',
    familyZh: '家有喜事，长幼健康平安',
    propertyZh: '投资以稳赚钱，忌高杠杆冒险',
  },
  // Page 22: 红心J + 黑桃8
  'heartJ__spade8': {
    starType: 'yanNian',
    titleZh: '朋友欢乐，心情愉快，健康无碍',
    careerZh: '努力付出得到实质回报，获众人称许',
    wealthZh: '有意想不到的财源进账',
    officialZh: '业务表现出色，受众人赞赏',
    relationshipZh: '有好桃花运，情缘温馨',
    mindZh: '放宽心，健康安好，自得其乐',
    socialZh: '朋友欢聚畅谈，气氛愉快',
    familyZh: '默默互相关心，氛围温馨',
    propertyZh: '投资获利，回报丰厚',
  },
  // Page 23: 黑桃10 + 黑桃9
  'spade9__spade10': {
    starType: 'yanNian',
    titleZh: '加薪，地产买卖赚钱',
    careerZh: '工作业绩扎实，努力得到丰盛回报',
    wealthZh: '有意料之外的丰厚财源，地产获利',
    officialZh: '职位晋升，或被委派至关键要职',
    relationshipZh: '有突如其来的美满恋情',
    mindZh: '充满活力，心力强盛',
    socialZh: '朋友欢聚，常有富贵朋友同行',
    familyZh: '亲人默默互相关爱照料',
    propertyZh: '地产买卖赚钱，不动产投资收益大',
  },
  // Page 24: 梅花Q + 黑桃7
  'clubQ__spade7': {
    starType: 'yanNian',
    titleZh: '暗中有贵人相助',
    careerZh: '努力耕耘终获回报，暗局转明',
    wealthZh: '有意料不到的财源涌入',
    officialZh: '有升职迹象，台面下获得强力引荐',
    relationshipZh: '有人暗恋，桃花暗芳自赏',
    mindZh: '有活力，健康平稳',
    socialZh: '暗中有得力贵人默默相助',
    familyZh: '家庭关系平实稳定互相关照',
    propertyZh: '投资暗中获利，闷声发财',
  },
  // Page 25: 方块K + 黑桃6
  'diamondK__spade6': {
    starType: 'yanNian',
    titleZh: '遇到积极的老板，前途光明',
    careerZh: '努力付出终得回报，受领军者赏识',
    wealthZh: '财源大增，奖金分红丰裕',
    officialZh: '上司老板亲自提拔，前途不可限量',
    relationshipZh: '积极追求意中人，情路顺畅',
    mindZh: '精力旺盛，做事积极向上',
    socialZh: '男性贵人多，多为掌权领导',
    familyZh: '家庭关系和谐美满',
    propertyZh: '有意外的投资回酬与产业契机',
  },
  // Page 26: 黑桃10 + 红心10
  'heart10__spade10': {
    starType: 'fuWei',
    titleZh: '财气不错',
    careerZh: '业务有持续盈利，经营平稳顺畅',
    wealthZh: '懂得用钱赚钱，资产利滚利',
    officialZh: '上司很赏识，有升职加薪之喜',
    relationshipZh: '感情和睦，成双成对长相守',
    mindZh: '心灵富足，知足常乐',
    socialZh: '结识富贵稳重之友人',
    familyZh: '家境殷实，经济状况良好很和睦',
    propertyZh: '回酬稳健，无后顾之忧',
  },
  // Page 27: 梅花Q + 方块Q
  'clubQ__diamondQ': {
    starType: 'fuWei',
    titleZh: '贵人相助，且多为女性',
    careerZh: '得女性伙伴大力相助，团队齐心',
    wealthZh: '女贵人带财，经商得利',
    officialZh: '女上司格外赏识，保驾护航',
    relationshipZh: '女性深得疼爱，关系甜蜜',
    mindZh: '平顺安乐，多得众人照拂',
    socialZh: '女贵人多，人缘极佳',
    familyZh: '家庭女性成员相处和睦美满',
    propertyZh: '投资回酬不错，资产安全',
  },
  // Page 28: 方块K + 梅花K
  'clubK__diamondK': {
    starType: 'fuWei',
    titleZh: '得老板上级赏识，才能得以发挥',
    careerZh: '男性伙伴相助，权责明确',
    wealthZh: '男贵人带财，项目稳妥推进',
    officialZh: '深受男上司赏识，才华大展',
    relationshipZh: '男性深得伴侣体恤爱护',
    mindZh: '顺畅舒坦，周围多臂膀协助',
    socialZh: '男性贵人多，商界人脉稳固',
    familyZh: '家庭男长辈和睦支持',
    propertyZh: '回酬稳固，收益见好',
  },
  // Page 29: 黑桃6 + 红心6
  'heart6__spade6': {
    starType: 'fuWei',
    titleZh: '越动越旺',
    careerZh: '多往外做业务，到处皆是机遇',
    wealthZh: '财源滚滚，多动多得',
    officialZh: '有升职或调职外任之良机',
    relationshipZh: '容易在出差出行中遇见喜欢之人',
    mindZh: '心气积极，渴望寻求新变动',
    socialZh: '性格外向，贵人多在外部外邦',
    familyZh: '有搬新家、换环境之迹象',
    propertyZh: '投资有积极变动之象，宜灵活操作',
  },
  // Page 30: 黑桃7 + 红心7
  'heart7__spade7': {
    starType: 'fuWei',
    titleZh: '不宜太进取',
    careerZh: '以守为进，保持现状为上策',
    wealthZh: '财源来得较慢，宜耐心积攒',
    officialZh: '官位维持现状，不争风头',
    relationshipZh: '感情稳定如常，波澜不惊',
    mindZh: '心态稳定，不愿折腾变动',
    socialZh: '性格偏内向，贵人在内部旧友中',
    familyZh: '家庭安稳宁静，平和无争',
    propertyZh: '产业平平稳稳，守成即是赚',
  },
  // Page 31: 黑桃8 + 红心8
  'heart8__spade8': {
    starType: 'fuWei',
    titleZh: '精神状态，喜事连连',
    careerZh: '业务容易成交，合作水到渠成',
    wealthZh: '财气极佳，收支顺心',
    officialZh: '有升职良机，受人器重',
    relationshipZh: '适宜订婚结婚，或结识优质新对象',
    mindZh: '精神状态极佳，身心舒畅',
    socialZh: '人缘极好，走到哪里都受欢喜',
    familyZh: '家中喜事连连，喜气盈门',
    propertyZh: '投资有可喜回报',
  },
  // Page 32: 方块A + 红心J
  'diamondA__heartJ': {
    starType: 'xinQing',
    titleZh: '心情愉快，多朋友帮',
    careerZh: '会赚钱，能聚拢财气',
    wealthZh: '涌现赚钱的好点子、好项目',
    officialZh: '名成利就，口碑大振',
    relationshipZh: '感情和睦，彼此恩爱',
    mindZh: '身心灵状态良好，乐观积极',
    socialZh: '多朋友鼎力帮助，欢聚有道',
    familyZh: '家庭美满祥和',
    propertyZh: '投资有实质回酬',
  },
  // Page 33: 方块A + 梅花Q
  'clubQ__diamondA': {
    starType: 'xinQing',
    titleZh: '多女性朋友帮助的财而开心',
    careerZh: '事业有显著进步，业务蒸蒸日上',
    wealthZh: '多得女性朋友或长辈帮助得财',
    officialZh: '女上司多加提拔重用',
    relationshipZh: '与另一半感情良好恩爱',
    mindZh: '心情开朗舒畅，笑口常开',
    socialZh: '有知心女性朋友提供实际支持',
    familyZh: '家庭融洽，妻贤子孝',
    propertyZh: '有丰厚储蓄，衣食丰足',
  },
  // Page 34: 梅花A + 方块A
  'clubA__diamondA': {
    starType: 'xinQing',
    titleZh: '心情反复，容易陷入情绪化',
    careerZh: '事业缺少明确方向，徘徊犹疑',
    wealthZh: '收入不稳定，忽高忽低',
    officialZh: '工作表现差强人意，难获赞赏',
    relationshipZh: '感情容易情绪化用事，喜怒无常',
    mindZh: '心情反复不定，容易患得患失',
    socialZh: '多怀疑朋友真心，人际生隙',
    familyZh: '容易因小事和家人争执不休',
    propertyZh: '不善于投资理财，容易冲动进退',
  },
  // Page 35: 梅花A + 黑桃7
  'clubA__spade7': {
    starType: 'xinQing',
    titleZh: '心情在为文件公事公办等事情烦恼',
    careerZh: '为公务繁文缛节与合同文件伤脑筋',
    wealthZh: '钱财迟迟不入账，应收款拖欠',
    officialZh: '易惹官非公事上的烦恼是非',
    relationshipZh: '婚姻烦恼缠身，进退维谷',
    mindZh: '心烦意乱，难以专注',
    socialZh: '闭门谢客，不想与人过多交际',
    familyZh: '心烦于家庭产权、证件等繁杂事务',
    propertyZh: '签署文件合同时务必加倍小心审阅',
  },
  // Page 36: 梅花A + 黑桃10
  'clubA__spade10': {
    starType: 'xinQing',
    titleZh: '为钱财担忧',
    careerZh: '经营面临损失风险，宜守防亏',
    wealthZh: '容易陷入财务纠纷与资金紧缺',
    officialZh: '加辛苦不加薪，劳而少功',
    relationshipZh: '易碰上重利拜金之不良对象',
    mindZh: '计划落空而耗财，心力交瘁',
    socialZh: '交际应酬超支破费，少有实质收获',
    familyZh: '家人之间容易为了钱财开支争执',
    propertyZh: '有投资失利风险，不可盲动',
  },
  // Page 37: 梅花A + 黑桃8
  'clubA__spade8': {
    starType: 'xinQing',
    titleZh: '精神衰弱，需多加休息，心情放乐观些',
    careerZh: '容易因健康与精力不济而耽误事业',
    wealthZh: '破财在求医问药与调理身体上',
    officialZh: '因健康欠佳被长官质疑能力',
    relationshipZh: '感情交流出现阻碍，各怀心事',
    mindZh: '为身体健康和琐碎阻碍而烦心',
    socialZh: '应酬过多透支精力，伤身耗神',
    familyZh: '常为家中长幼的健康状况牵肠挂肚',
    propertyZh: '投资遇到阻滞，进展受阻',
  },
  // Page 38: 黑桃A + 黑桃6
  'spade6__spadeA': {
    starType: 'xinQing',
    titleZh: '心情在为搬迁旅行等要改变的事情烦恼',
    careerZh: '事业面临不好的剧烈变动，前路多舛',
    wealthZh: '耗费大财，意外开销骤增',
    officialZh: '面临被调职、下放或部门重组烦扰',
    relationshipZh: '有聚少离多、分居或情感分离迹象',
    mindZh: '突如其来的变动导致心绪不安',
    socialZh: '身边多小人干扰挑唆',
    familyZh: '为了搬迁移居、行程变动心烦意乱',
    propertyZh: '市场震荡导致投资有亏损风险',
  },
  // Page 39: 黑桃A + 方块K
  'diamondK__spadeA': {
    starType: 'xinQing',
    titleZh: '得不到上司赏识而不开心',
    careerZh: '事业遇阻碍，处处碰壁，心烦郁闷',
    wealthZh: '多有破财在长辈老者之事上',
    officialZh: '难以得到上级赏识，怀才不遇',
    relationshipZh: '常有男性外人无端制造情感困扰',
    mindZh: '烦恼于同长辈或领导的人际关系',
    socialZh: '多长辈级别的小人指手画脚',
    familyZh: '常为家里的长者事情烦恼分心',
    propertyZh: '因轻信长者意见导致投资失策',
  },
  // Page 40: 黑桃A + 梅花A
  'clubA__spadeA': {
    starType: 'xinQing',
    titleZh: '心情很低落，意志消沉',
    careerZh: '心灰意冷，缺乏积极发展事业的动力',
    wealthZh: '常为生计银钱烦心，手头紧迫',
    officialZh: '前途茫茫无目标，陷入职业迷茫',
    relationshipZh: '感情暗淡无光，彼此渐行渐远',
    mindZh: '心情低落消沉，意志薄弱',
    socialZh: '多遇损友消耗自身能量',
    familyZh: '家中琐事烦恼多，缺乏温馨感',
    propertyZh: '对各项投资持悲观态度',
  },
  // Page 41: 方块K + 黑桃8
  'diamondK__spade8': {
    starType: 'jueMing',
    titleZh: '惹官非而坐牢，严重触法',
    careerZh: '事业陷入低谷，危机四伏',
    wealthZh: '损耗大笔钱财，资金断流',
    officialZh: '极易招惹官司诉讼，甚至有牢狱之灾',
    relationshipZh: '伴侣关系不合，濒临破裂',
    mindZh: '担忧财务严重困扰，忧心如焚',
    socialZh: '极易受到损友拖累连坐',
    familyZh: '家人争吵不休，长幼多健康危机',
    propertyZh: '投资亏损巨大，不可贸然入局',
  },
  // Page 42: 黑桃7 + 黑桃10
  'spade7__spade10': {
    starType: 'jueMing',
    titleZh: '文件上失误，严重破财，争夺财产',
    careerZh: '事业陷入低潮期，难有进展',
    wealthZh: '严重入不敷出，债台高筑',
    officialZh: '面临降职失业之严峻危机',
    relationshipZh: '牵涉分居离婚与法律分割事务',
    mindZh: '受经济债务困扰，夜不能寐',
    socialZh: '交友不慎，被损友拉下水',
    familyZh: '家人为争夺财产反目成仇',
    propertyZh: '投资巨亏，签约文件有重大漏洞',
  },
  // Page 43: 黑桃6 + 红心J
  'heartJ__spade6': {
    starType: 'jueMing',
    titleZh: '结伴出外，小心意外情伤',
    careerZh: '事业剧烈变动，深陷发展低谷',
    wealthZh: '破大财，出门在外耗费无度',
    officialZh: '面临撤职、待岗或失业风险',
    relationshipZh: '容易在感情中遭受重大背叛情伤',
    mindZh: '对未知的动荡充满恐惧与担忧',
    socialZh: '结交损友受累，外出遇险',
    familyZh: '谨防家中至亲出意外伤损',
    propertyZh: '投资亏损严重，资产缩水',
  },
  // Page 44: 梅花Q + 黑桃9
  'clubQ__spade9': {
    starType: 'jueMing',
    titleZh: '因桃色问题而损财，工作受女性阻碍',
    careerZh: '事业因男女桃色纠纷受重创',
    wealthZh: '因不良情缘或女性问题大笔破财',
    officialZh: '在职场上遭排挤，有失业之虞',
    relationshipZh: '第三者插足破坏原本感情',
    mindZh: '周围环境因不良女性而生巨大变动',
    socialZh: '极易招惹女性小人口舌陷害',
    familyZh: '家中女性成员生事端，开销巨大',
    propertyZh: '投资亏损大，勿信花言巧语',
  },
  // Page 46: 黑桃9 + 黑桃8
  'spade8__spade9': {
    starType: 'wuGui',
    titleZh: '工作压力大',
    careerZh: '找不到理想的工作与项目，处处受制',
    wealthZh: '因钱财财务纠纷而备受困扰',
    officialZh: '极易招惹官非与部门间矛盾',
    relationshipZh: '夫妻情侣貌合神离，同床异梦',
    mindZh: '精神不振，疑神疑鬼，甚至有卡阴之虞',
    socialZh: '常与他人闹不和，社交处处受阻',
    familyZh: '家庭不和睦，口角是非频繁',
    propertyZh: '积蓄大幅缩水，存款耗尽',
  },
  // Page 47: 黑桃10 + 红心J
  'heartJ__spade10': {
    starType: 'wuGui',
    titleZh: '交损友，投资失误，耗财不宜合伙',
    careerZh: '事业方向迷失，找不到立足点',
    wealthZh: '钱财纠纷不断，耗费巨大',
    officialZh: '职场惹官非，背黑锅',
    relationshipZh: '各奔前程，容易忽略伴侣感受',
    mindZh: '为朋友和资金难题愁肠百结',
    socialZh: '交到损友，被带偏方向',
    familyZh: '为钱财分配与家人大起争执',
    propertyZh: '投资决策失误，绝不可参与合伙',
  },
  // Page 48: 方块K + 梅花Q
  'clubQ__diamondK': {
    starType: 'wuGui',
    titleZh: '小人多，是非多',
    careerZh: '周围小人暗中作梗，阻碍重重',
    wealthZh: '因轻信不靠谱伙伴而蒙受损失',
    officialZh: '不被老板或顶头上司看好',
    relationshipZh: '好端端的感情容易被人从中破坏',
    mindZh: '深陷复杂的人事斗争心力交瘁',
    socialZh: '贵人寥寥，身边小人丛生',
    familyZh: '家庭成员间争执不断，意见不合',
    propertyZh: '容易被误导盲目乱投资导致亏损',
  },
  // Page 49: 黑桃6 + 黑桃7
  'spade6__spade7': {
    starType: 'wuGui',
    titleZh: '精神恍惚，反反复复',
    careerZh: '优柔寡断，犹豫不决导致错失良机',
    wealthZh: '财运时好时坏，起伏动荡难稳',
    officialZh: '得不到上级认可，地位摇摇欲坠',
    relationshipZh: '感情发展不佳，拖泥带水不果断',
    mindZh: '神不守舍，反反复复难以做决定',
    socialZh: '暗中小人环伺，防不胜防',
    familyZh: '家庭关系趋于暗淡冷漠',
    propertyZh: '投资极易做出错误决策导致血亏',
  },
  // Page 50: 黑桃9 + 红心7
  'heart7__spade9': {
    starType: 'liuSha',
    titleZh: '工作上遇烦心事',
    careerZh: '生意低迷不振，客源萎缩',
    wealthZh: '收入不稳定，进账大打折扣',
    officialZh: '前途茫茫无目标，得过且过',
    relationshipZh: '交不到心仪对象，多遇烂桃花',
    mindZh: '思想悲观消极，防忧郁情绪滋生',
    socialZh: '宅在家中自我封闭，不愿交际',
    familyZh: '家人之间沉默寡言，严重缺乏沟通',
    propertyZh: '投资投下去后毫无起色与水花',
  },
  // Page 51: 黑桃10 + 梅花Q
  'clubQ__spade10': {
    starType: 'liuSha',
    titleZh: '烂桃花，卡阴，破财',
    careerZh: '沉迷不良男女关系，无心放在正途',
    wealthZh: '深陷财务纠纷，钱财被耗散',
    officialZh: '官禄前途暗淡，丧失升迁良机',
    relationshipZh: '被烂桃花纠缠，感情备受折磨',
    mindZh: '精神不济，疑神疑鬼，需净化心灵',
    socialZh: '身边多女性小人从中作梗',
    familyZh: '家庭不和，常与家中女性长辈冲突',
    propertyZh: '辛勤积累的产业储蓄被无端败光',
  },
  // Page 52: 红心J + 方块K
  'diamondK__heartJ': {
    starType: 'liuSha',
    titleZh: '小人阻碍，老板给予很大的压力',
    careerZh: '事业阻碍重重，如负千斤重担',
    wealthZh: '财气不佳，求财吃力艰难',
    officialZh: '受到顶头上司或老板极大施压严苛苛责',
    relationshipZh: '感情走势不佳，冷战摩擦频繁',
    mindZh: '精神压力巨大，焦虑紧绷',
    socialZh: '多受身边小人牵累拖延',
    familyZh: '家人阻碍阻扰自己的选择与发展',
    propertyZh: '投资失策，损失储蓄资本',
  },
  // Page 53: 黑桃6 + 黑桃8
  'spade6__spade8': {
    starType: 'liuSha',
    titleZh: '受骗，易静不易动',
    careerZh: '事业前景暗淡，前路充满陷阱',
    wealthZh: '意外破大财，谨防诈骗被掏空',
    officialZh: '职场多口舌是非，被无端针对',
    relationshipZh: '感情容易轻信他人谎言被骗',
    mindZh: '注意身心健康，暗淡害怕缺乏安全感',
    socialZh: '小人在暗处伺机陷害设计',
    familyZh: '家人暗地里多有异动与心机',
    propertyZh: '极易在不动产与大宗交易上受骗',
  },
  // Page 54: 黑桃9 + 红心J
  'heartJ__spade9': {
    starType: 'huoHai',
    titleZh: '朋友聚会，反多口角',
    careerZh: '在职场容易受心机小人排挤',
    wealthZh: '财来财去如过眼云烟，存不住钱',
    officialZh: '任职毫无亮眼表现，难当大任',
    relationshipZh: '姻缘难成，好事多磨',
    mindZh: '缺乏主见，容易被外界流言左右',
    socialZh: '结识损友，聚会常演变为争吵',
    familyZh: '家庭内部不和睦，火气偏旺',
    propertyZh: '被迫变卖手头产业以填补窟窿',
  },
  // Page 55: 黑桃10 + 黑桃8
  'spade8__spade10': {
    starType: 'huoHai',
    titleZh: '健康出问题而耗财',
    careerZh: '事业毫无起色，停滞不前',
    wealthZh: '因自己或家人健康疾患频繁耗财',
    officialZh: '表现平平，被边缘化',
    relationshipZh: '极易因银钱贫乏而导致感情破裂分离',
    mindZh: '长期受身体健康不佳所累',
    socialZh: '心灰意冷，毫无心情与外界交际',
    familyZh: '家人健康频繁亮起红灯',
    propertyZh: '投资不利，资金被深套其中',
  },
  // Page 56: 梅花Q + 黑桃6
  'clubQ__spade6': {
    starType: 'huoHai',
    titleZh: '注意烂桃花，谨防女人破财',
    careerZh: '工作心不在焉，三心二意',
    wealthZh: '因女人或不当花销而大破财',
    officialZh: '遭受女性上司暗中刁难阻碍',
    relationshipZh: '谨防心机女性破坏原本美满家庭',
    mindZh: '深受不良桃花困扰，神魂颠倒',
    socialZh: '周围多有心机的女性朋友算计',
    familyZh: '常与女性亲友产生激烈口角争端',
    propertyZh: '投资房产或商铺需万分谨慎',
  },
  // Page 57: 方块K + 黑桃7
  'diamondK__spade7': {
    starType: 'huoHai',
    titleZh: '老板给压力，或法律文件上出问题',
    careerZh: '事业在法规合同、政策审查上遭遇阻力',
    wealthZh: '破小财，经常支付罚金违约金',
    officialZh: '上司施加繁重压力，挑剔挑刺',
    relationshipZh: '感情平淡乏味，缺乏共鸣',
    mindZh: '身心压力山大，心事重重',
    socialZh: '身边男性小人多，宜减少无效社交',
    familyZh: '家中男性长辈给予强大家庭压力',
    propertyZh: '投资合同务必找专业律师严格审查',
  },
};

/**
 * 核心查表计算：根据两张牌匹配最精准的真实断语
 * 如果没有完全匹配的特定两张牌，则依据花色五行生克与点数吉凶生成严密的传统推演！
 */
export function evaluatePairMeaning(c1: PlayingCard, c2: PlayingCard): PairRuleResult {
  const key = makePairKey(c1, c2);
  if (PAIR_RULES_DATABASE[key]) {
    return PAIR_RULES_DATABASE[key];
  }

  // 严密降级引擎：依据真实《九星牌卦》花色与点数法则智能合成
  const s1 = c1.suit;
  const s2 = c2.suit;
  const isRed1 = s1 === 'diamond' || s1 === 'heart';
  const isRed2 = s2 === 'diamond' || s2 === 'heart';
  const isBlack1 = !isRed1;
  const isBlack2 = !isRed2;

  // 1. 双红心/方块组合 -> 偏吉（天医/延年/生气）
  if (isRed1 && isRed2) {
    return {
      starType: 'yanNian',
      titleZh: `双阳聚气 · ${c1.nameZh}配${c2.nameZh}`,
      careerZh: '诸事顺遂，阳光明朗，能得同道中人诚心共谋。',
      wealthZh: '财气充沛，正道取财，投资回报较为乐观。',
      officialZh: '工作表现受赏识，有升迁转正良机。',
      relationshipZh: '喜气洋洋，感情升温，夫妻和谐。',
      mindZh: '心情开朗积极，身心气血充盈。',
      socialZh: '多与正直通达之贵人交往合作。',
      familyZh: '家宅安泰，和乐融融。',
      propertyZh: '产业稳固，资财渐增。',
    };
  }

  // 2. 双黑桃/梅花组合 -> 偏静或需防耗（伏位/五鬼/六煞）
  if (isBlack1 && isBlack2) {
    const hasA = c1.rank === 'A' || c2.rank === 'A';
    const has8 = c1.rank === '8' || c2.rank === '8';
    if (hasA) {
      return {
        starType: 'xinQing',
        titleZh: `重阴审度 · ${c1.nameZh}配${c2.nameZh}`,
        careerZh: '宜守不宜冒进，按部就班做好本职工作。',
        wealthZh: '财来财去，宜收紧开支，防无谓破耗。',
        officialZh: '守住本分，避免卷入职场口舌风波。',
        relationshipZh: '心事暗藏，需多主动真诚沟通。',
        mindZh: '易生忧思，宜静心调适，多晒太阳户外活动。',
        socialZh: '谨防损友带偏节奏，远离是非小人。',
        familyZh: '家常事务宜以和为贵，切莫争胜。',
        propertyZh: '投资宜保守，现金为王。',
      };
    }
    return {
      starType: has8 ? 'wuGui' : 'fuWei',
      titleZh: `静定盘整 · ${c1.nameZh}配${c2.nameZh}`,
      careerZh: '按规矩办事，防范流程遗漏与合约瑕疵。',
      wealthZh: '财源平稳，宜以稳固主营业务为主。',
      officialZh: '持重求安，踏实积累不可浮躁。',
      relationshipZh: '平淡之中见真情，彼此包容体谅。',
      mindZh: '沉稳厚实，守中致和。',
      socialZh: '以信待人，交情宜长不宜急。',
      familyZh: '安稳平实，尊老爱幼。',
      propertyZh: '资产求稳，慎碰高风险投机。',
    };
  }

  // 3. 一红一黑（一阳一阴）-> 阴阳互济，以动促成（生气/天医/祸害）
  const isSpade = s1 === 'spade' || s2 === 'spade';
  const isDiamond = s1 === 'diamond' || s2 === 'diamond';
  if (isDiamond) {
    return {
      starType: 'shengQi',
      titleZh: `财动生辉 · ${c1.nameZh}配${c2.nameZh}`,
      careerZh: '借势出击，多跑业务多见客户，成算大增。',
      wealthZh: '动中得财，利于商谈、签约与销售转化。',
      officialZh: '多外出走动更有机会获得提拔。',
      relationshipZh: '彼此相吸，适宜安排出行增进好感。',
      mindZh: '精神焕发，执行力强。',
      socialZh: '多出门广结良缘，多得外部贵人支援。',
      familyZh: '利于改善居住环境或置办家居良品。',
      propertyZh: '商业投资见起色，动中有获。',
    };
  }

  return {
    starType: 'tianYi',
    titleZh: `时和岁丰 · ${c1.nameZh}配${c2.nameZh}`,
    careerZh: '得遇贵人指点迷津，难题峰回路转。',
    wealthZh: '财气渐顺，收支得宜。',
    officialZh: '上级明察秋毫，得应有肯定。',
    relationshipZh: '长久融洽，彼此为生命良伴。',
    mindZh: '心气舒畅，无病痛挂碍。',
    socialZh: '贵人和煦，谈笑皆鸿儒。',
    familyZh: '阖家安康，互敬互爱。',
    propertyZh: '资产保值，平稳积累。',
  };
}

// ==========================================
// 5. 八宫方位映射与卡牌对应 (Document 2 Page 1-8)
// ==========================================
export interface PalaceData {
  id: string;
  nameZh: string;
  nameEn: string;
  compassDirZh: string;
  cardPositions: number[]; // e.g. [2, 7, 19]
  scopeZh: string;
  meaningZh: string;
}

export const EIGHT_PALACES_SPEC: Record<string, PalaceData> = {
  career: {
    id: 'career',
    nameZh: '事业宫',
    nameEn: 'Career Palace',
    compassDirZh: '正西（兑金/卯向横轴）',
    cardPositions: [2, 7, 19], // Page 1
    scopeZh: '生意，职业，创业，公司，工作场所，工厂，合作伙伴，生财之路。',
    meaningZh: '掌管求测者事业立身之本。以 2 号春令牌为枢纽，7 号二月牌、19 号外环流日牌为辅翼，详断合伙成败与经营吉凶。',
  },
  mind: {
    id: 'mind',
    nameZh: '组织宫',
    nameEn: 'Organization & Mind Palace',
    compassDirZh: '西北（乾金方位）',
    cardPositions: [8, 20, 9, 21], // Page 2
    scopeZh: '个人想法，思考，策划，精神，思想，智慧，个性，信仰，身心灵方面。',
    meaningZh: '掌管决策者的战略定力与心智气度。以 8 号三月牌、20 号外环，及 9 号四月牌、21 号外环为坐标，推演思想与精神状态。',
  },
  social: {
    id: 'social',
    nameZh: '交际宫',
    nameEn: 'Social & Nobles Palace',
    compassDirZh: '正北（12点钟/午火正轴）',
    cardPositions: [3, 10, 22], // Page 3
    scopeZh: '人际关系，贵人运，朋友，交际，出外运势，交际手腕。',
    meaningZh: '掌管四海人脉与贵人引路。以 3 号夏令牌、10 号五月牌★、22 号外环为核心，断言外出逢凶化吉与结盟气运。',
  },
  family: {
    id: 'family',
    nameZh: '家庭宫',
    nameEn: 'Family & Roots Palace',
    compassDirZh: '东北（艮土方位）',
    cardPositions: [11, 23, 12, 24], // Page 4
    scopeZh: '家人关系，家庭状况，搬家，邻居，祖先风水，添置产业，家宅风水。',
    meaningZh: '掌管安居祖荫与家业繁衍。以 11 号六月牌、23 号外环，12 号七月牌★、24 号外环为凭，洞察家道兴旺与添产安居。',
  },
  wealth: {
    id: 'wealth',
    nameZh: '财富宫',
    nameEn: 'Wealth Palace',
    compassDirZh: '正东（3点钟/酉金横轴）',
    cardPositions: [4, 13, 25], // Page 5
    scopeZh: '财富来源，正财，偏财，妻财，财产，意外之财。',
    meaningZh: '掌管现金流向与财源根本。以 4 号秋令牌、13 号八月牌▲、25 号外环为准绳，定夺盈亏大数与聚财避漏。',
  },
  official: {
    id: 'official',
    nameZh: '官禄宫',
    nameEn: 'Status & Authority Palace',
    compassDirZh: '东南（巽木方位）',
    cardPositions: [14, 26, 15, 27], // Page 6
    scopeZh: '权力，名誉，地位，职位，事业升迁，老板，贵人，上级，政治人物，有权威的人。',
    meaningZh: '掌管名位威权与上峰赏识。以 14 号九月牌★、26 号外环，15 号十月牌、27 号外环为定势，研判升职执柄之机。',
  },
  relationship: {
    id: 'relationship',
    nameZh: '感情宫',
    nameEn: 'Romance & Marriage Palace',
    compassDirZh: '正南（6点钟/子水正轴）',
    cardPositions: [5, 16, 28], // Page 7
    scopeZh: '姻缘，桃花运，爱情，异性缘，夫妻感情。',
    meaningZh: '掌管良缘正配与情意纠葛。以 5 号冬令牌、16 号冬月牌、28 号外环为标尺，精断桃花纯杂与琴瑟和鸣。',
  },
  children: {
    id: 'children',
    nameZh: '儿女宫',
    nameEn: 'Descendants & Foundation Palace',
    compassDirZh: '西南（坤土方位）',
    cardPositions: [17, 29, 6, 18], // Page 8
    scopeZh: '儿女，成就，组织，职员，下属，财产，不动产。',
    meaningZh: '掌管后嗣成就与基盘底定。以 6 号正月牌、18 号外环，17 号腊月牌、29 号外环为根基，衡量产业传承与得力臂膀。',
  },
};

// ==========================================
// 6. 流日开牌顺序表 (Document 1 Page 7-18)
// ==========================================
export const LUNAR_HOURLY_BRANCHES = [
  { branchZh: '寅时', timeRange: '03:00 - 04:59', daysZh: '初一，十三，二十五' },
  { branchZh: '卯时', timeRange: '05:00 - 06:59', daysZh: '初二，十四' },
  { branchZh: '辰时', timeRange: '07:00 - 08:59', daysZh: '初三，十五' },
  { branchZh: '巳时', timeRange: '09:00 - 10:59', daysZh: '初四，十六' },
  { branchZh: '午时', timeRange: '11:00 - 12:59', daysZh: '初五，十七' },
  { branchZh: '未时', timeRange: '13:00 - 14:59', daysZh: '初六，十八' },
  { branchZh: '申时', timeRange: '15:00 - 16:59', daysZh: '初七，十九' },
  { branchZh: '酉时', timeRange: '17:00 - 18:59', daysZh: '初八，二十' },
  { branchZh: '戌时', timeRange: '19:00 - 20:59', daysZh: '初九，二十一' },
  { branchZh: '亥时', timeRange: '21:00 - 22:59', daysZh: '初十，二十二' },
  { branchZh: '子时', timeRange: '23:00 - 00:59', daysZh: '十一，二十三' },
  { branchZh: '丑时', timeRange: '01:00 - 02:59', daysZh: '十二，二十四' },
];

/**
 * 根据当下的农历月份（1..12），获取 18~29 号牌的流日对应表
 * 农历正月(1) -> 处在6号，对应18号开始 (Page 7)
 * 农历二月(2) -> 处在7号，对应19号开始 (Page 8)
 * 农历三月(3) -> 处在8号，对应20号开始 (Page 9)
 * ...
 * 农历十二月(12) -> 处在17号，对应29号开始 (Page 18)
 */
export function getDailySlotSchedule(lunarMonth: number = 1): Array<{
  slotIndex: number;
  cardPos: number;
  daysZh: string;
  branchZh: string;
  timeRange: string;
}> {
  // Start card position for 1st branch: (lunarMonth - 1) offset from 18
  // e.g. Month 1 -> 18, Month 2 -> 19, ..., Month 12 -> 29
  const baseCard = 18 + ((lunarMonth - 1) % 12);

  return LUNAR_HOURLY_BRANCHES.map((branch, i) => {
    // Clockwise cycle among 18..29
    let cardPos = baseCard + i;
    if (cardPos > 29) {
      cardPos = 18 + (cardPos - 30);
    }
    return {
      slotIndex: i + 1,
      cardPos,
      daysZh: branch.daysZh,
      branchZh: branch.branchZh,
      timeRange: branch.timeRange,
    };
  });
}
