import { Consultation, CastSession, PalaceReading, FollowUpItem } from '../types';
import { getMarcusTanDefaultCards, computeHexagrams } from './cardEngine';

const marcusCards = getMarcusTanDefaultCards();
const { benGua, bianGua, movingLineIndex } = computeHexagrams(marcusCards.slice(29));

export const defaultMarcusCastSession: CastSession = {
  id: 'cast-marcus-01',
  consultationId: 'NS-20250518-882',
  castBy: 'master-lin-01',
  castByName: '林清泉 驻堂督导',
  castAt: '2025-05-18 10:42 GMT+8',
  lunarDateZh: '乙巳流年（农历）· 时空奇门卦局',
  lunarDateEn: 'Year of Yi-Si (Lunar) · Space-Time Qi Men Chart',
  cards: marcusCards,
  benGua,
  bianGua,
  movingLineIndex,
  movingCard: marcusCards[35], // ♥ Q
  governingStarsZh: ['【天医星】解困', '【生气星】转机'],
  masterNotesZh:
    '雷天大壮卦象刚烈，合伙人多方各有企图。变卦归妹主张“先客后主，依约成事”，切忌以口头默契替代权责法约。',
  masterNotesEn:
    'The Da Zhuang hexagram reflects strong momentum and assertive parties. Transformed into Gui Mei, the advice is to formalize responsibilities legally before capital enters.',
  engineVersion: 'NineStarEngine-v1.2-Deterministic',
};

