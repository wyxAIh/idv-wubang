const DATA = window.IDV_DATA;
const AVATARS = window.IDV_AVATARS || {};
const DETAIL_GUIDES = window.IDV_DETAIL_GUIDES || {};

const PARTS = {
  1: "一阶",
  2: "二阶",
  3: "三阶",
  4: "四阶",
  5: "五阶",
  6: "六阶",
  7: "七阶",
  8: "巅峰七阶"
};

const PART_MODELS = {
  1: { win: 31, draw: 9, pick: 19, ban: 13, cognition: 12, reliability: 16, note: "低阶局更看重直观胜平收益、出场稳定和低阶 ban 压力，避免把冷门绝活误判过高。" },
  2: { win: 30, draw: 10, pick: 18, ban: 14, cognition: 13, reliability: 15, note: "仍偏向上手收益，同时把常见低阶禁用压力纳入强度判断。" },
  3: { win: 28, draw: 11, pick: 16, ban: 16, cognition: 15, reliability: 14, note: "开始出现熟练度分化，ban 率和胜平率共同判断实战压迫。" },
  4: { win: 26, draw: 12, pick: 15, ban: 18, cognition: 17, reliability: 12, note: "中低阶开始考虑角色上限，但不会让认知分压过实际环境数据。" },
  5: { win: 22, draw: 13, pick: 12, ban: 19, cognition: 18, elite: 5, reliability: 11, note: "五阶局同时看 C500、胜平率和 BP 压力，并开始参考 S1/A100/B300 的高手认知排序。" },
  6: { win: 19, draw: 14, pick: 10, ban: 21, cognition: 22, elite: 7, reliability: 7, note: "六阶起上限和 BP 价值明显提高，S1、A100、B300 会以额外比例参与高阶强度判断。" },
  7: { win: 16, draw: 15, pick: 8, ban: 23, cognition: 24, elite: 10, reliability: 4, note: "七阶接近高阶环境，更重视 S1/A100/B300 上限、禁用压力和稳定争平能力。" }
};

const HUNTER_PEAK_ORDER = [
  "牙医",
  "女王蜂",
  "跛脚羊",
  "时空之影",
  "梦之女巫",
  "台球手",
  "歌剧演员",
  "孽蜥",
  "红夫人",
  "破轮",
  "喧嚣",
  "隐士",
  "爱哭鬼",
  "蜡像师",
  "红蝶",
  "使徒",
  "小丑",
  "渔女",
  "杂货商",
  "宿伞之魂",
  "雕刻家",
  "守夜人",
  "博士",
  "记录员",
  "愚人金",
  "鹿头",
  "摄影师",
  "杰克",
  "蜘蛛",
  "26号守卫",
  "小提琴家",
  "疯眼",
  "噩梦",
  "黄衣之主",
  "厂长"
];

const SURVIVOR_PEAK_ORDER = [
  "斗牛士",
  "勘探员",
  "前锋",
  "幻灯师",
  "拉拉队员",
  "医生",
  "机械师",
  "击球手",
  "木偶师",
  "守墓人",
  "古董商",
  "佣兵",
  "园丁",
  "先知",
  "记者",
  "法罗女士",
  "幸运儿",
  "小说家",
  "弓箭手",
  "祭司",
  "画家",
  "邮差",
  "囚徒",
  "气象学家",
  "玩具商",
  "咒术师",
  "骑士",
  "调香师",
  "哭泣小丑",
  "小女孩",
  "野人",
  "心理学家",
  "大副",
  "杂技演员",
  "逃脱大师",
  "牛仔",
  "空军",
  "魔术师",
  "调酒师",
  "舞女",
  "教授",
  "飞行家",
  "律师",
  "昆虫学者",
  "盲女",
  "病患",
  "火灾调查员",
  "作曲家",
  "慈善家",
  "入殓师",
  "冒险家"
];

const PEAK_TARGETS = {
  43: {
    hunter: HUNTER_PEAK_ORDER,
    survivor: SURVIVOR_PEAK_ORDER
  }

};

const FACTION_MODELS = {
  survivor: {
    8: {
      win: 3,
      draw: 5,
      pick: 1,
      ban: 9,
      cognition: 2,
      elite: 8,
      reliability: 1,
      version: 71,
      note: "巅七求生专用：以 S44 最新全服数据推导版本校准，平率、ban/BP 压力和阵容功能价值高于单纯胜率。"
    }
  },
  hunter: {
    8: {
      win: 6,
      draw: 4,
      pick: 0,
      ban: 23,
      cognition: 1,
      elite: 7,
      reliability: 0,
      version: 59,
      note: "巅七监管专用：按 S44 最新全服数据推导版本校准，禁用率/BP 压力显著加权，胜率和认知分只作为辅助修正。"
    }
  }
};

const S43_PEAK_MODELS = {
  survivor: {
    win: 3,
    draw: 5,
    pick: 1,
    ban: 9,
    cognition: 1,
    elite: 6,
    reliability: 0,
    version: 75,
    note: "第43赛季巅七求生专用：以用户校准榜为版本锚点，ban/BP、平局保分和 S1/A100/B300 高阶认知参与修正，避免只按胜率把体系位低估。"
  },
  hunter: {
    win: 2,
    draw: 2,
    pick: 0,
    ban: 26,
    cognition: 1,
    elite: 4,
    reliability: 0,
    version: 65,
    note: "第43赛季巅七监管专用：提高 ban 率与 BP 压力权重，并用目标榜校准牙医、女王蜂、跛脚羊等版本超模位，压低红蝶这类中高阶体感偏高角色。"
  }

};

const FIELD_LABELS = {
  win: "胜率",
  draw: "平率",
  pick: "出场率",
  ban: "禁用率",
  cognition: "S/A/B/C认知分",
  elite: "高阶认知排序",
  reliability: "样本可信修正",
  version: "版本实战校准"
};

const VIDEO_TAKEAWAYS = {
  survivor: [
    "求生阵营现在不是“谁能遛最久谁就最强”的版本。真正能上分的角色，要么能稳定拖出密码机时间，要么能把救援风险压低，要么能给队友创造二次转点。单看一局高光，很容易把爽感误当强度。",
    "求生者内部差异很大：救援位看的是进椅区和防双倒，牵制位看的是转点续航，修机位看的是少吃干扰，辅助位看的是资源给得准不准。本站把这些拆成数据项，是为了让玩家知道自己队伍缺的是哪一块。",
    "地图对求生的影响很明显。医院、红教堂、军工厂这类图更考验强区转点；湖景村、月亮河、公园这类大图更考验队友补位和远距离救援；唐人街、永眠镇这类复杂图则更看路线熟悉度。",
    "平率是理解求生强度的关键。一个角色不一定能大幅抬高胜率，但如果能把必输局拖成平局，它在排位里的价值就很实在。高阶榜单会更重视这种保平和资源交换能力。",
    "BP 不是照抄热门答案。热门角色被 ban，可能因为强，也可能因为烦、难处理或克制当前阵容。真正实用的做法，是准备同定位替代角色，而不是一个角色没了就不会打。"
  ],
  hunter: [
    "监管阵营的强度差异更集中在追击效率、守椅质量和控场链条。女王蜂、台球手、女巫、时空之影、跛脚羊、牙医这类角色靠的是持续压迫，不是单纯一刀快。",
    "红蝶这类中低阶容易打出压迫感的角色，到了五六七阶会更依赖对手失误。玩家会处理视野、窗区和二次转点后，她的强度不应该被低阶体感过度抬高。",
    "地图同样会改变监管强度。小图、窄区和板窗密集区更利于守椅与区域压制；大图会放大转场成本；多层或复杂街区会考验监管是否能同时处理人和机。",
    "高阶监管更看 BP 价值。一个角色如果能逼掉关键求生、限制热门阵容，或者让对面救援链变得很难受，它的实际排名可以高于纯胜率表现。",
    "本站的目标不是把角色说成玄学强弱，而是把玩家能感知到的版本压力翻译成数据：胜率说明终结能力，平率说明拉扯结果，禁用率说明 BP 压力，S1/A100/B300/C500 说明高手和普通高认知玩家的差距。"
  ]
};

