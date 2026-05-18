import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { questions, Question, QuestionCategory, CATEGORY_LABELS, CATEGORY_COLORS } from '../data/questions';
import { formulaItems, refSections } from '../data/reference';
import { lessons } from '../data/lessons';
import { recordQuizAnswer, loadProgress, markCardMastered, unmarkCardMastered } from '../storage/progress';
import { colors, spacing, radius, fontSize } from '../theme';

type Mode = 'lesson' | 'flash' | 'quiz' | 'formula' | 'reference';
type FilterCategory = QuestionCategory | 'all';

const MODE_TABS: { key: Mode; label: string }[] = [
  { key: 'lesson', label: '📖 教科書' },
  { key: 'flash', label: '📇 カード' },
  { key: 'quiz', label: '📝 過去問' },
  { key: 'formula', label: '🧮 計算' },
  { key: 'reference', label: '📋 法規' },
];

const FILTER_OPTIONS: { key: FilterCategory; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'theory', label: '電気理論' },
  { key: 'wiring', label: '配線図' },
  { key: 'law', label: '法規' },
  { key: 'materials', label: '器具・材料' },
];

export default function WrittenExamScreen() {
  const [mode, setMode] = useState<Mode>('lesson');
  const [category, setCategory] = useState<FilterCategory>('all');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    loadProgress().then((p) => setMasteredIds(p.masteredCards));
  }, []);

  const filtered = category === 'all' ? questions : questions.filter((q) => q.category === category);
  const unmastered = filtered.filter((q) => !masteredIds.includes(q.id));
  const flashCards = unmastered.length > 0 ? unmastered : filtered;
  const currentCard: Question | undefined = flashCards[cardIndex % Math.max(flashCards.length, 1)];
  const currentQuiz: Question | undefined = filtered[quizIndex % Math.max(filtered.length, 1)];

  const nextCard = async (mastered: boolean) => {
    if (!currentCard) return;
    if (mastered) {
      await markCardMastered(currentCard.id);
      setMasteredIds((prev) => [...prev, currentCard.id]);
    } else {
      await unmarkCardMastered(currentCard.id);
      setMasteredIds((prev) => prev.filter((id) => id !== currentCard.id));
    }
    setFlipped(false);
    setCardIndex((i) => i + 1);
  };

  const selectAnswer = async (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
    const correct = idx === currentQuiz?.answer;
    setQuizScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    if (currentQuiz) await recordQuizAnswer(currentQuiz.id, correct);
  };

  const nextQuiz = () => {
    setSelected(null);
    setShowResult(false);
    setQuizIndex((i) => i + 1);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore({ correct: 0, total: 0 });
    setSelected(null);
    setShowResult(false);
  };

  const showCategoryFilter = mode === 'flash' || mode === 'quiz';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📝 筆記対策</Text>
        <Text style={styles.headerSub}>教科書{lessons.length}章 · {questions.length}問収録 · 計算ガイド · 法規まとめ</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.modeTabsScroll}
        contentContainerStyle={styles.modeTabsContent}
      >
        {MODE_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={mode === tab.key ? [styles.modeTab, styles.modeTabActive] : styles.modeTab}
            onPress={() => setMode(tab.key)}
          >
            <Text style={mode === tab.key ? [styles.modeTabText, styles.modeTabTextActive] : styles.modeTabText}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {showCategoryFilter && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catScroll}
          contentContainerStyle={styles.catScrollContent}
        >
          {FILTER_OPTIONS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={category === f.key ? [styles.catChip, styles.catChipActive] : styles.catChip}
              onPress={() => {
                setCategory(f.key);
                setCardIndex(0);
                setQuizIndex(0);
                setSelected(null);
                setShowResult(false);
              }}
            >
              <Text style={category === f.key ? [styles.catChipText, styles.catChipTextActive] : styles.catChipText}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {mode === 'lesson' ? (
        <LessonView />
      ) : (
        <ScrollView style={styles.flex1} contentContainerStyle={styles.content}>
          {mode === 'flash' ? (
            <FlashCardView
              card={currentCard}
              flipped={flipped}
              onFlip={() => setFlipped((f) => !f)}
              nextCard={nextCard}
              total={flashCards.length}
              index={cardIndex % Math.max(flashCards.length, 1)}
              masteredCount={masteredIds.filter((id) => filtered.find((q) => q.id === id)).length}
              totalCount={filtered.length}
            />
          ) : mode === 'quiz' ? (
            <QuizView
              question={currentQuiz}
              selected={selected}
              showResult={showResult}
              selectAnswer={selectAnswer}
              nextQuiz={nextQuiz}
              quizScore={quizScore}
              resetQuiz={resetQuiz}
              index={quizIndex % Math.max(filtered.length, 1)}
              total={filtered.length}
            />
          ) : mode === 'formula' ? (
            <FormulaView />
          ) : (
            <ReferenceView />
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ──── Lesson (教科書) ────────────────────────────────────────

function LessonView() {
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);
  const [openPointIdx, setOpenPointIdx] = useState<Record<string, number | null>>({});

  const toggleLesson = (id: string) => {
    setOpenLessonId(openLessonId === id ? null : id);
  };

  const togglePoint = (lessonId: string, idx: number) => {
    setOpenPointIdx((prev) => ({
      ...prev,
      [lessonId]: prev[lessonId] === idx ? null : idx,
    }));
  };

  return (
    <ScrollView style={styles.flex1} contentContainerStyle={styles.lessonScrollContent}>
      <View style={styles.lessonIntro}>
        <Text style={styles.lessonIntroTitle}>📖 電気工事士 教科書</Text>
        <Text style={styles.lessonIntroText}>
          {lessons.length}章構成の体系的な学習テキスト。各項目をタップして詳しい解説を読みましょう。
        </Text>
      </View>

      {lessons.map((lesson) => {
        const isOpen = openLessonId === lesson.id;
        return (
          <View key={lesson.id} style={styles.lessonCard}>
            <TouchableOpacity
              style={styles.lessonCardHeader}
              onPress={() => toggleLesson(lesson.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.lessonIcon}>{lesson.icon}</Text>
              <View style={styles.lessonHeaderText}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonSummaryShort} numberOfLines={isOpen ? undefined : 2}>
                  {lesson.summary}
                </Text>
              </View>
              <Text style={styles.lessonChevron}>{isOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {isOpen ? (
              <View style={styles.lessonBody}>
                {lesson.points.map((point, idx) => {
                  const isPointOpen = openPointIdx[lesson.id] === idx;
                  return (
                    <View key={idx} style={styles.pointCard}>
                      <TouchableOpacity
                        style={styles.pointHeader}
                        onPress={() => togglePoint(lesson.id, idx)}
                        activeOpacity={0.85}
                      >
                        <View style={styles.pointNumBadge}>
                          <Text style={styles.pointNum}>{idx + 1}</Text>
                        </View>
                        <Text style={styles.pointHeading} numberOfLines={isPointOpen ? undefined : 2}>
                          {point.heading}
                        </Text>
                        <Text style={styles.pointChevron}>{isPointOpen ? '▲' : '▼'}</Text>
                      </TouchableOpacity>

                      {isPointOpen ? (
                        <View style={styles.pointBody}>
                          <Text style={styles.pointBodyText}>{point.body}</Text>

                          {point.formula ? (
                            <View style={styles.formulaBox}>
                              <Text style={styles.formulaBoxLabel}>公式</Text>
                              <Text style={styles.formulaBoxText}>{point.formula}</Text>
                            </View>
                          ) : null}

                          {point.tip ? (
                            <View style={styles.tipBox}>
                              <Text style={styles.tipBoxLabel}>💡 ポイント</Text>
                              <Text style={styles.tipBoxText}>{point.tip}</Text>
                            </View>
                          ) : null}
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

// ──── Flash Card ────────────────────────────────────────────

interface FlashCardProps {
  card: Question | undefined;
  flipped: boolean;
  onFlip: () => void;
  nextCard: (mastered: boolean) => void;
  total: number;
  index: number;
  masteredCount: number;
  totalCount: number;
}

function FlashCardView({ card, flipped, onFlip, nextCard, total, index, masteredCount, totalCount }: FlashCardProps) {
  if (!card) return <Text style={styles.emptyText}>問題がありません</Text>;

  return (
    <View style={styles.flashContainer}>
      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>{index + 1} / {total}</Text>
        <Text style={styles.masteredText}>習得済み: {masteredCount} / {totalCount}</Text>
      </View>

      <TouchableOpacity onPress={onFlip} activeOpacity={0.9}>
        <View style={styles.flashCard}>
          {flipped ? (
            <View style={styles.cardFaceBack}>
              <Text style={styles.answerLabel}>答え</Text>
              <Text style={styles.flashAnswer}>{card.options[card.answer]}</Text>
              <Text style={styles.explanationText}>{card.explanation}</Text>
            </View>
          ) : (
            <View style={styles.cardFaceFront}>
              <View style={[styles.catBadge, { backgroundColor: CATEGORY_COLORS[card.category] }]}>
                <Text style={styles.catBadgeText}>{CATEGORY_LABELS[card.category]}</Text>
              </View>
              <Text style={styles.flashQuestion}>{card.question}</Text>
              <Text style={styles.tapHint}>タップして答えを見る</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {flipped && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.retryBtn]} onPress={() => nextCard(false)}>
            <Text style={styles.actionBtnText}>🔄 もう一度</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.masteredBtn]} onPress={() => nextCard(true)}>
            <Text style={styles.actionBtnText}>✅ わかった</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ──── Quiz ───────────────────────────────────────────────────

interface QuizViewProps {
  question: Question | undefined;
  selected: number | null;
  showResult: boolean;
  selectAnswer: (idx: number) => void;
  nextQuiz: () => void;
  quizScore: { correct: number; total: number };
  resetQuiz: () => void;
  index: number;
  total: number;
}

function QuizView({ question, selected, showResult, selectAnswer, nextQuiz, quizScore, resetQuiz, index, total }: QuizViewProps) {
  if (!question) return <Text style={styles.emptyText}>問題がありません</Text>;
  const isCorrect = selected === question.answer;

  return (
    <View style={styles.quizContainer}>
      <View style={styles.scoreRow}>
        <Text style={styles.scoreText}>
          正解率: {quizScore.total > 0 ? Math.round((quizScore.correct / quizScore.total) * 100) : 0}%
        </Text>
        <Text style={styles.scoreText}>{quizScore.correct} / {quizScore.total}</Text>
        <View style={styles.flex1} />
        <TouchableOpacity onPress={resetQuiz}>
          <Text style={styles.resetText}>リセット</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>{index + 1} / {total}</Text>
        <View style={[styles.catBadge, { backgroundColor: CATEGORY_COLORS[question.category] }]}>
          <Text style={styles.catBadgeText}>{CATEGORY_LABELS[question.category]}</Text>
        </View>
      </View>

      <View style={styles.quizCard}>
        <Text style={styles.quizQuestion}>{question.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {question.options.map((opt, i) => {
          let optStyle = styles.optionBtnDefault;
          if (showResult) {
            if (i === question.answer) optStyle = styles.optionBtnCorrect;
            else if (i === selected) optStyle = styles.optionBtnWrong;
          } else if (selected === i) {
            optStyle = styles.optionBtnSelected;
          }
          return (
            <TouchableOpacity
              key={i}
              style={[styles.optionBtn, optStyle]}
              onPress={() => selectAnswer(i)}
              disabled={showResult}
            >
              <Text style={styles.optionLabel}>{['A', 'B', 'C', 'D'][i]}</Text>
              <Text style={styles.optionText}>{opt}</Text>
              {showResult && i === question.answer ? <Text style={styles.correctMark}>✓</Text> : null}
              {showResult && i === selected && i !== question.answer ? <Text style={styles.wrongMark}>✗</Text> : null}
            </TouchableOpacity>
          );
        })}
      </View>

      {showResult ? (
        <View style={isCorrect ? styles.resultBoxCorrect : styles.resultBoxWrong}>
          <Text style={isCorrect ? styles.resultTextCorrect : styles.resultTextWrong}>
            {isCorrect ? '🎉 正解！' : '❌ 不正解'}
          </Text>
          <Text style={styles.explanationText}>{question.explanation}</Text>
          <TouchableOpacity style={styles.nextBtn} onPress={nextQuiz}>
            <Text style={styles.nextBtnText}>次の問題 →</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

// ──── Formula Guide ──────────────────────────────────────────

const FORMULA_CATEGORIES = ['基本公式', '電力・電力量', '合成抵抗', '交流回路', '電圧降下', '変圧器'];

function FormulaView() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <View style={styles.refContainer}>
      <View style={styles.refIntro}>
        <Text style={styles.refIntroTitle}>🧮 計算公式ガイド</Text>
        <Text style={styles.refIntroText}>試験に出る計算公式を例題つきで解説。タップして例題を確認しましょう。</Text>
      </View>

      {FORMULA_CATEGORIES.map((cat) => {
        const items = formulaItems.filter((f) => f.category === cat);
        if (items.length === 0) return null;
        return (
          <View key={cat} style={styles.refSection}>
            <Text style={styles.refSectionTitle}>{cat}</Text>
            {items.map((item) => {
              const isOpen = openId === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.formulaCard}
                  onPress={() => setOpenId(isOpen ? null : item.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.formulaHeader}>
                    <View style={styles.formulaHeaderLeft}>
                      <Text style={styles.formulaName}>{item.name}</Text>
                      <Text style={styles.formulaExpr}>{item.formula}</Text>
                    </View>
                    <Text style={styles.formulaChevron}>{isOpen ? '▲' : '▼'}</Text>
                  </View>

                  {isOpen ? (
                    <View style={styles.formulaBody}>
                      <Text style={styles.formulaVars}>{item.vars}</Text>
                      <Text style={styles.formulaDesc}>{item.description}</Text>
                      <View style={styles.exampleBox}>
                        <Text style={styles.exampleLabel}>例題</Text>
                        <Text style={styles.exampleQuestion}>{item.example}</Text>
                        <View style={styles.exampleAnswerBox}>
                          <Text style={styles.exampleAnswerLabel}>解答</Text>
                          <Text style={styles.exampleAnswer}>{item.exampleAnswer}</Text>
                        </View>
                      </View>
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

// ──── Reference (法規まとめ) ─────────────────────────────────

function ReferenceView() {
  const [openId, setOpenId] = useState<string | null>(refSections[0]?.id ?? null);

  return (
    <View style={styles.refContainer}>
      <View style={styles.refIntro}>
        <Text style={styles.refIntroTitle}>📋 法規・基準まとめ</Text>
        <Text style={styles.refIntroText}>試験で必須の数値・規定を一覧で確認。タップで詳細を表示。</Text>
      </View>

      {refSections.map((section) => {
        const isOpen = openId === section.id;
        return (
          <View key={section.id} style={styles.refSectionCard}>
            <TouchableOpacity
              style={styles.refSectionHeader}
              onPress={() => setOpenId(isOpen ? null : section.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.refSectionIcon}>{section.icon}</Text>
              <Text style={styles.refSectionName}>{section.title}</Text>
              <Text style={styles.refChevron}>{isOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {isOpen ? (
              <View style={styles.refTableContainer}>
                {section.rows.map((row, i) => (
                  <View
                    key={i}
                    style={row.highlight ? [styles.refTableRow, styles.refTableRowHighlight] : styles.refTableRow}
                  >
                    <Text style={styles.refTableLabel}>{row.label}</Text>
                    <View style={styles.refTableRight}>
                      <Text style={row.highlight ? [styles.refTableValue, styles.refTableValueHighlight] : styles.refTableValue}>
                        {row.value}
                      </Text>
                      {row.note ? <Text style={styles.refTableNote}>{row.note}</Text> : null}
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

// ──── Styles ────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex1: { flex: 1 },
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  headerTitle: { color: colors.accent, fontSize: fontSize.xl, fontWeight: 'bold' },
  headerSub: { color: '#aaa', fontSize: fontSize.sm, marginTop: 2 },

  modeTabsScroll: { backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border, maxHeight: 50 },
  modeTabsContent: { flexDirection: 'row' },
  modeTab: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, alignItems: 'center', minWidth: 90 },
  modeTabActive: { borderBottomWidth: 3, borderBottomColor: colors.accent },
  modeTabText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '600' },
  modeTabTextActive: { color: colors.primary, fontWeight: 'bold' },

  catScroll: { backgroundColor: colors.card, maxHeight: 50 },
  catScrollContent: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, flexDirection: 'row' },
  catChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
  },
  catChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  catChipText: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: '600' },
  catChipTextActive: { color: '#fff' },

  content: { padding: spacing.md, paddingBottom: 40 },
  emptyText: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },

  // Lesson (教科書)
  lessonScrollContent: { padding: spacing.md, paddingBottom: 40 },
  lessonIntro: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  lessonIntroTitle: { color: colors.accent, fontSize: fontSize.lg, fontWeight: 'bold', marginBottom: 4 },
  lessonIntroText: { color: '#ccc', fontSize: fontSize.sm, lineHeight: 18 },
  lessonCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lessonCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    backgroundColor: colors.primary,
  },
  lessonIcon: { fontSize: 28, marginRight: spacing.sm, marginTop: 2 },
  lessonHeaderText: { flex: 1, marginRight: spacing.sm },
  lessonTitle: { fontSize: fontSize.md, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  lessonSummaryShort: { fontSize: fontSize.xs, color: '#ccc', lineHeight: 17 },
  lessonChevron: { fontSize: fontSize.sm, color: '#aaa', marginTop: 4 },
  lessonBody: { padding: spacing.sm, backgroundColor: colors.background },

  pointCard: {
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
    overflow: 'hidden',
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  pointHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.sm,
  },
  pointNumBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
    marginTop: 1,
    flexShrink: 0,
  },
  pointNum: { fontSize: 11, fontWeight: 'bold', color: colors.primary },
  pointHeading: { flex: 1, fontSize: fontSize.sm, fontWeight: '700', color: colors.text, lineHeight: 20 },
  pointChevron: { fontSize: fontSize.xs, color: colors.textSecondary, marginLeft: spacing.xs, marginTop: 2 },
  pointBody: { paddingHorizontal: spacing.sm, paddingBottom: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  pointBodyText: { fontSize: fontSize.sm, color: colors.text, lineHeight: 22, marginTop: spacing.sm },
  formulaBox: {
    backgroundColor: colors.primary + '14',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  formulaBoxLabel: { fontSize: fontSize.xs, fontWeight: 'bold', color: colors.primary, marginBottom: 4 },
  formulaBoxText: { fontSize: fontSize.sm, fontWeight: '700', color: colors.accent, fontFamily: 'monospace', lineHeight: 20 },
  tipBox: {
    backgroundColor: colors.warning + '18',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  tipBoxLabel: { fontSize: fontSize.xs, fontWeight: 'bold', color: colors.warning, marginBottom: 4 },
  tipBoxText: { fontSize: fontSize.xs, color: colors.text, lineHeight: 18 },

  // Flash card
  flashContainer: { marginBottom: spacing.md },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  progressText: { fontSize: fontSize.sm, color: colors.textSecondary },
  masteredText: { fontSize: fontSize.sm, color: colors.success, fontWeight: '600' },
  flashCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    minHeight: 220,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  cardFaceFront: { width: '100%' },
  cardFaceBack: { width: '100%', backgroundColor: colors.primary + '08' },
  catBadge: { borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: spacing.md },
  catBadgeText: { fontSize: fontSize.xs, color: '#fff', fontWeight: 'bold' },
  flashQuestion: { fontSize: fontSize.lg, fontWeight: 'bold', color: colors.text, lineHeight: 26 },
  tapHint: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.md, textAlign: 'center' },
  answerLabel: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '600', marginBottom: spacing.xs },
  flashAnswer: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.success, marginBottom: spacing.md },
  explanationText: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  actionRow: { flexDirection: 'row', marginTop: spacing.sm },
  actionBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  retryBtn: { backgroundColor: colors.warning + '22', borderWidth: 1, borderColor: colors.warning, marginRight: spacing.sm },
  masteredBtn: { backgroundColor: colors.success + '22', borderWidth: 1, borderColor: colors.success },
  actionBtnText: { fontSize: fontSize.md, fontWeight: 'bold', color: colors.text },

  // Quiz
  quizContainer: { marginBottom: spacing.md },
  scoreRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  scoreText: { fontSize: fontSize.sm, color: colors.textSecondary, marginRight: spacing.sm },
  resetText: { fontSize: fontSize.sm, color: colors.accent, fontWeight: 'bold' },
  quizCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: spacing.md,
  },
  quizQuestion: { fontSize: fontSize.md, fontWeight: 'bold', color: colors.text, lineHeight: 24 },
  optionsContainer: { marginBottom: spacing.md },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    marginBottom: spacing.sm,
  },
  optionBtnDefault: { backgroundColor: colors.card, borderColor: colors.border },
  optionBtnSelected: { backgroundColor: colors.primary + '11', borderColor: colors.primary },
  optionBtnCorrect: { backgroundColor: colors.success + '22', borderColor: colors.success },
  optionBtnWrong: { backgroundColor: colors.danger + '22', borderColor: colors.danger },
  optionLabel: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    color: '#fff',
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  optionText: { flex: 1, fontSize: fontSize.sm, color: colors.text },
  correctMark: { fontSize: fontSize.lg, color: colors.success },
  wrongMark: { fontSize: fontSize.lg, color: colors.danger },
  resultBoxCorrect: { borderRadius: radius.md, padding: spacing.md, backgroundColor: colors.success + '22' },
  resultBoxWrong: { borderRadius: radius.md, padding: spacing.md, backgroundColor: colors.danger + '22' },
  resultTextCorrect: { fontSize: fontSize.lg, fontWeight: 'bold', color: colors.success, marginBottom: spacing.sm },
  resultTextWrong: { fontSize: fontSize.lg, fontWeight: 'bold', color: colors.danger, marginBottom: spacing.sm },
  nextBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: 'center', marginTop: spacing.sm },
  nextBtnText: { color: '#fff', fontSize: fontSize.md, fontWeight: 'bold' },

  // Formula & Reference shared
  refContainer: { paddingBottom: 40 },
  refIntro: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  refIntroTitle: { color: colors.accent, fontSize: fontSize.lg, fontWeight: 'bold', marginBottom: 4 },
  refIntroText: { color: '#ccc', fontSize: fontSize.sm, lineHeight: 18 },
  refSection: { marginBottom: spacing.md },
  refSectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    paddingLeft: 4,
  },

  // Formula cards
  formulaCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  formulaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  formulaHeaderLeft: { flex: 1 },
  formulaName: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 4 },
  formulaExpr: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.accent, fontFamily: 'monospace' },
  formulaChevron: { fontSize: fontSize.sm, color: colors.textSecondary, marginLeft: spacing.sm },
  formulaBody: { borderTopWidth: 1, borderTopColor: colors.border, padding: spacing.md, backgroundColor: colors.primary + '08' },
  formulaVars: { fontSize: fontSize.xs, color: colors.primary, fontWeight: '600', marginBottom: spacing.xs },
  formulaDesc: { fontSize: fontSize.sm, color: colors.text, lineHeight: 20, marginBottom: spacing.md },
  exampleBox: { backgroundColor: colors.card, borderRadius: radius.sm, padding: spacing.sm, borderLeftWidth: 3, borderLeftColor: colors.accent },
  exampleLabel: { fontSize: fontSize.xs, color: colors.accent, fontWeight: 'bold', marginBottom: 4 },
  exampleQuestion: { fontSize: fontSize.sm, color: colors.text, marginBottom: spacing.xs },
  exampleAnswerBox: { backgroundColor: colors.success + '15', borderRadius: radius.sm, padding: spacing.xs, marginTop: 4 },
  exampleAnswerLabel: { fontSize: fontSize.xs, color: colors.success, fontWeight: 'bold' },
  exampleAnswer: { fontSize: fontSize.sm, color: colors.success, fontWeight: '600', marginTop: 2 },

  // Reference section cards
  refSectionCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  refSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary,
  },
  refSectionIcon: { fontSize: fontSize.lg, marginRight: spacing.sm },
  refSectionName: { flex: 1, fontSize: fontSize.md, fontWeight: 'bold', color: '#fff' },
  refChevron: { fontSize: fontSize.sm, color: '#aaa' },
  refTableContainer: { paddingVertical: spacing.xs },
  refTableRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  refTableRowHighlight: { backgroundColor: colors.accent + '18' },
  refTableLabel: { width: '45%', fontSize: fontSize.sm, color: colors.textSecondary, paddingRight: spacing.sm },
  refTableRight: { flex: 1 },
  refTableValue: { fontSize: fontSize.sm, fontWeight: 'bold', color: colors.text },
  refTableValueHighlight: { color: colors.primary, fontSize: fontSize.md },
  refTableNote: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
});