export const defaultMarcusPalaces: Record<string, PalaceReading> = {
  career: {
    palaceId: 'career',
    nameZh: '事业宫 (Career Palace)',
    nameEn: 'Career Palace',
    tagZh: '主宫位 · 已全面解锁',
    tagEn: 'Primary Palace · Unlocked',
    icon: 'corporate_fare',
    unlocked: true,
    contentZh:
      '当前两家投资机构中，A 机构（偏向激进扩张）表面条件优厚，实则内藏对控制权的严苛对赌；B 机构（稳健型基金）虽估值审慎，但其行业资源与你在吉隆坡的落地场景互补性达 80% 以上。雷泽归妹卦象昭示：“归妹以娣，雨恐亦濡”，意味着你需要扮演沉着整合者的角色，切忌被高估值虚妄诱导。',
    contentEn:
      'Between the two investment suitors, Firm A offers aggressive valuation but conceals strict performance clawbacks. Firm B offers measured valuation but delivers over 80% strategic resource fit in Kuala Lumpur. Act as a grounded integrator; avoid superficial valuation traps.',
    keyActionPointsZh: [
      '关键破局窗口：农历七月至九月（秋令金旺，契约签署吉时，水木背景贵人现身）',
      '合伙人信任危机防范：农历八月防暗动（三爻动变逢绝命星，核心成员可能因利益产生犹豫）',
      '落地战略建议：权责法务先定（在马来西亚公司法框架下设立双重表决权或防稀释条款）',
    ],
    keyActionPointsEn: [
      'Breakthrough Window: Lunar Months 7-9 (Autumn peak, auspicious contract signing)',
      'Partner Trust Guard: Beware Lunar Month 8 (Fatal star movement causes hesitation)',
      'Strategic Implementation: Bind bylaws under Malaysian Company Act with anti-dilution terms',
    ],
    metricLabelZh: '大师重点关注项 · 星曜吉神',
    metricLabelEn: 'Master Focus Item · Beneficial Star',
    metricValue: '天乙贵人同临震宫',
    badgeTextZh: '主宫位',
    badgeTextEn: 'Primary Palace',
  },
  wealth: {
    palaceId: 'wealth',
    nameZh: '财富宫 (Wealth)',
    nameEn: 'Wealth Palace',
    tagZh: '正财丰盛 · 偏财戒贪',
    tagEn: 'Steady Income · Prudent Capital',
    icon: 'account_balance_wallet',
    unlocked: true,
    contentZh:
      '正财位稳健扎实，现有核心现金流足以支撑新项目前 6 个月的冷启动。但受方块 10 与三爻动影响，需特别注意：资本注入建议分两阶段（Milestone-based）到账，防范资金链断裂风险；注意知识产权与本地牌照挂靠费用的隐性支出。',
    contentEn:
      'Earned cash flow is resilient, covering initial 6-month cold start expenses. However, conditioned by Diamond 10 and line 3 movement, ensure tranche-based milestone investments and audit local IP/licensing expenditures.',
    keyActionPointsZh: [
      '资本注入：投资款项建议分两阶段（Milestone-based）到账，防范资金链断裂风险。',
      '合约细则：注意知识产权与本地牌照挂靠费用的隐性支出。',
    ],
    keyActionPointsEn: [
      'Capital Inflow: Milestone-based disbursements recommended.',
      'Contract Details: Beware hidden licensing and compliance overheads.',
    ],
    metricLabelZh: '现金流安全指数',
    metricLabelEn: 'Cash Flow Safety Index',
    metricValue: '85% (高安全性)',
    metricProgress: 85,
    badgeTextZh: '已解锁',
    badgeTextEn: 'Unlocked',
  },
  mindStrategy: {
    palaceId: 'mindStrategy',
    nameZh: '组织宫 (Mind & Strategy)',
    nameEn: 'Mind & Strategy Palace',
    tagZh: '心性调适 · 顶层决策模型',
    tagEn: 'Mindset Calibration & Hierarchy',
    icon: 'psychology',
    unlocked: false,
    contentZh:
      '组织结构在今年二季度易见权力中空，下属中有一名骨干核心成员将提出期权诉求。如处理得当将成左膀右臂，如处理不慎将引发团队动荡。心法口诀：静水流深，柔以济刚。',
    contentEn:
      'A leadership vacuum may emerge in Q2; a key contributor will request equity vesting. Handle with transparent incentive structures to turn them into an invaluable anchor.',
    associatedCardZh: '对应牌：♣ K 梅花统领',
    associatedStarZh: 'VIP 专属',
    badgeTextZh: 'VIP 专属',
    badgeTextEn: 'VIP Exclusive',
  },
  authority: {
    palaceId: 'authority',
    nameZh: '官禄宫 (Authority & Status)',
    nameEn: 'Authority & Status Palace',
    tagZh: '商誉声望 · 监管合规',
    tagEn: 'Reputation & Regulatory Standing',
    icon: 'workspace_premium',
    unlocked: false,
    contentZh:
      '涉及大马本地机构联合审批或牌照获取，农历五月与十月是关键文书审查窗口，注意避免第三方代办机构的延误风险。声誉评级：AAA 级向好。',
    contentEn:
      'Regulatory compliance for local Malaysian licenses peaks during Lunar months 5 and 10. Audit third-party filing agencies to prevent unwarranted delays.',
    associatedStarZh: '对应星：天辅星正照',
    badgeTextZh: 'VIP 专属',
    badgeTextEn: 'VIP Exclusive',
  },
  social: {
    palaceId: 'social',
    nameZh: '交际宫 (Social & Allies)',
    nameEn: 'Social & Allies Palace',
    tagZh: '真伪贵人甄别 · 防暗小人',
    tagEn: 'Allies Identification & Guard',
    icon: 'groups',
    unlocked: false,
    contentZh:
      '提防农历八月一位口才极佳的中间撮合人，其承诺之政府配资存在不实成分，务必以第三方尽职调查为准绳。警惕生肖：巳亥相冲。',
    contentEn:
      'Beware a persuasive intermediary in Lunar month 8 promising public grants. Demand third-party audit before committing resources.',
    associatedCardZh: '对应牌：♠ 3 避险',
    badgeTextZh: 'VIP 专属',
    badgeTextEn: 'VIP Exclusive',
  },
  family: {
    palaceId: 'family',
    nameZh: '家庭宫 (Family Palace)',
    nameEn: 'Family Palace',
    tagZh: '大后方安泰 · 宅邸气场',
    tagEn: 'Sanctuary & Domestic Support',
    icon: 'cottage',
    unlocked: false,
    contentZh:
      '家居西北方属乾位，建议保持整洁明亮，利于求测人思维清晰，家人全面支持外出创业，后方无忧。气场协调度：高。',
    contentEn:
      'Maintain uncluttered clarity in the Northwest sector of your living space to foster mental focus. Family backing remains steady throughout your venture.',
    associatedStarZh: '对应星：天任吉星',
    badgeTextZh: 'VIP 专属',
    badgeTextEn: 'VIP Exclusive',
  },
  romance: {
    palaceId: 'romance',
    nameZh: '感情宫 (Romance Palace)',
    nameEn: 'Romance Palace',
    tagZh: '心境滋养 · 伴侣同频',
    tagEn: 'Emotional Haven & Harmony',
    icon: 'favorite',
    unlocked: false,
    contentZh:
      '感情运势平和温润，今年主精力聚焦在商业搏杀，伴侣能成为情绪避风港，多听取伴侣直觉，有意外灵感。同心力：强。',
    contentEn:
      'Your partner acts as a vital emotional buffer amid intense commercial negotiations. Consult their intuitive perspective on people issues.',
    associatedCardZh: '对应牌：♥ 8 金秋应期',
    badgeTextZh: 'VIP 专属',
    badgeTextEn: 'VIP Exclusive',
  },
  legacy: {
    palaceId: 'legacy',
    nameZh: '传承宫 (Legacy & Team)',
    nameEn: 'Legacy & Children Palace',
    tagZh: '门生梯队 · 资产永续',
    tagEn: 'Succession & Team Mentorship',
    icon: 'diversity_3',
    unlocked: false,
    contentZh:
      '新创事业中招聘的年轻主力在农历十月发挥奇效，宜采用师徒制绑定核心利益，打造长期稳定的基本盘。后继发展：郁郁葱葱。',
    contentEn:
      'Young recruits onboarded in Lunar month 10 will demonstrate unexpected ingenuity. Implement apprenticeship incentives for enduring retention.',
    associatedCardZh: '对应牌：♠ 7 冬令奠基',
    badgeTextZh: 'VIP 专属',
    badgeTextEn: 'VIP Exclusive',
  },
};

