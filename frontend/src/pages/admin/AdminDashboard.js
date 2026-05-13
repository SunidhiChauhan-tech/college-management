import { useEffect, useState } from "react";
import API from "../../services/api";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0d0d14; font-family: 'DM Sans', sans-serif; color: #e2e2ee; }
  .admin-layout { min-height: 100vh; background: #0d0d14; }
  .admin-main { margin-left: 220px; padding: 2rem; min-height: calc(100vh - 64px); }
  @media (max-width: 768px) { .admin-main { margin-left: 0; padding: 1rem; } }

  .page-header { margin-bottom: 2rem; }
  .page-title { font-family: 'Playfair Display', serif; font-size: 1.9rem; font-weight: 700; color: #f1f1f6; margin-bottom: 0.25rem; }
  .page-sub { font-size: 0.85rem; color: #6b7280; }

  .stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.25rem; margin-bottom: 2.5rem; }
  @media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2,1fr); } }

  .stat-card { background: #16161f; border: 1px solid #22222f; border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; position: relative; overflow: hidden; transition: transform 0.2s; }
  .stat-card:hover { transform: translateY(-3px); }
  .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; border-radius:16px 16px 0 0; }
  .stat-card.s1::before { background: linear-gradient(90deg,#4f46e5,#818cf8); }
  .stat-card.s2::before { background: linear-gradient(90deg,#059669,#34d399); }
  .stat-card.s3::before { background: linear-gradient(90deg,#d97706,#fbbf24); }
  .stat-card.s4::before { background: linear-gradient(90deg,#db2777,#f472b6); }
  .stat-icon { font-size: 1.4rem; }
  .stat-val { font-size: 2rem; font-weight: 700; font-family:'Playfair Display',serif; color:#f1f1f6; line-height:1; }
  .stat-lbl { font-size: 0.72rem; color:#6b7280; text-transform:uppercase; letter-spacing:0.08em; }

  .card { background:#16161f; border:1px solid #22222f; border-radius:16px; padding:1.75rem; margin-bottom:1.75rem; }
  .card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.75rem; }
  .card-title { font-size:1.1rem; font-weight:600; color:#f1f1f6; }
  .badge-count { font-size:0.78rem; color:#6b7280; background:#1e1e2a; padding:0.25rem 0.65rem; border-radius:20px; border:1px solid #2a2a38; }

  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1rem; }
  .grid-1a { display:grid; grid-template-columns:1fr auto; gap:0.75rem; margin-bottom:1rem; align-items:end; }
  .grid-3 { display:grid; grid-template-columns:1fr 1fr auto; gap:0.75rem; margin-bottom:1rem; align-items:end; }
  @media (max-width:560px) { .grid-2,.grid-1a,.grid-3 { grid-template-columns:1fr; } }

  .field label { display:block; font-size:0.72rem; font-weight:500; color:#9ca3af; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.35rem; }
  .inp { width:100%; padding:0.65rem 0.9rem; background:#1e1e2a; border:1px solid #2a2a38; border-radius:10px; color:#e2e2ee; font-family:'DM Sans',sans-serif; font-size:0.88rem; outline:none; transition:border-color 0.2s; }
  .inp:focus { border-color:#4f46e5; }
  .inp::placeholder { color:#4b5563; }
  .sel { width:100%; padding:0.65rem 0.9rem; background:#1e1e2a; border:1px solid #2a2a38; border-radius:10px; color:#e2e2ee; font-family:'DM Sans',sans-serif; font-size:0.88rem; outline:none; cursor:pointer; appearance:none; }
  .sel:focus { border-color:#4f46e5; }

  .btn { padding:0.65rem 1.25rem; border:none; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:0.88rem; font-weight:500; cursor:pointer; white-space:nowrap; transition:opacity 0.2s,transform 0.15s; }
  .btn:hover { opacity:0.88; transform:translateY(-1px); }
  .btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
  .btn-green  { background:linear-gradient(135deg,#059669,#0d9488); color:#fff; }
  .btn-blue   { background:linear-gradient(135deg,#4f46e5,#7c3aed); color:#fff; }
  .btn-orange { background:linear-gradient(135deg,#d97706,#f59e0b); color:#fff; }
  .btn-teal   { background:linear-gradient(135deg,#0891b2,#06b6d4); color:#fff; }
  .btn-red    { padding:0.35rem 0.75rem; background:rgba(220,38,38,0.12); border:1px solid rgba(220,38,38,0.25); border-radius:8px; color:#f87171; font-size:0.78rem; font-family:'DM Sans',sans-serif; cursor:pointer; transition:background 0.2s; }
  .btn-red:hover { background:rgba(220,38,38,0.22); }

  .ok  { background:rgba(5,150,105,0.1); border:1px solid rgba(5,150,105,0.25); border-radius:10px; padding:0.65rem 1rem; margin-bottom:1rem; color:#34d399; font-size:0.85rem; }
  .err { background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.25); border-radius:10px; padding:0.65rem 1rem; margin-bottom:1rem; color:#f87171; font-size:0.85rem; }

  .list-row { display:flex; align-items:center; justify-content:space-between; padding:0.75rem 0; border-bottom:1px solid #1e1e2a; gap:1rem; }
  .list-row:last-child { border-bottom:none; }
  .av { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:600; color:#fff; flex-shrink:0; }
  .av-stu { background:linear-gradient(135deg,#4f46e5,#7c3aed); }
  .av-tch { background:linear-gradient(135deg,#059669,#0d9488); }
  .av-crs { background:linear-gradient(135deg,#d97706,#f59e0b); }
  .li { flex:1; min-width:0; }
  .ln { font-size:0.9rem; font-weight:500; color:#e2e2ee; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ls { font-size:0.78rem; color:#6b7280; display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap; }
  .pill { padding:0.1rem 0.5rem; border-radius:10px; font-size:0.7rem; font-weight:500; }
  .pill-g { background:rgba(5,150,105,0.15); border:1px solid rgba(5,150,105,0.3); color:#34d399; }
  .pill-o { background:rgba(217,119,6,0.15); border:1px solid rgba(217,119,6,0.3); color:#fbbf24; }
  .pill-b { background:rgba(79,70,229,0.15); border:1px solid rgba(79,70,229,0.3); color:#818cf8; }
  .pill-r { background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.2); color:#f87171; }

  .divider { border:none; border-top:1px solid #22222f; margin:1.5rem 0; }
  .sub-hd { font-size:0.92rem; font-weight:600; color:#f1f1f6; margin-bottom:1rem; }

  /* course card */
  .course-card { background:#1a1a26; border:1px solid #22222f; border-radius:12px; padding:1.25rem; margin-bottom:0.75rem; }
  .course-card:last-child { margin-bottom:0; }
  .cc-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem; }
  .cc-name { font-size:1rem; font-weight:600; color:#f1f1f6; }

  /* subject row */
  .subj-row { display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0; border-bottom:1px solid #1e1e2a; flex-wrap:wrap; }
  .subj-row:last-child { border-bottom:none; }
  .subj-name { font-size:0.88rem; font-weight:500; color:#fbbf24; min-width:80px; }
  .subj-tch  { font-size:0.78rem; color:#6b7280; flex:1; }
  .subj-sel  { padding:0.35rem 0.65rem; background:#1e1e2a; border:1px solid #2a2a38; border-radius:8px; color:#e2e2ee; font-family:'DM Sans',sans-serif; font-size:0.78rem; outline:none; cursor:pointer; appearance:none; }
  .subj-btn  { padding:0.35rem 0.75rem; background:rgba(8,145,178,0.15); border:1px solid rgba(8,145,178,0.3); border-radius:8px; color:#22d3ee; font-size:0.75rem; font-family:'DM Sans',sans-serif; cursor:pointer; white-space:nowrap; }
  .subj-rm   { padding:0.3rem 0.6rem; background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.2); border-radius:8px; color:#f87171; font-size:0.72rem; cursor:pointer; }

  .result-row { display:flex; align-items:center; justify-content:space-between; padding:0.75rem 0; border-bottom:1px solid #1e1e2a; gap:1rem; }
  .result-row:last-child { border-bottom:none; }
  .r-badge { padding:0.2rem 0.6rem; background:rgba(79,70,229,0.15); border:1px solid rgba(79,70,229,0.3); border-radius:20px; font-size:0.78rem; color:#818cf8; font-weight:500; }

  .empty { text-align:center; padding:2rem; color:#4b5563; font-size:0.88rem; }
  .empty-icon { font-size:2rem; margin-bottom:0.5rem; }
  .hint { font-size:0.75rem; color:#6b7280; margin-bottom:1rem; padding:0.5rem 0.75rem; background:#1a1a26; border-radius:8px; border:1px solid #22222f; }
`;

function AdminDashboard() {
  const [students,    setStudents]    = useState([]);
  const [teachers,    setTeachers]    = useState([]);
  const [courses,     setCourses]     = useState([]);
  const [results,     setResults]     = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  // course form
  const [newCourse,  setNewCourse]  = useState("");
  const [courseMsg,  setCourseMsg]  = useState("");

  // assign course to student
  const [assignStuId,   setAssignStuId]   = useState("");
  const [assignCourse,  setAssignCourse]  = useState("");
  const [assignStuMsg,  setAssignStuMsg]  = useState("");

  // subject management
  const [selCourseId,      setSelCourseId]      = useState("");
  const [newSubject,        setNewSubject]        = useState("");
  const [subjectMsg,        setSubjectMsg]        = useState("");
  const [subjectTeacherMap, setSubjectTeacherMap] = useState({});

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = () => {
    API.get("/students").then(r => setStudents(r.data)).catch(console.log);
    API.get("/teachers").then(r => setTeachers(r.data)).catch(console.log);
    API.get("/courses").then(r => {
      setCourses(r.data);
      if (r.data.length > 0) setSelCourseId(r.data[0]._id);
    }).catch(console.log);
    API.get("/results").then(r => setResults(r.data)).catch(console.log);
  };

  const flash = (set, msg, ms = 3000) => { set(msg); setTimeout(() => set(""), ms); };
  const ini = (n = "") => (n || "?").split(" ").map(x => x[0]).join("").toUpperCase().slice(0, 2);
  const selCourse = courses.find(c => c._id === selCourseId);

  // ── Delete student ──
  const deleteStudent = async (id) => {
    if (!window.confirm("Remove this student?")) return;
    try {
      await API.delete(`/students/${id}`);
      setStudents(prev => prev.filter(s => s._id !== id));
    } catch (err) { console.log(err); }
  };

  // ── Assign course to existing student ──
  const assignCourseToStudent = async () => {
    if (!assignStuId || !assignCourse) { flash(setAssignStuMsg, "⚠️ Select student and course."); return; }
    try {
      await API.put("/courses/assign-student", { studentId: assignStuId, courseName: assignCourse });
      setStudents(prev => prev.map(s => s._id === assignStuId ? { ...s, course: assignCourse } : s));
      const n = students.find(s => s._id === assignStuId)?.name;
      flash(setAssignStuMsg, `✅ ${n} assigned to ${assignCourse}!`);
      setAssignStuId(""); setAssignCourse("");
    } catch (err) { flash(setAssignStuMsg, "⚠️ Failed."); }
  };

  // ── Create course ──
  const createCourse = async () => {
    if (!newCourse.trim()) return;
    try {
      const r = await API.post("/courses/add", { courseName: newCourse.trim() });
      setCourses(prev => [...prev, r.data.course]);
      setNewCourse("");
      flash(setCourseMsg, `✅ "${r.data.course.courseName}" created!`);
    } catch (err) { flash(setCourseMsg, `⚠️ ${err.response?.data?.message || "Failed."}`); }
  };

  // ── Delete course ──
  const deleteCourse = async (id, name) => {
    if (!window.confirm(`Delete course "${name}"?`)) return;
    try {
      await API.delete(`/courses/${id}`);
      setCourses(prev => prev.filter(c => c._id !== id));
      flash(setCourseMsg, `🗑️ "${name}" deleted.`);
    } catch (err) { console.log(err); }
  };

  // ── Add subject ──
  const addSubject = async () => {
    if (!newSubject.trim() || !selCourseId) return;
    try {
      const r = await API.post("/courses/add-subject", { courseId: selCourseId, subjectName: newSubject.trim() });
      setCourses(prev => prev.map(c => c._id === selCourseId ? r.data.course : c));
      setNewSubject("");
      flash(setSubjectMsg, `✅ "${newSubject.trim()}" added!`);
    } catch (err) { flash(setSubjectMsg, `⚠️ ${err.response?.data?.message || "Failed."}`); }
  };

  // ── Remove subject ──
  const removeSubject = async (subjectName) => {
    try {
      const r = await API.delete("/courses/remove-subject", { data: { courseId: selCourseId, subjectName } });
      setCourses(prev => prev.map(c => c._id === selCourseId ? r.data.course : c));
      flash(setSubjectMsg, `🗑️ "${subjectName}" removed.`);
    } catch (err) { console.log(err); }
  };

  // ── Assign teacher to subject ──
  const assignTeacher = async (subjectName) => {
    const teacherId = subjectTeacherMap[subjectName];
    if (!teacherId) { flash(setSubjectMsg, "⚠️ Select a teacher first."); return; }
    try {
      const r = await API.put("/courses/assign-subject-teacher", { courseId: selCourseId, subjectName, teacherId });
      setCourses(prev => prev.map(c => c._id === selCourseId ? r.data.course : c));
      setTeachers(prev => prev.map(t => t._id === teacherId ? { ...t, subject: subjectName } : t));
      const tName = teachers.find(t => t._id === teacherId)?.name;
      flash(setSubjectMsg, `✅ ${tName} assigned to ${subjectName}!`);
      setSubjectTeacherMap(prev => ({ ...prev, [subjectName]: "" }));
    } catch (err) { flash(setSubjectMsg, "⚠️ Failed."); }
  };

  return (
    <>
      <style>{styles}</style>
      <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} />
      <div className="admin-layout">
        <Navbar toggleSidebar={() => setShowSidebar(!showSidebar)} />
        <main className="admin-main">

          <div className="page-header" id="dashboard">
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-sub">Manage students, teachers, courses and subjects</p>
          </div>

          {/* STATS */}
          <div className="stat-grid">
            <div className="stat-card s1"><div className="stat-icon">🎓</div><div className="stat-val">{students.length}</div><div className="stat-lbl">Students</div></div>
            <div className="stat-card s2"><div className="stat-icon">👨‍🏫</div><div className="stat-val">{teachers.length}</div><div className="stat-lbl">Teachers</div></div>
            <div className="stat-card s3"><div className="stat-icon">📚</div><div className="stat-val">{courses.length}</div><div className="stat-lbl">Courses</div></div>
            <div className="stat-card s4"><div className="stat-icon">📊</div><div className="stat-val">{results.length}</div><div className="stat-lbl">Results</div></div>
          </div>

          {/* ── STUDENTS ── */}
          <div className="card" id="students">
            <div className="card-header">
              <h3 className="card-title">Students</h3>
              <span className="badge-count">{students.length} registered</span>
            </div>

            <p className="hint">💡 Students register themselves from the login page. You can view, delete, or assign them to a course below.</p>

            {/* Assign course to student */}
            <div className="sub-hd">🔗 Assign Course to Student</div>
            {assignStuMsg && <div className={assignStuMsg.startsWith("✅") ? "ok" : "err"}>{assignStuMsg}</div>}
            <div className="grid-3">
              <div className="field">
                <label>Select Student</label>
                <select className="sel" value={assignStuId} onChange={e => setAssignStuId(e.target.value)}>
                  <option value="">— Choose student —</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.name} {s.course ? `(${s.course})` : "(no course)"}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Course</label>
                <select className="sel" value={assignCourse} onChange={e => setAssignCourse(e.target.value)}>
                  <option value="">— Choose course —</option>
                  {courses.map(c => <option key={c._id} value={c.courseName}>{c.courseName}</option>)}
                </select>
              </div>
              <button className="btn btn-teal" style={{ marginTop: "1.4rem" }} onClick={assignCourseToStudent}>Assign</button>
            </div>

            <div className="divider" />

            {/* Student list */}
            {students.length === 0
              ? <div className="empty"><div className="empty-icon">🎓</div>No students registered yet</div>
              : students.map(s => (
                <div key={s._id} className="list-row">
                  <div className={`av av-stu`}>{ini(s.name)}</div>
                  <div className="li">
                    <div className="ln">{s.name}</div>
                    <div className="ls">
                      {s.email}
                      {s.course ? <span className="pill pill-g">{s.course}</span> : <span className="pill pill-r">No Course</span>}
                      {s.subjects?.length > 0 && <span className="pill pill-b">{s.subjects.length} subjects</span>}
                    </div>
                  </div>
                  <button className="btn-red" onClick={() => deleteStudent(s._id)}>Remove</button>
                </div>
              ))
            }
          </div>

          {/* ── TEACHERS ── */}
          <div className="card" id="teachers">
            <div className="card-header">
              <h3 className="card-title">Teachers</h3>
              <span className="badge-count">{teachers.length} teachers</span>
            </div>
            <p className="hint">💡 Teachers are added via the Register form. Assign them to subjects in the Courses section below.</p>
            {teachers.length === 0
              ? <div className="empty"><div className="empty-icon">👨‍🏫</div>No teachers yet</div>
              : teachers.map(t => (
                <div key={t._id} className="list-row">
                  <div className="av av-tch">{ini(t.name)}</div>
                  <div className="li">
                    <div className="ln">{t.name}</div>
                    <div className="ls">
                      {t.email}
                      {t.subject && <span className="pill pill-o">{t.subject}</span>}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>

          {/* ── COURSES & SUBJECTS ── */}
          <div className="card" id="courses">
            <div className="card-header">
              <h3 className="card-title">Courses & Subjects</h3>
              <span className="badge-count">{courses.length} courses</span>
            </div>

            {/* Create course */}
            {courseMsg && <div className={courseMsg.startsWith("✅") ? "ok" : "err"}>{courseMsg}</div>}
            <div className="sub-hd">➕ Create Course</div>
            <div className="grid-1a" style={{ marginBottom: "1.5rem" }}>
              <div className="field">
                <label>Course Name</label>
                <input className="inp" placeholder="e.g. BCA, MCA, BSc IT"
                  value={newCourse} onChange={e => setNewCourse(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && createCourse()} />
              </div>
              <button className="btn btn-orange" style={{ marginTop: "1.4rem" }} onClick={createCourse} disabled={!newCourse.trim()}>+ Create</button>
            </div>

            {/* Courses list */}
            {courses.length === 0
              ? <div className="empty"><div className="empty-icon">📚</div>No courses yet. Create one above!</div>
              : courses.map(c => (
                <div key={c._id} className="course-card">
                  <div className="cc-top">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div className="av av-crs" style={{ width: 32, height: 32, fontSize: "0.75rem" }}>{ini(c.courseName)}</div>
                      <span className="cc-name">{c.courseName}</span>
                      <span className="pill pill-b">{c.subjects?.length || 0} subjects</span>
                      <span className="pill pill-g">{c.students?.length || 0} students</span>
                    </div>
                    <button className="btn-red" onClick={() => deleteCourse(c._id, c.courseName)}>Delete</button>
                  </div>
                  {c.subjects?.length > 0 && (
                    <div>
                      {c.subjects.map((s, i) => (
                        <div key={i} style={{ fontSize: "0.78rem", color: "#6b7280", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.25rem 0" }}>
                          <span style={{ color: "#fbbf24", fontWeight: 500 }}>📘 {s.name}</span>
                          {s.teacher?.name
                            ? <span className="pill pill-g">👨‍🏫 {s.teacher.name}</span>
                            : <span style={{ color: "#4b5563" }}>No teacher</span>
                          }
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            }

            {/* Manage subjects for selected course */}
            {courses.length > 0 && (
              <>
                <div className="divider" />
                <div className="sub-hd">🧩 Manage Subjects & Assign Teachers</div>
                {subjectMsg && <div className={subjectMsg.startsWith("✅") ? "ok" : "err"}>{subjectMsg}</div>}

                <div className="grid-3">
                  <div className="field">
                    <label>Select Course</label>
                    <select className="sel" value={selCourseId} onChange={e => setSelCourseId(e.target.value)}>
                      {courses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>New Subject Name</label>
                    <input className="inp" placeholder="e.g. Python, Math, DSA"
                      value={newSubject} onChange={e => setNewSubject(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addSubject()} />
                  </div>
                  <button className="btn btn-orange" style={{ marginTop: "1.4rem" }} onClick={addSubject} disabled={!newSubject.trim()}>+ Add</button>
                </div>

                <div style={{ fontSize: "0.78rem", color: "#9ca3af", marginBottom: "0.75rem" }}>
                  Subjects in <strong style={{ color: "#fbbf24" }}>{selCourse?.courseName}</strong> — assign a teacher to each:
                </div>

                {!selCourse?.subjects?.length
                  ? <p style={{ fontSize: "0.82rem", color: "#4b5563", fontStyle: "italic" }}>No subjects yet. Add one above.</p>
                  : selCourse.subjects.map((s, i) => {
                    const assignedName = s.teacher?.name || teachers.find(t => t._id === s.teacher)?.name;
                    return (
                      <div key={i} className="subj-row">
                        <span className="subj-name">📘 {s.name}</span>
                        <span className="subj-tch">
                          {assignedName
                            ? <span className="pill pill-g">👨‍🏫 {assignedName}</span>
                            : <span style={{ color: "#4b5563" }}>No teacher</span>
                          }
                        </span>
                        <select className="subj-sel"
                          value={subjectTeacherMap[s.name] || ""}
                          onChange={e => setSubjectTeacherMap(prev => ({ ...prev, [s.name]: e.target.value }))}>
                          <option value="">— Assign teacher —</option>
                          {teachers.map(t => <option key={t._id} value={t._id}>{t.name} ({t.subject || "No subject"})</option>)}
                        </select>
                        <button className="subj-btn" onClick={() => assignTeacher(s.name)}>✓ Assign</button>
                        <button className="subj-rm" onClick={() => removeSubject(s.name)}>✕</button>
                      </div>
                    );
                  })
                }
              </>
            )}
          </div>

          {/* ── RESULTS ── */}
          <div className="card" id="results">
            <div className="card-header">
              <h3 className="card-title">Results</h3>
              <span className="badge-count">{results.length} records</span>
            </div>
            {results.length === 0
              ? <div className="empty"><div className="empty-icon">📊</div>No results yet</div>
              : results.map(r => (
                <div key={r._id} className="result-row">
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>{r?.student?.name || "Unknown"}</div>
                    <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>Exam result</div>
                  </div>
                  <span className="r-badge">Marks: {r?.marks}</span>
                </div>
              ))
            }
          </div>

        </main>
      </div>
    </>
  );
}

export default AdminDashboard;