const ROLE_FLAVORS = {
  hunter: {
    "牙医": {
      anchor: "牙医是当前巅七最典型的高压版本答案，强在对局节奏被它一开始就拧死。",
      detail: "它的价值不是“能不能追到”，而是“让对手几乎没有舒服处理链”。",
      advice: "高阶优先围绕禁用和镜像对手进行 BP，低阶则要防止只看强度忽略操作熟练度。"
    },
    "女王蜂": {
      anchor: "女王蜂偏的是持续压迫和补伤害节奏，打的是对手不愿意跟你反复换血的心理。",
      detail: "如果对局里它的出场和禁用都很高，通常不是偶然，是对局厌恶度和压迫感一起在起作用。",
      advice: "地图狭窄、对手救援链短时更强，开放图和强转点图要更谨慎。"
    },
    "跛脚羊": {
      anchor: "跛脚羊吃的是地形与框位博弈，强就强在把交互点做成单向题。",
      detail: "它对熟练度和地图理解很敏感，越懂框位的人越能把这角色的上限拉出来。",
      advice: "别只盯追击速度，要把拐角、板区和转点线路一起看。"
    },
    "时空之影": {
      anchor: "时空之影的核心是时间差压迫，追击和控场不是分开的两件事。",
      detail: "这种角色的好坏，往往取决于它能不能把一波领先持续滚到第二波。",
      advice: "高阶看连贯压制，低阶看容错和第一轮击倒效率。"
    },
    "梦之女巫": {
      anchor: "梦之女巫是典型的上限型控场角色，靠多线干扰把局面切碎。",
      detail: "它的认知分上限往往比普通平均值更重要，因为会玩和不会玩的差距很大。",
      advice: "若 S1 与 C500 差距大，说明这是绝活型强度，不要只按平均值排。"
    },
    "台球手": {
      anchor: "台球手强在路线压制和位置读秒，像是在用几何题逼对手失误。",
      detail: "它的有效性依赖对地形和落点的判断，不是单纯“快”就能解释。",
      advice: "若禁用率高但出场不算高，通常说明它更像针对性强角，而不是无脑强角。"
    },
    "歌剧演员": {
      anchor: "歌剧演员偏高机动连压，优势是不断逼迫对手放弃舒服转点。",
      detail: "版本里它如果一直稳在前排，通常说明追击效率和转场收益都没有掉。",
      advice: "开放图和远点图会放大它的节奏优势。"
    },
    "孽蜥": {
      anchor: "孽蜥的强点是空中交互和地形穿透，特别吃玩家的判断感。",
      detail: "它不是靠数值碾压，而是靠连续博弈把对手路线拆掉。",
      advice: "有熟练度就能越打越顺，但低熟练度会明显放大失误。"
    },
    "红夫人": {
      anchor: "红夫人靠的是镜面压制和直线惩罚，擅长把对手的转点切掉。",
      detail: "她的数据强度通常很依赖地图和站位，如果图不对，强度会掉得很明显。",
      advice: "别只看追击，镜像落点和守椅切面更关键。"
    },
    "破轮": {
      anchor: "破轮是切换节奏能力很强的角色，追击、守尸和压线都能做。",
      detail: "它高的时候，通常说明角色没有只靠一招，而是整套流程都在起作用。",
      advice: "把滚轮节奏和救援点位一起练，单练一种会损失很多强度。"
    },
    "喧嚣": {
      anchor: "喧嚣的亮点在于持续制造干扰，让对手无法按标准流程打完一局。",
      detail: "这类角色的排位波动通常和操作熟练度高度绑定。",
      advice: "高阶要看连锁压制，低阶要防止自己把技能用成一次性资源。"
    },
    "隐士": {
      anchor: "隐士的价值是资源转换，不是单点追击。",
      detail: "它能不能排高，关键看能不能把队伍节奏磨成自己想要的速度。",
      advice: "禁用率与对局厌恶度通常都偏高，说明它在环境里有真实压力。"
    },
    "爱哭鬼": {
      anchor: "爱哭鬼更像是守点和地形压制的结合体，强在把地面做成危险区。",
      detail: "如果地图适配好，它的分数会比直观看起来更高。",
      advice: "小图和密集建筑图更容易体现它的强度。"
    },
    "蜡像师": {
      anchor: "蜡像师打的是持续封位和消耗，节奏慢但压力密度高。",
      detail: "它对局面的控制不是瞬时爆发，而是一步步把可走空间缩没。",
      advice: "高阶更看封位质量，低阶更看打不中时的容错。"
    },
    "红蝶": {
      anchor: "红蝶强在转点和镜头博弈，越会处理视野的人越能压出价值。",
      detail: "它不是纯粹靠数值的角色，而是靠路线预判吃饭。",
      advice: "地图越开阔，越能把它的机动感体现出来。"
    },
    "使徒": {
      anchor: "使徒是典型的守尸和压节奏角色，喜欢把对手的救援变成交换题。",
      detail: "如果禁用和出场都稳定，说明它的战术价值不是虚的。",
      advice: "椅区运营比单刀更重要，尤其在高阶。"
    },
    "小丑": {
      anchor: "小丑是直线压迫和突然转向的代表，节奏吃得很凶。",
      detail: "它的表现通常高度依赖开刀效率，慢热会明显掉强度。",
      advice: "低阶容易吃到直线强压，高阶更看路线预判。"
    },
    "渔女": {
      anchor: "渔女的特点是持续控场和区域阻断，低阶往往非常好用。",
      detail: "越是对手不爱处理节奏、又喜欢扎堆的局，她越容易抬分。",
      advice: "若场次不高但禁用和胜平都漂亮，说明这是典型环境型角色。"
    },
    "杂货商": {
      anchor: "杂货商靠的是道具与线路叠压，适合把对手逼进不好走的地形。",
      detail: "它的强度常常体现为局面越来越难走，而不是第一秒就见血。",
      advice: "高阶看封位质量，低阶看是否容易被绕开。"
    },
    "宿伞之魂": {
      anchor: "宿伞之魂吃双形态切换，强弱差往往来自节奏是否切得顺。",
      detail: "会切形态的人和不会切形态的人，强度差距会被数据放大。",
      advice: "别只看表面胜率，要看你是否能把两种形态的功能拼起来。"
    },
    "雕刻家": {
      anchor: "雕刻家擅长把地形雕成禁区，靠的是压路线和逼站位。",
      detail: "如果地图资源密集，它的收益就会更明显。",
      advice: "板窗多的图要提早规划切面，不要只追单点。"
    },
    "守夜人": {
      anchor: "守夜人更偏节奏封锁，特别擅长让对手的转点变得不舒服。",
      detail: "它的存在感来自风场和路线控制，不是单刀爆发。",
      advice: "懂得切断支援线时，它的战术价值会非常高。"
    },
    "博士": {
      anchor: "博士是高上限硬压角色，能不能打出来几乎完全看操作和判断。",
      detail: "这类角色的认知分上限通常比均值更重要。",
      advice: "别用平均分看博士，要用高手表现看它的极限。"
    },
    "记录员": {
      anchor: "记录员的强在预判和回溯，属于典型的阅读对局型角色。",
      detail: "它的优势不是直接爆发，而是把对手未来几步提前写死。",
      advice: "高阶越会打博弈，它越能体现价值。"
    },
    "愚人金": {
      anchor: "愚人金吃的是地形转换和地面控制，属于能把场地改写的类型。",
      detail: "一旦局面进入它熟悉的地形，压迫会很快变强。",
      advice: "开放区别大、能做结构的图更适合它。"
    },
    "鹿头": {
      anchor: "鹿头更依赖钩子命中和路径判断，吃准头也吃节奏。",
      detail: "如果操作不稳，数据会直接塌；如果练熟，很多局面能变得很简单。",
      advice: "有预判能力再选它，否则容易被地形卡住。"
    },
    "摄影师": {
      anchor: "摄影师的价值来自双线经营，强在一边打人一边算回溯。",
      detail: "这类角色很容易出现‘会的人很强，不会的人很普通’的断层。",
      advice: "看上限时要看 S1，看普适性时更要看 C500。"
    },
    "杰克": {
      anchor: "杰克更像是靠雾刃和拉点节奏把对手逼出失误。",
      detail: "它不是最硬的强角，但在熟练者手里有很顺的节奏。",
      advice: "高阶别只靠单刀吃饭，得把压线节奏也打出来。"
    },
    "蜘蛛": {
      anchor: "蜘蛛擅长铺网和守尸，典型特点是越拖越有手感。",
      detail: "如果前期网铺得好，后面压力会明显变大。",
      advice: "适合擅长预设战场的人。"
    },
    "26号守卫": {
      anchor: "26号守卫偏远程封路和路线打断，靠的是提前算位置。",
      detail: "它的强度很依赖你能不能让对手在路上就吃亏。",
      advice: "高阶更看封位意识，低阶更看命中稳定性。"
    },
    "小提琴家": {
      anchor: "小提琴家是典型的版本手感角色，连招节奏和覆盖范围决定下限。",
      detail: "如果环境对它不友好，分数会掉得比别的角色更直观。",
      advice: "更适合手熟而不是只看版本印象的人。"
    },
    "疯眼": {
      anchor: "疯眼更偏阵地战，核心是把地图变成自己的棋盘。",
      detail: "它不属于简单粗暴的角色，而是布局和路线控制更重要。",
      advice: "局面越能被你提前布置，强度越高。"
    },
    "噩梦": {
      anchor: "噩梦靠排人和追击联动，强的时候很像在缩小对手的活动半径。",
      detail: "它对读点和时机要求不低，没打顺会显得平。",
      advice: "适合愿意提前想路线的人。"
    },
    "黄衣之主": {
      anchor: "黄衣之主更重守点和区域压制，触手价值高时会非常烦人。",
      detail: "它的强度常常和对手是否会主动拆节奏有关。",
      advice: "地图窄、站位集中时更容易抬强度。"
    },
    "厂长": {
      anchor: "厂长的问题往往不是会不会赢，而是现版本节奏是否给他足够时间。",
      detail: "它比较像老派守尸角色，强度更吃地图和对手失误。",
      advice: "低阶可能更容易打出收益，高阶会明显吃环境。"
    }
  },
  survivor: {
    "斗牛士": {
      anchor: "斗牛士的核心是牵制和节奏切换，不是单纯硬拖。",
      detail: "它更像把对手的刀拆掉，而不是自己硬吃刀。",
      advice: "如果你能把转点和干扰做顺，它就很适合打高压局。"
    },
    "勘探员": {
      anchor: "勘探员吃磁铁时机和路线判断，强在把追击方向掰弯。",
      detail: "它的价值会随着玩家预判能力明显上升。",
      advice: "高阶看磁铁落点，低阶看别把自己玩进死角。"
    },
    "前锋": {
      anchor: "前锋不是泛用强，而是用撞救和断节奏把局面打散。",
      detail: "它最值钱的地方在于给队友争出关键时间，而不是每局都秀操作。",
      advice: "如果队伍缺一个能硬改救援节奏的人，前锋就会非常亮眼。"
    },
    "幻灯师": {
      anchor: "幻灯师的强点在穿点和联动，能把救援与转点串成一条线。",
      detail: "这种角色特别吃对地图结构的理解。",
      advice: "别把它当纯牵制，它更像半辅助半机动位。"
    },
    "拉拉队员": {
      anchor: "拉拉队员偏团队增益和节奏补位，能把队伍的容错抬起来。",
      detail: "它的强弱更多体现在局面流畅度，而不是单点冲刺。",
      advice: "适合和稳定主牵制搭配。"
    },
    "医生": {
      anchor: "医生的价值是自我修复和稳态容错，适合把失误成本压低。",
      detail: "低阶里它常常比纸面更强，因为容错真的能换回局面。",
      advice: "队伍如果缺稳定续航，医生会很顺手。"
    },
    "机械师": {
      anchor: "机械师仍然是修机节奏核心，但它的强不等于无脑安心。",
      detail: "一旦局面被针对，能不能稳住就是另一回事。",
      advice: "高阶别只盯修机数值，还要看保机和分工。"
    },
    "击球手": {
      anchor: "击球手强在拦救和反制，属于用对抗感很强的角色。",
      detail: "它会不会强，取决于你能不能把救援窗口打断。",
      advice: "如果队里需要一个能接住守尸压力的人，它很有价值。"
    },
    "木偶师": {
      anchor: "木偶师的特色是双身容错和救援后手，打的是不容易死。",
      detail: "这类角色很吃使用者的节奏感和判断。",
      advice: "越能提前布局，越容易发挥。"
    },
    "守墓人": {
      anchor: "守墓人擅长把救援变得更稳，很多时候是在替队伍买时间。",
      detail: "它的好坏经常取决于椅区和地形是否允许你绕。",
      advice: "高阶要练假动作和进退节奏。"
    },
    "古董商": {
      anchor: "古董商是典型的近战反制型角色，能把牵制打得很有压迫感。",
      detail: "它强在打断和细节，不在莽。",
      advice: "对线博弈越强，它越值钱。"
    },
    "佣兵": {
      anchor: "佣兵的强是挨刀、顶刀、拖时间，救援价值非常稳定。",
      detail: "它的强度和队伍分工高度相关，单排里也常能靠稳定性吃分。",
      advice: "别把佣兵当纯救人，拖节奏才是本体。"
    },
    "园丁": {
      anchor: "园丁的价值更偏防守和干扰，能把某些局面拖得很难受。",
      detail: "如果对手喜欢围绕椅区打节奏，它会非常烦。",
      advice: "适合需要一点稳定防守的人。"
    },
    "先知": {
      anchor: "先知的核心是保护和预警，能不能把预判用准决定价值高低。",
      detail: "它不是单纯吃功能位，而是吃信息质量。",
      advice: "高阶对位里，先知的保护链很关键。"
    },
    "记者": {
      anchor: "记者更像救援和牵制的穿插位，强调临场处理。",
      detail: "它的强弱会随着你能不能把节奏接上而变化。",
      advice: "适合会看局面的人，不太适合只按套路出牌。"
    },
    "法罗女士": {
      anchor: "法罗女士是纯粹的修机定盘星，节奏价值很稳定。",
      detail: "它的强度更多来自团队整体需要，而不是个人秀。",
      advice: "如果队伍缺起码的修机速度，它很合适。"
    },
    "幸运儿": {
      anchor: "幸运儿的特点是抽取随机资源，波动性很强。",
      detail: "它不是稳定强角，但在一些局里会有意外收益。",
      advice: "更适合娱乐或特殊配队，不适合拿它当主输出。"
    },
    "小说家": {
      anchor: "小说家偏贴身博弈和控制感，靠的是对交互细节的理解。",
      detail: "它的价值会在复杂局面里更明显。",
      advice: "越擅长判断对手行为的人，越能把它打顺。"
    },
    "弓箭手": {
      anchor: "弓箭手的优势是远程干扰，能把对手追击节奏切开。",
      detail: "它更像一个干扰型工具位，而不是纯牵制位。",
      advice: "用好距离感比莽出手更重要。"
    },
    "祭司": {
      anchor: "祭司是通道和转线的代表，强在打穿地图逻辑。",
      detail: "它越是和队伍配合好，越容易显得离谱。",
      advice: "队友会接通道时，它的收益会很高。"
    },
    "画家": {
      anchor: "画家适合用画框制造节奏差，强在救援和牵制之间切换。",
      detail: "它对时机的要求很高，画得早晚都会亏。",
      advice: "会控距离的人会更适合它。"
    },
    "邮差": {
      anchor: "邮差的核心是信息和支援，属于很讲协同的角色。",
      detail: "它不一定是最高爆发，但在顺局里能把队伍效率抬起来。",
      advice: "团队沟通越好，收益越大。"
    },
    "囚徒": {
      anchor: "囚徒主打双机联动，修机和牵制都能参与节奏。",
      detail: "它在高阶里往往比低阶更完整，因为更会用联动。",
      advice: "别把它只当修机位，它还有很强的局面调度能力。"
    },
    "气象学家": {
      anchor: "气象学家靠的是场地控制和距离管理，属于很吃时机的辅助牵制位。",
      detail: "一旦你把风向和地形配起来，强度会明显提升。",
      advice: "别乱交资源，留关键点反而更强。"
    },
    "玩具商": {
      anchor: "玩具商更擅长把板窗和飞跃资源转成节奏。",
      detail: "它的强点是把地图资源打成连锁反应。",
      advice: "适合擅长提前规划路线的人。"
    },
    "咒术师": {
      anchor: "咒术师的压制感很强，能把关键追击窗口掐掉。",
      detail: "她的价值往往体现在高压局里，不在无脑控场。",
      advice: "越懂什么时候打断，越能把她的上限拉满。"
    },
    "骑士": {
      anchor: "骑士偏保护和护航，适合给关键位争空间。",
      detail: "它的存在感来自团队链条，不是单点爆发。",
      advice: "阵容里如果缺稳住局面的工具，它会很顺。"
    },
    "调香师": {
      anchor: "调香师的核心是回溯容错，能把一段失误尽量抹掉。",
      detail: "这类角色对操作节奏要求高，但一旦打顺很难被轻易压死。",
      advice: "别把香水只当保命，节奏重置才是关键。"
    },
    "哭泣小丑": {
      anchor: "哭泣小丑兼顾爆发、转点和辅助，功能面很全。",
      detail: "它的优势通常来自把资源调度得比较顺。",
      advice: "适合会读局面、又愿意主动接节奏的人。"
    },
    "小女孩": {
      anchor: "小女孩更偏跟随和信息辅助，强调陪跑和修正节奏。",
      detail: "它不是自己硬打输出，而是把队友打得更顺。",
      advice: "配合型越强，收益越大。"
    },
    "野人": {
      anchor: "野人靠冲撞和救援做文章，节奏感很好时会很烦。",
      detail: "它适合在队友需要换时间的时候强行顶上。",
      advice: "更偏主动干预型，而不是纯保守位。"
    },
    "心理学家": {
      anchor: "心理学家偏双人配合和自保，强在把对局拖到自己舒服的节奏。",
      detail: "它在稳定局里表现更好，在混乱局里容易被打散。",
      advice: "适合懂配合的人。"
    },
    "大副": {
      anchor: "大副靠隐身和绕点做时间差，属于很吃地图记忆的角色。",
      detail: "打得好会很烦，打不好就很一般。",
      advice: "图熟和路线熟比盲冲更重要。"
    },
    "杂技演员": {
      anchor: "杂技演员的强点是弹跳和远离追击，吃路线意识。",
      detail: "它有时候是靠地形把强度抬上去的。",
      advice: "若能把落点和转身处理好，会很难追。"
    },
    "逃脱大师": {
      anchor: "逃脱大师的价值在于脱离追击的稳定性。",
      detail: "它不是最高爆发位，但很适合稳住存活时间。",
      advice: "你要先把“不死”做扎实，再谈别的。"
    },
    "牛仔": {
      anchor: "牛仔是套索救援和拉扯型角色，操作味很重。",
      detail: "它擅长把对手的节奏硬扯开。",
      advice: "队伍里如果有人愿意吃节奏，它会更好发挥。"
    },
    "空军": {
      anchor: "空军属于典型的枪救位，关键节点非常值钱。",
      detail: "它的稳定性高，但要把枪交在真正的关键点上。",
      advice: "别急着开枪，等最有价值的窗口。"
    },
    "魔术师": {
      anchor: "魔术师是典型的分身迷惑位，能把追击方向骗乱。",
      detail: "它的收益很看对手是否容易被带节奏。",
      advice: "保留幻影的时机比乱交更重要。"
    },
    "调酒师": {
      anchor: "调酒师偏饮酒容错和状态调节，属于稳态打法。",
      detail: "它在拉长局面时很有用。",
      advice: "如果队伍需要稳定续航，它是好选择。"
    },
    "舞女": {
      anchor: "舞女的核心是加减速节奏，打的是对手跟不上你的节拍。",
      detail: "它对地图移动和资源分配很敏感。",
      advice: "会卡节奏的人会更适合它。"
    },
    "教授": {
      anchor: "教授是前置交互和抗压型角色，能把一波危险接住。",
      detail: "它的价值在于把不该倒的点尽量撑过去。",
      advice: "适合喜欢稳住局面的人。"
    },
    "飞行家": {
      anchor: "飞行家偏远移和救援穿插，强在把危险点快速换掉。",
      detail: "它的发挥很依赖路线判断。",
      advice: "先学会转点，再学会救人。"
    },
    "律师": {
      anchor: "律师靠地图情报做文章，属于把信息换成稳定性的角色。",
      detail: "它的强弱很大程度取决于你会不会用视野信息。",
      advice: "更适合先看路、再行动的人。"
    },
    "昆虫学者": {
      anchor: "昆虫学者的价值在虫群牵制和空间干扰。",
      detail: "会用的人能把追击线扰乱得很明显。",
      advice: "别让虫群只停留在干扰表面，要配合转点。"
    },
    "盲女": {
      anchor: "盲女靠信息与破译效率，偏团队资源位。",
      detail: "它不是爆发型，但在安全修机里很舒服。",
      advice: "适合有队伍节奏的局。"
    },
    "病患": {
      anchor: "病患靠钩索转点和机动性吃饭，节奏很活。",
      detail: "它的上限来自你对距离的处理。",
      advice: "会拉角度的人会很喜欢它。"
    },
    "火灾调查员": {
      anchor: "火灾调查员偏气囊和干扰，属于把追击节奏打碎的类型。",
      detail: "它不一定最硬，但很会制造麻烦。",
      advice: "别只想着跑，还要想着怎么卡住对手。"
    },
    "作曲家": {
      anchor: "作曲家是节奏破译位，强在把时间换得更平滑。",
      detail: "它的收益偏稳定，不靠爆点。",
      advice: "队伍里想稳住修机链时很好用。"
    },
    "慈善家": {
      anchor: "慈善家靠手电干扰和节奏打断，属于纯粹的对抗位。",
      detail: "它对操作细节和时机把控要求不低。",
      advice: "会卡视野的人才能把它的强点打出来。"
    },
    "入殓师": {
      anchor: "入殓师更像后手保险位，擅长提前布置和接残局。",
      detail: "它不是高频出手型，而是关键时刻值钱。",
      advice: "越懂残局，越能发挥它的意义。"
    },
    "冒险家": {
      anchor: "冒险家是典型偷机和缩小型角色，节奏很吃地图细节。",
      detail: "低场次和低显眼度会让它的结论很依赖样本可信修正。",
      advice: "别按普通牵制位去理解它。"
    }
  }
};

