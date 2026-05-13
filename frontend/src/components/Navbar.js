const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  .cms-navbar {
    height: 64px;
    background: #111118;
    border-bottom: 1px solid #22222f;
    position: sticky;
    top: 0;
    z-index: 998;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    font-family: 'DM Sans', sans-serif;
    width: 100%;
    box-sizing: border-box;
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .navbar-hamburger {
    background: #1e1e2a;
    border: 1px solid #2a2a38;
    border-radius: 8px;
    color: #e2e2ee;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.2s;
    flex-shrink: 0;
  }

  .navbar-hamburger:hover { background: #252534; }

  .navbar-title {
    font-size: 1rem;
    font-weight: 600;
    color: #f1f1f6;
    white-space: nowrap;
  }

  .navbar-title span { color: #818cf8; }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .navbar-admin-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #1e1e2a;
    border: 1px solid #2a2a38;
    border-radius: 20px;
    padding: 0.3rem 0.75rem 0.3rem 0.4rem;
    font-size: 0.82rem;
    color: #e2e2ee;
    font-weight: 500;
  }

  .navbar-avatar {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    color: #fff;
    font-weight: 600;
  }

  .navbar-logout {
    padding: 0.3rem 0.75rem;
    background: rgba(220,38,38,0.1);
    border: 1px solid rgba(220,38,38,0.25);
    border-radius: 8px;
    color: #f87171;
    font-size: 0.78rem;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }

  .navbar-logout:hover { background: rgba(220,38,38,0.2); }
`;

function Navbar({ toggleSidebar }) {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <style>{navStyles}</style>
      <div className="cms-navbar">
        <div className="navbar-left">
          <button className="navbar-hamburger" onClick={toggleSidebar}>☰</button>
          <div className="navbar-title"><span>Edu</span>Manage CMS</div>
        </div>
        <div className="navbar-right">
          <div className="navbar-admin-badge">
            <div className="navbar-avatar">A</div>
            Admin
          </div>
          <button className="navbar-logout" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>
    </>
  );
}

export default Navbar;