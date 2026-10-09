// Grade scales: letter -> grade points.
export const SCALES = {
  '4.5': {
    label: '4.5 scale (Korea)',
    grades: { 'A+': 4.5, A0: 4.0, 'B+': 3.5, B0: 3.0, 'C+': 2.5, C0: 2.0, 'D+': 1.5, D0: 1.0, F: 0 },
  },
  '4.3': {
    label: '4.3 scale',
    grades: {
      'A+': 4.3, A0: 4.0, 'A-': 3.7, 'B+': 3.3, B0: 3.0, 'B-': 2.7,
      'C+': 2.3, C0: 2.0, 'C-': 1.7, 'D+': 1.3, D0: 1.0, 'D-': 0.7, F: 0,
    },
  },
  '4.0': {
    label: '4.0 scale (US)',
    grades: {
      A: 4.0, 'A-': 3.7, 'B+': 3.3, B: 3.0, 'B-': 2.7, 'C+': 2.3,
      C: 2.0, 'C-': 1.7, 'D+': 1.3, D: 1.0, F: 0,
    },
  },
}

// Pass / no-pass courses earn (or don't earn) credits but never count toward the GPA.
export const PASS_GRADES = { P: true, NP: false }

export function gradeOptions(scale) {
  return [...Object.keys(SCALES[scale].grades), ...Object.keys(PASS_GRADES)]
}

// Totals for a list of courses ({ credits, grade }). Courses without a grade,
// without credits, or with a grade the scale doesn't know are ignored.
export function totals(courses, scale) {
  const points = SCALES[scale].grades
  let gradedCredits = 0
  let weightedPoints = 0
  let earnedCredits = 0

  for (const { credits, grade } of courses) {
    const c = Number(credits)
    if (!(c > 0)) continue
    if (grade in points) {
      gradedCredits += c
      weightedPoints += c * points[grade]
      if (grade !== 'F') earnedCredits += c
    } else if (grade in PASS_GRADES && PASS_GRADES[grade]) {
      earnedCredits += c
    }
  }
  return { gradedCredits, weightedPoints, earnedCredits }
}

export function gpa({ gradedCredits, weightedPoints }) {
  return gradedCredits > 0 ? weightedPoints / gradedCredits : null
}

export function cumulative(semesters, scale) {
  return totals(semesters.flatMap((s) => s.courses), scale)
}

export function formatGpa(value) {
  return value === null ? '–' : value.toFixed(2)
}
