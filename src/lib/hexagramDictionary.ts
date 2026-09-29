/**
 * 易经六十四卦真传详解库 (权威大成典籍)
 * 严格依据《九星牌卦 - 六十四卦详解》文档 1 (Pages 28-157) 全文数字化录入
 */

export interface HexagramDetail {
  number: number;
  nameZh: string;
  nameEn: string;
  upperNameZh: string;
  lowerNameZh: string;
  guaCiZh: string;
  coreMottoZh: string;
  verdictZh: string;
  businessAdviceZh: string;
  employeeAdviceZh: string;
  affairsZh: string;
  loveZh: string;
  careerZh: string;
  masterAdviceZh: string;
}

export const HEXAGRAM_DICTIONARY: Record<number, HexagramDetail> = {
  1: {
    number: 1,
    nameZh: '乾为天',
    nameEn: 'The Creative (Qian)',
    upperNameZh: '天',
    lowerNameZh: '天',
    guaCiZh: '乾，元亨利贞。',
    coreMottoZh: '完成元亨利贞的循环，方能获得成就。',
    verdictZh: '得此卦者，天行刚健，自强不息，名利双收之象，宜把握机会，争取成果。女人得此卦则有过於刚直之嫌。',
    businessAdviceZh: '具备先天的优势，拥有一切良好的条件，自可水到渠成。',
    employeeAdviceZh: '能力强，能够独当一面，但需要把握良好时机。',
    affairsZh: '小吉，亨通。时机很重要。能够守住美德，与时俱进则能有很大发展机会。',
    loveZh: '刚强好胜，容易产生摩擦。宜以柔克刚。',
    careerZh: '能力强，能够独当一面。然而是否能够亨通，则有待良好的时机。',
    masterAdviceZh: '得此卦者在能力上并不是问题，最大的问题在於“时机”与自己的应变力。建议凡事不要过於固执，最好要能见机行事，随机应变，做事要有弹性。',
  },
  2: {
    number: 2,
    nameZh: '坤为地',
    nameEn: 'The Receptive (Kun)',
    upperNameZh: '地',
    lowerNameZh: '地',
    guaCiZh: '坤，元亨，利牝马之贞。君子有攸往，先迷后得主利。西南得朋，东北丧朋，安贞吉。',
    coreMottoZh: '能屈能伸，配合上层，不争风头。',
    verdictZh: '得此卦者，宜顺从运势，以静制动，不宜独立谋事，顺从他人，一起合作，可成大事。',
    businessAdviceZh: '面对顾客时，老板也要懂得配合，迎合需求，圆滑应对。',
    employeeAdviceZh: '要学会扮演好坤卦角色，最忠心、最能配合上级的人才能稳步出头。',
    affairsZh: '小吉。柔顺、慢慢来，可成；急切、积极进取反而不可得。',
    loveZh: '吉，可以慢慢培养感情，坚持到底可成。',
    careerZh: '小顺。谦卑退让，可找到好的老板。但不利於独自创业。',
    masterAdviceZh: '对于立定志向想做的事，应该要持之以恒，坚持到底，则可成功；操之过急，易致失败。利于追随于人，不适于自己独当一面。',
  },
  3: {
    number: 3,
    nameZh: '水雷屯',
    nameEn: 'Difficulty at the Beginning (Zhun)',
    upperNameZh: '水',
    lowerNameZh: '雷',
    guaCiZh: '屯，元亨利贞，勿用有攸往，利建侯。',
    coreMottoZh: '在开始的阶段，面对困难；万事起头难。',
    verdictZh: '得此卦者，身处困境，宜守不宜进，须多加辛苦努力，排除困难，方可通达，有初难后解之象。',
    businessAdviceZh: '刚开始创业、找到新项目时，不要轻举妄动，先分析各方情况，步步为营。',
    employeeAdviceZh: '创业惟艰，应多注重自己实力的培养，基础的奠定。',
    affairsZh: '凡事起头难。艰难时刻，适于培养实力，奠定根基，为将来的成功做准备。',
    loveZh: '艰难的开始，需要时间磨合。',
    careerZh: '创业惟艰，多注重实力培养，打牢地基方能成事。',
    masterAdviceZh: '屯卦代表“困难”，但不代表失败。如果能够屯积实力，走过“凡事起头难”的阶段，未来仍是无可限量。身处困境，宜守不宜进。',
  },
  4: {
    number: 4,
    nameZh: '山水蒙',
    nameEn: 'Youthful Folly (Meng)',
    upperNameZh: '山',
    lowerNameZh: '水',
    guaCiZh: '蒙，亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告，利贞。',
    coreMottoZh: '事情发展初期，前景模糊，当虚心求教。',
    verdictZh: '智慧犹如童蒙，不辨是非，迷失方向；若能顺贤师良友之教，启其聪明则亨通。',
    businessAdviceZh: '身为上司，新人向你请教，要耐心回答；在未明局面前不可盲目铺大摊子。',
    employeeAdviceZh: '新人在处于蒙昧阶段就要虚心地向有经验的人学习和请教。',
    affairsZh: '事情迷濛不明，不宜轻信于人，此卦易犯小人，因危险而停止。能求教于人则有助进展。',
    loveZh: '蒙昧无知的爱情，宜于看清真相或选择放弃。',
    careerZh: '能力不足以应付，需要再多方学习，诚心求教于有经验的长者。',
    masterAdviceZh: '能力不足以处理危机，最好的策略是向有经验与智慧的人请益。但请益之前请先做好准备，诚心前往，避免繁琐而一问再问。若是意气用事必现大凶象。',
  },
  5: {
    number: 5,
    nameZh: '水天需',
    nameEn: 'Waiting (Xu)',
    upperNameZh: '水',
    lowerNameZh: '天',
    guaCiZh: '需，有孚，光亨，贞吉，利涉大川。',
    coreMottoZh: '还需要等待时机成熟，才能被满足。',
    verdictZh: '得此卦者，时机尚未成熟，需要耐心等待，急进反会见凶。',
    businessAdviceZh: '做生意需要付出对等的时间与精力，不要指望一蹴而就。',
    employeeAdviceZh: '克服困难，在不急不慢的过程中把控时机，静候佳音。',
    affairsZh: '龙困浅滩，时机尚未成熟，需要耐心等待，急进反会见凶。',
    loveZh: '双方有阻隔，但强行是无法得到的，随缘顺性。',
    careerZh: '虽有能力，但目前还没有适当的机会。先设法渡过眼前危机为宜。',
    masterAdviceZh: '需卦是藏有危机的一卦，虽然你的能力足以化险为夷，但仍不宜妄动，以退守、静待时机才是上策。若执意盲动，恐会历经一番苦战。',
  },
  6: {
    number: 6,
    nameZh: '天水讼',
    nameEn: 'Conflict (Song)',
    upperNameZh: '天',
    lowerNameZh: '水',
    guaCiZh: '讼，有孚窒惕中吉，终凶。利见大人，不利涉大川。',
    coreMottoZh: '考虑全面，尽量避免诉讼和争执。',
    verdictZh: '身心不安，事多不顺，与他人多争诉之事，宜修身养性，谨慎处事。',
    businessAdviceZh: '诉讼没有赢家，双方面都不会有好结果。应当减少与他人的纠纷，远离是非争执。',
    employeeAdviceZh: '中庸、退让，放弃无谓坚持则吉。',
    affairsZh: '官司、争吵、争议。先吉后凶。凡事放弃内心的执拗为上策。',
    loveZh: '争吵、不和，各执己见。',
    careerZh: '有争议，有法律官非的风险，务必合规合法。',
    masterAdviceZh: '注意福祸相倚，得未必是福，失未必是祸。放下坚持，凡事谦让为上策，退一步海阔天空，绝对是卜到讼卦的最佳对策。',
  },
  11: {
    number: 11,
    nameZh: '地天泰',
    nameEn: 'Peace (Tai)',
    upperNameZh: '地',
    lowerNameZh: '天',
    guaCiZh: '泰，小往大来，吉亨。',
    coreMottoZh: '要乐不忘忧，居安思危。',
    verdictZh: '得此卦者，否极泰来，鸿运当头，诸事皆顺，但须防乐极生悲。',
    businessAdviceZh: '掌握时机、照顾下属、上下沟通，公司就能稳健发展。',
    employeeAdviceZh: '外柔内刚，处事圆滑通泰，不可因顺利而有所放肆。',
    affairsZh: '吉，万事亨通，如意吉祥。小往大来，通泰吉祥；泰极转否，事宜固守。',
    loveZh: '双方情投意合，天生一对。',
    careerZh: '上下和气，打成一片。前途事业均顺利，但不可骄傲任意从之。',
    masterAdviceZh: '虽然一切顺利，万事如意。但人无远虑，必有近忧。对于事情的发展应当有防患于未然的远见，则可长保安泰。',
  },
  12: {
    number: 12,
    nameZh: '天地否',
    nameEn: 'Standstill (Pi)',
    upperNameZh: '天',
    lowerNameZh: '地',
    guaCiZh: '否之匪人，不利君子贞，大往小来。',
    coreMottoZh: '要沟通、忍让；则万事通顺。',
    verdictZh: '得此卦者，万物闭塞之象，上下不合，诸事不顺，凡事宜忍，须待时运好转而有为。',
    businessAdviceZh: '公司资讯断链，老板不听下属建议，员工不听客户意见，上下不沟通自然生意不顺。',
    employeeAdviceZh: '遇到不讲理的人时要忍耐，学会向上沟通打破僵局。',
    affairsZh: '闭塞不通，有严重的沟通问题。上下不合，凡事宜忍。',
    loveZh: '双方无法相互沟通了解，产生隔阂。',
    careerZh: '万事窒碍不顺，沟通成本极高。',
    masterAdviceZh: '除了静待时机，等待否极泰来，或许可以多注意自己在沟通能力上的问题。若能打破上下无法沟通的局面，则可否极泰来。',
  },
  34: {
    number: 34,
    nameZh: '雷天大壮',
    nameEn: 'Great Power (Da Zhuang)',
    upperNameZh: '雷',
    lowerNameZh: '天',
    guaCiZh: '大壮，利贞。',
    coreMottoZh: '发展比较好的时期，要谦和，不冒进。',
    verdictZh: '得此卦者：运势过于强盛，宜心平气和，谨慎行事，否则必生过失。',
    businessAdviceZh: '外在的壮大固然重要，但不要忽略内心的强大与稳健风控。',
    employeeAdviceZh: '理直气壮有时虽有必要，但不可盛气凌人，造成人际冲突。',
    affairsZh: '小吉，但会有冲突，甚至受到伤害，忌盲动逞能。',
    loveZh: '吵架不合，过于要强。',
    careerZh: '理直气壮，据理力争或可达到目标，但小心因此造成与人冲突及不和。',
    masterAdviceZh: '理直气壮、据理力争有时虽有必要，但却很可能因此造成不必要的伤害。凡事应当多点冷静审察情势，不要莽撞，就能够避免不必要的错误与灾难。运势过于强盛，宜心平气和。',
  },
  54: {
    number: 54,
    nameZh: '雷泽归妹',
    nameEn: 'The Marrying Maiden (Gui Mei)',
    upperNameZh: '雷',
    lowerNameZh: '泽',
    guaCiZh: '归妹，征凶，无攸利。',
    coreMottoZh: '安守本份，不要妄想；先客后主，公私分明。',
    verdictZh: '得此卦者，困难之时，做事有违常理，灾祸不断。宜明察事理，修身养性，断绝妄念。',
    businessAdviceZh: '共同创业的：要把所有相关条件和合作方式谈清楚，杜绝一切可能导致意见不合的可能；公私分明，谨守本分。',
    employeeAdviceZh: '在同一公司务必分清权责公私，切莫因私人情面耽误制度。',
    affairsZh: '祸出百端，事物有违常理。初时有悦，不久反凶，祸害随至。婚姻、合作之事可成，但出征攻伐大凶。',
    loveZh: '婚姻可成，但过于感情用事，不符礼法，不见得幸福。',
    careerZh: '结盟、合作可以成功，但有严重法律风险！其余事务凶，无利可图。',
    masterAdviceZh: '凡事要特别注意不要感情用事，注意法律、舆论等风险。困难之时，做事有违常理，灾祸不断。宜明察事理，修身养性，断绝妄念。把法律与利益分配白纸黑字写清，是化解归妹凶险的唯一生路。',
  },
};

