import { useEffect, useState } from "react";
import API from "../../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0d0d14; font-family: 'DM Sans', sans-serif; color: #e2e2ee; }
  .student-root { min-height: 100vh; background: #0d0d14; }

  .s-navbar {
    height: 64px; background: #111118; border-bottom: 1px solid #22222f;
    position: sticky; top: 0; z-index: 998;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem; width: 100%;
  }
  .s-navbar-title { font-size: 1rem; font-weight: 600; color: #f1f1f6; }
  .s-navbar-title span { color: #818cf8; }
  .s-navbar-right { display: flex; align-items: center; gap: 0.75rem; }
  .s-badge {
    display: flex; align-items: center; gap: 0.5rem;
    background: #1e1e2a; border: 1px solid #2a2a38;
    border-radius: 20px; padding: 0.3rem 0.75rem 0.3rem 0.4rem;
    font-size: 0.82rem; color: #e2e2ee; font-weight: 500;
  }
  .s-avatar-sm {
    width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; color: #fff; font-weight: 600;
  }
  .s-logout-btn {
    padding: 0.3rem 0.75rem; background: rgba(220,38,38,0.1);
    border: 1px solid rgba(220,38,38,0.25); border-radius: 8px;
    color: #f87171; font-size: 0.78rem; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: background 0.2s;
  }
  .s-logout-btn:hover { background: rgba(220,38,38,0.2); }

  .student-main { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem; }
  @media (max-width: 600px) { .student-main { padding: 1rem; } }

  .s-profile-hero {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border: 1px solid #22222f; border-radius: 20px;
    padding: 2rem; display: flex; align-items: center;
    gap: 1.75rem; margin-bottom: 1.5rem; position: relative; overflow: hidden;
  }
  .s-profile-hero::before {
    content: ''; position: absolute; width: 250px; height: 250px;
    background: radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%);
    top: -80px; right: -50px; pointer-events: none;
  }
  .s-avatar-lg {
    width: 80px; height: 80px; border-radius: 50%;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; font-weight: 700; color: #fff;
    flex-shrink: 0; box-shadow: 0 8px 25px rgba(79,70,229,0.4);
  }
  .s-profile-info { flex: 1; min-width: 0; }
  .s-profile-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem; font-weight: 700; color: #f1f1f6; margin-bottom: 0.25rem;
  }
  .s-profile-email { font-size: 0.88rem; color: #6b7280; margin-bottom: 0.5rem; }
  .s-role-badge {
    display: inline-block; padding: 0.2rem 0.7rem;
    background: rgba(79,70,229,0.15); border: 1px solid rgba(79,70,229,0.3);
    border-radius: 20px; font-size: 0.75rem; color: #818cf8;
    font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em;
  }
  @media (max-width: 480px) { .s-profile-hero { flex-direction: column; text-align: center; } }

  .s-info-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 1rem; margin-bottom: 1.5rem;
  }
  .s-info-card {
    background: #16161f; border: 1px solid #22222f;
    border-radius: 14px; padding: 1.25rem 1.5rem; transition: transform 0.2s;
  }
  .s-info-card:hover { transform: translateY(-2px); }
  .s-info-label {
    font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em;
    color: #6b7280; font-weight: 500; margin-bottom: 0.4rem;
  }
  .s-info-value { font-size: 0.95rem; font-weight: 500; color: #e2e2ee; }

  .s-section-card {
    background: #16161f; border: 1px solid #22222f;
    border-radius: 16px; padding: 1.75rem; margin-bottom: 1.5rem;
  }
  .s-section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;
  }
  .s-section-title { font-size: 1.05rem; font-weight: 600; color: #f1f1f6; }

  /* COURSE CARDS */
  .s-course-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem; margin-bottom: 1rem;
  }
  .s-course-card {
    padding: 1.25rem; background: #1e1e2a; border: 2px solid #2a2a38;
    border-radius: 12px; cursor: pointer; transition: all 0.2s; text-align: center;
  }
  .s-course-card:hover { border-color: #4f46e5; background: rgba(79,70,229,0.08); }
  .s-course-card.selected { border-color: #4f46e5; background: rgba(79,70,229,0.12); }
  .s-course-icon { font-size: 2rem; margin-bottom: 0.5rem; }
  .s-course-name { font-size: 0.95rem; font-weight: 600; color: #f1f1f6; }
  .s-course-sub { font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem; }

  /* SUBJECT CHECKBOXES */
  .s-subjects-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.75rem; margin-bottom: 1.25rem;
  }
  .s-subject-item {
    display: flex; align-items: center; gap: 0.65rem;
    padding: 0.75rem 1rem; background: #1e1e2a; border: 1px solid #2a2a38;
    border-radius: 10px; cursor: pointer;
    transition: border-color 0.2s, background 0.2s; user-select: none;
  }
  .s-subject-item.selected {
    background: rgba(79,70,229,0.12); border-color: rgba(79,70,229,0.4);
  }
  .s-subject-item.selected .s-subject-check {
    background: #4f46e5; border-color: #4f46e5;
  }
  .s-subject-item.selected .s-subject-check::after {
    content: '✓'; color: #fff; font-size: 0.65rem;
    display: flex; align-items: center; justify-content: center;
  }
  .s-subject-check {
    width: 18px; height: 18px; border-radius: 5px;
    border: 2px solid #3a3a4f; background: transparent;
    flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .s-subject-name { font-size: 0.88rem; font-weight: 500; color: #e2e2ee; }
  .s-subject-teacher { font-size: 0.72rem; color: #6b7280; margin-top: 0.1rem; }

  .s-save-btn {
    padding: 0.65rem 1.5rem; border: none; border-radius: 10px;
    background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500;
    cursor: pointer; transition: opacity 0.2s, transform 0.15s;
  }
  .s-save-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .s-save-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .s-success-banner {
    background: rgba(5,150,105,0.1); border: 1px solid rgba(5,150,105,0.25);
    border-radius: 10px; padding: 0.65rem 1rem; margin-bottom: 1rem;
    color: #34d399; font-size: 0.85rem;
  }

  /* ATTENDANCE */
  .s-att-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.9rem 0; border-bottom: 1px solid #1e1e2a; gap: 1rem;
  }
  .s-att-item:last-child { border-bottom: none; }
  .s-att-left { flex: 1; min-width: 0; }
  .s-att-subject { font-size: 0.9rem; font-weight: 500; color: #e2e2ee; margin-bottom: 0.25rem; }
  .s-att-detail { font-size: 0.75rem; color: #6b7280; }
  .s-att-right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
  .s-att-bar-wrap { width: 100px; background: #1e1e2a; border-radius: 20px; height: 8px; overflow: hidden; }
  .s-att-bar { height: 100%; border-radius: 20px; transition: width 0.5s ease; }
  .s-att-pct { font-size: 0.82rem; font-weight: 600; min-width: 38px; text-align: right; }
  .s-att-dots { display: flex; gap: 3px; margin-top: 0.3rem; flex-wrap: wrap; }
  .s-att-dot { width: 8px; height: 8px; border-radius: 50%; }
  .s-att-dot.present { background: #34d399; }
  .s-att-dot.absent  { background: #f87171; }

  .s-empty { text-align: center; padding: 1.5rem; color: #4b5563; font-size: 0.88rem; }
  .s-empty-icon { font-size: 2rem; margin-bottom: 0.5rem; }

  .s-loading {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 60vh; gap: 1rem; color: #6b7280;
  }
  .s-spinner {
    width: 40px; height: 40px; border: 3px solid #22222f;
    border-top-color: #4f46e5; border-radius: 50%;
    animation: sspin 0.8s linear infinite;
  }
  @keyframes sspin { to { transform: rotate(360deg); } }
`;

const getInitials = (name = "") =>
  (name || "S").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

const attColor = (pct) => {
  if (pct >= 75) return "#34d399";
  if (pct >= 50) return "#fbbf24";
  return "#f87171";
};

// ✅ safely extract subject name — works for both string and object
const getSubjectName = (s) => {
  if (!s) return "";
  if (typeof s === "string") return s;
  return s.name || "";
};

// ✅ safely extract teacher name from subject object
const getSubjectTeacher = (s) => {
  if (!s || typeof s === "string") return null;
  if (s.teacher && typeof s.teacher === "object") return s.teacher.name;
  return null;
};

function StudentDashboard() {
  const [student,          setStudent]          = useState(null);
  const [courses,          setCourses]          = useState([]);
  const [selectedCourse,   setSelectedCourse]   = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [attendance,       setAttendance]       = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [saving,           setSaving]           = useState(false);
  const [saveMsg,          setSaveMsg]          = useState("");

  useEffect(() => {
    Promise.all([
      API.get("/students/me"),
      API.get("/courses"),
      API.get("/attendance/me").catch(() => ({ data: [] }))
    ])
      .then(([sRes, cRes, aRes]) => {
        const studentData = sRes.data;
        setStudent(studentData);
        setSelectedSubjects(studentData.subjects || []);

        const allCourses = cRes.data || [];
        setCourses(allCourses);

        // auto-select student's enrolled course if they have one
        if (studentData.course) {
          const myCourse = allCourses.find(
            c => c.courseName?.toLowerCase() === studentData.course?.toLowerCase()
          );
          if (myCourse) setSelectedCourse(myCourse);
        }

        setAttendance(Array.isArray(aRes.data) ? aRes.data : []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // ✅ available subjects — extracted as strings from the selected course
  const availableSubjects = selectedCourse?.subjects || [];

  const toggleSubject = (subjectName) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectName)
        ? prev.filter(s => s !== subjectName)
        : [...prev, subjectName]
    );
  };

  const saveSubjects = async () => {
    if (!selectedCourse) return;
    setSaving(true);
    try {
      const res = await API.put("/students/enroll", {
        subjects:   selectedSubjects,
        course:     selectedCourse.courseName  // also update course
      });
      setStudent(res.data.student);
      setSaveMsg("Subjects saved! Your teacher's dashboard will now show you.");
      setTimeout(() => setSaveMsg(""), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { localStorage.clear(); window.location.href = "/"; };

  const courseName = student?.course || "Not Selected";

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="student-root">
        <div className="s-loading"><div className="s-spinner" /><span>Loading…</span></div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="student-root">

        {/* NAVBAR */}
        <nav className="s-navbar">
          <div className="s-navbar-title"><span>Edu</span>Manage CMS</div>
          <div className="s-navbar-right">
            <div className="s-badge">
              <div className="s-avatar-sm">{getInitials(student?.name)}</div>
              {student?.name?.split(" ")[0] || "Student"}
            </div>
            <button className="s-logout-btn" onClick={handleLogout}>Sign Out</button>
          </div>
        </nav>

        <main className="student-main">

          {/* PROFILE HERO */}
          <div className="s-profile-hero">
            <div className="s-avatar-lg">{getInitials(student?.name)}</div>
            <div className="s-profile-info">
              <div className="s-profile-name">{student?.name || "—"}</div>
              <div className="s-profile-email">{student?.email || "—"}</div>
              <span className="s-role-badge">🎓 {courseName}</span>
            </div>
          </div>

          {/* INFO CARDS */}
          <div className="s-info-grid">
            <div className="s-info-card">
              <div className="s-info-label">Full Name</div>
              <div className="s-info-value">{student?.name || "—"}</div>
            </div>
            <div className="s-info-card">
              <div className="s-info-label">Email</div>
              <div className="s-info-value">{student?.email || "—"}</div>
            </div>
            <div className="s-info-card">
              <div className="s-info-label">Course</div>
              <div className="s-info-value" style={{ color: courseName === "Not Selected" ? "#f87171" : "#34d399" }}>
                {courseName}
              </div>
            </div>
            <div className="s-info-card">
              <div className="s-info-label">Subjects</div>
              <div className="s-info-value">{selectedSubjects.length} enrolled</div>
            </div>
          </div>

          {/* ── STEP 1: SELECT COURSE ── */}
          <div className="s-section-card">
            <div className="s-section-header">
              <div className="s-section-title">📚 Step 1 — Select Your Course</div>
              {selectedCourse && (
                <span style={{
                  fontSize: "0.78rem", color: "#34d399",
                  background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.3)",
                  padding: "0.2rem 0.65rem", borderRadius: "20px"
                }}>
                  ✓ {selectedCourse.courseName} selected
                </span>
              )}
            </div>

            {courses.length === 0 ? (
              <div className="s-empty">
                <div className="s-empty-icon">📚</div>
                No courses available yet. Ask your admin to create courses.
              </div>
            ) : (
              <div className="s-course-grid">
                {courses.map(c => (
                  <div
                    key={c._id}
                    className={`s-course-card ${selectedCourse?._id === c._id ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedCourse(c);
                      // reset subject selection when switching courses
                      setSelectedSubjects([]);
                    }}
                  >
                    <div className="s-course-icon">🎓</div>
                    <div className="s-course-name">{c.courseName}</div>
                    <div className="s-course-sub">
                      {c.subjects?.length || 0} subjects
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── STEP 2: SELECT SUBJECTS ── */}
          {selectedCourse && (
            <div className="s-section-card">
              <div className="s-section-header">
                <div className="s-section-title">
                  🧩 Step 2 — Choose Subjects in {selectedCourse.courseName}
                </div>
                <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                  {selectedSubjects.length} selected
                </span>
              </div>

              {saveMsg && <div className="s-success-banner">✅ {saveMsg}</div>}

              {availableSubjects.length === 0 ? (
                <div className="s-empty">
                  <div className="s-empty-icon">🧩</div>
                  No subjects in this course yet. Ask your admin to add subjects.
                </div>
              ) : (
                <>
                  <div className="s-subjects-grid">
                    {availableSubjects.map((s) => {
                      // ✅ extract name safely — s can be string or {name, teacher, _id}
                      const subjectName    = getSubjectName(s);
                      const teacherName    = getSubjectTeacher(s);
                      const isSelected     = selectedSubjects.includes(subjectName);

                      return (
                        <div
                          key={subjectName}  // ✅ always a string key
                          className={`s-subject-item ${isSelected ? "selected" : ""}`}
                          onClick={() => toggleSubject(subjectName)}
                        >
                          <div className="s-subject-check" />
                          <div>
                            {/* ✅ render only the string name — not the object */}
                            <div className="s-subject-name">{subjectName}</div>
                            {teacherName && (
                              <div className="s-subject-teacher">👨‍🏫 {teacherName}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    className="s-save-btn"
                    onClick={saveSubjects}
                    disabled={saving || selectedSubjects.length === 0}
                  >
                    {saving ? "Saving…" : "✓ Enroll in Selected Subjects"}
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── ATTENDANCE ── */}
          <div className="s-section-card">
            <div className="s-section-header">
              <div className="s-section-title">📊 My Attendance</div>
              {attendance.length > 0 && (
                <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                  {attendance.length} subject{attendance.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {attendance.length === 0 ? (
              <div className="s-empty">
                <div className="s-empty-icon">📋</div>
                No attendance recorded yet.
                {selectedSubjects.length === 0
                  ? " Enroll in subjects first."
                  : " Your teacher will mark attendance once classes begin."}
              </div>
            ) : (
              attendance.map((a, i) => (
                <div key={i} className="s-att-item">
                  <div className="s-att-left">
                    <div className="s-att-subject">{a.subject}</div>
                    <div className="s-att-detail">
                      {a.present} present · {a.absent} absent · {a.total} classes
                    </div>
                    {a.recent?.length > 0 && (
                      <div className="s-att-dots">
                        {a.recent.map((r, idx) => (
                          <div key={idx} className={`s-att-dot ${r.status}`} title={`${r.date}: ${r.status}`} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="s-att-right">
                    <div className="s-att-bar-wrap">
                      <div className="s-att-bar" style={{ width: `${a.percentage}%`, background: attColor(a.percentage) }} />
                    </div>
                    <div className="s-att-pct" style={{ color: attColor(a.percentage) }}>{a.percentage}%</div>
                  </div>
                </div>
              ))
            )}
          </div>

        </main>
      </div>
    </>
  );
}

export default StudentDashboard;