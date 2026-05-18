export type SkillDifficulty = 'easy' | 'normal' | 'hard';

export interface SkillStep {
  step: number;
  title: string;
  description: string;
  caution?: string;
}

export interface CandidateProblem {
  id: number;
  title: string;
  description: string;
  timeMinutes: number;
  difficulty: SkillDifficulty;
  steps: SkillStep[];
  checklist: string[];
}

export const DIFFICULTY_LABELS: Record<SkillDifficulty, string> = {
  easy: '易しい',
  normal: '普通',
  hard: '難しい',
};

export const DIFFICULTY_COLORS: Record<SkillDifficulty, string> = {
  easy: '#4CAF50',
  normal: '#FF9800',
  hard: '#F44336',
};

export const candidateProblems: CandidateProblem[] = [
  {
    id: 1,
    title: '候補問題 No.1',
    description: '単相3線式100/200V配線。引掛シーリング・コンセント・スイッチを含む基本的な回路。',
    timeMinutes: 40,
    difficulty: 'easy',
    steps: [
      { step: 1, title: '材料確認', description: 'ケーブル・器具の種類と数量を確認する', caution: '不足品・傷物がないかチェック' },
      { step: 2, title: '寸法取り', description: 'ケーブルを指定寸法にカットする', caution: '±50mm以内に収める' },
      { step: 3, title: 'シース剥き', description: 'ケーブルのシースを指定長さだけ剥く', caution: '絶縁被覆を傷つけないよう注意' },
      { step: 4, title: '絶縁被覆剥き', description: '各電線の絶縁被覆を20mm程度剥く', caution: '心線に傷をつけない' },
      { step: 5, title: '器具への接続', description: 'スイッチ・コンセント・引掛シーリングに電線を接続', caution: '極性（接地側・非接地側）を確認' },
      { step: 6, title: 'リングスリーブ圧着', description: '接続部をリングスリーブで圧着する', caution: '指定スリーブサイズと刻印を確認' },
      { step: 7, title: '最終確認', description: '回路が正しく接続されているかチェックリストで確認', caution: '接続忘れ・極性ミスがないか確認' },
    ],
    checklist: [
      'ケーブルの寸法が指定範囲内',
      'シースの剥き長さが適切',
      '絶縁被覆の剥き長さが適切（20mm程度）',
      'スイッチの接続が正しい',
      'コンセントの極性が正しい（W端子→白線）',
      '引掛シーリングの極性が正しい',
      'リングスリーブのサイズと刻印が正しい',
      '心線が機器から飛び出していない',
    ],
  },
  {
    id: 2,
    title: '候補問題 No.2',
    description: '単相3線式100/200V。3路スイッチによる2か所点滅回路を含む。',
    timeMinutes: 40,
    difficulty: 'normal',
    steps: [
      { step: 1, title: '材料確認', description: '3路スイッチを含む材料確認', caution: '3路スイッチの向きを確認' },
      { step: 2, title: '寸法取り・カット', description: '各ケーブルを指定寸法にカット' },
      { step: 3, title: 'シース・被覆剥き', description: 'シースと絶縁被覆を剥く', caution: '心線に傷をつけない' },
      { step: 4, title: '3路スイッチ接続', description: '3路スイッチの0番・1番・3番端子に正しく接続', caution: '0番端子（共通）の接続を間違えない' },
      { step: 5, title: '渡り線の作成', description: '3路スイッチ間の渡り線を作成・接続' },
      { step: 6, title: '負荷側接続', description: 'ランプレセプタクル・コンセントに接続', caution: '極性を確認' },
      { step: 7, title: '圧着と最終確認', description: 'リングスリーブ圧着後、全体を確認' },
    ],
    checklist: [
      '3路スイッチの0番端子に正しい電線が接続されている',
      '3路スイッチの1番・3番端子に渡り線が接続されている',
      'ランプレセプタクルの口金側にW（白）線が接続されている',
      'リングスリーブのサイズが正しい',
      '各寸法が指定範囲内',
      '接続部の心線の露出が適切',
    ],
  },
  {
    id: 3,
    title: '候補問題 No.3',
    description: '単相2線式100V。コンセント・スイッチ・ランプレセプタクルの組み合わせ。',
    timeMinutes: 40,
    difficulty: 'easy',
    steps: [
      { step: 1, title: '材料確認', description: '支給材料の確認と配置' },
      { step: 2, title: 'ケーブル加工', description: '寸法に合わせてカット・シース剥き' },
      { step: 3, title: '被覆剥き', description: '各電線の絶縁被覆を剥く' },
      { step: 4, title: 'コンセント接続', description: 'W・非W端子に正しく接続', caution: '極性を間違えない' },
      { step: 5, title: 'スイッチ接続', description: 'スイッチに電線を接続' },
      { step: 6, title: 'ランプレセプタクル接続', description: '受け口（口金側）にW線を接続', caution: '口金側はW端子（接地側）' },
      { step: 7, title: '接続と確認', description: 'リングスリーブ圧着・全体確認' },
    ],
    checklist: [
      'コンセントのW端子に白線が接続',
      'ランプレセプタクル口金にW線が接続',
      '各寸法が適切',
      'リングスリーブ刻印が正しい',
      '絶縁被覆の剥き代が適切',
    ],
  },
  {
    id: 4,
    title: '候補問題 No.4',
    description: '単相3線式100/200V。200Vコンセントと100Vコンセントが混在する回路。',
    timeMinutes: 40,
    difficulty: 'normal',
    steps: [
      { step: 1, title: '材料確認', description: '200V・100Vコンセントの確認' },
      { step: 2, title: 'ケーブル加工', description: '各部のケーブルカット・加工' },
      { step: 3, title: '200Vコンセント接続', description: '2線（非接地側2本）を接続', caution: '200Vコンセントに接地側を接続しない' },
      { step: 4, title: '100Vコンセント接続', description: 'W・非W端子に接続' },
      { step: 5, title: 'ジョイントボックス内接続', description: '電線相互をリングスリーブで圧着' },
      { step: 6, title: '最終確認', description: '各接続と極性を確認' },
    ],
    checklist: [
      '200Vコンセントの接続が正しい',
      '100Vコンセントの極性が正しい',
      'リングスリーブのサイズが正しい',
      '各ケーブル寸法が適切',
    ],
  },
  {
    id: 5,
    title: '候補問題 No.5',
    description: '単相2線式100V。タイムスイッチを含む自動点滅回路。',
    timeMinutes: 40,
    difficulty: 'normal',
    steps: [
      { step: 1, title: '材料確認', description: 'タイムスイッチを含む材料確認' },
      { step: 2, title: 'ケーブル加工', description: 'ケーブルのカット・シース剥き' },
      { step: 3, title: 'タイムスイッチ接続', description: '端子番号を確認して接続', caution: '端子の番号（S・L・N等）を確認' },
      { step: 4, title: '負荷接続', description: '器具への配線' },
      { step: 5, title: '接続・確認', description: '全体の接続確認' },
    ],
    checklist: [
      'タイムスイッチの端子接続が正しい',
      '各寸法が適切',
      '絶縁被覆の剥き代が適切',
    ],
  },
  {
    id: 6,
    title: '候補問題 No.6',
    description: '単相3線式。リモコンリレーを使った回路。',
    timeMinutes: 40,
    difficulty: 'hard',
    steps: [
      { step: 1, title: '材料確認', description: 'リモコンリレー・リモコンスイッチの確認' },
      { step: 2, title: 'ケーブル加工', description: '各部のケーブル加工' },
      { step: 3, title: 'リモコンリレー接続', description: '制御回路・主回路を正しく接続', caution: '制御線と主回路を混同しない' },
      { step: 4, title: 'リモコンスイッチ接続', description: 'スイッチ端子に正しく接続' },
      { step: 5, title: '負荷接続', description: '照明器具への配線' },
      { step: 6, title: '最終確認', description: '全体の接続と配線を確認' },
    ],
    checklist: [
      'リモコンリレーの制御回路が正しい',
      'リモコンスイッチの接続が正しい',
      '主回路と制御回路が混在していない',
      '各寸法が適切',
    ],
  },
  {
    id: 7,
    title: '候補問題 No.7',
    description: '単相3線式。露出形コンセントと埋込形コンセントを含む回路。',
    timeMinutes: 40,
    difficulty: 'easy',
    steps: [
      { step: 1, title: '材料確認', description: '露出・埋込コンセントの確認' },
      { step: 2, title: 'ケーブル加工', description: 'ケーブルのカット・加工' },
      { step: 3, title: 'コンセント接続', description: '各コンセントに正しく接続', caution: '露出・埋込で端子の向きが異なる場合あり' },
      { step: 4, title: 'ジョイント部接続', description: 'リングスリーブで圧着' },
      { step: 5, title: '最終確認', description: '全体の接続確認' },
    ],
    checklist: [
      '各コンセントの極性が正しい',
      'リングスリーブのサイズが正しい',
      '各寸法が適切',
    ],
  },
  {
    id: 8,
    title: '候補問題 No.8',
    description: '単相2線式100V。パイロットランプ（確認表示灯）を含む回路。',
    timeMinutes: 40,
    difficulty: 'normal',
    steps: [
      { step: 1, title: '材料確認', description: 'パイロットランプを含む材料確認' },
      { step: 2, title: 'ケーブル加工', description: 'ケーブルの加工' },
      { step: 3, title: 'パイロットランプ接続', description: '同時点滅・常時点灯・異時点滅を確認して接続', caution: '接続方法によって動作が変わる' },
      { step: 4, title: 'スイッチ・負荷接続', description: '各器具への接続' },
      { step: 5, title: '圧着・確認', description: '全体の確認' },
    ],
    checklist: [
      'パイロットランプの接続方式が指定通り（同時/常時/異時）',
      'スイッチの接続が正しい',
      '各寸法が適切',
    ],
  },
  {
    id: 9,
    title: '候補問題 No.9',
    description: '単相3線式100/200V。三相負荷なし。自動点滅器（光センサー）を含む。',
    timeMinutes: 40,
    difficulty: 'normal',
    steps: [
      { step: 1, title: '材料確認', description: '自動点滅器を含む材料確認' },
      { step: 2, title: 'ケーブル加工', description: 'ケーブルの加工' },
      { step: 3, title: '自動点滅器接続', description: '端子（1・2・3）を確認して接続', caution: '端子番号を間違えない' },
      { step: 4, title: '負荷接続', description: '照明器具への配線' },
      { step: 5, title: '最終確認', description: '全体の確認' },
    ],
    checklist: [
      '自動点滅器の端子接続が正しい',
      '各寸法が適切',
      'リングスリーブの刻印が正しい',
    ],
  },
  {
    id: 10,
    title: '候補問題 No.10',
    description: '単相3線式100/200V。電力量計・分岐回路を含む複雑な回路。',
    timeMinutes: 40,
    difficulty: 'hard',
    steps: [
      { step: 1, title: '材料確認', description: '電力量計を含む材料確認' },
      { step: 2, title: '回路図確認', description: '分岐回路の構成を理解する', caution: '複数の分岐を混同しない' },
      { step: 3, title: 'ケーブル加工', description: '各部のケーブル加工' },
      { step: 4, title: '各器具への接続', description: '電力量計・分岐回路の各器具に接続' },
      { step: 5, title: 'ジョイント部圧着', description: '接続点をリングスリーブで圧着' },
      { step: 6, title: '最終確認', description: '回路全体の確認' },
    ],
    checklist: [
      '電力量計の接続が正しい',
      '各分岐回路の接続が正しい',
      'リングスリーブのサイズが正しい',
      '各寸法が適切',
      '極性の誤りがない',
    ],
  },
  {
    id: 11,
    title: '候補問題 No.11',
    description: '単相2線式100V。金属管工事を含む回路。',
    timeMinutes: 40,
    difficulty: 'hard',
    steps: [
      { step: 1, title: '材料確認', description: '金属管・ロックナット等の確認' },
      { step: 2, title: '金属管の加工', description: '金属管をパイプカッターでカット', caution: '切断後は必ずリーマーでバリ除去' },
      { step: 3, title: '金属管の曲げ', description: 'ベンダーで正確に曲げる（必要な場合）' },
      { step: 4, title: '電線の通線', description: '金属管に電線を通す', caution: '電線の被覆を傷つけない' },
      { step: 5, title: '器具への接続', description: 'コンセント・スイッチへの接続' },
      { step: 6, title: 'アウトレットボックス取付', description: 'ロックナットでしっかり固定' },
      { step: 7, title: '最終確認', description: '全体の確認' },
    ],
    checklist: [
      '金属管の切断面にバリがない',
      'ロックナットが適切に締まっている',
      '電線の被覆に傷がない',
      '各寸法が適切',
      'アウトレットボックスの取付が適切',
    ],
  },
  {
    id: 12,
    title: '候補問題 No.12',
    description: '単相3線式。合成樹脂管工事（PF管）を含む回路。',
    timeMinutes: 40,
    difficulty: 'normal',
    steps: [
      { step: 1, title: '材料確認', description: 'PF管・カップリング等の確認' },
      { step: 2, title: 'PF管の加工', description: 'PF管を必要な長さにカット' },
      { step: 3, title: '電線の通線', description: 'PF管に電線を通す' },
      { step: 4, title: 'カップリング取付', description: 'PF管の接続部にカップリングを取り付ける' },
      { step: 5, title: '器具への接続', description: '各器具への配線・接続' },
      { step: 6, title: '最終確認', description: '全体確認' },
    ],
    checklist: [
      'PF管の長さが適切',
      'カップリングの取付が適切',
      '電線の被覆に傷がない',
      '各器具の接続が正しい',
    ],
  },
  {
    id: 13,
    title: '候補問題 No.13',
    description: '単相3線式100/200V。4路スイッチを含む3か所点滅回路（最高難度）。',
    timeMinutes: 40,
    difficulty: 'hard',
    steps: [
      { step: 1, title: '材料確認', description: '4路スイッチ・3路スイッチを確認', caution: '4路と3路を混同しない' },
      { step: 2, title: '回路図の理解', description: '3か所点滅の回路構成を理解する', caution: '電線の接続順序を確認' },
      { step: 3, title: 'ケーブル加工', description: '各部のケーブルカット・加工' },
      { step: 4, title: '3路スイッチ接続', description: '入口・出口の3路スイッチを接続', caution: '0番端子の接続を間違えない' },
      { step: 5, title: '4路スイッチ接続', description: '中間の4路スイッチを接続', caution: '4路スイッチの端子（1・2・3・4）を確認' },
      { step: 6, title: '負荷側接続', description: 'ランプレセプタクル等に接続' },
      { step: 7, title: '圧着・最終確認', description: '全体の回路を確認' },
    ],
    checklist: [
      '3路スイッチの0番端子の接続が正しい',
      '4路スイッチの端子接続が正しい',
      '3路→4路→3路の順序で正しく接続',
      'ランプレセプタクルの口金にW線が接続',
      '各寸法が適切',
      'リングスリーブのサイズと刻印が正しい',
    ],
  },
];

export const defects = {
  major: [
    '回路の誤り（短絡・断線・未接続）',
    '極性の誤り（接地側・非接地側の逆接続）',
    'ランプレセプタクル口金への非接地側接続',
    '電線の接続忘れ',
    '規定外の工事方法の使用',
    '配線器具の破損',
    '接地線の未接続',
  ],
  minor: [
    'ケーブル外装の剥き長さが規定外（10mm以上の誤差）',
    '絶縁被覆の剥き代が規定外（20mm±3mm以外）',
    'ケーブル長さが指定の±50%を超える',
    '絶縁被覆のキズ・断線寸前の状態',
    'ランプレセプタクル・露出型コンセントのネジ締め不足',
    'リングスリーブの心線が1本以上飛び出ている',
    '差込コネクタへの差し込み不足',
  ],
};
