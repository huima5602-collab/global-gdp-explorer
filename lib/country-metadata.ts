export type CityInfo = {
  nameZh: string;
  nameEn: string;
  image: string;
  description: string;
};

export type AttractionInfo = {
  nameZh: string;
  nameEn: string;
  image: string;
  description: string;
};

export type CountryMeta = {
  iso3: string;
  iso2: string;
  nameZh: string;
  nameEn: string;
  capitalZh: string;
  capitalEn: string;
  population: string;
  latitude: number;
  longitude: number;
  flagUrl: string;
  summary: string;
  cities: CityInfo[];
  attractions: AttractionInfo[];
};

function hashCode(input: string) {
  return input.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 9999;
}

const img = (q: string) => `https://loremflickr.com/900/600/${encodeURIComponent(q)}?lock=${hashCode(q)}`;

export const COUNTRY_META: Record<string, CountryMeta> = {
  USA: {
    iso3: 'USA', iso2: 'US', nameZh: '美国', nameEn: 'United States', capitalZh: '华盛顿', capitalEn: 'Washington, D.C.', population: '约3.35亿', latitude: 38.9, longitude: -77.0,
    flagUrl: 'https://flagcdn.com/w320/us.png', summary: '全球最大经济体之一，服务业、科技、金融、军工和高端制造业高度发达。',
    cities: [
      { nameZh: '纽约', nameEn: 'New York', image: img('New York skyline'), description: '全球金融、媒体和商业中心。' },
      { nameZh: '洛杉矶', nameEn: 'Los Angeles', image: img('Los Angeles city'), description: '影视、科技和国际贸易重镇。' },
      { nameZh: '旧金山', nameEn: 'San Francisco', image: img('San Francisco Golden Gate'), description: '湾区创新经济的重要门户。' }
    ],
    attractions: [
      { nameZh: '自由女神像', nameEn: 'Statue of Liberty', image: img('Statue of Liberty New York'), description: '纽约港的代表性地标。' },
      { nameZh: '大峡谷', nameEn: 'Grand Canyon', image: img('Grand Canyon Arizona'), description: '世界知名自然景观。' }
    ]
  },
  CHN: {
    iso3: 'CHN', iso2: 'CN', nameZh: '中国', nameEn: 'China', capitalZh: '北京', capitalEn: 'Beijing', population: '约14.1亿', latitude: 39.9, longitude: 116.4,
    flagUrl: 'https://flagcdn.com/w320/cn.png', summary: '世界主要制造业和贸易大国，数字经济、新能源、高铁、电子制造等产业发展迅速。',
    cities: [
      { nameZh: '北京', nameEn: 'Beijing', image: img('Beijing Forbidden City'), description: '政治、文化、科技创新中心。' },
      { nameZh: '上海', nameEn: 'Shanghai', image: img('Shanghai skyline'), description: '国际金融、航运和贸易中心。' },
      { nameZh: '深圳', nameEn: 'Shenzhen', image: img('Shenzhen skyline'), description: '科技创新和先进制造业重镇。' }
    ],
    attractions: [
      { nameZh: '长城', nameEn: 'Great Wall', image: img('Great Wall China'), description: '中国最具代表性的历史文化景观之一。' },
      { nameZh: '故宫', nameEn: 'Forbidden City', image: img('Forbidden City Beijing'), description: '明清皇家宫殿建筑群。' }
    ]
  },
  DEU: {
    iso3: 'DEU', iso2: 'DE', nameZh: '德国', nameEn: 'Germany', capitalZh: '柏林', capitalEn: 'Berlin', population: '约8400万', latitude: 52.5, longitude: 13.4,
    flagUrl: 'https://flagcdn.com/w320/de.png', summary: '欧洲最大经济体之一，以汽车、机械、化工和高端制造著称。',
    cities: [
      { nameZh: '柏林', nameEn: 'Berlin', image: img('Berlin Germany'), description: '德国首都，文化和创新产业活跃。' },
      { nameZh: '慕尼黑', nameEn: 'Munich', image: img('Munich Germany'), description: '汽车、科技和会展经济发达。' }
    ],
    attractions: [
      { nameZh: '勃兰登堡门', nameEn: 'Brandenburg Gate', image: img('Brandenburg Gate Berlin'), description: '柏林标志性建筑。' },
      { nameZh: '新天鹅堡', nameEn: 'Neuschwanstein Castle', image: img('Neuschwanstein Castle'), description: '德国著名城堡景点。' }
    ]
  },
  JPN: {
    iso3: 'JPN', iso2: 'JP', nameZh: '日本', nameEn: 'Japan', capitalZh: '东京', capitalEn: 'Tokyo', population: '约1.24亿', latitude: 35.7, longitude: 139.7,
    flagUrl: 'https://flagcdn.com/w320/jp.png', summary: '高端制造、汽车、电子、机器人和服务业发达。',
    cities: [
      { nameZh: '东京', nameEn: 'Tokyo', image: img('Tokyo skyline'), description: '亚洲重要金融与消费中心。' },
      { nameZh: '大阪', nameEn: 'Osaka', image: img('Osaka Japan'), description: '关西经济中心。' }
    ],
    attractions: [
      { nameZh: '富士山', nameEn: 'Mount Fuji', image: img('Mount Fuji Japan'), description: '日本代表性自然地标。' },
      { nameZh: '京都清水寺', nameEn: 'Kiyomizu Temple', image: img('Kiyomizu Temple Kyoto'), description: '京都著名历史景点。' }
    ]
  },
  IND: {
    iso3: 'IND', iso2: 'IN', nameZh: '印度', nameEn: 'India', capitalZh: '新德里', capitalEn: 'New Delhi', population: '约14.3亿', latitude: 28.6, longitude: 77.2,
    flagUrl: 'https://flagcdn.com/w320/in.png', summary: '人口规模庞大，信息技术服务、制药、制造业和消费市场增长显著。',
    cities: [
      { nameZh: '新德里', nameEn: 'New Delhi', image: img('New Delhi India'), description: '印度政治中心。' },
      { nameZh: '孟买', nameEn: 'Mumbai', image: img('Mumbai India'), description: '金融、影视和港口经济中心。' }
    ],
    attractions: [
      { nameZh: '泰姬陵', nameEn: 'Taj Mahal', image: img('Taj Mahal India'), description: '世界知名文化遗产。' },
      { nameZh: '斋浦尔', nameEn: 'Jaipur', image: img('Jaipur India'), description: '印度著名旅游城市。' }
    ]
  },
  GBR: {
    iso3: 'GBR', iso2: 'GB', nameZh: '英国', nameEn: 'United Kingdom', capitalZh: '伦敦', capitalEn: 'London', population: '约6700万', latitude: 51.5, longitude: -0.1,
    flagUrl: 'https://flagcdn.com/w320/gb.png', summary: '金融、教育、创意产业、生命科学和高端服务业发达。',
    cities: [
      { nameZh: '伦敦', nameEn: 'London', image: img('London skyline'), description: '全球金融与文化中心之一。' },
      { nameZh: '曼彻斯特', nameEn: 'Manchester', image: img('Manchester UK'), description: '工业历史与现代服务业并重。' }
    ],
    attractions: [
      { nameZh: '大本钟', nameEn: 'Big Ben', image: img('Big Ben London'), description: '伦敦经典地标。' },
      { nameZh: '巨石阵', nameEn: 'Stonehenge', image: img('Stonehenge UK'), description: '英国著名史前遗址。' }
    ]
  },
  FRA: {
    iso3: 'FRA', iso2: 'FR', nameZh: '法国', nameEn: 'France', capitalZh: '巴黎', capitalEn: 'Paris', population: '约6800万', latitude: 48.9, longitude: 2.3,
    flagUrl: 'https://flagcdn.com/w320/fr.png', summary: '制造业、航空航天、奢侈品、旅游和农业食品产业具有全球影响力。',
    cities: [
      { nameZh: '巴黎', nameEn: 'Paris', image: img('Paris Eiffel Tower'), description: '法国政治、文化与旅游中心。' },
      { nameZh: '里昂', nameEn: 'Lyon', image: img('Lyon France'), description: '工业、科研和美食城市。' }
    ],
    attractions: [
      { nameZh: '埃菲尔铁塔', nameEn: 'Eiffel Tower', image: img('Eiffel Tower Paris'), description: '法国最知名地标之一。' },
      { nameZh: '卢浮宫', nameEn: 'Louvre Museum', image: img('Louvre Museum Paris'), description: '世界著名博物馆。' }
    ]
  },
  ITA: {
    iso3: 'ITA', iso2: 'IT', nameZh: '意大利', nameEn: 'Italy', capitalZh: '罗马', capitalEn: 'Rome', population: '约5900万', latitude: 41.9, longitude: 12.5,
    flagUrl: 'https://flagcdn.com/w320/it.png', summary: '制造业、时尚、设计、旅游和高端消费品产业突出。',
    cities: [
      { nameZh: '罗马', nameEn: 'Rome', image: img('Rome Italy'), description: '历史文化与行政中心。' },
      { nameZh: '米兰', nameEn: 'Milan', image: img('Milan Italy'), description: '金融、时尚和设计中心。' }
    ],
    attractions: [
      { nameZh: '罗马斗兽场', nameEn: 'Colosseum', image: img('Colosseum Rome'), description: '古罗马文明代表性遗迹。' },
      { nameZh: '威尼斯', nameEn: 'Venice', image: img('Venice Italy'), description: '世界知名水城。' }
    ]
  },
  BRA: {
    iso3: 'BRA', iso2: 'BR', nameZh: '巴西', nameEn: 'Brazil', capitalZh: '巴西利亚', capitalEn: 'Brasília', population: '约2.16亿', latitude: -15.8, longitude: -47.9,
    flagUrl: 'https://flagcdn.com/w320/br.png', summary: '拉美重要经济体，农业、矿业、能源、制造业和服务业规模较大。',
    cities: [
      { nameZh: '圣保罗', nameEn: 'São Paulo', image: img('Sao Paulo Brazil'), description: '巴西金融和商业中心。' },
      { nameZh: '里约热内卢', nameEn: 'Rio de Janeiro', image: img('Rio de Janeiro'), description: '旅游和文化城市。' }
    ],
    attractions: [
      { nameZh: '基督像', nameEn: 'Christ the Redeemer', image: img('Christ the Redeemer Brazil'), description: '里约热内卢地标。' },
      { nameZh: '亚马孙雨林', nameEn: 'Amazon Rainforest', image: img('Amazon Rainforest'), description: '全球重要生态区域。' }
    ]
  },
  CAN: {
    iso3: 'CAN', iso2: 'CA', nameZh: '加拿大', nameEn: 'Canada', capitalZh: '渥太华', capitalEn: 'Ottawa', population: '约4000万', latitude: 45.4, longitude: -75.7,
    flagUrl: 'https://flagcdn.com/w320/ca.png', summary: '资源、能源、金融、科技、教育和服务业发达。',
    cities: [
      { nameZh: '多伦多', nameEn: 'Toronto', image: img('Toronto skyline'), description: '加拿大最大城市和金融中心。' },
      { nameZh: '温哥华', nameEn: 'Vancouver', image: img('Vancouver city'), description: '太平洋门户城市。' }
    ],
    attractions: [
      { nameZh: '尼亚加拉瀑布', nameEn: 'Niagara Falls', image: img('Niagara Falls Canada'), description: '北美著名自然景观。' },
      { nameZh: '班夫国家公园', nameEn: 'Banff National Park', image: img('Banff National Park'), description: '加拿大落基山旅游胜地。' }
    ]
  }
};

export function getCountryMeta(iso3: string) {
  return COUNTRY_META[iso3.toUpperCase()];
}

export function countryZh(iso3: string, fallback: string) {
  return getCountryMeta(iso3)?.nameZh ?? fallback;
}
