# denki-master — プロジェクト設定

## プロジェクト概要
電気工事マスターアプリ。React Native (Expo) + TypeScript。
電気工事の学習・資格取得支援モバイルアプリ。

## 技術スタック
- React Native + Expo ~54.0.33
- TypeScript ~5.9.2
- React Navigation（底部タブナビゲーション）
- AsyncStorage（ローカルデータ永続化）
- react-native-chart-kit（グラフ）

## 開発ルール
- コメントは日本語
- TypeScriptのany型禁止
- コンポーネントは200行以内

## よく使うコマンド
```bash
npx expo start          # 開発サーバー起動
npx expo start --web    # Web版起動
npx expo start --android
```

## トークン節約ワークフロー
- 計画（plan.md） → Claude
- 実装 → `/codex:rescue plan.md`
- レビュー → `/codex:review`
- 完了後 → `/clear`

## 絶対にやってはいけないこと
- APIキーをコードにハードコード
- any型の使用