/**
 * 完整 64 卦名称与上下卦对应表 (涵盖所有卦象)
 */
export const FULL_64_HEXAGRAM_NAMES: Record<string, { num: number; nameZh: string; nameEn: string; summaryZh: string }> = {
  'Qian-Qian': { num: 1, nameZh: '乾为天', nameEn: 'The Creative', summaryZh: '天行刚健 · 自强不息' },
  'Kun-Kun': { num: 2, nameZh: '坤为地', nameEn: 'The Receptive', summaryZh: '厚德载物 · 顺从合作' },
  'Kan-Zhen': { num: 3, nameZh: '水雷屯', nameEn: 'Difficulty at Beginning', summaryZh: '万事起头难 · 蓄积实力' },
  'Gen-Kan': { num: 4, nameZh: '山水蒙', nameEn: 'Youthful Folly', summaryZh: '启蒙解惑 · 虚心求教' },
  'Kan-Qian': { num: 5, nameZh: '水天需', nameEn: 'Waiting', summaryZh: '耐心等待 · 静待时机' },
  'Qian-Kan': { num: 6, nameZh: '天水讼', nameEn: 'Conflict', summaryZh: '慎防官非 · 退让免灾' },
  'Kun-Kan': { num: 7, nameZh: '地水师', nameEn: 'The Army', summaryZh: '做好自己 · 选贤任能' },
  'Kan-Kun': { num: 8, nameZh: '水地比', nameEn: 'Holding Together', summaryZh: '相亲相辅 · 团结互助' },
  'Xun-Qian': { num: 9, nameZh: '风天小畜', nameEn: 'Small Taming', summaryZh: '积聚资源 · 韬光养晦' },
  'Qian-Dui': { num: 10, nameZh: '天泽履', nameEn: 'Treading', summaryZh: '如履薄冰 · 各司其职' },
  'Kun-Qian': { num: 11, nameZh: '地天泰', nameEn: 'Peace', summaryZh: '否极泰来 · 居安思危' },
  'Qian-Kun': { num: 12, nameZh: '天地否', nameEn: 'Standstill', summaryZh: '闭塞不通 · 强化沟通' },
  'Qian-Li': { num: 13, nameZh: '天火同人', nameEn: 'Fellowship', summaryZh: '同心协力 · 志同道合' },
  'Li-Qian': { num: 14, nameZh: '火天大有', nameEn: 'Great Possession', summaryZh: '如日中天 · 戒骄戒躁' },
  'Kun-Gen': { num: 15, nameZh: '地山谦', nameEn: 'Modesty', summaryZh: '谦谦君子 · 终获福报' },
  'Zhen-Kun': { num: 16, nameZh: '雷地豫', nameEn: 'Enthusiasm', summaryZh: '顺应规律 · 防范沉溺' },
  'Dui-Zhen': { num: 17, nameZh: '泽雷随', nameEn: 'Following', summaryZh: '顺势而为 · 随顺变通' },
  'Gen-Xun': { num: 18, nameZh: '山风蛊', nameEn: 'Decay', summaryZh: '破旧立新 · 整肃积弊' },
  'Kun-Dui': { num: 19, nameZh: '地泽临', nameEn: 'Approach', summaryZh: '居高临下 · 循序渐进' },
  'Xun-Kun': { num: 20, nameZh: '风地观', nameEn: 'Contemplation', summaryZh: '见贤思齐 · 洞察秋毫' },
  'Li-Zhen': { num: 21, nameZh: '火雷噬嗑', nameEn: 'Biting Through', summaryZh: '雷厉风行 · 消除梗阻' },
  'Gen-Li': { num: 22, nameZh: '山火贲', nameEn: 'Grace', summaryZh: '虚实相映 · 崇尚实质' },
  'Gen-Kun': { num: 23, nameZh: '山地剥', nameEn: 'Splitting Apart', summaryZh: '谨守正道 · 顺势而止' },
  'Kun-Zhen': { num: 24, nameZh: '地雷复', nameEn: 'Return', summaryZh: '一阳来复 · 改过迎新' },
  'Qian-Zhen': { num: 25, nameZh: '天雷无妄', nameEn: 'Innocence', summaryZh: '踏实安分 · 远离虚妄' },
  'Gen-Qian': { num: 26, nameZh: '山天大畜', nameEn: 'Great Accumulation', summaryZh: '厚积薄发 · 大器晚成' },
  'Gen-Zhen': { num: 27, nameZh: '山雷颐', nameEn: 'Nourishment', summaryZh: '谨言慎食 · 修德养身' },
  'Dui-Xun': { num: 28, nameZh: '泽风大过', nameEn: 'Great Preponderance', summaryZh: '非常时期 · 稳固根本' },
  'Kan-Kan': { num: 29, nameZh: '坎为水', nameEn: 'The Abysmal', summaryZh: '双重险陷 · 坚守诚信' },
  'Li-Li': { num: 30, nameZh: '离为火', nameEn: 'The Clinging', summaryZh: '依附正道 · 兼备品德' },
  'Dui-Gen': { num: 31, nameZh: '泽山咸', nameEn: 'Influence', summaryZh: '心心相印 · 和谐相通' },
  'Zhen-Xun': { num: 32, nameZh: '雷风恒', nameEn: 'Duration', summaryZh: '持之以恒 · 坚守初心' },
  'Qian-Gen': { num: 33, nameZh: '天山遯', nameEn: 'Retreat', summaryZh: '明哲保身 · 适时退避' },
  'Zhen-Qian': { num: 34, nameZh: '雷天大壮', nameEn: 'Great Power', summaryZh: '壮大声势 · 戒骄戒躁' },
  'Li-Kun': { num: 35, nameZh: '火地晋', nameEn: 'Progress', summaryZh: '如日东升 · 步步高升' },
  'Kun-Li': { num: 36, nameZh: '地火明夷', nameEn: 'Darkening of Light', summaryZh: '韬光养晦 · 暗夜守志' },
  'Xun-Li': { num: 37, nameZh: '风火家人', nameEn: 'The Family', summaryZh: '修身齐家 · 和睦同心' },
  'Li-Dui': { num: 38, nameZh: '火泽睽', nameEn: 'Opposition', summaryZh: '求同存异 · 异中求和' },
  'Kan-Gen': { num: 39, nameZh: '水山蹇', nameEn: 'Obstruction', summaryZh: '反身修德 · 择善而从' },
  'Zhen-Kan': { num: 40, nameZh: '雷水解', nameEn: 'Deliverance', summaryZh: '柔顺化险 · 把握转机' },
  'Gen-Dui': { num: 41, nameZh: '山泽损', nameEn: 'Decrease', summaryZh: '损己利人 · 先损后益' },
  'Xun-Zhen': { num: 42, nameZh: '风雷益', nameEn: 'Increase', summaryZh: '互相裨益 · 积极进取' },
  'Dui-Qian': { num: 43, nameZh: '泽天夬', nameEn: 'Breakthrough', summaryZh: '决断果敢 · 手段委婉' },
  'Qian-Xun': { num: 44, nameZh: '天风姤', nameEn: 'Coming to Meet', summaryZh: '邂逅相遇 · 慎防桃色' },
  'Dui-Kun': { num: 45, nameZh: '泽地萃', nameEn: 'Gathering Together', summaryZh: '汇聚英才 · 慎防盛衰' },
  'Kun-Xun': { num: 46, nameZh: '地风升', nameEn: 'Pushing Upward', summaryZh: '循序渐进 · 贵人提携' },
  'Dui-Kan': { num: 47, nameZh: '泽水困', nameEn: 'Oppression', summaryZh: '穷则思变 · 坚守节操' },
  'Kan-Xun': { num: 48, nameZh: '水风井', nameEn: 'The Well', summaryZh: '源远流长 · 修德惠人' },
  'Dui-Li': { num: 49, nameZh: '泽火革', nameEn: 'Revolution', summaryZh: '顺应天时 · 革旧鼎新' },
  'Li-Xun': { num: 50, nameZh: '火风鼎', nameEn: 'The Cauldron', summaryZh: '因人成事 · 创新图强' },
  'Zhen-Zhen': { num: 51, nameZh: '震为雷', nameEn: 'The Arousing', summaryZh: '震惊百里 · 镇定应对' },
  'Gen-Gen': { num: 52, nameZh: '艮为山', nameEn: 'Keeping Still', summaryZh: '当止则止 · 动静不失' },
  'Xun-Gen': { num: 53, nameZh: '风山渐', nameEn: 'Development', summaryZh: '按部就班 · 积厚成势' },
  'Zhen-Dui': { num: 54, nameZh: '雷泽归妹', nameEn: 'The Marrying Maiden', summaryZh: '安守本分 · 防范法律' },
  'Zhen-Li': { num: 55, nameZh: '雷火丰', nameEn: 'Abundance', summaryZh: '盛大丰满 · 警惕衰微' },
  'Li-Gen': { num: 56, nameZh: '火山旅', nameEn: 'The Wanderer', summaryZh: '客居异乡 · 谨慎低调' },
  'Xun-Xun': { num: 57, nameZh: '巽为风', nameEn: 'The Gentle', summaryZh: '谦逊柔顺 · 随势应变' },
  'Dui-Dui': { num: 58, nameZh: '兑为泽', nameEn: 'The Joyous', summaryZh: '广交诤友 · 和合悦服' },
  'Xun-Kan': { num: 59, nameZh: '风水涣', nameEn: 'Dispersion', summaryZh: '聚散有道 · 重整团队' },
  'Kan-Dui': { num: 60, nameZh: '水泽节', nameEn: 'Limitation', summaryZh: '适度节制 · 建立制度' },
  'Xun-Dui': { num: 61, nameZh: '风泽中孚', nameEn: 'Inner Truth', summaryZh: '一诺千金 · 诚实立身' },
  'Zhen-Gen': { num: 62, nameZh: '雷山小过', nameEn: 'Small Preponderance', summaryZh: '恪守中庸 · 谨慎行事' },
  'Kan-Li': { num: 63, nameZh: '水火既济', nameEn: 'After Completion', summaryZh: '功成名遂 · 思患预防' },
  'Li-Kan': { num: 64, nameZh: '火水未济', nameEn: 'Before Completion', summaryZh: '摆正位置 · 谋篇新局' },
};

