import assert from 'node:assert/strict'
import { test } from 'node:test'
import { cumulative, formatGpa, gpa, gradeOptions, totals } from './gpa.js'

const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`)

test('credit-weighted average on the 4.5 scale', () => {
  const t = totals([
    { credits: 3, grade: 'A+' }, // 13.5
    { credits: 3, grade: 'B0' }, //  9.0
    { credits: 1, grade: 'C+' }, //  2.5
  ], '4.5')
  close(gpa(t), 25 / 7)
  assert.equal(t.earnedCredits, 7)
})

test('F counts toward the GPA but earns no credits', () => {
  const t = totals([{ credits: 3, grade: 'A0' }, { credits: 3, grade: 'F' }], '4.5')
  close(gpa(t), 2.0)
  assert.equal(t.gradedCredits, 6)
  assert.equal(t.earnedCredits, 3)
})

test('P/NP courses never change the GPA', () => {
  const t = totals([
    { credits: 3, grade: 'B+' },
    { credits: 2, grade: 'P' },
    { credits: 1, grade: 'NP' },
  ], '4.5')
  close(gpa(t), 3.5)
  assert.equal(t.earnedCredits, 5)
})

test('incomplete rows are ignored', () => {
  const t = totals([
    { credits: 3, grade: 'A0' },
    { credits: '', grade: 'A+' },
    { credits: 3, grade: '' },
    { credits: -2, grade: 'F' },
    { credits: 3, grade: 'A0+' },
  ], '4.5')
  close(gpa(t), 4.0)
})

test('no graded courses means no GPA yet', () => {
  assert.equal(gpa(totals([], '4.5')), null)
  assert.equal(gpa(totals([{ credits: 3, grade: 'P' }], '4.5')), null)
  assert.equal(formatGpa(null), '–')
})

test('cumulative GPA weights every course, not every semester', () => {
  const semesters = [
    { courses: [{ credits: 18, grade: 'A0' }] },
    { courses: [{ credits: 3, grade: 'C0' }] },
  ]
  // averaging the two semester GPAs would give 3.0; the real answer is lower
  close(gpa(cumulative(semesters, '4.5')), (18 * 4 + 3 * 2) / 21)
})

test('grades are read with the selected scale', () => {
  close(gpa(totals([{ credits: 3, grade: 'A+' }], '4.3')), 4.3)
  close(gpa(totals([{ credits: 3, grade: 'A' }], '4.0')), 4.0)
  assert.equal(gpa(totals([{ credits: 3, grade: 'A' }], '4.5')), null) // 'A' is not a 4.5-scale grade
  assert.deepEqual(gradeOptions('4.5').slice(-3), ['F', 'P', 'NP'])
})

test('formatting rounds to two decimals', () => {
  assert.equal(formatGpa(25 / 7), '3.57')
  assert.equal(formatGpa(4.5), '4.50')
})
