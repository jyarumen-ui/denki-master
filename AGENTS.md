# AGENTS.md — Codex Instructions（denki-master）

## 役割
実装担当。Claude からplan.mdを受け取り実装する。

## 担当領域
- React Nativeコンポーネント実装
- Expoスクリーン作成
- AsyncStorageデータ管理
- TypeScript型定義

## 作業ルール
- any型禁止
- コメントは日本語
- コンポーネント200行以内

## タスク処理フロー
1. plan.md受け取り
2. 実装
3. `npx expo start --web` で動作確認
4. 変更ファイルと結果のみ報告