const state = {
  faction: "survivor",
  part: 8,
  sort: "rank",
  selectedName: null
};

function pct(value, digits = 2) {
  if (value == null || Number.isNaN(value)) return "暂无";
  return `${(value * 100).toFixed(digits)}%`;
}

function num(value) {
  if (value == null || Number.isNaN(value)) return "暂无";
  return Number(value).toLocaleString("zh-CN");
}

function avatarPath(character) {
  return AVATARS[character.name]?.file || "assets/wubang-icon.jpg";
}

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function detailUrl(character) {
  const params = new URLSearchParams({
    name: character.name,
    faction: character.faction,
    part: String(state.part)
  });
  if (selectedSeason() === 43) {
    params.set("archive", "s43");
  }
  return `character.html?${params.toString()}`;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function normalize(value, min, max) {
  if (value == null || Number.isNaN(value)) return 0;
  if (max === min) return 50;
  return clamp(((value - min) / (max - min)) * 100);
}

function charactersForState() {
  return DATA.characters.filter((item) => item.faction === state.faction && item.metrics[String(state.part)]);
}

function ranges(rows) {
  const values = (fn) => rows.map(fn).filter((value) => value != null && !Number.isNaN(value));
  const range = (list) => [Math.min(...list), Math.max(...list)];
  return {
    win: range(values((item) => item.metrics[state.part].winRate)),
    draw: range(values((item) => item.metrics[state.part].drawRate)),
    pick: range(values((item) => item.metrics[state.part].pickRate)),
    ban: range(values((item) => item.metrics[state.part].banRate)),
    cognition: range(values((item) => cognitionRaw(item))),
    elite: range(values((item) => eliteCognitionRaw(item))),
    c500: range(values((item) => item.badges.c500))
  };
}

function cognitionRaw(character) {
  const b = character.badges;
  if (!b || !b.s1) return null;
  return (
    (b.s1 || 0) * 0.24 +
    (b.s10 || b.s1 || 0) * 0.12 +
    (b.a11 || b.a100 || 0) * 0.14 +
    (b.a100 || b.a11 || 0) * 0.12 +
    (b.b101 || b.b300 || 0) * 0.12 +
    (b.b300 || b.b101 || 0) * 0.08 +
    (b.c301 || b.c500 || 0) * 0.08 +
    (b.c500 || b.c301 || 0) * 0.10
  );
}

function eliteCognitionRaw(character) {
  const b = character.badges;
  if (!b || !b.s1) return null;
  return (
    (b.s1 || 0) * 0.45 +
    (b.a100 || b.a11 || 0) * 0.32 +
    (b.b300 || b.b101 || 0) * 0.23
  );
}

function selectedSeason() {
  return Number(DATA?.meta?.season) || (window.IDV_SELECTED_ARCHIVE === "s43" ? 43 : 44);

}

function seasonCopy() {
  const season = selectedSeason();
  if (season === 43) {
    return {
      label: "S43",
      heroEyebrow: "Season 43 archive analyzer",
      heroLead: "第43赛季 2026-06-13 归档榜单。这个版本按当时小程序全服数据和你给出的巅七校准榜重算，所有榜单、详情和环境解读均使用第43赛季快照。",
      summary: "当前榜单已切换到 S43 归档数据，并按 6 月 13 日版本环境重新计算。"
    };
  }
  return {
    label: `S${season}`,
    heroEyebrow: `Season ${season} data-first analyzer`,
    heroLead: `第五人格角色推荐与战斗环境全解。用第${season}赛季 ${DATA.meta.dayDataDate} 真实全服数据、八段位差异和版本信息一起判断角色强度。`,
    summary: `当前榜单已按 S${season} 最新小程序同源数据重算。`
  };

}

function modelFor(character) {
  if (state.part === 8 && selectedSeason() === 43) {
    return S43_PEAK_MODELS[character.faction] || FACTION_MODELS[character.faction]?.[state.part] || PART_MODELS[state.part];
  }
  return FACTION_MODELS[character.faction]?.[state.part] || PART_MODELS[state.part];
}

const calibrationCache = new Map();

function currentDataCalibrationOrder(faction) {
  const cacheKey = `${faction}:${state.part}:${DATA.meta.dayDataDate}:${DATA.meta.badgeDataDate}`;
  if (calibrationCache.has(cacheKey)) return calibrationCache.get(cacheKey);

  const previousFaction = state.faction;
  state.faction = faction;
  const rows = charactersForState();
  const range = ranges(rows);
  state.faction = previousFaction;

  const order = rows
    .map((character) => {
      const metrics = character.metrics[String(state.part)];
      const model = modelFor(character);
      const rawCognition = cognitionRaw(character);
      const rawElite = eliteCognitionRaw(character);
      const baseScore =
        normalize(metrics.winRate, range.win[0], range.win[1]) * (model.win / 100) +
        normalize(metrics.drawRate, range.draw[0], range.draw[1]) * (model.draw / 100) +
        normalize(metrics.pickRate, range.pick[0], range.pick[1]) * (model.pick / 100) +
        normalize(metrics.banRate, range.ban[0], range.ban[1]) * (model.ban / 100) +
        normalize(rawCognition, range.cognition[0], range.cognition[1]) * (model.cognition / 100) +
        normalize(rawElite, range.elite[0], range.elite[1]) * ((model.elite || 0) / 100) +
        clamp(35 + normalize(metrics.pickRate, range.pick[0], range.pick[1]) * 0.65) * (model.reliability / 100) +
        environmentAdjustment(character);
      return { name: character.name, baseScore };
    })
    .sort((a, b) => b.baseScore - a.baseScore)
    .map((item) => item.name);

  calibrationCache.set(cacheKey, order);
  return order;
}

function versionCalibration(character) {
  if (state.part !== 8) return null;
  const order = PEAK_TARGETS[selectedSeason()]?.[character.faction] || currentDataCalibrationOrder(character.faction);
  const index = order.indexOf(character.name);
  if (index === -1) return 50;
  return 100 - (index / (order.length - 1)) * 100;
}

function environmentAdjustment(character) {
  const name = character.name;
  const part = Number(state.part);
  const hunterAdjustments = {
    "\u7ea2\u8776": { 4: -4, 5: -8, 6: -12, 7: -14, 8: -3 },
    "\u6e14\u5973": { 1: 8, 2: 8, 3: 7, 4: 6, 5: 3, 6: 2, 7: 1 },
    "\u7231\u54ed\u9b3c": { 1: 4, 2: 4, 3: 3, 4: 3, 5: 2 },
    "\u5973\u738b\u8702": { 3: 2, 4: 3, 5: 4, 6: 6, 7: 7, 8: 5 },
    "\u53f0\u7403\u624b": { 4: 3, 5: 4, 6: 6, 7: 7, 8: 5 },
    "\u68a6\u4e4b\u5973\u5deb": { 5: 3, 6: 5, 7: 7, 8: 6 },
    "\u65f6\u7a7a\u4e4b\u5f71": { 4: 2, 5: 3, 6: 5, 7: 6, 8: 5 },
    "\u8ddb\u811a\u7f8a": { 3: 2, 4: 3, 5: 4, 6: 6, 7: 7, 8: 6 },
    "\u7259\u533b": { 3: 3, 4: 4, 5: 5, 6: 7, 7: 8, 8: 6 }
  };
  const survivorAdjustments = {
    "\u6597\u725b\u58eb": { 5: 3, 6: 5, 7: 6, 8: 5 },
    "\u52d8\u63a2\u5458": { 4: 2, 5: 3, 6: 4, 7: 5, 8: 4 },
    "\u524d\u950b": { 4: 2, 5: 3, 6: 4, 7: 5, 8: 4 },
    "\u5e7b\u706f\u5e08": { 4: 2, 5: 3, 6: 4, 7: 5, 8: 4 },
    "\u62c9\u62c9\u961f\u5458": { 3: 2, 4: 3, 5: 4, 6: 5, 7: 5, 8: 4 },
    "\u533b\u751f": { 1: 4, 2: 4, 3: 4, 4: 3, 5: 2, 6: 2, 7: 2, 8: 2 },
    "\u673a\u68b0\u5e08": { 6: 3, 7: 4, 8: 3 },
    "\u5f8b\u5e08": { 6: -2, 7: -3, 8: -2 },
    "\u6148\u5584\u5bb6": { 5: -2, 6: -3, 7: -4, 8: -3 }
  };
  const table = character.faction === "hunter" ? hunterAdjustments : survivorAdjustments;
  return table[name]?.[part] || 0;
}

function scoreCharacter(character, range) {
  const metrics = character.metrics[String(state.part)];
  const model = modelFor(character);
  const rawCognition = cognitionRaw(character);
  const rawElite = eliteCognitionRaw(character);

  const win = normalize(metrics.winRate, range.win[0], range.win[1]);
  const draw = normalize(metrics.drawRate, range.draw[0], range.draw[1]);
  const pick = normalize(metrics.pickRate, range.pick[0], range.pick[1]);
  const ban = normalize(metrics.banRate, range.ban[0], range.ban[1]);
  const cognition = normalize(rawCognition, range.cognition[0], range.cognition[1]);
  const elite = normalize(rawElite, range.elite[0], range.elite[1]);
  const reliability = clamp(35 + normalize(metrics.pickRate, range.pick[0], range.pick[1]) * 0.65);
  const version = versionCalibration(character);
  const adjustment = environmentAdjustment(character);

  const score =
    win * (model.win / 100) +
    draw * (model.draw / 100) +
    pick * (model.pick / 100) +
    ban * (model.ban / 100) +
    cognition * (model.cognition / 100) +
    elite * ((model.elite || 0) / 100) +
    reliability * (model.reliability / 100) +
    (version || 0) * ((model.version || 0) / 100) +
    adjustment;

  return {
    score,
    win,
    draw,
    pick,
    ban,
    cognition,
    elite,
    reliability,
    version,
    adjustment
  };
}

function tier(rank, total) {
  const ratio = rank / total;
  if (ratio <= 0.12) return "S";
  if (ratio <= 0.32) return "A";
  if (ratio <= 0.62) return "B";
  return "C";
}

function roleFlavor(character) {
  const direct = ROLE_FLAVORS[character.faction]?.[character.name];
  if (direct) return direct;

  if (character.faction === "hunter") {
    return {
      anchor: `${character.name}主要看追击、守尸和控场能不能形成闭环。`,
      detail: "监管者侧不能只看胜率，还要看它是否能稳定逼出救援压力。",
      advice: "先确认自己能稳定开第一刀，再看是否值得当版本主练。"
    };
  }

  if ((character.position || "").includes("破译")) {
    return {
      anchor: `${character.name}更偏破译节奏位，价值来自把机子进度稳定推上去。`,
      detail: "破译型角色常常不是最能秀的，但能直接决定队伍下限。",
      advice: "适合队伍需要稳定修机链时使用。"
    };
  }

  if ((character.position || "").includes("救援")) {
    return {
      anchor: `${character.name}更偏救援和二次接节奏，重点是能不能把椅区压力吃下来。`,
      detail: "救援型角色的数据要和平率一起看，很多强度体现在少输或保平。",
      advice: "优先练进椅区路线和交资源时机。"
    };
  }

  if ((character.position || "").includes("辅助")) {
    return {
      anchor: `${character.name}更偏队伍功能位，强度来自它能不能让队友打得更舒服。`,
      detail: "辅助型角色不能只看个人胜率，要看队伍联动和 BP 价值。",
      advice: "单排要谨慎，双排或固定队会更容易发挥。"
    };
  }

  return {
    anchor: `${character.name}主要承担牵制和转点压力。`,
    detail: "牵制型角色的胜率要和出场率一起看，样本稳定才说明强度可靠。",
    advice: "先确认熟悉地图转点，再把它放进上分池。"
  };
}

// Character guidance stays explicit for newly added roster entries.
ROLE_FLAVORS.survivor["\u9ed8\u5267\u827a\u4eba"] = {
  anchor: "\u9ed8\u5267\u827a\u4eba\u7684\u4ef7\u503c\u6765\u81ea\u7f13\u901f\u4e0e\u5e72\u6270\u7684\u8fde\u7eed\u6027\uff0c\u4e0d\u662f\u4e00\u6b21\u6027\u7684\u7206\u53d1\u6551\u4eba\u3002",
  detail: "\u9996\u5468\u6570\u636e\u663e\u793a\u5b83\u5728\u4e2d\u4f4e\u6bb5\u6709\u4e00\u5b9a\u7684\u6eb6\u9519\u7387\uff0c\u9ad8\u6bb5\u5219\u66f4\u4f9d\u8d56\u961f\u53cb\u7406\u89e3\u548c\u677f\u533a\u8def\u7ebf\u3002",
  advice: "\u5929\u8d4b\u4f18\u5148\u56de\u5149\u53cd\u7167\uff0c\u6839\u636e\u961f\u4f0d\u518d\u8003\u8651\u5316\u9669\u4e3a\u5937\uff1b\u4e0d\u8981\u628a\u7f13\u901f\u8d44\u6e90\u4e00\u6b21\u6027\u5168\u4ea4\u3002"
};

ROLE_FLAVORS.survivor["\u6cd5\u7f57\u5973\u58eb"] = {
  anchor: "\u6cd5\u7f57\u5973\u58eb\u7684\u5f3a\u5ea6\u4e0d\u5728\u4e8e\u7ad9\u6869\u4fee\u673a\uff0c\u800c\u5728\u4e8e\u7528\u4f2a\u88c5\u548c\u6cd5\u6756\u628a\u76d1\u7ba1\u7684\u9996\u5200\u8282\u594f\u6253\u4e71\u3002",
  detail: "\u5979\u7684\u6570\u636e\u8981\u7ed3\u5408\u51fa\u573a\u548c\u8ba4\u77e5\u5206\u770b\uff1a\u4f1a\u7528\u6cd5\u6756\u8d5a\u8eab\u4f4d\u7684\u73a9\u5bb6\u80fd\u660e\u663e\u62c9\u9ad8\u4e0a\u9650\uff0c\u4e0d\u4f1a\u7528\u65f6\u5c31\u53ea\u662f\u4e00\u4e2a\u5bb9\u6613\u88ab\u8ffd\u7684\u4fee\u673a\u4f4d\u3002",
  advice: "\u6cd5\u6756\u53ef\u4ee5\u4e0d\u5b9a\u65f6\u5411\u524d\u4e22\u7136\u540e\u53cd\u8d70\uff0c\u5229\u7528\u76d1\u7ba1\u9884\u5224\u8def\u7ebf\u7684\u4e00\u77ac\u95f4\u8d5a\u8eab\u4f4d\uff1b\u5982\u679c\u53ea\u628a\u6cd5\u6756\u5f53\u88ab\u52a8\u4fdd\u547d\uff0c\u5f3a\u5ea6\u4f1a\u6389\u5f97\u5f88\u660e\u663e\u3002"
};

function tacticalFocus(character) {
  const focusByName = {
    "牙医": "起手压迫和低交互追击",
    "女王蜂": "持续消耗与补伤节奏",
    "跛脚羊": "框位封锁和地形压迫",
    "时空之影": "时间差追击",
    "梦之女巫": "多线控场上限",
    "台球手": "路线压制",
    "歌剧演员": "高机动连追",
    "孽蜥": "空中地形博弈",
    "隐士": "资源转换和控局",
    "渔女": "区域控场",
    "前锋": "撞救和断节奏能力",
    "医生": "自疗容错和续航",
    "机械师": "修机启动速度",
    "勘探员": "磁铁反制和转点",
    "斗牛士": "牵制切换和干扰",
    "幻灯师": "穿点联动",
    "拉拉队员": "团队增益",
    "击球手": "守尸反制",
    "佣兵": "稳定救援",
    "先知": "预判保护",
    "祭司": "通道转线",
    "冒险家": "偷机和隐蔽节奏",
    "入殓师": "后手保险"
  };
  if (focusByName[character.name]) return focusByName[character.name];
  if (character.faction === "hunter") return "追击、守尸和控场闭环";
  if ((character.position || "").includes("救援")) return "救援干预能力";
  if ((character.position || "").includes("破译")) return "破译节奏";
  if ((character.position || "").includes("辅助")) return "队伍功能价值";
  return "牵制和转点能力";
}

function metricStory(character, metrics) {
  const badgeGap = (character.badges.s1 || 0) - (character.badges.c500 || 0);
  const focus = tacticalFocus(character);
  const highWin = character.faction === "hunter" ? metrics.winRate >= 0.5 : metrics.winRate >= 0.38;
  const highDraw = metrics.drawRate >= (character.faction === "hunter" ? 0.22 : 0.3);
  const highPick = metrics.pickRate >= 0.05;
  const lowPick = metrics.pickRate < 0.01;
  const highBan = metrics.banRate >= (character.faction === "hunter" ? 0.08 : 0.05);
  const veryHighBan = metrics.banRate >= (character.faction === "hunter" ? 0.18 : 0.12);
  const highC500 = (character.badges.c500 || 0) >= (character.faction === "hunter" ? 10500 : 8500);

  let strength;
  if (highBan && highPick) {
    strength = `${character.name}既能上场又能吃 ban，说明${focus}不是纸面威胁，而是排位里真的会改变对局`;
  } else if (highBan) {
    strength = `${character.name}的禁用率被抬高，主要是在针对它的${focus}`;
  } else if (highWin && highDraw) {
    strength = `${character.name}胜率和平率一起好看，说明${focus}既能冲胜，也能把坏局拖回来`;
  } else if (highWin) {
    strength = `${character.name}在胜率端有明显贡献，${focus}能比较直接地转成胜局`;
  } else if (highDraw) {
    strength = `${character.name}平率表现更突出，更像靠${focus}稳住局面的保底型选择`;
  } else if (highC500) {
    strength = `${character.name}的 C500 不低，说明正常高手仍能复制出${focus}的强度`;
  } else if (highPick) {
    strength = `${character.name}出场样本稳定，说明玩家对这套${focus}打法的接受度不差`;
  } else {
    strength = `${character.name}单项数据没有特别夸张，综合位置更多来自多项指标的均衡`;
  }

  let risk;
  if (veryHighBan) {
    risk = `但${character.name}的 BP 可用率不稳定，真到排位里要准备同功能替代位`;
  } else if (lowPick && highWin) {
    risk = `但${character.name}出场太低，胜率要按绝活样本处理，不能直接外推给普通玩家`;
  } else if (badgeGap >= 8000) {
    risk = `但${character.name}的 S1 和 C500 拉得很开，说明上限高、普适性没有那么稳`;
  } else if (metrics.lossRate > (character.faction === "hunter" ? 0.38 : 0.45)) {
    risk = character.faction === "hunter"
      ? `但${character.name}败率偏高时，容易被拖进运营和多跑节奏`
      : `但${character.name}败率偏高时，路人局容错会比较紧`;
  } else if (!highPick) {
    risk = `但${character.name}样本密度一般，需要结合熟练度和地图再判断`;
  } else {
    risk = `${character.name}短板不算尖锐，主要看地图、阵容和玩家熟练度`;
  }

  return { strength, risk };
}

function averageFor(faction, part) {
  const rows = DATA.characters.filter((item) => item.faction === faction && item.metrics[String(part)]);
  const avg = (fn) => rows.reduce((sum, row) => sum + fn(row), 0) / rows.length;
  return {
    win: avg((row) => row.metrics[part].winRate),
    draw: avg((row) => row.metrics[part].drawRate),
    loss: avg((row) => row.metrics[part].lossRate),
    pick: avg((row) => row.metrics[part].pickRate),
    ban: avg((row) => row.metrics[part].banRate),
    c500: avg((row) => row.badges.c500 || 0)
  };
}

function signedPct(value) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(2)}%`;
}

function signedNum(value) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${Math.round(value).toLocaleString("zh-CN")}`;
}

