import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  candidateProblems,
  CandidateProblem,
  defects,
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
} from '../data/skills';
import { loadProgress, markSkillCompleted } from '../storage/progress';
import { colors, spacing, radius, fontSize } from '../theme';

type View_ = 'list' | 'detail' | 'defects';

export default function SkillsScreen() {
  const [view, setView] = useState<View_>('list');
  const [selected, setSelected] = useState<CandidateProblem | null>(null);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [checklist, setChecklist] = useState<boolean[]>([]);

  useEffect(() => {
    loadProgress().then((p) => setCompletedIds(p.skillsCompleted));
  }, []);

  const openDetail = (problem: CandidateProblem) => {
    setSelected(problem);
    setChecklist(new Array(problem.checklist.length).fill(false));
    setView('detail');
  };

  const toggleCheck = (i: number) => {
    setChecklist((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const completeSkill = async () => {
    if (!selected) return;
    const updated = await markSkillCompleted(selected.id);
    setCompletedIds(updated.skillsCompleted);
  };

  const allChecked = checklist.every(Boolean);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {(view === 'detail' || view === 'defects') && (
            <TouchableOpacity onPress={() => setView('list')} style={styles.backBtn}>
              <Text style={styles.backBtnText}>← 戻る</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>🔌 技能対策</Text>
            <Text style={styles.headerSub}>
              {view === 'list'
                ? `候補問題 完了: ${completedIds.length} / 13問`
                : view === 'defects'
                ? '欠陥判定早見表'
                : selected?.title}
            </Text>
          </View>
          {view === 'list' && (
            <TouchableOpacity onPress={() => setView('defects')} style={styles.defectBtn}>
              <Text style={styles.defectBtnText}>欠陥表</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {view === 'list' && (
        <FlatList
          data={candidateProblems}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const done = completedIds.includes(item.id);
            return (
              <TouchableOpacity style={done ? [styles.problemCard, styles.problemCardDone] : styles.problemCard} onPress={() => openDetail(item)}>
                <View style={styles.problemLeft}>
                  <View style={[styles.problemNo, { backgroundColor: done ? colors.success : colors.primary }]}>
                    <Text style={styles.problemNoText}>{done ? '✓' : item.id}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.problemTitle}>{item.title}</Text>
                    <Text style={styles.problemDesc} numberOfLines={2}>{item.description}</Text>
                  </View>
                </View>
                <View style={styles.problemRight}>
                  <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLORS[item.difficulty] }]}>
                    <Text style={styles.diffBadgeText}>{DIFFICULTY_LABELS[item.difficulty]}</Text>
                  </View>
                  <Text style={styles.timeText}>⏱ {item.timeMinutes}分</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {view === 'detail' && selected && (
        <ScrollView contentContainerStyle={styles.detailContent}>
          <View style={styles.detailMeta}>
            <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLORS[selected.difficulty] }]}>
              <Text style={styles.diffBadgeText}>{DIFFICULTY_LABELS[selected.difficulty]}</Text>
            </View>
            <Text style={styles.timeText}>⏱ 目安 {selected.timeMinutes}分</Text>
          </View>

          <Text style={styles.problemDescFull}>{selected.description}</Text>

          <Text style={styles.sectionTitle}>📋 作業手順</Text>
          {selected.steps.map((step) => (
            <View key={step.step} style={styles.stepCard}>
              <View style={styles.stepNoCircle}>
                <Text style={styles.stepNoText}>{step.step}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.description}</Text>
                {step.caution && (
                  <View style={styles.cautionBox}>
                    <Text style={styles.cautionText}>⚠️ {step.caution}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}

          <Text style={styles.sectionTitle}>✅ 完了チェックリスト</Text>
          {selected.checklist.map((item, i) => (
            <TouchableOpacity key={i} style={styles.checkRow} onPress={() => toggleCheck(i)}>
              <View style={checklist[i] ? [styles.checkbox, styles.checkboxDone] : styles.checkbox}>
                {checklist[i] ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text style={checklist[i] ? [styles.checkText, styles.checkTextDone] : styles.checkText}>{item}</Text>
            </TouchableOpacity>
          ))}

          {allChecked && (
            <TouchableOpacity
              style={completedIds.includes(selected.id) ? [styles.completeBtn, styles.completeBtnDone] : styles.completeBtn}
              onPress={completeSkill}
            >
              <Text style={styles.completeBtnText}>
                {completedIds.includes(selected.id) ? '✓ 完了済み' : '🎉 完了としてマーク'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {view === 'defects' && (
        <ScrollView contentContainerStyle={styles.detailContent}>
          <View style={styles.defectSection}>
            <View style={[styles.defectHeader, { backgroundColor: colors.danger }]}>
              <Text style={styles.defectHeaderText}>🚨 重大欠陥（一発不合格）</Text>
            </View>
            {defects.major.map((d, i) => (
              <View key={i} style={styles.defectRow}>
                <Text style={styles.defectBullet}>●</Text>
                <Text style={styles.defectText}>{d}</Text>
              </View>
            ))}
          </View>

          <View style={styles.defectSection}>
            <View style={[styles.defectHeader, { backgroundColor: colors.warning }]}>
              <Text style={styles.defectHeaderText}>⚠️ 軽微な欠陥（複数で不合格）</Text>
            </View>
            {defects.minor.map((d, i) => (
              <View key={i} style={styles.defectRow}>
                <Text style={[styles.defectBullet, { color: colors.warning }]}>●</Text>
                <Text style={styles.defectText}>{d}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>💡 軽微な欠陥は1つで合格になることもありますが、同種が2か所以上または異種が複数あると不合格になります。</Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: colors.accent, fontSize: fontSize.xl, fontWeight: 'bold' },
  headerSub: { color: '#aaa', fontSize: fontSize.sm, marginTop: 2 },
  backBtn: { paddingRight: spacing.md, paddingVertical: 4 },
  backBtnText: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '600' },
  defectBtn: { backgroundColor: colors.danger, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 5 },
  defectBtnText: { color: '#fff', fontSize: fontSize.xs, fontWeight: '700' },
  listContent: { padding: spacing.md, gap: spacing.sm },
  problemCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  problemCardDone: { borderLeftWidth: 4, borderLeftColor: colors.success },
  problemLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, gap: spacing.md },
  problemNo: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  problemNoText: { color: '#fff', fontWeight: 'bold', fontSize: fontSize.md },
  problemTitle: { fontSize: fontSize.md, fontWeight: 'bold', color: colors.text },
  problemDesc: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2, lineHeight: 18 },
  problemRight: { alignItems: 'flex-end', gap: spacing.xs },
  diffBadge: { borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  diffBadgeText: { fontSize: fontSize.xs, color: '#fff', fontWeight: '700' },
  timeText: { fontSize: fontSize.xs, color: colors.textSecondary },
  detailContent: { padding: spacing.md, paddingBottom: 60, gap: spacing.md },
  detailMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  problemDescFull: { fontSize: fontSize.md, color: colors.text, lineHeight: 22 },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: 'bold', color: colors.primary, marginTop: spacing.sm },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  stepNoCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  stepNoText: { color: '#fff', fontWeight: 'bold', fontSize: fontSize.sm },
  stepTitle: { fontSize: fontSize.md, fontWeight: 'bold', color: colors.text },
  stepDesc: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2, lineHeight: 20 },
  cautionBox: { backgroundColor: colors.warning + '22', borderRadius: radius.sm, padding: spacing.sm, marginTop: spacing.xs },
  cautionText: { fontSize: fontSize.xs, color: colors.warning, fontWeight: '600' },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.md },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  checkboxDone: { backgroundColor: colors.success, borderColor: colors.success },
  checkmark: { color: '#fff', fontWeight: 'bold', fontSize: fontSize.sm },
  checkText: { flex: 1, fontSize: fontSize.sm, color: colors.text },
  checkTextDone: { color: colors.textSecondary, textDecorationLine: 'line-through' },
  completeBtn: { backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.md },
  completeBtnDone: { backgroundColor: colors.success },
  completeBtnText: { fontSize: fontSize.md, fontWeight: 'bold', color: colors.primary },
  defectSection: { borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.card },
  defectHeader: { padding: spacing.md },
  defectHeaderText: { color: '#fff', fontSize: fontSize.md, fontWeight: 'bold' },
  defectRow: { flexDirection: 'row', padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm },
  defectBullet: { color: colors.danger, fontSize: fontSize.md },
  defectText: { flex: 1, fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },
  infoBox: { backgroundColor: colors.accent + '22', borderRadius: radius.md, padding: spacing.md },
  infoText: { fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },
});
