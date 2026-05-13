import { useState } from "react";
import API from "../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

  .login-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    padding: 1rem;
    position: relative;
    overflow: hidden;
  }

  .login-root::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
    top: -150px;
    left: -150px;
    pointer-events: none;
  }

  .login-root::after {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%);
    bottom: -100px;
    right: -100px;
    pointer-events: none;
  }

  .login-card {
    display: flex;
    width: 100%;
    max-width: 880px;
    min-height: 540px;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 40px 100px rgba(0,0,0,0.6);
    position: relative;
    z-index: 1;
  }

  /* LEFT PANEL */
  .login-left {
    flex: 1;
    background: linear-gradient(145deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 3rem;
    position: relative;
    overflow: hidden;
  }

  .login-left::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border: 60px solid rgba(255,255,255,0.07);
    border-radius: 50%;
    top: -80px;
    right: -80px;
  }

  .login-left::after {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    border: 40px solid rgba(255,255,255,0.05);
    border-radius: 50%;
    bottom: -60px;
    left: 30px;
  }

  .login-brand {
    font-family: 'Playfair Display', serif;
    font-size: 2.6rem;
    font-weight: 900;
    color: #fff;
    line-height: 1.1;
    margin-bottom: 1rem;
    position: relative;
    z-index: 1;
  }

  .login-brand span {
    display: block;
    font-size: 1.1rem;
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .login-left-desc {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.65);
    line-height: 1.7;
    max-width: 260px;
    position: relative;
    z-index: 1;
  }

  .login-badges {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 2.5rem;
    position: relative;
    z-index: 1;
  }

  .login-badge {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.8);
  }

  .login-badge-dot {
    width: 8px;
    height: 8px;
    background: rgba(255,255,255,0.5);
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* RIGHT PANEL */
  .login-right {
    flex: 1;
    background: #111118;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .login-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #f1f1f6;
    margin-bottom: 0.25rem;
  }

  .login-subtitle {
    font-size: 0.88rem;
    color: #6b7280;
    margin-bottom: 2rem;
  }

  /* ROLE TABS */
  .role-tabs {
    display: flex;
    background: #1c1c27;
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 1.5rem;
    gap: 2px;
  }

  .role-tab {
    flex: 1;
    padding: 0.5rem 0.25rem;
    border: none;
    background: transparent;
    color: #6b7280;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .role-tab.active {
    background: #4f46e5;
    color: #fff;
    box-shadow: 0 2px 8px rgba(79,70,229,0.4);
  }

  /* INPUTS */
  .login-field {
    margin-bottom: 1rem;
  }

  .login-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: #9ca3af;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
    display: block;
  }

  .login-input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: #1c1c27;
    border: 1px solid #2a2a38;
    border-radius: 10px;
    color: #f1f1f6;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .login-input:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.15);
  }

  .login-input::placeholder {
    color: #4b5563;
  }

  /* BUTTON */
  .login-btn {
    width: 100%;
    padding: 0.85rem;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 15px rgba(79,70,229,0.35);
  }

  .login-btn:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(79,70,229,0.45);
  }

  .login-btn:active {
    transform: translateY(0);
  }

  .login-btn.register-btn {
    background: linear-gradient(135deg, #059669, #0d9488);
    box-shadow: 0 4px 15px rgba(5,150,105,0.35);
  }

  /* TOGGLE */
  .login-toggle {
    text-align: center;
    font-size: 0.85rem;
    color: #6b7280;
    margin-top: 1.25rem;
  }

  .login-toggle-link {
    color: #818cf8;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s;
  }

  .login-toggle-link:hover {
    color: #a5b4fc;
  }

  /* DIVIDER */
  .login-divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1.25rem 0;
  }

  .login-divider::before,
  .login-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #2a2a38;
  }

  .login-divider span {
    font-size: 0.75rem;
    color: #4b5563;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* RESPONSIVE */
  @media (max-width: 680px) {
    .login-card {
      flex-direction: column;
      max-width: 420px;
    }

    .login-left {
      padding: 2rem;
      min-height: unset;
    }

    .login-brand {
      font-size: 1.9rem;
    }

    .login-badges {
      display: none;
    }

    .login-left-desc {
      display: none;
    }

    .login-right {
      padding: 2rem 1.5rem;
    }
  }
`;

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const url = role === "teacher" ? "/teachers/login" : "/students/login";
      const res = await API.post(url, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      const r = res.data.user.role;
      window.location.href = r === "admin" ? "/admin-dashboard" : r === "teacher" ? "/teacher-dashboard" : "/student-dashboard";
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const url = role === "teacher" ? "/teachers/register" : "/students/register";
      const data = role === "teacher" ? { name, email, password, subject: "General" } : { name, email, password };
      await API.post(url, data);
      alert("Registered successfully!");
      setIsRegister(false);
    } catch (err) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="login-card">

          {/* LEFT */}
          <div className="login-left">
            <div className="login-brand">
              <span>College</span>
              EduManage
            </div>
            <p className="login-left-desc">
              A unified platform for students, teachers, and administrators to manage academics seamlessly.
            </p>
            <div className="login-badges">
              <div className="login-badge"><span className="login-badge-dot" /> Student portals & results</div>
              <div className="login-badge"><span className="login-badge-dot" /> Teacher course management</div>
              <div className="login-badge"><span className="login-badge-dot" /> Admin control panel</div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="login-right">
            <div className="login-title">{isRegister ? "Create Account" : "Welcome Back"}</div>
            <div className="login-subtitle">{isRegister ? "Join the platform today" : "Sign in to your account"}</div>

            {/* ROLE TABS */}
            <div className="role-tabs">
              {["student", "teacher", "admin"].map((r) => (
                <button
                  key={r}
                  className={`role-tab ${role === r ? "active" : ""}`}
                  onClick={() => setRole(r)}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            {/* NAME (register only) */}
            {isRegister && (
              <div className="login-field">
                <label className="login-label">Full Name</label>
                <input className="login-input" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}

            {/* EMAIL */}
            <div className="login-field">
              <label className="login-label">Email Address</label>
              <input className="login-input" type="email" placeholder="you@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* PASSWORD */}
            <div className="login-field">
              <label className="login-label">Password</label>
              <input className="login-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {/* BUTTON */}
            <button
              className={`login-btn ${isRegister ? "register-btn" : ""}`}
              onClick={isRegister ? handleRegister : handleLogin}
              disabled={loading}
            >
              {loading ? "Please wait…" : isRegister ? "Create Account" : "Sign In"}
            </button>

            <div className="login-toggle">
              {isRegister ? "Already have an account? " : "New here? "}
              <span className="login-toggle-link" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Sign In" : "Register"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;

