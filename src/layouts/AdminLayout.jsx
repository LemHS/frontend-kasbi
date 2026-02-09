import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  MessageSquare, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  User,
  ChevronLeft,
  Shield // Added Shield icon for the Superadmin menu
} from "lucide-react";
import kasbiLogo from "../assets/images/kasbi-logo.png";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // --- STATE ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // --- 1. GET USER DATA (With safety check) ---
  const userData = JSON.parse(localStorage.getItem("user_data")) || {};

  // --- 2. PROTECT ROUTE & HANDLE RESIZE ---
  useEffect(() => {
    // Auth Check: Allow both 'admin' and 'superadmin'
    const allowedRoles = ["admin", "superadmin"];
    
    if (!userData?.role || !allowedRoles.includes(userData.role)) {
      navigate("/login");
    } else {
      setIsAuthorized(true);
    }

    // Responsive Handler
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate, userData?.role]);

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      logout();
      navigate("/login");
    }
  };

  // --- NAVIGATION CONFIGURATION ---
  const allNavItems = [
    {
      path: "/admin/chatbot",
      label: "Chatbot KASBI",
      icon: <MessageSquare size={20} />,
      allowedRoles: ["admin", "superadmin"]
    },
    {
      path: "/admin/dokumen",
      label: "Manajemen Dokumen",
      icon: <FileText size={20} />,
      allowedRoles: ["admin", "superadmin"]
    },
    {
      path: "/admin/admin",
      label: "Kelola Admin",
      icon: <Shield size={20} />,
      allowedRoles: ["superadmin"] // Only for superadmin
    }
  ];

  // Filter items based on current user role
  const visibleNavItems = allNavItems.filter(item => 
    item.allowedRoles.includes(userData.role)
  );

  if (!isAuthorized) return null;

  // --- DYNAMIC STYLES ---
  const sidebarTransform = isMobile 
    ? (mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)')
    : (sidebarOpen ? 'translateX(0)' : `translateX(-280px)`);

  const mainMargin = isMobile 
    ? '0' 
    : (sidebarOpen ? '280px' : '0');

  const topBarLeftMargin = isMobile ? '40px' : '0';

  return (
    <div style={styles.container}>
      
      {/* --- MOBILE TOGGLE BUTTON --- */}
      {isMobile && (
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={styles.mobileToggleBtn}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* --- MOBILE OVERLAY --- */}
      {isMobile && mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          style={styles.mobileOverlay}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside style={{ ...styles.sidebar, transform: sidebarTransform }}>
        {/* Header Sidebar */}
        <div style={styles.sidebarHeader}>
          <div style={styles.logoContainer}>
            <img src={kasbiLogo} alt="KASBI Logo" style={styles.logo} />
          </div>
          <h2 style={styles.brandTitle}>Admin Panel</h2>
          <p style={styles.brandSubtitle}>BPMP Papua</p>
        </div>

        {/* Navigation */}
        <nav style={styles.navContainer}>
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : styles.navLinkInactive)
              })}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navText}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              <User size={20} />
            </div>
            <div style={styles.userDetails}>
              <div style={styles.userName}>
                {userData.username || "Admin"}
              </div>
              <div style={styles.userRole}>
                {userData.role ? userData.role.toUpperCase() : "ADMIN"}
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout} 
            style={styles.logoutBtn}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(200, 16, 46, 0.8)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            <LogOut size={16} style={{marginRight: '8px'}} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main style={{ ...styles.main, marginLeft: mainMargin }}>
        {/* Top Bar */}
        <header style={styles.topBar}>
          <div style={{ ...styles.topBarLeft, marginLeft: topBarLeftMargin }}>
            {!isMobile && (
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={styles.desktopToggleBtn}
              >
                {sidebarOpen ? <ChevronLeft size={20}/> : <Menu size={20}/>}
              </button>
            )}
            <h1 style={styles.pageTitle}>
              Sistem Informasi KASBI
            </h1>
          </div>
          
          <div style={styles.topBarRight}>
            <div style={styles.statusBadge}>
              <span style={styles.statusDot}></span>
              <span>Online</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div style={styles.contentArea}>
          <Outlet />
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <p>© {new Date().getFullYear()} BPMP Papua • KASBI Admin</p>
        </footer>
      </main>
    </div>
  );
}

