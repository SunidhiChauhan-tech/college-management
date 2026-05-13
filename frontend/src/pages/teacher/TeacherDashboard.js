import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0d0d14; font-family: 'DM Sans', sans-serif; color: #e2e2ee; }
  .teacher-layout { min-height: 100vh; background: #0d0d14; }

  /* NAVBAR */
  .t-navbar {
    height: 64px; background: #111118; border-bottom: 1px solid #22222f;
    position: sticky; top: 0; z-index: 998;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem; width: 100%;
  }
  .t-navbar-title { font-size: 1rem; font-weight: 600; color: #f1f1f6; }
  .t-navbar-title span { color: #34d399; }
  .t-navbar-right { display: flex; align-items: center; gap: 0.75rem; }
  .t-badge {
    display: flex; align-items: center; gap: 0.5rem;
    background: #1e1e2a; border: 1px solid #2a2a38;
    border-radius: 20px; padding: 0.3rem 0.75rem 0.3rem 0.4rem;
    font-size: 0.82rem; color: #e2e2ee; font-weight: 500;
  }
  .t-avatar-sm {
    width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg, #059669, #0d9488);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; color: #fff; font-weight: 600;
  }
  .t-logout-btn {
    padding: 0.3rem 0.75rem; background: rgba(220,38,38,0.1);
    border: 1px solid rgba(220,38,38,0.25); border-radius: 8px;
    color: #f87171; font-size: 0.78rem; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: background 0.2s;
  }
  .t-logout-btn:hover { background: rgba(220,38,38,0.2); }

  /* MAIN */
  .teacher-main { max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem; }
  @media (max-width: 600px) { .teacher-main { padding: 1rem; } }

  /* TABS */
  .t-tabs {
    display: flex; gap: 0.5rem; margin-bottom: 2rem;
    background: #16161f; border: 1px solid #22222f;
    border-radius: 14px; padding: 0.35rem; flex-wrap: wrap;
  }
  .t-tab {
    flex: 1; min-width: 100px; padding: 0.6rem 0.75rem;
    border: none; background: transparent; color: #6b7280;
    border-radius: 10px; font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; font-weight: 500; cursor: pointer;
    transition: all 0.2s; white-space: nowrap; text-align: center;
  }
  .t-tab.active {
    background: linear-gradient(135deg, #059669, #0d9488);
    color: #fff; box-shadow: 0 2px 10px rgba(5,150,105,0.3);
  }

  /* SECTION CARD */
  .t-section-card {
    background: #16161f; border: 1px solid #22222f;
    border-radius: 16px; padding: 1.75rem; margin-bottom: 1.5rem;
  }
  .t-section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;
  }
  .t-section-title { font-size: 1.05rem; font-weight: 600; color: #f1f1f6; }
  .t-count-badge {
    font-size: 0.78rem; color: #6b7280; background: #1e1e2a;
    padding: 0.25rem 0.65rem; border-radius: 20px; border: 1px solid #2a2a38;
  }

  /* PROFILE HERO */
  .t-profile-hero {
    background: linear-gradient(135deg, #0f1f1a 0%, #0d1f17 100%);
    border: 1px solid #1a3a2e; border-radius: 20px;
    padding: 2rem; display: flex; align-items: center;
    gap: 1.75rem; margin-bottom: 1.5rem; position: relative; overflow: hidden;
  }
  .t-profile-hero::before {
    content: ''; position: absolute; width: 280px; height: 280px;
    background: radial-gradient(circle, rgba(5,150,105,0.12) 0%, transparent 70%);
    top: -80px; right: -60px; pointer-events: none;
  }
  .t-avatar-lg {
    width: 80px; height: 80px; border-radius: 50%;
    background: linear-gradient(135deg, #059669, #0d9488);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; font-weight: 700; color: #fff;
    flex-shrink: 0; box-shadow: 0 8px 25px rgba(5,150,105,0.4);
  }
  .t-profile-info { flex: 1; min-width: 0; }
  .t-profile-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem; font-weight: 700; color: #f1f1f6; margin-bottom: 0.25rem;
  }
  .t-profile-email { font-size: 0.88rem; color: #6b7280; margin-bottom: 0.5rem; }
  .t-role-badge {
    display: inline-block; padding: 0.2rem 0.7rem;
    background: rgba(5,150,105,0.15); border: 1px solid rgba(5,150,105,0.3);
    border-radius: 20px; font-size: 0.75rem; color: #34d399;
    font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em;
  }
  @media (max-width: 480px) { .t-profile-hero { flex-direction: column; text-align: center; } }

  /* INFO GRID */
  .t-info-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem; margin-bottom: 1.5rem;
  }
  .t-info-card {
    background: #16161f; border: 1px solid #22222f;
    border-radius: 14px; padding: 1.25rem 1.5rem; transition: transform 0.2s;
  }
  .t-info-card:hover { transform: translateY(-2px); }
  .t-info-label {
    font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em;
    color: #6b7280; font-weight: 500; margin-bottom: 0.4rem;
  }
  .t-info-value { font-size: 0.95rem; font-weight: 500; color: #e2e2ee; }

  /* QUICK STATS */
  .t-quick-stats {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1rem; margin-bottom: 1.5rem;
  }
  @media (max-width: 480px) { .t-quick-stats { grid-template-columns: 1fr; } }
  .t-qs-card {
    background: #16161f; border: 1px solid #22222f;
    border-radius: 14px; padding: 1.25rem; text-align: center;
    position: relative; overflow: hidden;
  }
  .t-qs-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    border-radius: 14px 14px 0 0;
  }
  .t-qs-card.c1::before { background: linear-gradient(90deg, #059669, #34d399); }
  .t-qs-card.c2::before { background: linear-gradient(90deg, #4f46e5, #818cf8); }
  .t-qs-card.c3::before { background: linear-gradient(90deg, #d97706, #fbbf24); }
  .t-qs-value {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem; font-weight: 700; color: #f1f1f6; line-height: 1;
  }
  .t-qs-label {
    font-size: 0.72rem; color: #6b7280;
    text-transform: uppercase; letter-spacing: 0.08em; margin-top: 0.3rem;
  }

  /* LIST ITEMS */
  .t-list-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.75rem 0; border-bottom: 1px solid #1e1e2a; gap: 1rem;
  }
  .t-list-item:last-child { border-bottom: none; }
  .t-list-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; font-weight: 600; color: #fff; flex-shrink: 0;
  }
  .t-list-info { flex: 1; min-width: 0; }
  .t-list-name {
    font-size: 0.9rem; font-weight: 500; color: #e2e2ee;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .t-list-sub {
    font-size: 0.78rem; color: #6b7280;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  /* RESULTS */
  .t-result-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.75rem 0; border-bottom: 1px solid #1e1e2a; gap: 1rem;
  }
  .t-result-item:last-child { border-bottom: none; }
  .t-marks-badge {
    padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600;
  }
  .t-marks-badge.high { background: rgba(5,150,105,0.15); border: 1px solid rgba(5,150,105,0.3); color: #34d399; }
  .t-marks-badge.mid  { background: rgba(217,119,6,0.15);  border: 1px solid rgba(217,119,6,0.3);  color: #fbbf24; }
  .t-marks-badge.low  { background: rgba(220,38,38,0.12);  border: 1px solid rgba(220,38,38,0.25); color: #f87171; }

  /* MARKS FORM */
  .t-marks-form {
    display: grid; grid-template-columns: 1fr 1fr auto;
    gap: 0.75rem; margin-bottom: 1.25rem; align-items: end;
  }
  @media (max-width: 560px) { .t-marks-form { grid-template-columns: 1fr; } }
  .t-form-field label {
    display: block; font-size: 0.72rem; font-weight: 500; color: #9ca3af;
    text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem;
  }
  .t-input {
    width: 100%; padding: 0.65rem 0.9rem; background: #1e1e2a;
    border: 1px solid #2a2a38; border-radius: 10px; color: #e2e2ee;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem; outline: none;
    transition: border-color 0.2s;
  }
  .t-input:focus { border-color: #059669; }
  .t-input::placeholder { color: #4b5563; }
  .t-select {
    width: 100%; padding: 0.65rem 0.9rem; background: #1e1e2a;
    border: 1px solid #2a2a38; border-radius: 10px; color: #e2e2ee;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
    outline: none; cursor: pointer; appearance: none;
  }
  .t-select:focus { border-color: #059669; }
  .t-add-btn {
    padding: 0.65rem 1.25rem; border: none; border-radius: 10px;
    background: linear-gradient(135deg, #059669, #0d9488); color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500;
    cursor: pointer; white-space: nowrap; transition: opacity 0.2s, transform 0.15s;
  }
  .t-add-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .t-add-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* ── ATTENDANCE MARKING UI ── */
  .att-toolbar {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 1.25rem; flex-wrap: wrap;
  }

  .att-date-input {
    padding: 0.55rem 0.9rem; background: #1e1e2a;
    border: 1px solid #2a2a38; border-radius: 10px; color: #e2e2ee;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem; outline: none;
    transition: border-color 0.2s; cursor: pointer;
  }
  .att-date-input:focus { border-color: #059669; }

  .att-quick-btns { display: flex; gap: 0.5rem; flex-wrap: wrap; }

  .att-quick-btn {
    padding: 0.45rem 0.85rem; border: 1px solid #2a2a38;
    border-radius: 8px; background: #1e1e2a; color: #9ca3af;
    font-size: 0.78rem; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
  }
  .att-quick-btn:hover { background: #252534; color: #e2e2ee; }
  .att-quick-btn.present-all {
    border-color: rgba(5,150,105,0.4); color: #34d399;
    background: rgba(5,150,105,0.08);
  }
  .att-quick-btn.absent-all {
    border-color: rgba(220,38,38,0.3); color: #f87171;
    background: rgba(220,38,38,0.08);
  }

  /* attendance student row */
  .att-student-row {
    display: flex; align-items: center;
    padding: 0.85rem 0; border-bottom: 1px solid #1e1e2a; gap: 1rem;
  }
  .att-student-row:last-child { border-bottom: none; }

  .att-student-info { flex: 1; min-width: 0; }
  .att-student-name {
    font-size: 0.9rem; font-weight: 500; color: #e2e2ee;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .att-student-email {
    font-size: 0.75rem; color: #6b7280;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  /* present / absent toggle */
  .att-toggle {
    display: flex; border-radius: 10px; overflow: hidden;
    border: 1px solid #2a2a38; flex-shrink: 0;
  }

  .att-toggle-btn {
    padding: 0.4rem 0.85rem; border: none; background: #1e1e2a;
    font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 500;
    cursor: pointer; transition: all 0.15s; color: #6b7280;
  }

  .att-toggle-btn.present.active {
    background: rgba(5,150,105,0.2); color: #34d399;
  }

  .att-toggle-btn.absent.active {
    background: rgba(220,38,38,0.15); color: #f87171;
  }

  /* save button */
  .att-save-btn {
    width: 100%; padding: 0.85rem; border: none; border-radius: 12px;
    background: linear-gradient(135deg, #059669, #0d9488); color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600;
    cursor: pointer; margin-top: 1.25rem;
    transition: opacity 0.2s, transform 0.15s;
    box-shadow: 0 4px 15px rgba(5,150,105,0.3);
  }
  .att-save-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .att-save-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* ── ATTENDANCE SUMMARY TABLE ── */
  .att-summary-row {
    display: flex; align-items: center;
    padding: 0.85rem 0; border-bottom: 1px solid #1e1e2a; gap: 1rem;
  }
  .att-summary-row:last-child { border-bottom: none; }

  .att-summary-info { flex: 1; min-width: 0; }
  .att-summary-name { font-size: 0.9rem; font-weight: 500; color: #e2e2ee; }
  .att-summary-sub  { font-size: 0.75rem; color: #6b7280; margin-top: 0.1rem; }

  .att-bar-wrap {
    width: 120px; background: #1e1e2a;
    border-radius: 20px; height: 8px; overflow: hidden; flex-shrink: 0;
  }
  .att-bar { height: 100%; border-radius: 20px; transition: width 0.5s ease; }

  .att-pct-badge {
    padding: 0.2rem 0.6rem; border-radius: 20px;
    font-size: 0.78rem; font-weight: 600; min-width: 52px; text-align: center;
  }
  .att-pct-badge.good { background: rgba(5,150,105,0.15); border: 1px solid rgba(5,150,105,0.3); color: #34d399; }
  .att-pct-badge.warn { background: rgba(217,119,6,0.15);  border: 1px solid rgba(217,119,6,0.3);  color: #fbbf24; }
  .att-pct-badge.bad  { background: rgba(220,38,38,0.12);  border: 1px solid rgba(220,38,38,0.25); color: #f87171; }

  /* BANNERS */
  .t-success-banner {
    background: rgba(5,150,105,0.1); border: 1px solid rgba(5,150,105,0.25);
    border-radius: 10px; padding: 0.75rem 1rem; margin-bottom: 1rem;
    color: #34d399; font-size: 0.85rem;
  }
  .t-error-banner {
    background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.25);
    border-radius: 10px; padding: 0.75rem 1rem; margin-bottom: 1rem;
    color: #f87171; font-size: 0.85rem;
  }
  .t-info-banner {
    background: rgba(79,70,229,0.1); border: 1px solid rgba(79,70,229,0.25);
    border-radius: 10px; padding: 0.75rem 1rem; margin-bottom: 1rem;
    color: #818cf8; font-size: 0.85rem;
  }

  /* ANNOUNCEMENTS */
  .t-textarea {
    width: 100%; padding: 0.75rem 0.9rem; background: #1e1e2a;
    border: 1px solid #2a2a38; border-radius: 10px; color: #e2e2ee;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
    outline: none; resize: vertical; min-height: 90px;
    transition: border-color 0.2s; margin-bottom: 0.75rem;
  }
  .t-textarea:focus { border-color: #059669; }
  .t-textarea::placeholder { color: #4b5563; }
  .t-announcement-item {
    padding: 1rem; background: #1a1a26; border: 1px solid #2a2a38;
    border-radius: 12px; margin-bottom: 0.75rem; position: relative;
  }
  .t-announcement-item:last-child { margin-bottom: 0; }
  .t-announcement-text { font-size: 0.9rem; color: #d1d5db; line-height: 1.6; }
  .t-announcement-meta { font-size: 0.72rem; color: #4b5563; margin-top: 0.5rem; }
  .t-delete-ann {
    position: absolute; top: 0.75rem; right: 0.75rem;
    background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.2);
    border-radius: 6px; color: #f87171; font-size: 0.72rem;
    padding: 0.2rem 0.5rem; cursor: pointer; transition: background 0.2s;
  }
  .t-delete-ann:hover { background: rgba(220,38,38,0.2); }

  /* EMPTY + LOADING */
  .t-empty { text-align: center; padding: 2rem; color: #4b5563; font-size: 0.88rem; }
  .t-empty-icon { font-size: 2rem; margin-bottom: 0.5rem; }
  .t-loading {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 60vh; gap: 1rem; color: #6b7280;
  }
  .t-spinner {
    width: 40px; height: 40px; border: 3px solid #22222f;
    border-top-color: #059669; border-radius: 50%;
    animation: tspin 0.8s linear infinite;
  }
  @keyframes tspin { to { transform: rotate(360deg); } }
`;

// ── helpers ──
const getInitials = (name = "") =>
  name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";

const todayStr = () => new Date().toISOString().split("T")[0];

const marksBadge = (m) => {
  const n = Number(m);
  if (n >= 75) return "high";
  if (n >= 50) return "mid";
  return "low";
};

const pctClass = (p) => p >= 75 ? "good" : p >= 50 ? "warn" : "bad";
const pctColor = (p) => p >= 75 ? "#34d399" : p >= 50 ? "#fbbf24" : "#f87171";

const nowStr = () =>
  new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const TABS = ["Overview", "Students", "Attendance", "Results", "Announcements"];

function TeacherDashboard() {
  const [teacher,        setTeacher]        = useState(null);
  const [myStudents,     setMyStudents]     = useState([]);   // only teacher's subject students
  const [allResults,     setAllResults]     = useState([]);
  const [announcements,  setAnnouncements]  = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [activeTab,      setActiveTab]      = useState("Overview");

  // results form
  const [selStudent,  setSelStudent]  = useState("");
  const [marks,       setMarks]       = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [resultMsg,   setResultMsg]   = useState(null);

  // attendance state
  const [attDate,      setAttDate]      = useState(todayStr());
  const [attRecords,   setAttRecords]   = useState({}); // { studentId: "present"|"absent" }
  const [attSummary,   setAttSummary]   = useState([]); // percentage per student
  const [attSaving,    setAttSaving]    = useState(false);
  const [attMsg,       setAttMsg]       = useState(null);
  const [attView,      setAttView]      = useState("mark"); // "mark" | "summary"
  const [loadingAtt,   setLoadingAtt]   = useState(false);

  // announcements
  const [annText, setAnnText] = useState("");

  // ── initial fetch ──
  useEffect(() => {
    Promise.all([
      API.get("/teachers/me"),
      API.get("/students/my-students"),  // only teacher's subject students
      API.get("/results"),
    ])
      .then(([tRes, sRes, rRes]) => {
        setTeacher(tRes.data);
        setMyStudents(sRes.data);
        setAllResults(rRes.data);

        // initialise all students as "present" by default
        const init = {};
        sRes.data.forEach(s => { init[s._id] = "present"; });
        setAttRecords(init);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    const saved = localStorage.getItem("teacher_announcements");
    if (saved) { try { setAnnouncements(JSON.parse(saved)); } catch (_) {} }
  }, []);

  // ── fetch existing attendance for selected date ──
  const fetchAttendanceForDate = useCallback(async (date) => {
    setLoadingAtt(true);
    try {
      const res = await API.get(`/attendance/my-subject?date=${date}`);
      const existing = res.data.records || [];

      // pre-fill attRecords with whatever was already marked
      setAttRecords(prev => {
        const updated = { ...prev };
        existing.forEach(r => {
          if (r.student?._id) updated[r.student._id] = r.status;
        });
        return updated;
      });

      if (existing.length > 0) {
        setAttMsg({
          type: "info",
          text: `${existing.length} records already exist for ${date}. You can update them.`
        });
      } else {
        setAttMsg(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAtt(false);
    }
  }, []);

  // fetch attendance when date changes or tab opens
  useEffect(() => {
    if (activeTab === "Attendance") {
      fetchAttendanceForDate(attDate);
    }
  }, [activeTab, attDate, fetchAttendanceForDate]);

  // ── fetch summary ──
  const fetchSummary = async () => {
    try {
      const res = await API.get("/attendance/summary");
      setAttSummary(res.data.summary || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "Attendance" && attView === "summary") {
      fetchSummary();
    }
  }, [activeTab, attView]);

  // ── toggle one student ──
  const toggleStatus = (studentId) => {
    setAttRecords(prev => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present"
    }));
  };

  // ── mark all present / all absent ──
  const markAll = (status) => {
    const updated = {};
    myStudents.forEach(s => { updated[s._id] = status; });
    setAttRecords(updated);
  };

  // ── save attendance ──
  const saveAttendance = async () => {
    if (myStudents.length === 0) return;
    setAttSaving(true);
    setAttMsg(null);

    const records = myStudents.map(s => ({
      studentId: s._id,
      status: attRecords[s._id] || "absent"
    }));

    try {
      const res = await API.post("/attendance/mark", {
        records,
        date: attDate
      });

      setAttMsg({
        type: "success",
        text: `✅ Attendance saved for ${res.data.saved?.length || 0} students on ${attDate}`
      });

      // refresh summary
      fetchSummary();

    } catch (err) {
      setAttMsg({ type: "error", text: "❌ Failed to save attendance. Please try again." });
      console.error(err);
    } finally {
      setAttSaving(false);
      setTimeout(() => setAttMsg(null), 5000);
    }
  };

  // ── results ──
  const handleAddResult = async () => {
    if (!selStudent || !marks) return;
    setSubmitting(true);
    setResultMsg(null);
    try {
      const res = await API.post("/results/add", {
        student: selStudent,
        marks: Number(marks)
      });
      const studentObj = myStudents.find(s => s._id === selStudent);
      setAllResults(prev => [...prev, {
        ...res.data,
        student: studentObj || { _id: selStudent, name: "Unknown" }
      }]);
      setSelStudent(""); setMarks("");
      setResultMsg({ type: "success", text: `Marks added for ${studentObj?.name}!` });
      setTimeout(() => setResultMsg(null), 3000);
    } catch (err) {
      setResultMsg({ type: "error", text: "Failed to save result." });
    } finally {
      setSubmitting(false);
    }
  };

  // ── announcements ──
  const addAnnouncement = () => {
    if (!annText.trim()) return;
    const updated = [{ id: Date.now(), text: annText.trim(), time: nowStr() }, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem("teacher_announcements", JSON.stringify(updated));
    setAnnText("");
  };

  const deleteAnnouncement = (id) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem("teacher_announcements", JSON.stringify(updated));
  };

  const handleLogout = () => { localStorage.clear(); window.location.href = "/"; };

  const avgMarks = allResults.length
    ? Math.round(allResults.reduce((s, r) => s + Number(r.marks), 0) / allResults.length)
    : 0;

  const presentCount = Object.values(attRecords).filter(v => v === "present").length;
  const absentCount  = myStudents.length - presentCount;

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="teacher-layout">
        <div className="t-loading"><div className="t-spinner" /><span>Loading dashboard…</span></div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="teacher-layout">

        {/* NAVBAR */}
        <nav className="t-navbar">
          <div className="t-navbar-title"><span>Edu</span>Manage CMS</div>
          <div className="t-navbar-right">
            <div className="t-badge">
              <div className="t-avatar-sm">{getInitials(teacher?.name || "T")}</div>
              {teacher?.name?.split(" ")[0] || "Teacher"}
            </div>
            <button className="t-logout-btn" onClick={handleLogout}>Sign Out</button>
          </div>
        </nav>

        <main className="teacher-main">

          {/* TABS */}
          <div className="t-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`t-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {{ Overview: "📊 ", Students: "🎓 ", Attendance: "📋 ", Results: "📈 ", Announcements: "📢 " }[tab]}
                {tab}
              </button>
            ))}
          </div>


          {/* ══════ OVERVIEW ══════ */}
          {activeTab === "Overview" && (
            <>
              <div className="t-profile-hero">
                <div className="t-avatar-lg">{getInitials(teacher?.name || "T")}</div>
                <div className="t-profile-info">
                  <div className="t-profile-name">{teacher?.name || "—"}</div>
                  <div className="t-profile-email">{teacher?.email || "—"}</div>
                  <span className="t-role-badge">👨‍🏫 {teacher?.subject || "Teacher"}</span>
                </div>
              </div>
              <div className="t-info-grid">
                <div className="t-info-card"><div className="t-info-label">Name</div><div className="t-info-value">{teacher?.name || "—"}</div></div>
                <div className="t-info-card"><div className="t-info-label">Email</div><div className="t-info-value">{teacher?.email || "—"}</div></div>
                <div className="t-info-card"><div className="t-info-label">Subject</div><div className="t-info-value">{teacher?.subject || "General"}</div></div>
                <div className="t-info-card"><div className="t-info-label">Status</div><div className="t-info-value" style={{ color: "#34d399" }}>● Active</div></div>
              </div>
              <div className="t-quick-stats">
                <div className="t-qs-card c1"><div className="t-qs-value">{myStudents.length}</div><div className="t-qs-label">My Students</div></div>
                <div className="t-qs-card c2"><div className="t-qs-value">{allResults.length}</div><div className="t-qs-label">Results</div></div>
                <div className="t-qs-card c3"><div className="t-qs-value">{avgMarks}%</div><div className="t-qs-label">Avg Marks</div></div>
              </div>
              <div className="t-section-card">
                <div className="t-section-header">
                  <div className="t-section-title">Recent Results</div>
                  <button className="t-add-btn" style={{ padding: "0.35rem 0.85rem", fontSize: "0.78rem" }} onClick={() => setActiveTab("Results")}>View All →</button>
                </div>
                {allResults.length === 0
                  ? <div className="t-empty"><div className="t-empty-icon">📊</div>No results yet</div>
                  : allResults.slice(0, 4).map(r => (
                    <div key={r._id} className="t-result-item">
                      <div className="t-list-avatar">{getInitials(r.student?.name)}</div>
                      <div className="t-list-info"><div className="t-list-name">{r.student?.name || "Unknown"}</div></div>
                      <span className={`t-marks-badge ${marksBadge(r.marks)}`}>{r.marks} marks</span>
                    </div>
                  ))
                }
              </div>
            </>
          )}


          {/* ══════ STUDENTS ══════ */}
          {activeTab === "Students" && (
            <div className="t-section-card">
              <div className="t-section-header">
                <div className="t-section-title">
                  Students enrolled in {teacher?.subject || "your subject"}
                </div>
                <span className="t-count-badge">{myStudents.length} students</span>
              </div>
              {myStudents.length === 0
                ? <div className="t-empty"><div className="t-empty-icon">🎓</div>No students have enrolled in {teacher?.subject} yet</div>
                : myStudents.map(s => (
                  <div key={s._id} className="t-list-item">
                    <div className="t-list-avatar">{getInitials(s.name)}</div>
                    <div className="t-list-info">
                      <div className="t-list-name">{s.name}</div>
                      <div className="t-list-sub">{s.email}</div>
                    </div>
                    <span className="t-role-badge" style={{ fontSize: "0.72rem" }}>
                      {s.course || "BCA"}
                    </span>
                  </div>
                ))
              }
            </div>
          )}


          {/* ══════ ATTENDANCE ══════ */}
          {activeTab === "Attendance" && (
            <>
              {/* Mark / Summary toggle */}
              <div className="t-section-card" style={{ padding: "1rem 1.75rem" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className={`t-tab ${attView === "mark" ? "active" : ""}`}
                    style={{ flex: "unset", minWidth: "unset" }}
                    onClick={() => setAttView("mark")}
                  >
                    📋 Mark Attendance
                  </button>
                  <button
                    className={`t-tab ${attView === "summary" ? "active" : ""}`}
                    style={{ flex: "unset", minWidth: "unset" }}
                    onClick={() => setAttView("summary")}
                  >
                    📊 Summary
                  </button>
                </div>
              </div>

              {/* ── MARK ATTENDANCE VIEW ── */}
              {attView === "mark" && (
                <div className="t-section-card">
                  <div className="t-section-header">
                    <div className="t-section-title">
                      Mark Attendance — {teacher?.subject}
                    </div>
                    <span className="t-count-badge">
                      {presentCount} present · {absentCount} absent
                    </span>
                  </div>

                  {/* feedback banners */}
                  {attMsg && (
                    <div className={
                      attMsg.type === "success" ? "t-success-banner" :
                      attMsg.type === "info"    ? "t-info-banner"    : "t-error-banner"
                    }>
                      {attMsg.text}
                    </div>
                  )}

                  {/* toolbar — date picker + quick buttons */}
                  <div className="att-toolbar">
                    <div className="t-form-field" style={{ margin: 0 }}>
                      <label style={{
                        display: "block", fontSize: "0.72rem", fontWeight: 500,
                        color: "#9ca3af", textTransform: "uppercase",
                        letterSpacing: "0.05em", marginBottom: "0.35rem"
                      }}>
                        Date
                      </label>
                      <input
                        type="date"
                        className="att-date-input"
                        value={attDate}
                        max={todayStr()}
                        onChange={e => setAttDate(e.target.value)}
                      />
                    </div>

                    <div className="att-quick-btns" style={{ marginTop: "1.4rem" }}>
                      <button className="att-quick-btn present-all" onClick={() => markAll("present")}>
                        ✅ All Present
                      </button>
                      <button className="att-quick-btn absent-all" onClick={() => markAll("absent")}>
                        ❌ All Absent
                      </button>
                    </div>
                  </div>

                  {/* loading existing records */}
                  {loadingAtt && (
                    <div style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "1rem" }}>
                      Checking existing records…
                    </div>
                  )}

                  {/* student list with toggles */}
                  {myStudents.length === 0 ? (
                    <div className="t-empty">
                      <div className="t-empty-icon">🎓</div>
                      No students enrolled in {teacher?.subject} yet
                    </div>
                  ) : (
                    <>
                      {myStudents.map(s => (
                        <div key={s._id} className="att-student-row">
                          <div className="t-list-avatar">{getInitials(s.name)}</div>
                          <div className="att-student-info">
                            <div className="att-student-name">{s.name}</div>
                            <div className="att-student-email">{s.email}</div>
                          </div>
                          {/* present / absent toggle */}
                          <div className="att-toggle">
                            <button
                              className={`att-toggle-btn present ${attRecords[s._id] === "present" ? "active" : ""}`}
                              onClick={() => setAttRecords(prev => ({ ...prev, [s._id]: "present" }))}
                            >
                              ✓ Present
                            </button>
                            <button
                              className={`att-toggle-btn absent ${attRecords[s._id] === "absent" ? "active" : ""}`}
                              onClick={() => setAttRecords(prev => ({ ...prev, [s._id]: "absent" }))}
                            >
                              ✗ Absent
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        className="att-save-btn"
                        onClick={saveAttendance}
                        disabled={attSaving}
                      >
                        {attSaving ? "Saving…" : `💾 Save Attendance for ${attDate}`}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* ── SUMMARY VIEW ── */}
              {attView === "summary" && (
                <div className="t-section-card">
                  <div className="t-section-header">
                    <div className="t-section-title">Attendance Summary — {teacher?.subject}</div>
                    <button
                      className="t-add-btn"
                      style={{ padding: "0.35rem 0.85rem", fontSize: "0.78rem" }}
                      onClick={fetchSummary}
                    >
                      🔄 Refresh
                    </button>
                  </div>

                  {attSummary.length === 0 ? (
                    <div className="t-empty">
                      <div className="t-empty-icon">📊</div>
                      No attendance data yet. Start marking attendance first.
                    </div>
                  ) : (
                    attSummary.map(item => (
                      <div key={item.student._id} className="att-summary-row">
                        <div className="t-list-avatar">{getInitials(item.student.name)}</div>
                        <div className="att-summary-info">
                          <div className="att-summary-name">{item.student.name}</div>
                          <div className="att-summary-sub">
                            {item.present} present · {item.absent} absent · {item.total} classes
                          </div>
                        </div>
                        <div className="att-bar-wrap">
                          <div
                            className="att-bar"
                            style={{
                              width: `${item.percentage}%`,
                              background: pctColor(item.percentage)
                            }}
                          />
                        </div>
                        <span className={`att-pct-badge ${pctClass(item.percentage)}`}>
                          {item.percentage}%
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}


          {/* ══════ RESULTS ══════ */}
          {activeTab === "Results" && (
            <>
              <div className="t-section-card">
                <div className="t-section-header">
                  <div className="t-section-title">Add Student Marks</div>
                </div>
                {resultMsg && (
                  <div className={resultMsg.type === "success" ? "t-success-banner" : "t-error-banner"}>
                    {resultMsg.text}
                  </div>
                )}
                <div className="t-marks-form">
                  <div className="t-form-field">
                    <label>Select Student</label>
                    <select className="t-select" value={selStudent} onChange={e => setSelStudent(e.target.value)}>
                      <option value="">— Choose student —</option>
                      {myStudents.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="t-form-field">
                    <label>Marks (out of 100)</label>
                    <input className="t-input" type="number" min="0" max="100" placeholder="e.g. 85" value={marks} onChange={e => setMarks(e.target.value)} />
                  </div>
                  <button className="t-add-btn" onClick={handleAddResult} disabled={submitting || !selStudent || !marks}>
                    {submitting ? "Saving…" : "+ Add"}
                  </button>
                </div>
              </div>
              <div className="t-section-card">
                <div className="t-section-header">
                  <div className="t-section-title">All Results</div>
                  <span className="t-count-badge">{allResults.length} records</span>
                </div>
                {allResults.length === 0
                  ? <div className="t-empty"><div className="t-empty-icon">📈</div>No results yet</div>
                  : allResults.map(r => (
                    <div key={r._id} className="t-result-item">
                      <div className="t-list-avatar">{getInitials(r.student?.name)}</div>
                      <div className="t-list-info">
                        <div className="t-list-name">{r.student?.name || "Unknown"}</div>
                        <div className="t-list-sub">{r.course?.courseName || teacher?.subject}</div>
                      </div>
                      <span className={`t-marks-badge ${marksBadge(r.marks)}`}>{r.marks} / 100</span>
                    </div>
                  ))
                }
              </div>
            </>
          )}


          {/* ══════ ANNOUNCEMENTS ══════ */}
          {activeTab === "Announcements" && (
            <>
              <div className="t-section-card">
                <div className="t-section-header"><div className="t-section-title">Post Announcement</div></div>
                <textarea className="t-textarea" placeholder="Write an announcement…" value={annText} onChange={e => setAnnText(e.target.value)} />
                <button className="t-add-btn" onClick={addAnnouncement} disabled={!annText.trim()}>📢 Post</button>
              </div>
              <div className="t-section-card">
                <div className="t-section-header">
                  <div className="t-section-title">Posted Announcements</div>
                  <span className="t-count-badge">{announcements.length} posts</span>
                </div>
                {announcements.length === 0
                  ? <div className="t-empty"><div className="t-empty-icon">📢</div>No announcements yet</div>
                  : announcements.map(a => (
                    <div key={a.id} className="t-announcement-item">
                      <button className="t-delete-ann" onClick={() => deleteAnnouncement(a.id)}>✕ Remove</button>
                      <div className="t-announcement-text">{a.text}</div>
                      <div className="t-announcement-meta">Posted: {a.time}</div>
                    </div>
                  ))
                }
              </div>
            </>
          )}

        </main>
      </div>
    </>
  );
}

export default TeacherDashboard;