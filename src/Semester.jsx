import { formatGpa, gpa, gradeOptions, totals } from './gpa'
import { newCourse } from './model'

export default function Semester({ semester, scale, onChange, onRemove }) {
  const { name, courses } = semester
  const options = gradeOptions(scale)
  const result = totals(courses, scale)

  const setCourses = (update) => onChange({ courses: update(courses) })

  const updateCourse = (id, field, value) =>
    setCourses((list) => list.map((c) => (c.id === id ? { ...c, [field]: value } : c)))

  const removeCourse = (id) => setCourses((list) => list.filter((c) => c.id !== id))

  const confirmRemove = () => {
    const hasData = courses.some((c) => c.name || c.grade)
    if (!hasData || window.confirm(`Remove ${name || 'this semester'}?`)) onRemove()
  }

  return (
    <section className="card">
      <div className="card-head">
        <input
          className="semester-name"
          value={name}
          aria-label="Semester name"
          onChange={(e) => onChange({ name: e.target.value })}
        />
        <div className="semester-gpa">
          <span className="muted">GPA</span> <strong>{formatGpa(gpa(result))}</strong>
          <span className="muted"> · {result.earnedCredits} cr</span>
        </div>
        <button className="icon" aria-label={`Remove ${name}`} onClick={confirmRemove}>×</button>
      </div>

      <div className="row header" aria-hidden="true">
        <span>Course</span><span>Credits</span><span>Grade</span><span />
      </div>

      {courses.map((course, i) => (
        <div className="row" key={course.id}>
          <input
            placeholder={`Course ${i + 1}`}
            value={course.name}
            aria-label={`Course ${i + 1} name`}
            onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
          />
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            value={course.credits}
            aria-label={`Course ${i + 1} credits`}
            onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
          />
          <select
            value={options.includes(course.grade) ? course.grade : ''}
            aria-label={`Course ${i + 1} grade`}
            onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
          >
            <option value="">–</option>
            {options.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <button className="icon" aria-label={`Remove course ${i + 1}`} onClick={() => removeCourse(course.id)}>×</button>
        </div>
      ))}

      <button className="link" onClick={() => setCourses((list) => [...list, newCourse()])}>+ Add course</button>
    </section>
  )
}
