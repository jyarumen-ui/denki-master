export interface FormulaItem {
  id: string;
  category: string;
  name: string;
  formula: string;
  vars: string;
  description: string;
  example: string;
  exampleAnswer: string;
}

export interface RefSection {
  id: string;
  title: string;
  icon: string;
  rows: { label: string; value: string; note?: string; highlight?: boolean }[];
}

export const formulaItems: FormulaItem[] = [
  {
    id: 'f01',
    category: '基本公式',
    name: 'オームの法則（電圧）',
    formula: 'V = I × R',
    vars: 'V:電圧[V]　I:電流[A]　R:抵抗[Ω]',
    description: '電圧・電流・抵抗の最も基本的な関係式。',
    example: '抵抗10Ω、電流3Aのとき電圧は？',
    exampleAnswer: 'V = 3 × 10 = 30V',
  },
  {
    id: 'f02',
    category: '基本公式',
    name: 'オームの法則（電流）',
    formula: 'I = V ÷ R',
    vars: 'V:電圧[V]　I:電流[A]　R:抵抗[Ω]',
    description: '電圧を抵抗で割ると電流が求まる。',
    example: '100Vを25Ωの抵抗に加えたとき電流は？',
    exampleAnswer: 'I = 100 ÷ 25 = 4A',
  },
  {
    id: 'f03',
    category: '基本公式',
    name: 'オームの法則（抵抗）',
    formula: 'R = V ÷ I',
    vars: 'V:電圧[V]　I:電流[A]　R:抵抗[Ω]',
    description: '電圧を電流で割ると抵抗が求まる。',
    example: '200V、10Aのとき抵抗は？',
    exampleAnswer: 'R = 200 ÷ 10 = 20Ω',
  },
  {
    id: 'f04',
    category: '電力・電力量',
    name: '電力（基本）',
    formula: 'P = V × I',
    vars: 'P:電力[W]　V:電圧[V]　I:電流[A]',
    description: '電圧と電流の積が消費電力。',
    example: '100V、5Aの器具の消費電力は？',
    exampleAnswer: 'P = 100 × 5 = 500W',
  },
  {
    id: 'f05',
    category: '電力・電力量',
    name: '電力（電流と抵抗から）',
    formula: 'P = I² × R',
    vars: 'P:電力[W]　I:電流[A]　R:抵抗[Ω]',
    description: '電流の二乗と抵抗の積。ジュール熱の計算に使う。',
    example: '5A、8Ωの抵抗での消費電力は？',
    exampleAnswer: 'P = 5² × 8 = 25 × 8 = 200W',
  },
  {
    id: 'f06',
    category: '電力・電力量',
    name: '電力（電圧と抵抗から）',
    formula: 'P = V² ÷ R',
    vars: 'P:電力[W]　V:電圧[V]　R:抵抗[Ω]',
    description: '電圧と抵抗が分かれば電力が求まる。',
    example: '100V、500Wの電熱器の抵抗は？',
    exampleAnswer: 'R = V²/P = 10000/500 = 20Ω',
  },
  {
    id: 'f07',
    category: '電力・電力量',
    name: '電力量',
    formula: 'W = P × t',
    vars: 'W:電力量[Wh]　P:電力[W]　t:時間[h]',
    description: '電力（W）に使用時間（h）を掛けると電力量（Wh）。',
    example: '1kWの器具を3時間使った電力量は？',
    exampleAnswer: 'W = 1000 × 3 = 3000Wh = 3kWh',
  },
  {
    id: 'f08',
    category: '合成抵抗',
    name: '直列接続の合成抵抗',
    formula: 'R = R₁ + R₂ + R₃...',
    vars: 'R:合成抵抗[Ω]　R₁,R₂...:各抵抗[Ω]',
    description: '直列は単純に足し算。合成抵抗は各抵抗より必ず大きくなる。',
    example: '3Ωと7Ωの直列合成抵抗は？',
    exampleAnswer: 'R = 3 + 7 = 10Ω',
  },
  {
    id: 'f09',
    category: '合成抵抗',
    name: '並列接続の合成抵抗',
    formula: '1/R = 1/R₁ + 1/R₂',
    vars: 'R:合成抵抗[Ω]　R₁,R₂:各抵抗[Ω]',
    description: '並列は逆数の和。合成抵抗は各抵抗より必ず小さくなる。',
    example: '6Ωと3Ωの並列合成抵抗は？',
    exampleAnswer: '1/R = 1/6 + 1/3 = 1/6 + 2/6 = 3/6\nR = 6/3 = 2Ω',
  },
  {
    id: 'f10',
    category: '合成抵抗',
    name: '同じ抵抗2本の並列',
    formula: 'R = R₁ ÷ 2',
    vars: 'R:合成抵抗[Ω]　R₁:各抵抗[Ω]（同じ値）',
    description: '同じ抵抗を2本並列にすると抵抗は半分になる。',
    example: '4Ω×2本を並列にすると？',
    exampleAnswer: 'R = 4 ÷ 2 = 2Ω',
  },
  {
    id: 'f11',
    category: '交流回路',
    name: '最大値と実効値',
    formula: 'Vmax = √2 × Vrms ≈ 1.41 × Vrms',
    vars: 'Vmax:最大値[V]　Vrms:実効値[V]',
    description: '交流の実効値に√2（約1.414）を掛けると最大値（波高値）が求まる。',
    example: '実効値100Vの最大値は？',
    exampleAnswer: 'Vmax = 1.414 × 100 ≈ 141V',
  },
  {
    id: 'f12',
    category: '交流回路',
    name: '有効電力（単相）',
    formula: 'P = V × I × cosφ',
    vars: 'P:有効電力[W]　V:電圧[V]　I:電流[A]　cosφ:力率',
    description: '力率（cosφ）を掛けた実際に消費される電力。',
    example: '100V、10A、力率0.8のとき有効電力は？',
    exampleAnswer: 'P = 100 × 10 × 0.8 = 800W',
  },
  {
    id: 'f13',
    category: '電圧降下',
    name: '電圧降下（単相2線式）',
    formula: 'e = 2 × I × r × L',
    vars: 'e:電圧降下[V]　I:電流[A]　r:抵抗[Ω/m]　L:片道長さ[m]',
    description: '往復2本分なので×2。rはΩ/m単位の電線抵抗。',
    example: 'I=10A、r=0.1Ω/m、L=20mのとき電圧降下は？',
    exampleAnswer: 'e = 2 × 10 × 0.1 × 20 = 40V',
  },
  {
    id: 'f14',
    category: '変圧器',
    name: '変圧器の電圧比',
    formula: 'V₁/V₂ = N₁/N₂',
    vars: 'V₁:一次電圧　V₂:二次電圧　N₁:一次巻数　N₂:二次巻数',
    description: '電圧比は巻数比に等しい。',
    example: 'N₁=100回、N₂=200回、V₁=100Vのとき二次電圧は？',
    exampleAnswer: 'V₂ = 100 × (200/100) = 200V',
  },
  {
    id: 'f15',
    category: '変圧器',
    name: '変圧器の電流比',
    formula: 'I₁/I₂ = N₂/N₁ = V₂/V₁',
    vars: 'I₁:一次電流　I₂:二次電流（電流比は巻数比の逆）',
    description: '電流比は電圧比の逆（一次×一次=二次×二次が成立）。',
    example: 'V₁=200V、V₂=100V、I₁=2Aのとき二次電流は？',
    exampleAnswer: 'V₁I₁ = V₂I₂ → 200×2 = 100×I₂\nI₂ = 400/100 = 4A',
  },
];

