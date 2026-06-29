import { useState } from "react";

function GetSubject({ subject, updateSubject, del, grade_map }) {
    return (
        <div>
            <input
                type="text"
                placeholder="Subject Name"
                value={subject.name}
                onChange={(e) =>
                    updateSubject(subject.id, "name", e.target.value)
                }
            />

            
            <select value = {subject.letter} onChange = {(e) => updateSubject(subject.id, "letter", e.target.value)}>
                <option value="">Select grade</option>
                {Object.keys(grade_map).map((grades) =>
                (
                    <option value = {grades} >{grades}</option>
                ))}
                

            </select>
            
            
            <input
                type="number"
                placeholder="Credit"
                value={subject.credit}
                onChange={(e) =>
                    updateSubject(subject.id, "credit", Number(e.target.value))
                }
            />

            <button onClick = {()=>del(subject.id)}>del</button>
        </div>
    );
}

function Display({subjects}){
    return(
        <div>
          <table>
                    <tr>
                        <th>Subject Name</th>
                        <th>Letter Grade</th>
                        <th>Credit</th>
                    </tr>

                    {subjects.map((subject) => 
                    <tr>
                        <td>{subject.name}</td>
                        <td>{subject.letter}</td>
                        <td>{subject.credit}</td>
                    </tr>)
                    }
                </table>
        </div>
    );
}

function OneSem() {
    const [user, setUser] = useState({
        name: "",
        grade: "",
    });

    const [subjects, setSubjects] = useState([]);

    const [result, setResult] = useState(null);

    const [calculated,setCalculated] = useState(false);

    function addSubject() {
        setSubjects((prev) => [
            ...prev,
            {
                id: Date.now(),
                name: "",
                letter:"",
                credit: 0,
            },
        ]);

        setCalculated(false)
        setResult(null)
    }

    const GRADE_MAP = {
  "A+": 4.5, "A0": 4.0,
  "B+": 3.5, "B0": 3.0,
  "C+": 2.5, "C0": 2.0,
  "D+": 1.5, "D0": 1.0,
  "F": 0.0,
};
    
    function updateSubject(id, field, value) {
        setSubjects((prev) =>
            prev.map((subject) =>
                subject.id === id
                    ? { ...subject, [field]: value }
                    : subject
            )
        );
        setCalculated(false)
        setResult(null)
    }

    function getgrade(grade_letter)
    {
        return GRADE_MAP[grade_letter] ?? 0
    }

    function deletesubject(id)
    {
        setSubjects(prev =>
    prev.filter(subject => subject.id !== id)
)
        setCalculated(false)
        setResult(null)
    }

    function calculate() {
        let totalQualityPoints = 0;
        let totalCredits = 0;

        for (const subject of subjects) {
            
            let gradePoint = getgrade(subject.letter);
            totalQualityPoints += gradePoint * subject.credit;
            totalCredits += subject.credit;
        }

        if (totalCredits === 0) {
            setResult(0);
            return;
        }

        setResult((totalQualityPoints / totalCredits).toFixed(2));
        setCalculated(true)
    }

    return (
        <>
            <div>
                <p>Name</p>

                <input
                    type="text"
                    placeholder="Enter your name"
                    onChange={(e) =>
                        setUser({
                            ...user,
                            name: e.target.value,
                        })
                    }
                />

                <p>Grade</p>

                <input
                    type="text"
                    placeholder="Enter your grade"
                    onChange={(e) =>
                        setUser({
                            ...user,
                            grade: e.target.value,
                        })
                    }
                />
            </div>

            <h2>Hello {user.name}</h2>
          
            <button onClick={addSubject}>Add Subject</button>

            {subjects.map((subject) => (
                <GetSubject
                    key={subject.id}
                    subject={subject}
                    updateSubject={updateSubject}
                    del = {deletesubject}
                    grade_map = {GRADE_MAP}
                />
            ))}

            <br />

            <button onClick={calculate}>Calculate GPA</button>
             
                {calculated ? <Display subjects = {subjects}/> : null}
             
            <h2>GPA: {result}</h2>
        </>
    );
}

export default OneSem;