function talentAdvice(character) {
  const pos = character.position || "";
  if (character.faction === "hunter") {
    if (["梦之女巫", "隐士", "记录员", "摄影师", "疯眼"].includes(character.name)) {
      return "监管建议：偏控场角色优先考虑底牌/传送/闪现的组合思路，核心是中后期压机，不要把全部资源交在第一轮追击。";
    }
    if (["使徒", "26号守卫", "黄衣之主", "蜡像师", "雕刻家"].includes(character.name)) {
      return "监管建议：守椅收益高，天赋和辅助特质围绕救援压迫展开；能稳定打出二伤时，强度会明显上升。";
    }
    if (["歌剧演员", "红蝶", "红夫人", "孽蜥", "小丑", "杰克", "鹿头"].includes(character.name)) {
      return "监管建议：追击型优先保证首刀速度，闪现价值很高；如果地图太大或对手转点多，要提前规划二次追击路线。";
    }
    return "监管建议：根据地图选择闪现、传送或窥视者等思路。当前版本更看重追击后能否接守椅与控机，不能只追求单点击倒。";
  }

  const survivorAdvice = {
    "\u6cd5\u7f57\u5973\u58eb": "\u5929\u8d4b\u5efa\u8bae\uff1a\u56de\u5149\u8fd4\u7167\u4f18\u5148\uff0c\u4e3b\u6253\u4f2a\u88c5\u4e0e\u6cd5\u6756\u8f6c\u70b9\u3002\u6cd5\u6756\u4e0d\u8981\u53ea\u7b49\u88ab\u8ffd\u624d\u4ea4\uff0c\u53ef\u4ee5\u4e0d\u5b9a\u65f6\u5411\u524d\u9884\u4e22\u540e\u53cd\u8d70\uff0c\u8d5a\u8eab\u4f4d\u5dee\u548c\u89c6\u91ce\u8bef\u5224\uff1b\u82e5\u961f\u4f0d\u7f3a\u6551\u63f4\uff0c\u4e0d\u5efa\u8bae\u7531\u5979\u786c\u627f\u4e3b\u8981\u640f\u547d\u4f4d\u3002",
    "\u673a\u68b0\u5e08": "\u5929\u8d4b\u5efa\u8bae\uff1a\u56de\u5149\u8fd4\u7167\u4f18\u5148\uff0c\u4eba\u5076\u7528\u6765\u62a2\u8282\u594f\u800c\u4e0d\u662f\u968f\u624b\u6d88\u8017\u3002\u5f00\u5c40\u88ab\u627e\u5230\u65f6\u8981\u5c3d\u5feb\u8f6c\u8fdb\u5f3a\u533a\uff0c\u6d3b\u4eba\u548c\u4eba\u5076\u4e0d\u8981\u540c\u65f6\u66b4\u9732\u5728\u76d1\u7ba1\u8282\u594f\u91cc\u3002",
    "\u5f8b\u5e08": "\u5929\u8d4b\u5efa\u8bae\uff1a\u5229\u7528\u5730\u56fe\u4fe1\u606f\u63d0\u524d\u8eb2\u9ad8\u5371\u51fa\u751f\u70b9\uff0c\u56de\u5149\u8fd4\u7167\u914d\u5408\u81ea\u4fdd\u5206\u652f\u66f4\u7a33\u3002\u4f60\u7684\u4ef7\u503c\u662f\u4e0d\u7ed9\u76d1\u7ba1\u8005\u767d\u62ff\u9996\u5200\uff0c\u4e0d\u662f\u5403\u4f24\u5bb3\u540e\u518d\u8865\u6551\u573a\u3002",
    "\u4f5c\u66f2\u5bb6": "\u5929\u8d4b\u5efa\u8bae\uff1a\u56de\u5149\u8fd4\u7167\u4f18\u5148\uff0c\u8282\u594f\u4fee\u673a\u65f6\u8981\u628a\u8f6c\u70b9\u8def\u7ebf\u9884\u7559\u597d\u3002\u4f5c\u66f2\u5bb6\u4e0d\u9700\u8981\u4e3b\u52a8\u5356\u8840\u8bc1\u660e\u5b58\u5728\u611f\uff0c\u771f\u6b63\u8981\u505a\u7684\u662f\u628a\u673a\u5b50\u8282\u594f\u4fee\u5230\u5e95\u3002",
    "\u524d\u950b": "\u5929\u8d4b\u5efa\u8bae\uff1a\u53ef\u6839\u636e\u961f\u4f0d\u9009\u62e9\u5316\u9669\u4e3a\u5937\u6216\u7275\u5236\u5206\u652f\u3002\u7403\u4e0d\u8981\u4e3a\u4e86\u5e05\u800c\u4ea4\uff0c\u4f18\u5148\u7559\u7ed9\u649e\u6551\u3001\u649e\u65ad\u8282\u594f\u548c\u4e8c\u6b21\u8f6c\u70b9\u3002"
  };
  if (survivorAdvice[character.name]) return survivorAdvice[character.name];

  if (pos.includes("救援")) {
    return "天赋建议：默认回光返照 + 化险为夷。队伍里通常 1-2 个搏命位够用，救援位要承担半救、二救和扛刀换节奏。";
  }
  if (["前锋", "击球手", "野人", "牛仔"].includes(character.name)) {
    return "天赋建议：可根据队伍选择化险为夷或强化牵制。若队伍只有你能干扰救援，建议带搏命；固定队可让佣兵/守墓人带搏命，你承担干扰。";
  }
  if (pos.includes("破译")) {
    return "天赋建议：回光返照优先，通常不建议承担主要搏命位。重点是少吃第一刀、稳住破译节奏，必要时带提高自保和转点容错的分支。";
  }
  if (pos.includes("辅助")) {
    return "天赋建议：回光返照仍建议保留；是否带化险为夷取决于队伍救援位数量。辅助位更重要的是把保护资源留给主牵制或关键救援窗口。";
  }
  return "天赋建议：回光返照优先，主牵制位通常不必全队都带搏命；除非队伍没有稳定救援位，否则应把天赋资源放在转点和拉牵制。";
}

