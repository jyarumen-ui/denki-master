import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'denki_master_progress';

export interface QuizHistoryEntry {
  questionId: string;
  correct: boolean;
  date: string;
}

export interface Progress {
  masteredCards: string[];
  quizHistory: QuizHistoryEntry[];
  skillsCompleted: number[];
  studyStreak: number;
  lastStudyDate: string;
  examDate: string | null;
  totalStudyMinutes: number;
  todayStudyMinutes: number;
  todayDate: string;
}

const defaultProgress: Progress = {
  masteredCards: [],
  quizHistory: [],
  skillsCompleted: [],
  studyStreak: 0,
  lastStudyDate: '',
  examDate: null,
  totalStudyMinutes: 0,
  todayStudyMinutes: 0,
  todayDate: '',
};

export async function loadProgress(): Promise<Progress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProgress };
    const saved: Progress = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    if (saved.todayDate !== today) {
      saved.todayStudyMinutes = 0;
      saved.todayDate = today;
    }
    return saved;
  } catch {
    return { ...defaultProgress };
  }
}

export async function saveProgress(progress: Progress): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore
  }
}

export async function markCardMastered(cardId: string): Promise<Progress> {
  const progress = await loadProgress();
  if (!progress.masteredCards.includes(cardId)) {
    progress.masteredCards.push(cardId);
  }
  await updateStreak(progress);
  await saveProgress(progress);
  return progress;
}

export async function unmarkCardMastered(cardId: string): Promise<Progress> {
  const progress = await loadProgress();
  progress.masteredCards = progress.masteredCards.filter((id) => id !== cardId);
  await saveProgress(progress);
  return progress;
}

export async function recordQuizAnswer(questionId: string, correct: boolean): Promise<Progress> {
  const progress = await loadProgress();
  progress.quizHistory.push({
    questionId,
    correct,
    date: new Date().toISOString(),
  });
  await updateStreak(progress);
  await saveProgress(progress);
  return progress;
}

export async function markSkillCompleted(problemId: number): Promise<Progress> {
  const progress = await loadProgress();
  if (!progress.skillsCompleted.includes(problemId)) {
    progress.skillsCompleted.push(problemId);
  }
  await updateStreak(progress);
  await saveProgress(progress);
  return progress;
}

export async function setExamDate(date: string | null): Promise<Progress> {
  const progress = await loadProgress();
  progress.examDate = date;
  await saveProgress(progress);
  return progress;
}

async function updateStreak(progress: Progress): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  if (progress.lastStudyDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (progress.lastStudyDate === yesterday) {
    progress.studyStreak += 1;
  } else {
    progress.studyStreak = 1;
  }
  progress.lastStudyDate = today;
  progress.todayDate = today;
}

export function getQuizAccuracy(quizHistory: QuizHistoryEntry[]): number {
  if (quizHistory.length === 0) return 0;
  const correct = quizHistory.filter((h) => h.correct).length;
  return Math.round((correct / quizHistory.length) * 100);
}

export function getQuizAccuracyByCategory(
  quizHistory: QuizHistoryEntry[],
  questions: { id: string; category: string }[]
): Record<string, { total: number; correct: number }> {
  const result: Record<string, { total: number; correct: number }> = {};
  for (const entry of quizHistory) {
    const q = questions.find((q) => q.id === entry.questionId);
    if (!q) continue;
    if (!result[q.category]) result[q.category] = { total: 0, correct: 0 };
    result[q.category].total += 1;
    if (entry.correct) result[q.category].correct += 1;
  }
  return result;
}