// --- STATIC STYLES ---
const styles = {
  container: {
    display: 'flex', 
    minHeight: '100vh', 
    background: '#f8f9fa', 
    position: 'relative', 
    overflowX: 'hidden'
  },
  mobileToggleBtn: {
    position: 'fixed',
    top: '15px',
    left: '15px',
    zIndex: 1100,
    background: 'white',
    color: '#1a1a2e',
    border: '1px solid #e5e7eb',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  mobileOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 999,
    backdropFilter: 'blur(2px)'
  },
  sidebar: {
    width: '280px',
    background: '#1a1a2e',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 1000,
    boxShadow: '2px 0 20px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  sidebarHeader: {
    padding: '30px 20px 20px', 
    textAlign: 'center', 
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  logoContainer: {
    width: '100px', 
    height: '100px', 
    margin: '0 auto 15px', 
    background: 'rgba(255, 255, 255, 0.05)', 
    padding: '10px', 
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: '100%', 
    height: '100%', 
    objectFit: 'contain'
  },
  brandTitle: {
    fontSize: '18px', 
    fontWeight: '700', 
    margin: '0 0 5px', 
    color: 'white'
  },
  brandSubtitle: {
    fontSize: '12px', 
    opacity: '0.7', 
    margin: 0, 
    color: 'rgba(255, 255, 255, 0.8)'
  },
  navContainer: {
    flex: 1, 
    padding: '20px 0', 
    overflowY: 'auto'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    textDecoration: 'none',
    borderLeft: '4px solid',
    margin: '5px 0',
    transition: 'all 0.2s ease-in-out'
  },
  navLinkActive: {
    color: 'white',
    borderColor: '#c8102e',
    backgroundColor: 'rgba(200, 16, 46, 0.15)'
  },
  navLinkInactive: {
    color: 'rgba(255, 255, 255, 0.6)',
    borderColor: 'transparent',
    backgroundColor: 'transparent'
  },
  navIcon: {
    marginRight: '15px', 
    display: 'flex'
  },
  navText: {
    fontSize: '14px', 
    fontWeight: '500'
  },
  userSection: {
    padding: '20px', 
    borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
    background: 'rgba(0, 0, 0, 0.2)'
  },
  userInfo: {
    display: 'flex', 
    alignItems: 'center', 
    marginBottom: '20px'
  },
  userAvatar: {
    width: '40px', 
    height: '40px', 
    background: 'linear-gradient(135deg, #c8102e 0%, #ff3d4a 100%)', 
    borderRadius: '50%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    color: 'white', 
    marginRight: '12px',
    flexShrink: 0
  },
  userDetails: {
    overflow: 'hidden'
  },
  userName: {
    fontSize: '14px', 
    fontWeight: '600', 
    color: 'white', 
    whiteSpace: 'nowrap', 
    textOverflow: 'ellipsis', 
    maxWidth: '140px'
  },
  userRole: {
    fontSize: '11px', 
    opacity: '0.7', 
    color: 'white', 
    textTransform: 'uppercase'
  },
  logoutBtn: {
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '100%', 
    padding: '10px', 
    background: 'rgba(255, 255, 255, 0.1)', 
    border: '1px solid rgba(255,255,255,0.1)', 
    borderRadius: '6px', 
    color: 'white', 
    fontSize: '14px', 
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#f8f9fa',
    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  topBar: {
    height: '70px', 
    background: 'white', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: '0 30px', 
    borderBottom: '1px solid #e5e7eb', 
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', 
    position: 'sticky', 
    top: 0, 
    zIndex: 90
  },
  topBarLeft: {
    display: 'flex', 
    alignItems: 'center', 
    gap: '20px',
    transition: 'margin-left 0.3s ease'
  },
  desktopToggleBtn: {
    background: 'none', 
    border: '1px solid #e5e7eb', 
    borderRadius: '6px', 
    cursor: 'pointer', 
    color: '#1f2937', 
    width: '32px', 
    height: '32px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  pageTitle: {
    fontSize: '18px', 
    fontWeight: '700', 
    color: '#1f2937', 
    margin: 0
  },
  topBarRight: {
    display: 'flex', 
    alignItems: 'center', 
    gap: '15px'
  },
  statusBadge: {
    display: 'flex', 
    alignItems: 'center', 
    gap: '6px', 
    fontSize: '13px', 
    color: '#10B981', 
    background: '#ECFDF5', 
    padding: '4px 8px', 
    borderRadius: '20px',
    border: '1px solid #d1fae5'
  },
  statusDot: {
    width: '6px', 
    height: '6px', 
    background: '#10B981', 
    borderRadius: '50%'
  },
  contentArea: {
    flex: 1, 
    padding: '30px', 
    overflowY: 'auto'
  },
  footer: {
    background: 'white', 
    padding: '15px', 
    borderTop: '1px solid #e5e7eb', 
    textAlign: 'center', 
    fontSize: '13px', 
    color: '#9ca3af'
  }
};