function detailGuide(character) {
  const guide = DETAIL_GUIDES[character.faction]?.[character.name];
  if (!guide) return null;
  const pros = selectedSeason() === 43 ? guide.pros43 : guide.pros44;
  return {
    role: guide.role,
    pros: pros || guide.pros44 || guide.pros43,
    talent: guide.talent
  };
}

function mapAdvice(character) {
  if (character.faction === "hunter") {
    if (["渔女", "爱哭鬼", "蜡像师", "雕刻家", "黄衣之主"].includes(character.name)) {
      return "地图建议：小图、窄区和板窗密集区更能放大区域压制；大图需要尽早决定守椅还是转控机。";
    }
    if (["红蝶", "歌剧演员", "孽蜥", "红夫人", "小丑"].includes(character.name)) {
      return "地图建议：开阔图和长转点图更容易发挥机动性，但也要防止被强窗与二楼点拖节奏。";
    }
    if (["梦之女巫", "隐士", "记录员", "摄影师", "疯眼"].includes(character.name)) {
      return "地图建议：优先围绕密码机密集区和二挂区域控场，目标不是只抓一个人，而是让对手修机线断开。";
    }
    return "地图建议：开局先判断弱区出生点和最近密码机，追击路线尽量往椅区、遗产机和二次控场方向赶。";
  }

  if ((character.position || "").includes("破译")) {
    return "地图建议：破译位优先远离开局高危点。军工厂小木屋、医院二楼外圈、红教堂墓地区和唐人街街区都要提前想好转点路线。";
  }
  if ((character.position || "").includes("救援")) {
    return "地图建议：救援位不要贪远机，站位要能接近椅区。湖景村、月亮河这类大图尤其要提前看监管守椅方向。";
  }
  if ((character.position || "").includes("辅助")) {
    return "地图建议：辅助位要贴近主牵制和救援路线，不要离队伍太远；通道、保护和干扰资源要给到能换机子进度的位置。";
  }
  return "地图建议：主牵制优先围绕强窗、强板和二楼结构转点；弱区不要硬吃资源，能提前转安全区就不要在短板区硬博弈。";
}