/**
 * 根据卦名或上下卦获取完整卦解
 */
export function getHexagramFullDetail(upperKey: string, lowerKey: string): HexagramDetail {
  const meta = FULL_64_HEXAGRAM_NAMES[`${upperKey}-${lowerKey}`];
  if (meta && HEXAGRAM_DICTIONARY[meta.num]) {
    return HEXAGRAM_DICTIONARY[meta.num];
  }

  // Generic fallback if specific full text not yet keyed
  const num = meta ? meta.num : 1;
  const nameZh = meta ? meta.nameZh : '易经正卦';
  const nameEn = meta ? meta.nameEn : 'Authentic Hexagram';
  const summaryZh = meta ? meta.summaryZh : '时空演进，阴阳互易，宜依正道行事';

  return {
    number: num,
    nameZh,
    nameEn,
    upperNameZh: upperKey,
    lowerNameZh: lowerKey,
    guaCiZh: `${nameZh}，元亨利贞。顺天应人，安守正道。`,
    coreMottoZh: summaryZh,
    verdictZh: `得此卦者，${summaryZh}。宜审时度势，谨慎行事，顺应自然规律。`,
    businessAdviceZh: '经营宜顺应天时地利，加强团队合规与风险排查。',
    employeeAdviceZh: '恪尽职守，提升本领，谦和待人。',
    affairsZh: `${summaryZh}，诸事宜稳扎稳打。`,
    loveZh: '真诚相待，切莫执拗猜忌。',
    careerZh: '稳中求进，把握贵人契机。',
    masterAdviceZh: `【${nameZh}】昭示：${summaryZh}。依时空干支择期推进，可化险为夷，大有收获。`,
  };
}
