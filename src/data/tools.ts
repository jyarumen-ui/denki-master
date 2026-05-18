export type ToolCategory = 'measurement' | 'cutting' | 'wiring' | 'safety';
export type ExamFrequency = 'high' | 'medium' | 'low';

export interface Tool {
  id: string;
  name: string;
  nameEn: string;
  category: ToolCategory;
  description: string;
  usageTips: string[];
  examFrequency: ExamFrequency;
  emoji: string;
  imageUrl?: string;
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  measurement: '測定器具',
  cutting: '切断工具',
  wiring: '配線工具',
  safety: '安全用具',
};

export const CATEGORY_COLORS: Record<ToolCategory, string> = {
  measurement: '#2196F3',
  cutting: '#F44336',
  wiring: '#FF9800',
  safety: '#4CAF50',
};

export const FREQUENCY_LABELS: Record<ExamFrequency, string> = {
  high: '頻出',
  medium: '中程度',
  low: '低頻度',
};

export const FREQUENCY_COLORS: Record<ExamFrequency, string> = {
  high: '#F44336',
  medium: '#FF9800',
  low: '#4CAF50',
};

export const tools: Tool[] = [
  {
    id: 't01',
    name: 'ペンチ',
    nameEn: 'Combination Pliers',
    category: 'wiring',
    description:
      '電線を曲げたり切断したり、接続部を締め付けるために使う基本工具です。リングスリーブの仮止めや配線作業全般で活躍します。',
    usageTips: [
      '力を入れすぎると電線の被覆を傷つける',
      '切断はニッパーに任せ、ペンチは曲げ・掴みに使う',
      '使用後は刃部分を拭いて錆を防ぐ',
    ],
    examFrequency: 'high',
    emoji: '🔧',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Combination_pliers.jpg/320px-Combination_pliers.jpg',
  },
  {
    id: 't02',
    name: 'リングスリーブ圧着ペンチ',
    nameEn: 'Compression Crimping Pliers',
    category: 'wiring',
    description:
      'リングスリーブを正しく圧着するための専用工具です。技能試験の必須工具で、サイズごとに刻印（○・小・中・大）が異なります。',
    usageTips: [
      'スリーブサイズに合ったダイスを選ぶ',
      '完全に握り切るまで力を入れる',
      '刻印が正しく入っているか確認する',
    ],
    examFrequency: 'high',
    emoji: '🔩',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Crimping_tool_2009_G2.jpg/320px-Crimping_tool_2009_G2.jpg',
  },
  {
    id: 't03',
    name: 'ニッパー',
    nameEn: 'Wire Nippers',
    category: 'cutting',
    description:
      '電線や細い金属線を切断するための工具です。ペンチより細かい切断作業に向いています。リード線の仕上げカットに使います。',
    usageTips: [
      '刃を閉じて切ると断面がきれいに仕上がる',
      '太い電線には使わず適切な工具を選ぶ',
      '刃の角度を垂直に保つと切断精度が上がる',
    ],
    examFrequency: 'medium',
    emoji: '✂️',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/End-cutting-pliers.jpg/320px-End-cutting-pliers.jpg',
  },
  {
    id: 't04',
    name: 'ウォーターポンプフライヤー',
    nameEn: 'Water Pump Pliers',
    category: 'wiring',
    description:
      '金属管（ねじなし電線管）の取り付けやロックナットの締め付けに使う工具です。口の開き幅を調整できます。',
    usageTips: [
      '口幅をパイプ径に合わせて調整する',
      '傷防止のために布などを挟む場合もある',
      '過度な力は管を変形させる恐れがある',
    ],
    examFrequency: 'high',
    emoji: '🔧',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Waterpump_pliers.jpg/320px-Waterpump_pliers.jpg',
  },
  {
    id: 't05',
    name: '電工ナイフ',
    nameEn: "Electrician's Knife",
    category: 'cutting',
    description:
      'ケーブルの外装（シース）を剥くための専用ナイフです。刃先が折れ曲がらない構造で、安全に絶縁被覆を剥くことができます。',
    usageTips: [
      '刃を立てすぎると心線に傷がつく',
      '電線を回転させながら軽く切り込む',
      '使用後は刃を収納して安全に保管する',
    ],
    examFrequency: 'high',
    emoji: '🔪',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Lineman%27s_utility_knife.jpg/320px-Lineman%27s_utility_knife.jpg',
  },
  {
    id: 't06',
    name: 'VVFストリッパー',
    nameEn: 'VVF Cable Stripper',
    category: 'wiring',
    description:
      'VVFケーブル（平形ビニル絶縁ビニルシースケーブル）の被覆を素早く剥くための専用工具です。技能試験の時間短縮に欠かせません。',
    usageTips: [
      'ケーブルをまっすぐにして差し込む',
      '握り込む力を均一にすると仕上がりがきれい',
      '電線の太さ（1.6mm / 2.0mm）に対応したスリットを使う',
    ],
    examFrequency: 'high',
    emoji: '⚡',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Wire_stripper.jpg/320px-Wire_stripper.jpg',
  },
  {
    id: 't07',
    name: 'スケール（メジャー）',
    nameEn: 'Measuring Tape',
    category: 'measurement',
    description:
      '電線の長さや器具取付位置の寸法を計測する工具です。技能試験では各部の寸法指定があるため正確な計測が必要です。',
    usageTips: [
      '1回の計測で複数箇所をまとめてマークする',
      '試験では寸法が±50%以内に収まれば合格',
      'コンベックスタイプが使いやすい',
    ],
    examFrequency: 'high',
    emoji: '📏',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Tape_measure.jpg/320px-Tape_measure.jpg',
  },
  {
    id: 't08',
    name: 'プラスドライバー',
    nameEn: 'Phillips Screwdriver',
    category: 'wiring',
    description:
      'スイッチ・コンセントの端子ネジや器具取付ネジを締め付ける工具です。No.2サイズが電気工事では標準的です。',
    usageTips: [
      'ネジに対してまっすぐに押し付けながら回す',
      'カムアウト（空回り）防止にネジ穴と合ったサイズを選ぶ',
      '試験では端子ねじの締め忘れに注意',
    ],
    examFrequency: 'high',
    emoji: '🪛',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Phillips_screwdriver.jpg/320px-Phillips_screwdriver.jpg',
  },
  {
    id: 't09',
    name: 'マイナスドライバー',
    nameEn: 'Flathead Screwdriver',
    category: 'wiring',
    description:
      '端子台の端子ネジや差込形コネクタの解除レバーを操作するときに使います。先端幅5.5mm程度が一般的です。',
    usageTips: [
      '差込形コネクタの解除は先端を差し込み口に押し込む',
      '端子台の締め付けに使うことが多い',
      '先端が摩耗したら研いで使う',
    ],
    examFrequency: 'high',
    emoji: '🪛',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flat_head_screwdrivers.jpg/320px-Flat_head_screwdrivers.jpg',
  },
  {
    id: 't10',
    name: '検電器',
    nameEn: 'Voltage Tester',
    category: 'measurement',
    description:
      '電線や端子に電圧がかかっているかを確認する安全器具です。非接触型と接触型があり、作業前の感電防止に必須です。',
    usageTips: [
      '必ず電源OFF後に使用するが、切り忘れの確認にも使う',
      '先端を電線や端子に近づけると反応する',
      '電池の残量を定期的に確認する',
    ],
    examFrequency: 'medium',
    emoji: '🔦',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Voltage_tester.jpg/320px-Voltage_tester.jpg',
  },
  {
    id: 't11',
    name: 'クランプメーター',
    nameEn: 'Clamp Meter',
    category: 'measurement',
    description:
      '電線を挟み込んで電流値を測定する計器です。回路を切断せずに測定できるため、保守点検作業で広く使われます。',
    usageTips: [
      '電線1本だけをクランプで挟む（2本挟むと測定値が不正確）',
      'ゼロ調整（AC/DCモード）を確認してから測定',
      '測定レンジを大きめに設定してから徐々に下げる',
    ],
    examFrequency: 'medium',
    emoji: '📊',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Fluke_325_clamp_meter.jpg/320px-Fluke_325_clamp_meter.jpg',
  },
  {
    id: 't12',
    name: 'テスター（回路計）',
    nameEn: 'Multimeter',
    category: 'measurement',
    description:
      '電圧・電流・抵抗を測定できる多機能計器です。導通確認や電圧測定など、電気工事の各場面で活用されます。',
    usageTips: [
      '測定前に機能（V・A・Ω）とレンジを正しく設定する',
      '抵抗測定は必ず電源OFFの状態で行う',
      'リード線の赤＋・黒－の極性を間違えない',
    ],
    examFrequency: 'medium',
    emoji: '📡',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Multimeter_hm.jpg/320px-Multimeter_hm.jpg',
  },
  {
    id: 't13',
    name: 'ホルソー',
    nameEn: 'Hole Saw',
    category: 'cutting',
    description:
      '分電盤や配電箱に穴を開けるための円形の切削工具です。電動ドリルに取り付けて使用します。',
    usageTips: [
      '穴のサイズに合ったビットを選ぶ',
      'センタードリルでガイド穴を先に開ける',
      '切削中は一定の速度と圧力を保つ',
    ],
    examFrequency: 'low',
    emoji: '⭕',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Hole_saw.jpg/320px-Hole_saw.jpg',
  },
  {
    id: 't14',
    name: '金属管ベンダー',
    nameEn: 'Conduit Bender',
    category: 'wiring',
    description:
      '金属管（薄鋼電線管・厚鋼電線管）を任意の角度に曲げる工具です。配管ルートに合わせた正確な曲げ加工ができます。',
    usageTips: [
      '管径に合ったベンダーヘッドを使う',
      'マークした位置にベンダーをセットし均一な力で曲げる',
      '90°曲げは目盛りを見ながら少しずつ調整する',
    ],
    examFrequency: 'medium',
    emoji: '📐',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Conduit_bender.jpg/320px-Conduit_bender.jpg',
  },
  {
    id: 't15',
    name: 'パイプカッター',
    nameEn: 'Pipe Cutter',
    category: 'cutting',
    description:
      '金属管を正確に切断するための工具です。刃を回転させながら切り込み、きれいな断面で切断できます。',
    usageTips: [
      '切り口に刃を当て少しずつ締めながら回転させる',
      '急いで締めすぎると管が変形する',
      '切断後は必ずリーマーで内面のバリを除去する',
    ],
    examFrequency: 'medium',
    emoji: '🔄',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Pipe-cutter-01.jpg/320px-Pipe-cutter-01.jpg',
  },
  {
    id: 't16',
    name: 'リーマー',
    nameEn: 'Pipe Reamer',
    category: 'wiring',
    description:
      'パイプカッターで金属管を切断した後に生じる内面のバリを除去する工具です。電線の被覆損傷を防ぐために必須です。',
    usageTips: [
      '切断面を数回こするだけでバリが取れる',
      'バリの除去が不十分だと欠陥になる',
      'パイプカッターとセットで携行する',
    ],
    examFrequency: 'medium',
    emoji: '🔨',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Hand_reamer.jpg/320px-Hand_reamer.jpg',
  },
  {
    id: 't17',
    name: 'ゴムハンマー',
    nameEn: 'Rubber Mallet',
    category: 'wiring',
    description:
      'ボックスや器具を傷つけずに打ち込むためのハンマーです。アウトレットボックスの取り付けやノック穴の打ち抜きに使います。',
    usageTips: [
      '金属製ハンマーが使えない場面で活躍',
      '力加減を調整しやすい',
      '打ち込む対象の材質に合わせて使う',
    ],
    examFrequency: 'low',
    emoji: '🔨',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Rubber_mallet.jpg/320px-Rubber_mallet.jpg',
  },
  {
    id: 't18',
    name: '絶縁手袋',
    nameEn: 'Insulating Gloves',
    category: 'safety',
    description:
      '活線作業時に感電から手を守るためのゴム製手袋です。電圧ランクに応じた適切な規格のものを選ぶ必要があります。',
    usageTips: [
      '使用前に膨らませてピンホールがないか確認',
      '外側に革手袋を重ねると耐久性が上がる',
      '定期的な耐電圧試験が義務付けられている',
    ],
    examFrequency: 'medium',
    emoji: '🧤',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Electrical_insulating_gloves.jpg/320px-Electrical_insulating_gloves.jpg',
  },
  {
    id: 't19',
    name: '安全帽（ヘルメット）',
    nameEn: 'Safety Helmet',
    category: 'safety',
    description:
      '落下物や頭部の衝突から保護するためのヘルメットです。電気工事現場では感電保護機能付きのものが必要です。',
    usageTips: [
      'あご紐をしっかり締めて使用する',
      '内部の緩衝材が劣化したら交換する',
      '電気工事用はABE種の表示を確認',
    ],
    examFrequency: 'low',
    emoji: '⛑️',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Safety_helmet.jpg/320px-Safety_helmet.jpg',
  },
  {
    id: 't20',
    name: '電工ベルト',
    nameEn: 'Tool Belt',
    category: 'safety',
    description:
      '工具類を腰に装着するためのベルトです。高所作業や手が届きにくい場所での作業時に工具を手元に確保できます。',
    usageTips: [
      '重量バランスを考えて工具を配置する',
      '安全帯との併用で落下防止になる',
      '工具の出し入れがしやすい位置に配置',
    ],
    examFrequency: 'low',
    emoji: '🎽',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Tool_belt.jpg/320px-Tool_belt.jpg',
  },
];
