const sidebarStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');

  .cms-sidebar {
    width: 220px;
    background: #111118;
    border-right: 1px solid #22222f;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 997;
    display: flex;
    flex-direction: column;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
    transform: translateX(0);
    transition: transform 0.3s ease;
  }

  /* On mobile, hidden by default — shown when .open */
  @media (max-width: 768px) {
    .cms-sidebar {
      transform: translateX(-100%);
    }
    .cms-sidebar.open {
      transform: translateX(0);
      box-shadow: 6px 0 30px rgba(0,0,0,0.5);
    }
  }

  /* BRAND */
  .sidebar-brand {
    padding: 1.25rem 1.25rem 1rem;
    border-bottom: 1px solid #1e1e2a;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .sidebar-brand-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .sidebar-brand-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #f1f1f6;
    line-height: 1.1;
  }

  .sidebar-brand-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.65rem;
    color: #6b7280;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* NAV */
  .sidebar-nav {
    flex: 1;
    padding: 1rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    overflow-y: auto;
  }

  .sidebar-section-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #4b5563;
    font-weight: 500;
    padding: 0.5rem 0.5rem 0.25rem;
    margin-top: 0.5rem;
  }

  .sidebar-nav-btn {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
    padding: 0.6rem 0.75rem;
    background: transparent;
    border: none;
    border-radius: 10px;
    color: #9ca3af;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s, color 0.15s;
  }

  .sidebar-nav-btn:hover {
    background: #1e1e2a;
    color: #e2e2ee;
  }

  .sidebar-nav-btn.active {
    background: rgba(79,70,229,0.15);
    color: #818cf8;
  }

  .sidebar-nav-icon {
    font-size: 1rem;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
  }

  /* FOOTER */
  .sidebar-footer {
    padding: 1rem 1.25rem;
    border-top: 1px solid #1e1e2a;
  }

  .sidebar-footer-text {
    font-size: 0.72rem;
    color: #4b5563;
    text-align: center;
  }

  /* OVERLAY for mobile */
  .sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 999;
    backdrop-filter: blur(2px);
  }

  @media (max-width: 768px) {
    .sidebar-overlay.visible {
      display: block;
    }
  }
`;

const navItems = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "students",  icon: "🎓", label: "Students" },
  { id: "teachers",  icon: "👨‍🏫", label: "Teachers" },
  { id: "courses",   icon: "📚", label: "Courses" },
  { id: "results",   icon: "📈", label: "Results" },
];

function Sidebar({ show, onClose }) {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    // Close sidebar on mobile after clicking
    if (window.innerWidth <= 768 && onClose) onClose();
  };

  return (
    <>
      <style>{sidebarStyles}</style>

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${show ? "visible" : ""}`}
        onClick={onClose}
      />

      <div className={`cms-sidebar ${show ? "open" : ""}`}>

        {/* BRAND */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">🎓</div>
          <div>
            <div className="sidebar-brand-text">EduManage</div>
            <div className="sidebar-brand-sub">Admin Panel</div>
          </div>
        </div>

        {/* NAV ITEMS */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              className="sidebar-nav-btn"
              onClick={() => scrollToSection(item.id)}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-text">College Management System</div>
        </div>

      </div>
    </>
  );
}

export default Sidebar;