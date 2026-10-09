let nextId = 0
const newId = () => `${Date.now().toString(36)}-${(nextId++).toString(36)}`

export const newCourse = () => ({ id: newId(), name: '', credits: '3', grade: '' })

export const newSemester = (number) => ({
  id: newId(),
  name: `Semester ${number}`,
  courses: [newCourse(), newCourse(), newCourse()],
})