export const initialConsultations: Consultation[] = [
  {
    id: 'NS-20250518-882',
    uid: 'demo-user-marcus',
    name: '张子涵 (Marcus Tan)',
    phone: '+60 12-882 9134',
    question: '近期筹备在吉隆坡开展新合伙事业，但面临两家投资方选择与合伙人心态摇摆，想问测今年事业走向与最佳决策月份？',
    status: 'published',
    primaryPalace: '事业宫 (Career)',
    secondaryPalaces: ['财富宫', '组织心法'],
    castSessionId: 'cast-marcus-01',
    publicSummary:
      '“当前面对变局内耗偏重，但下半年藏有隐蔽贵人相助，适宜稳中求进。” 卦气显现：春季梅花 K 盘结，各方合伙理念尚未完全校准，容易因股权分配与决策权归属产生无形暗涌。入秋后（农历七月至九月）方块能量骤聚，两家投资方中带“水木”背景之机构将拿出实质性意向书，彼时落子可免除后顾之忧。',
    annualScore: 78,
    annualVerdict: '先劳后逸 · 动中有获',
    createdAt: '2025-05-18 10:15 GMT+8',
    updatedAt: '2025-05-18 10:42 GMT+8',
    isVip: false,
  },
  {
    id: 'NS-20250520-109',
    uid: 'demo-user-michelle',
    name: '李美玲 (Michelle Lee)',
    phone: '+60 16-773 2189',
    question: '计划于槟城乔治市购置第二处不动产并与海外伙伴合作文旅项目，想了解家庭宫与财富宫的时空契机。',
    status: 'pending_review',
    primaryPalace: '家庭宫 (Family)',
    secondaryPalaces: ['财富宫', '交际宫'],
    publicSummary: '待大师亲笔批注复核中，初步星象提示农历六月有文书吉星天辅相照，适宜签署契约。',
    annualScore: 82,
    annualVerdict: '基业固本 · 顺水行舟',
    createdAt: '2025-05-20 14:20 GMT+8',
    updatedAt: '2025-05-20 15:00 GMT+8',
    isVip: true,
  },
  {
    id: 'NS-20250521-042',
    uid: 'demo-user-wilson',
    name: '陈伟杰 (Wilson Chen)',
    phone: '+60 11-2390 8812',
    question: 'AI SaaS 初创项目已完成天使轮，现考虑在新加坡或吉隆坡设立双总部，问测团队扩张与组织宫凝聚力。',
    status: 'submitted',
    primaryPalace: '组织宫 (Mind & Strategy)',
    secondaryPalaces: ['官禄宫', '事业宫'],
    publicSummary: '系统已接收问测诉求，排队等待大师吉时亲抽 36 牌阵开盘。',
    annualScore: 75,
    annualVerdict: '初度谋断 · 待定乾坤',
    createdAt: '2025-05-21 09:30 GMT+8',
    updatedAt: '2025-05-21 09:30 GMT+8',
    isVip: false,
  },
];

export const initialFollowUps: FollowUpItem[] = [
  {
    id: 'f-01',
    consultationId: 'NS-20250518-882',
    uid: 'demo-user-marcus',
    userName: '张子涵 (Marcus Tan)',
    question: '林大师，关于农历八月的防暗动，如果两家投资方在七月底施压要求提前锁定义向，我是否可以借故法务审查拖延至九月？',
    answer: '答张子涵先生：雷泽归妹卦卦意正是“顺应法约、戒除躁急”。若对方在七月底强推，可合情合理委托具有公信力的大马律所进行条款交叉审核，此举既展现专业合规，又恰好避开八月暗动锋芒，至九月秋水得利时方能占据谈判上风。',
    status: 'answered',
    createdAt: '2025-05-18 16:30 GMT+8',
    answeredAt: '2025-05-19 09:15 GMT+8',
  },
];