function detailedEvaluation(character) {
  const metrics = character.metrics[String(state.part)];
  const avg = averageFor(character.faction, state.part);
  const ev = evaluation(character);
  const guide = detailGuide(character);
  const badgeGap = (character.badges.s1 || 0) - (character.badges.c500 || 0);
  const cognitionText =
    badgeGap > 8000
      ? `S1 比 C500 高 ${num(badgeGap)}，说明上限很高，但普通高手复现难度也高。`
      : `S1 与 C500 差距为 ${num(badgeGap)}，说明上限和可复制性相对更接近。`;
  const banText =
    metrics.banRate > avg.ban * 1.4
      ? `禁用率高于同榜均值 ${signedPct(metrics.banRate - avg.ban)}，BP 压力是真实存在的。`
      : metrics.banRate < avg.ban * 0.65
        ? `禁用率低于同榜均值 ${signedPct(metrics.banRate - avg.ban)}，更像可放出来但需要看地图/阵容的角色。`
        : `禁用率接近同榜均值，更多作为强度修正，而不是单独定性。`;
  const pickText =
    metrics.pickRate < avg.pick * 0.55
      ? `出场率低于均值 ${signedPct(metrics.pickRate - avg.pick)}，数据要结合样本可信修正，不宜只看胜率。`
      : `出场率相对均值 ${signedPct(metrics.pickRate - avg.pick)}，样本对实战判断有参考价值。`;

  return {
    overview: guide?.role ? `${guide.role}${ev.summary}` : `${ev.roleLine}${ev.summary}`,
    data: `胜率 ${pct(metrics.winRate)}（相对均值 ${signedPct(metrics.winRate - avg.win)}），平率 ${pct(metrics.drawRate)}（相对均值 ${signedPct(metrics.drawRate - avg.draw)}），败率 ${pct(metrics.lossRate)}（相对均值 ${signedPct(metrics.lossRate - avg.loss)}）。`,
    cognition: `S1 ${num(character.badges.s1)}，A100 ${num(character.badges.a100)}，B300 ${num(character.badges.b300)}，C500 ${num(character.badges.c500)}（C500 相对均值 ${signedNum((character.badges.c500 || 0) - avg.c500)}）。${cognitionText}`,
    bp: `${banText}${pickText}`,
    map: guide?.pros || mapAdvice(character),
    talent: guide?.talent || talentAdvice(character),
    advice: ev.advice
  };
}

