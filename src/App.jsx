import { useEffect, useState } from 'react'
import Semester from './Semester'
import { SCALES, cumulative, formatGpa, gpa } from './gpa'
import { newSemester } from './model'

const STORAGE_KEY = 'gpa-calculator-v2'

const freshState = () => ({ scale: '4.5', semesters: [newSemester(1)] })

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved && SCALES[saved.scale] && Array.isArray(saved.semesters)) return saved
  } catch {
    // storage unavailable or corrupted: start fresh
  }
  return freshState()
}

export default function App() {
  const [state, setState] = useState(load)
  const { scale, semesters } = state

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // private mode or storage full: the calculator still works, it just won't remember
    }
  }, [state])

  const setSemesters = (update) =>
    setState((s) => ({ ...s, semesters: update(s.semesters) }))

  const updateSemester = (id, changes) =>
    setSemesters((list) => list.map((s) => (s.id === id ? { ...s, ...changes } : s)))

  const removeSemester = (id) => setSemesters((list) => list.filter((s) => s.id !== id))

  const addSemester = () => setSemesters((list) => [...list, newSemester(list.length + 1)])

  const reset = () => {
    if (window.confirm('Clear all semesters and courses?')) setState(freshState())
  }

  const total = cumulative(semesters, scale)
  const overall = gpa(total)
  const max = Math.max(...Object.values(SCALES[scale].grades))

  return (
    <main>
      <header className="top">
        <div>
          <h1>GPA Calculator</h1>
          <p className="muted">Semester and cumulative GPA. Your courses are saved in this browser.</p>
        </div>
        <label className="scale">
          Grade scale
          <select value={scale} onChange={(e) => setState((s) => ({ ...s, scale: e.target.value }))}>
            {Object.entries(SCALES).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </label>
      </header>

      <section className="summary" aria-live="polite">
        <div className="headline">
          <span className="label">Cumulative GPA</span>
          <span className="big">{formatGpa(overall)}</span>
          <span className="muted">/ {max.toFixed(1)}</span>
        </div>
        <div className="bar" role="presentation">
          <div style={{ width: `${overall === null ? 0 : (overall / max) * 100}%` }} />
        </div>
        <dl className="stats">
          <div><dt>Credits earned</dt><dd>{total.earnedCredits}</dd></div>
          <div><dt>Credits in GPA</dt><dd>{total.gradedCredits}</dd></div>
          <div><dt>Semesters</dt><dd>{semesters.length}</dd></div>
        </dl>
      </section>

      {semesters.map((semester) => (
        <Semester
          key={semester.id}
          semester={semester}
          scale={scale}
          onChange={(changes) => updateSemester(semester.id, changes)}
          onRemove={() => removeSemester(semester.id)}
        />
      ))}

      <div className="actions">
        <button className="primary" onClick={addSemester}>+ Add semester</button>
        <button className="ghost" onClick={reset}>Reset</button>
      </div>

      <footer className="muted">
        P/NP courses earn credits but don’t affect your GPA. F counts as 0 points.
        <br />
        Made by <a href="https://github.com/Berekety1">Bereket</a> ·{' '}
        <a href="https://github.com/Berekety1/GPA-Calculator-V2">Source code</a>
      </footer>
    </main>
  )
}