export const refSections: RefSection[] = [
  {
    id: 'r01',
    title: '接地工事の種類と接地抵抗値',
    icon: '⚡',
    rows: [
      { label: 'A種接地', value: '10Ω以下', note: '高圧・特高用機器の外箱', highlight: true },
      { label: 'B種接地', value: '計算値', note: '変圧器の低圧側中性点' },
      { label: 'C種接地', value: '10Ω以下', note: '300V超の低圧機器外箱', highlight: true },
      { label: 'D種接地', value: '100Ω以下', note: '300V以下の機器外箱（最頻出）', highlight: true },
      { label: 'D種（漏電遮断器あり）', value: '500Ω以下', note: '0.5秒以内に動作する漏電遮断器設置時' },
    ],
  },
  {
    id: 'r02',
    title: '絶縁抵抗の最小値',
    icon: '📊',
    rows: [
      { label: '対地電圧150V以下', value: '0.1MΩ以上', note: '一般家庭回路など', highlight: true },
      { label: '対地電圧300V以下', value: '0.2MΩ以上', note: '200V回路など' },
      { label: '対地電圧300V超', value: '0.4MΩ以上', note: '高圧受電建物の低圧回路' },
      { label: '測定器', value: '絶縁抵抗計（メガー）', note: 'MΩ単位で測定' },
    ],
  },
  {
    id: 'r03',
    title: 'IV電線の許容電流（空中・単独）',
    icon: '🔌',
    rows: [
      { label: 'IV 1.6mm', value: '27A', note: '最頻出の値', highlight: true },
      { label: 'IV 2.0mm', value: '35A', note: '次によく出る', highlight: true },
      { label: 'IV 2.6mm', value: '48A', note: '' },
      { label: 'IV 3.2mm', value: '62A', note: '' },
      { label: '管路内3本収容', value: '×0.70', note: '複数本収容時は補正係数を掛ける' },
      { label: '管路内4本収容', value: '×0.63', note: '' },
    ],
  },
  {
    id: 'r04',
    title: 'リングスリーブ選択ガイド',
    icon: '🔧',
    rows: [
      { label: '1.6mm × 2本', value: '小スリーブ・刻印○', highlight: true },
      { label: '1.6mm × 3〜4本', value: '小スリーブ・刻印小', highlight: true },
      { label: '2.0mm × 2本', value: '小スリーブ・刻印小', highlight: true },
      { label: '1.6mm × 5本〜 / 2.0mm × 3〜4本', value: '中スリーブ・刻印中' },
      { label: '2.0mm × 5本〜 / 2.6mm含む多本', value: '大スリーブ・刻印大' },
      { label: '注意', value: '刻印は圧着後に必ず確認！', note: '刻印ミスは重大欠陥' },
    ],
  },
  {
    id: 'r05',
    title: '支持間隔（電線管・ケーブル）',
    icon: '📐',
    rows: [
      { label: 'VVFケーブル（面に沿う）', value: '2m以下', highlight: true },
      { label: '硬質合成樹脂管（VE管）', value: '1.5m以下', highlight: true },
      { label: '金属管（E管・C管）', value: '2m以下' },
      { label: '金属可とう電線管', value: '1m以下' },
      { label: '電線管内電線充填率', value: '40%以下', note: '管内断面積に対する電線断面積の総和' },
    ],
  },
  {
    id: 'r06',
    title: '電気工事士法 主要規定',
    icon: '📋',
    rows: [
      { label: '第二種免状の交付', value: '都道府県知事', highlight: true },
      { label: '第一種免状の交付', value: '経済産業大臣' },
      { label: '第二種の作業範囲', value: '一般用電気工作物', note: '低圧受電の住宅・店舗等' },
      { label: '軽微な工事（資格不要）', value: '電球交換・ヒューズ交換等', highlight: true },
      { label: '免状の携帯', value: '作業中は常に携帯義務', note: '提示を求められた場合は提示' },
      { label: '住所変更の届出', value: '免状交付の都道府県知事へ', note: '変更後すみやかに' },
    ],
  },
  {
    id: 'r07',
    title: '低圧の区分',
    icon: '⚡',
    rows: [
      { label: '低圧（交流）', value: '600V以下', highlight: true },
      { label: '低圧（直流）', value: '750V以下', highlight: true },
      { label: '高圧（交流）', value: '600V超〜7000V以下' },
      { label: '特別高圧', value: '7000V超' },
      { label: '一般家庭の電圧', value: '単相100V・200V', note: '低圧の一般用電気工作物' },
    ],
  },
  {
    id: 'r08',
    title: '漏電遮断器・過電流遮断器',
    icon: '🛡️',
    rows: [
      { label: '漏電遮断器（高感度形）', value: '30mA以下・0.1秒以内', highlight: true },
      { label: '配線用遮断器（15A分岐）', value: '1.6mm以上の電線', highlight: true },
      { label: '配線用遮断器（20A分岐）', value: '2.0mm以上の電線' },
      { label: '電線の最小断面積', value: '1.25mm²（1.6mm相当）', note: '屋内配線の原則' },
    ],
  },
];