function buildRankings() {
  const rows = charactersForState();
  const range = ranges(rows);
  const ranked = rows
    .map((character) => ({ ...character, analysis: scoreCharacter(character, range) }))
    .sort((a, b) => {
      if (state.sort === "win") return b.metrics[state.part].winRate - a.metrics[state.part].winRate;
      if (state.sort === "draw") return b.metrics[state.part].drawRate - a.metrics[state.part].drawRate;
      if (state.sort === "pick") return b.metrics[state.part].pickRate - a.metrics[state.part].pickRate;
      if (state.sort === "ban") return b.metrics[state.part].banRate - a.metrics[state.part].banRate;
      if (state.sort === "s1") return (b.badges.s1 || 0) - (a.badges.s1 || 0);
      if (state.sort === "a100") return (b.badges.a100 || 0) - (a.badges.a100 || 0);
      if (state.sort === "b300") return (b.badges.b300 || 0) - (a.badges.b300 || 0);
      if (state.sort === "c500") return (b.badges.c500 || 0) - (a.badges.c500 || 0);
      return b.analysis.score - a.analysis.score;
    });

  return ranked.map((item, index) => ({ ...item, rank: index + 1, tier: tier(index + 1, ranked.length) }));
}

function evaluation(character) {
  const metrics = character.metrics[String(state.part)];
  const rankText = `${PARTS[state.part]}${character.faction === "hunter" ? "监管者" : "求生者"}第 ${character.rank}`;
  const flavor = roleFlavor(character);
  const story = metricStory(character, metrics);
  const stageAdvice =
    state.part <= 2
      ? "当前段位更看重能不能稳定上手，先把容错和基础收益放在第一位。"
      : state.part <= 5
        ? "中阶开始要把 C500、出场率和胜平率放在一起看，别被单项高分误导。"
        : "高阶要把禁用率、认知上限和替代角色一起纳入 BP 规划。";

  return {
    summary: `${rankText}。${story.strength}；${story.risk}。`,
    roleLine: `${flavor.anchor}${flavor.detail}`,
    advice: `${flavor.advice}${stageAdvice}`,
    strengths: [story.strength],
    risks: [story.risk]
  };
}

function renderModel() {
  const grid = document.querySelector("#modelGrid");
  const renderWeightRows = (model) => Object.keys(model)
    .filter((key) => FIELD_LABELS[key])
    .map((key) => {
      const value = model[key];
      return `
        <div class="weight-row">
          <span>${FIELD_LABELS[key]}</span>
          <span class="weight-track" aria-label="${FIELD_LABELS[key]}权重 ${value}%">
            <span class="weight-fill weight-${key}" style="width:${value}%"></span>
          </span>
          <strong>${value}%</strong>
        </div>
      `;
    })
    .join("");
  const baseCards = Object.entries(PART_MODELS)
    .map(([part, model]) => {
      return `
        <article class="model-card">
          <p class="eyebrow">${PARTS[part]}</p>
          <h3>${PARTS[part]}模型</h3>
          <p>${model.note}</p>
          ${renderWeightRows(model)}
        </article>
      `;
    })
    .join("");
  const peakModels = selectedSeason() === 43
    ? S43_PEAK_MODELS
    : {
        hunter: FACTION_MODELS.hunter[8],
        survivor: FACTION_MODELS.survivor[8]
      };
  const hunterPeak = peakModels.hunter;
  const survivorPeak = peakModels.survivor;
  const specialCard = (title, model) => {
    return `
      <article class="model-card">
        <p class="eyebrow">${title}</p>
        <h3>${title}校准模型</h3>
        <p>${model.note}</p>
        ${renderWeightRows(model)}
      </article>
    `;
  };
  grid.innerHTML = `${baseCards}
    ${specialCard("巅七监管专用", hunterPeak)}
    ${specialCard("巅七求生专用", survivorPeak)}
  `;
}

function metricBar(label, value, max, kind = "") {
  const width = clamp((value / max) * 100);
  return `
    <div class="metric">
      <div class="metric-label"><span>${label}</span><strong>${pct(value)}</strong></div>
      <div class="metric-bar ${kind}"><span style="width:${width}%"></span></div>
    </div>
  `;
}

function renderSummary(rows) {
  const top = rows[0];
  const faction = state.faction === "survivor" ? "求生者" : "监管者";
  const avg = (fn) => rows.reduce((sum, row) => sum + fn(row), 0) / rows.length;
  const metrics = top.metrics[String(state.part)];
  const copy = seasonCopy();
  document.querySelector("#rankSummary").innerHTML = `
    <article class="summary-panel">
      <strong>${PARTS[state.part]} ${faction}综合榜</strong>
      <p>第 1 名：${top.name}。胜率 ${pct(metrics.winRate)}，平率 ${pct(metrics.drawRate)}，出场率 ${pct(metrics.pickRate)}，禁用率 ${pct(metrics.banRate)}，C500 ${num(top.badges.c500)}。</p>
    </article>
    <article class="summary-panel">
      <strong>数据日期</strong>
      <p>胜率/出场/禁用：${DATA.meta.dayDataDate}；认知徽章：${DATA.meta.badgeDataDate}。${copy.summary}</p>
    </article>
    <article class="summary-panel">
      <strong>环境均值</strong>
      <p>平均胜率 ${pct(avg((row) => row.metrics[state.part].winRate))}，平均平率 ${pct(avg((row) => row.metrics[state.part].drawRate))}，平均禁用率 ${pct(avg((row) => row.metrics[state.part].banRate))}。</p>
    </article>
  `;
}

function renderEnvironment() {
  const hunter = averageFor("hunter", 8);
  const survivor = averageFor("survivor", 8);
  const season = selectedSeason();
  const hunterPressure = hunter.win + hunter.draw * 0.45;
  const survivorPressure = survivor.win + survivor.draw * 0.55;
  const verdict =
    Math.abs(hunterPressure - survivorPressure) < 0.04
      ? "整体更接近平衡版本"
      : hunterPressure > survivorPressure
        ? "数据更偏监管节奏版本"
        : "数据更偏求生保平版本";
  const firstParagraph = season === 43
    ? `第43赛季 6 月 13 日归档环境里，巅七监管平均胜率 ${pct(hunter.win)}、平率 ${pct(hunter.draw)}、败率 ${pct(hunter.loss)}；巅七求生平均胜率 ${pct(survivor.win)}、平率 ${pct(survivor.draw)}、败率 ${pct(survivor.loss)}。这个版本的核心不是单边碾压，而是高阶 BP 对超模监管和关键求生体系位的挤压更明显，所以本站把 ban 率、平局保分和高认知排序放得更重。`
    : `巅七监管平均胜率 ${pct(hunter.win)}、平率 ${pct(hunter.draw)}、败率 ${pct(hunter.loss)}；巅七求生平均胜率 ${pct(survivor.win)}、平率 ${pct(survivor.draw)}、败率 ${pct(survivor.loss)}。判断时不只看胜率，也把平率按高阶保分价值折算，因为高阶排位里“稳定不输”本身就是环境强度。`;
  const bpParagraph = season === 43
    ? `S43 的 BP 逻辑更像“先处理无法放任的体系点”：监管侧牙医、女王蜂、跛脚羊、时空之影、梦之女巫、台球手属于高阶优先处理对象；求生侧斗牛士、勘探员、前锋、幻灯师、拉拉队员能明显改变牵制或救援链条。高 ban 不只是热度，而是阵容构建成本。`
    : `巅七监管平均禁用率 ${pct(hunter.ban)}，求生平均禁用率 ${pct(survivor.ban)}。如果一个角色同时高 ban、高出场，说明它不是冷门绝活；如果高认知但低出场，则需要样本可信修正。`;
  const climbParagraph = season === 43
    ? "低阶仍然更适合选容错高、惩罚失误快的角色，例如渔女这类低阶数据压迫更强的监管应当上移；五到七阶开始要按 BP 压力和 S1/A100/B300 认知排序修正，红蝶这种低中阶体感强但高阶依赖对手失误的角色不能继续虚高。"
    : "低阶优先选容错高、操作链短的角色；五阶到七阶开始看 C500 和出场率；巅七要看 BP、地图、角色上限和替代池，单项胜率高并不能直接说明角色最强。";
  document.querySelector("#environmentOverview").innerHTML = `
    <article class="environment-card">
      <strong>${verdict}</strong>
      <p>${firstParagraph}</p>
    </article>
    <article class="environment-card">
      <strong>BP 压力依据</strong>
      <p>${bpParagraph}</p>
    </article>
    <article class="environment-card">
      <strong>上分策略</strong>
      <p>${climbParagraph}</p>
    </article>
  `;
}

