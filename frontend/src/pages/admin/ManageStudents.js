import { useEffect, useState } from "react";
import API from "../../services/api";

function ManageStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    API.get("/students").then(res => setStudents(res.data));
  }, []);

  const deleteStudent = async (id) => {
    await API.delete(`/students/${id}`);
    setStudents(students.filter(s => s._id !== id));
  };

  return (
    <div>
      <h3>Students</h3>

      {students.map(s => (
        <div key={s._id}>
          {s.name}
          <button onClick={() => deleteStudent(s._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}