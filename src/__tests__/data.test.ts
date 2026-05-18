import { questions, CATEGORY_LABELS, CATEGORY_COLORS, type Question } from '../data/questions'

describe('questions データ', () => {
  it('questions配列が存在して空でない', () => {
    expect(Array.isArray(questions)).toBe(true)
    expect(questions.length).toBeGreaterThan(0)
  })

  it('各問題が必須フィールドを持つ', () => {
    questions.forEach((q: Question) => {
      expect(q.id).toBeTruthy()
      expect(q.question).toBeTruthy()
      expect(Array.isArray(q.options)).toBe(true)
      expect(q.options.length).toBeGreaterThanOrEqual(2)
      expect(typeof q.answer).toBe('number')
      expect(q.explanation).toBeTruthy()
    })
  })

  it('answerのインデックスがoptionsの範囲内', () => {
    questions.forEach((q: Question) => {
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(q.options.length)
    })
  })

  it('categoryが有効な値である', () => {
    const validCategories = ['theory', 'wiring', 'law', 'materials']
    questions.forEach((q: Question) => {
      expect(validCategories).toContain(q.category)
    })
  })

  it('CATEGORY_LABELSが全カテゴリを含む', () => {
    expect(CATEGORY_LABELS.theory).toBe('電気理論')
    expect(CATEGORY_LABELS.wiring).toBe('配線図')
    expect(CATEGORY_LABELS.law).toBe('法規')
    expect(CATEGORY_LABELS.materials).toBe('器具・材料')
  })

  it('CATEGORY_COLORSが全カテゴリを含む', () => {
    expect(CATEGORY_COLORS.theory).toBeTruthy()
    expect(CATEGORY_COLORS.wiring).toBeTruthy()
  })

  it('問題IDが一意である', () => {
    const ids = questions.map((q: Question) => q.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })
})