function renderDetail(character) {
  const metrics = character.metrics[String(state.part)];
  const detail = detailedEvaluation(character);
  document.querySelector("#detailShell").innerHTML = `
    <article class="detail-card ${character.faction}">
      <div class="detail-hero">
        <img src="${encodeURI(avatarPath(character))}" alt="${escapeAttr(character.name)}头像" />
        <div>
          <p class="eyebrow">${PARTS[state.part]} · ${character.faction === "hunter" ? "监管者" : "求生者"} · 第 ${character.rank}</p>
          <h3>${character.name}<span class="tier-mark">${character.tier}</span></h3>
          <div class="score-line"><strong>${character.analysis.score.toFixed(1)}</strong><span>综合指数</span></div>
          <div class="tags">
            <span class="tag">${character.position}</span>
            <span class="tag">胜 ${pct(metrics.winRate)}</span>
            <span class="tag">平 ${pct(metrics.drawRate)}</span>
            <span class="tag">禁用 ${pct(metrics.banRate)}</span>
            <span class="tag">C500 ${num(character.badges.c500)}</span>
            ${character.provisional ? '<span class="tag">首周样本</span>' : ''}
          </div>
        </div>
      </div>
      <div class="detail-grid">
        <section>
          <h4>角色定位</h4>
          <p>${detail.overview}</p>
        </section>
        <section>
          <h4>胜平败数据</h4>
          <p>${detail.data}</p>
        </section>
        <section>
          <h4>认知分与上限</h4>
          <p>${detail.cognition}</p>
        </section>
        <section>
          <h4>出场率与禁用率</h4>
          <p>${detail.bp}</p>
        </section>
        <section>
          <h4>优缺点</h4>
          <p>${detail.map}</p>
        </section>
        <section>
          <h4>${character.faction === "hunter" ? "监管策略" : "天赋建议"}</h4>
          <p>${detail.talent}</p>
        </section>
      </div>
      <div class="meter-grid detail-meters">
        ${metricBar("胜率", metrics.winRate, state.faction === "hunter" ? 0.75 : 0.5, "good")}
        ${metricBar("平率", metrics.drawRate, 0.5, "warn")}
        ${metricBar("出场率", metrics.pickRate, 0.22, "pick")}
        ${metricBar("禁用率", metrics.banRate, 0.35, "risk")}
        ${metricBar("胜率贡献", character.analysis.win / 100, 1, "good")}
        ${metricBar(character.analysis.version == null ? "认知贡献" : "版本校准", (character.analysis.version ?? character.analysis.cognition) / 100, 1, "warn")}
      </div>
    </article>
  `;
}

function renderRankings() {
  const rows = buildRankings();
  renderSummary(rows);
  document.querySelector("#rankList").innerHTML = rows
    .map((character) => {
      const metrics = character.metrics[String(state.part)];
      return `
        <a class="character-tile ${character.faction}" href="${detailUrl(character)}" aria-label="打开${escapeAttr(character.name)}详情页">
          <span class="tile-rank">${character.rank}</span>
          <img src="${encodeURI(avatarPath(character))}" alt="${escapeAttr(character.name)}头像" loading="lazy" />
          <span class="tile-name">${character.name}</span>
          <span class="tile-meta">${character.position}</span>
          <span class="tile-score">${character.analysis.score.toFixed(1)}</span>
          <span class="tile-stats">胜 ${pct(metrics.winRate, 1)} · 禁 ${pct(metrics.banRate, 1)}</span>
        </a>
      `;
    })
    .join("");
}

function renderDetailHeaderLinks() {
  if (window.IDV_SELECTED_ARCHIVE !== "s43") return;
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href === "index.html#rankings") link.setAttribute("href", "index.html?archive=s43#rankings");
    if (href === "index.html#model") link.setAttribute("href", "index.html?archive=s43#model");
    if (href === "index.html#environment") link.setAttribute("href", "index.html?archive=s43#environment");
  });
}

function renderDetailNeighborLinks(rows, character) {
  const index = rows.findIndex((row) => row.name === character.name);
  const prev = rows[index - 1];
  const next = rows[index + 1];
  const link = (item, label) => {
    if (!item) return `<span class="detail-nav-disabled">${label}</span>`;
    const query = new URLSearchParams({
      name: item.name,
      faction: item.faction,
      part: String(state.part)
    });
    if (selectedSeason() === 43) {
      query.set("archive", "s43");
    }
    return `<a href="character.html?${query.toString()}">${label}：${item.rank}. ${item.name}</a>`;
  };
  const backHref = selectedSeason() === 43
    ? "index.html?archive=s43#rankings"
    : "index.html#rankings";

  document.querySelector("#detailNav").innerHTML = `
    ${link(prev, "上一名")}
    <a href="${backHref}">返回八段榜单</a>
    ${link(next, "下一名")}
  `;
}

function initCharacterPage() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  const faction = params.get("faction") || "survivor";
  const part = Number(params.get("part") || 8);

  state.faction = faction;
  state.part = part;
  state.sort = "rank";

  const rows = buildRankings();
  const character = rows.find((row) => row.name === name) || rows[0];
  state.selectedName = character.name;

  const season = selectedSeason();
  document.title = `${character.name} | S${season} 五榜角色详情`;
  document.querySelector("#detailTitle").textContent = character.name;
  document.querySelector("#detailIntro").textContent =
    `第${season}赛季 ${PARTS[part]}${character.faction === "hunter" ? "监管者" : "求生者"}第 ${character.rank}。这里展示该赛季快照下的胜平败、认知分、BP 压力、优缺点和${character.faction === "hunter" ? "监管策略" : "天赋建议"}。`;

  renderDetail(character);
  renderDetailHeaderLinks();
  renderDetailNeighborLinks(rows, character);
}

function renderSources() {
  const sources = [
    ...DATA.sources,
    { label: "角色头像：第五人格 BWIKI 角色页", url: "https://wiki.biligame.com/dwrg/%E8%A7%92%E8%89%B2" }
  ];
  document.querySelector("#sourceList").innerHTML = sources
    .map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a>`)
    .join("");

  const notes = [DATA.videoNotes.survivor, DATA.videoNotes.hunter];
  document.querySelector("#videoNotes").innerHTML = notes
    .map((item) => {
      const kind = item.title.includes("求生者") ? "survivor" : "hunter";
      const takeaways = VIDEO_TAKEAWAYS[kind].map((text) => `<li>${text}</li>`).join("");
      return `
        <article class="insight-panel">
          <h3>${item.title}</h3>
          <p>参考这期视频对角色坐标、版本压力和玩家讨论的判断，再结合本站全服数据做交叉校准。</p>
          <ul class="signal-list">${takeaways}</ul>
        </article>
      `;
    })
    .join("");
}

function bindControls() {
  document.querySelectorAll("input[name='faction']").forEach((input) => {
    input.addEventListener("change", () => {
      state.faction = input.value;
      renderRankings();
    });
  });
  document.querySelectorAll("input[name='part']").forEach((input) => {
    input.addEventListener("change", () => {
      state.part = Number(input.value);
      renderRankings();
    });
  });
  document.querySelector("#sortSelect").addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderRankings();
  });
}

function bindAssessment() {
  const form = document.querySelector("#assessmentForm");
  const result = document.querySelector("#assessmentResult");
  if (!form || !result) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = [...new FormData(form).values()].map(Number);
    const score = values.reduce((sum, value) => sum + value, 0);
    const profile = score >= 24
      ? { title: "环境理解：战术型", text: "你会把 BP、地图和队伍分工放在一起判断。高段位建议优先练稳定功能位，并准备一名同定位替代角色。" }
      : score >= 17
        ? { title: "环境理解：适应型", text: "你有基础版本判断，但容易被单项数据带偏。选角时同时核对出场率、禁用率和自身熟练度。" }
        : { title: "环境理解：直觉型", text: "你的决策更依赖手感。先固定两名低失误角色，再用榜单补齐地图与克制关系，会比频繁换角更有效。" };
    result.innerHTML = `<strong>${profile.title}</strong><p>${profile.text}</p><a href="#rankings">按建议查看榜单</a>`;
    result.classList.add("is-visible");
    localStorage.setItem("wubang-assessment", JSON.stringify({ score, profile: profile.title, at: Date.now() }));
  });
}

window.WUBANG = {
  DATA,
  AVATARS,
  PARTS,
  state,
  pct,
  num,
  avatarPath,
  metricBar,
  buildRankings,
  detailedEvaluation,
  averageFor,
  renderDetail,
  renderEnvironment,
  renderRankings,
  modelFor,
  scoreCharacter
};

if (document.querySelector("#rankList")) {
  const copy = seasonCopy();
  document.title = `五榜 | ${copy.label} 第五人格角色推荐与战斗环境全解`;
  document.querySelector(".hero .eyebrow").textContent = copy.heroEyebrow;
  document.querySelector(".hero-lead").textContent = copy.heroLead;
  const heroSeason = document.querySelector(".hero-stats div:nth-child(3) dt");
  if (heroSeason) heroSeason.textContent = selectedSeason();
  document.querySelector("#dataNotice").textContent = DATA.meta.note;
  const sourceIntro = document.querySelector("#sources .section-heading p:not(.eyebrow)");
  if (sourceIntro) {
    sourceIntro.textContent = `胜率、平率、出场率、禁用率来自小程序同源的第${selectedSeason()}赛季 ${DATA.meta.dayDataDate} 累计全服数据；认知分来自同源 ${DATA.meta.badgeDataDate} 认知徽章 JSON。页面按当前快照重新计算八段榜单，并保留可回看的历史归档。`;
  }
  renderModel();
  renderSources();
  renderEnvironment();
  bindControls();
  bindAssessment();
  renderRankings();
}

if (document.querySelector("#detailShell")) {
  initCharacterPage();
}
