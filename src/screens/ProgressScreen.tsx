import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { loadProgress, setExamDate, getQuizAccuracy, getQuizAccuracyByCategory } from '../storage/progress';
import { questions } from '../data/questions';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../data/questions';
import { colors, spacing, radius, fontSize } from '../theme';
import { useFocusEffect } from '@react-navigation/native';

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getDaysBetween(a: string, b: string): number {
  const da = new Date(a);
  const db = new Date(b);
  return Math.round(Math.abs(da.getTime() - db.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ProgressScreen() {
  const [progress, setProgress] = useState<Awaited<ReturnType<typeof loadProgress>> | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProgress().then(setProgress);
    }, [])
  );

  if (!progress) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.textSecondary }}>読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const accuracy = getQuizAccuracy(progress.quizHistory);
  const byCategory = getQuizAccuracyByCategory(progress.quizHistory, questions);
  const masteredRate = questions.length > 0 ? Math.round((progress.masteredCards.length / questions.length) * 100) : 0;
  const daysUntilExam = progress.examDate ? getDaysUntil(progress.examDate) : null;

  const handleSetExamDate = () => {
    // Simple date entry via Alert on mobile
    Alert.prompt(
      '試験日を設定',
      'YYYY-MM-DD 形式で入力してください',
      async (text) => {
        if (!text) {
          await setExamDate(null);
          loadProgress().then(setProgress);
          return;
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
          await setExamDate(text);
          loadProgress().then(setProgress);
        } else {
          Alert.alert('エラー', '正しい日付形式（YYYY-MM-DD）で入力してください');
        }
      },
      'plain-text',
      progress.examDate || ''
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 学習進捗</Text>
        <Text style={styles.headerSub}>あなたの学習状況</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Exam countdown */}
        <View style={[styles.card, styles.examCard]}>
          <View style={styles.examTop}>
            <Text style={styles.examLabel}>📅 試験日まで</Text>
            <TouchableOpacity onPress={Platform.OS === 'ios' ? handleSetExamDate : undefined} style={styles.setDateBtn}>
              <Text style={styles.setDateText}>{progress.examDate ? '変更' : '設定'}</Text>
            </TouchableOpacity>
          </View>
          {daysUntilExam !== null ? (
            <View style={styles.countdownRow}>
              <Text style={[styles.daysNum, { color: daysUntilExam <= 7 ? colors.danger : daysUntilExam <= 30 ? colors.warning : colors.accent }]}>
                {daysUntilExam}
              </Text>
              <Text style={styles.daysLabel}>日</Text>
            </View>
          ) : (
            <Text style={styles.noDateText}>試験日が設定されていません</Text>
          )}
          {progress.examDate && (
            <Text style={styles.examDateText}>{progress.examDate}</Text>
          )}
        </View>

        {/* Streak */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { flex: 1 }]}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statNum}>{progress.studyStreak}</Text>
            <Text style={styles.statLabel}>連続学習日数</Text>
          </View>
          <View style={[styles.statCard, { flex: 1 }]}>
            <Text style={styles.statEmoji}>⚡</Text>
            <Text style={styles.statNum}>{progress.masteredCards.length}</Text>
            <Text style={styles.statLabel}>習得カード数</Text>
          </View>
        </View>

        {/* Flash card progress */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📇 フラッシュカード習得率</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${masteredRate}%`, backgroundColor: colors.success }]} />
          </View>
          <Text style={styles.progressPercent}>{masteredRate}%</Text>
          <Text style={styles.progressDetail}>{progress.masteredCards.length} / {questions.length} 問習得</Text>
        </View>

        {/* Quiz accuracy */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📝 過去問 正解率</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${accuracy}%`, backgroundColor: colors.accent }]} />
          </View>
          <Text style={styles.progressPercent}>{accuracy}%</Text>
          <Text style={styles.progressDetail}>回答数: {progress.quizHistory.length} 問</Text>

          {/* By category */}
          {Object.keys(byCategory).length > 0 && (
            <View style={styles.categoryBreakdown}>
              {Object.entries(byCategory).map(([cat, data]) => {
                const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                return (
                  <View key={cat} style={styles.catRow}>
                    <View style={[styles.catDot, { backgroundColor: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] }]} />
                    <Text style={styles.catName}>{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}</Text>
                    <View style={styles.catBarBg}>
                      <View style={[styles.catBarFill, {
                        width: `${pct}%`,
                        backgroundColor: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS]
                      }]} />
                    </View>
                    <Text style={styles.catPct}>{pct}%</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Skills progress */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔌 技能問題 完了数</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, {
              width: `${Math.round((progress.skillsCompleted.length / 13) * 100)}%`,
              backgroundColor: colors.warning
            }]} />
          </View>
          <Text style={styles.progressPercent}>
            {Math.round((progress.skillsCompleted.length / 13) * 100)}%
          </Text>
          <Text style={styles.progressDetail}>{progress.skillsCompleted.length} / 13 問完了</Text>

          <View style={styles.skillGrid}>
            {Array.from({ length: 13 }, (_, i) => i + 1).map((n) => (
              <View key={n} style={progress.skillsCompleted.includes(n) ? [styles.skillDot, styles.skillDotDone] : styles.skillDot}>
                <Text style={progress.skillsCompleted.includes(n) ? [styles.skillDotText, styles.skillDotTextDone] : styles.skillDotText}>
                  {progress.skillsCompleted.includes(n) ? '✓' : n}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Motivation message */}
        <View style={[styles.card, styles.motivationCard]}>
          <Text style={styles.motivationText}>
            {masteredRate >= 80 && accuracy >= 80
              ? '🎉 素晴らしい！合格まであと少しです！'
              : masteredRate >= 50 || accuracy >= 50
              ? '📈 順調に進んでいます。継続しましょう！'
              : '💪 毎日少しずつ続けることが合格への近道です！'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  headerTitle: { color: colors.accent, fontSize: fontSize.xl, fontWeight: 'bold' },
  headerSub: { color: '#aaa', fontSize: fontSize.sm, marginTop: 2 },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 40 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  examCard: { borderLeftWidth: 4, borderLeftColor: colors.accent },
  examTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  examLabel: { fontSize: fontSize.md, fontWeight: 'bold', color: colors.text },
  setDateBtn: { backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  setDateText: { color: '#fff', fontSize: fontSize.xs, fontWeight: '700' },
  countdownRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  daysNum: { fontSize: 56, fontWeight: 'bold' },
  daysLabel: { fontSize: fontSize.xl, color: colors.text, fontWeight: '600' },
  noDateText: { fontSize: fontSize.md, color: colors.textSecondary, paddingVertical: spacing.md },
  examDateText: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
  statsRow: { flexDirection: 'row', gap: spacing.md },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statEmoji: { fontSize: 32, marginBottom: spacing.xs },
  statNum: { fontSize: 36, fontWeight: 'bold', color: colors.primary },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
  cardTitle: { fontSize: fontSize.md, fontWeight: 'bold', color: colors.text, marginBottom: spacing.md },
  progressBarBg: { height: 10, backgroundColor: colors.border, borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 5 },
  progressPercent: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.text, marginTop: spacing.xs },
  progressDetail: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  categoryBreakdown: { marginTop: spacing.md, gap: spacing.sm },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  catName: { width: 70, fontSize: fontSize.xs, color: colors.text },
  catBarBg: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  catBarFill: { height: '100%', borderRadius: 4 },
  catPct: { width: 36, fontSize: fontSize.xs, color: colors.textSecondary, textAlign: 'right' },
  skillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.md },
  skillDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillDotDone: { backgroundColor: colors.warning },
  skillDotText: { fontSize: fontSize.sm, fontWeight: 'bold', color: colors.textSecondary },
  skillDotTextDone: { color: '#fff' },
  motivationCard: { backgroundColor: colors.primary },
  motivationText: { fontSize: fontSize.md, color: '#fff', textAlign: 'center', lineHeight: 24 },
});
