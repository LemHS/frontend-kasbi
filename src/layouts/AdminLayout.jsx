import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { 
  MessageSquare, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  Home,
  Settings
} from "lucide-react";
import kasbiLogo from "../assets/images/kasbi-logo.png";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    navigate("/login");
  };

  const navItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <Home size={20} style={{color: "white"}} />
    },
    {
      path: "/admin/chatbot",
      label: "Chatbot KASBI",
      icon: <MessageSquare size={20} style={{color: "white"}} />
    },
    {
      path: "/admin/dokumen",
      label: "Manajemen Dokumen",
      icon: <FileText size={20} style={{color: "white"}} />
    },
    {
      path: "/admin/pengaturan",
      label: "Pengaturan",
      icon: <Settings size={20} style={{color: "white"}} />
    }
  ];

  return (
    <div style={{display: 'flex', minHeight: '100vh', background: '#f8f9fa', position: 'relative'}}>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1100,
          background: 'linear-gradient(135deg, #c8102e 0%, #ff3d4a 100%)',
          color: 'white',
          border: 'none',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar dengan INLINE STYLE */}
      <aside 
        style={{
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
          overflowY: 'auto'
        }}
      >
        {/* Header Sidebar */}
        <div style={{padding: '30px 20px 20px', textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
          <img src={kasbiLogo} alt="KASBI Logo" style={{width: '120px', height: '120px', objectFit: 'contain', margin: '0 auto 15px', background: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '12px'}} />
          <h2 style={{fontSize: '18px', fontWeight: '700', margin: '0 0 5px', color: 'white'}}>Admin BPMP Papua</h2>
          <p style={{fontSize: '12px', opacity: '0.7', margin: 0, color: 'rgba(255, 255, 255, 0.8)'}}>Super Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav style={{flex: 1, padding: '20px 0', overflowY: 'auto'}}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: '15px 20px',
                color: 'rgba(255, 255, 255, 0.9)',
                textDecoration: 'none',
                borderLeft: '4px solid transparent',
                margin: '5px 10px',
                borderRadius: '8px',
                backgroundColor: isActive ? 'rgba(200, 16, 46, 0.2)' : 'transparent',
                borderLeftColor: isActive ? '#c8102e' : 'transparent'
              })}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span style={{marginRight: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '24px'}}>
                {item.icon}
              </span>
              <span style={{fontSize: '14px', fontWeight: '500', color: 'white'}}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div style={{padding: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0, 0, 0, 0.1)'}}>
          <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
            <div style={{width: '40px', height: '40px', background: 'linear-gradient(135deg, #c8102e 0%, #ff3d4a 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '12px'}}>
              <span>A</span>
            </div>
            <div>
              <div style={{fontSize: '14px', fontWeight: '600', marginBottom: '2px', color: 'white'}}>Administrator</div>
              <div style={{fontSize: '12px', opacity: '0.7', color: 'white'}}>Super Admin</div>
            </div>
          </div>
          
          <button onClick={handleLogout} style={{display: 'flex', alignItems: 'center', width: '100%', padding: '12px 20px', background: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', cursor: 'pointer'}}>
            <LogOut size={20} style={{marginRight: '10px'}} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8f9fa'}}>
        {/* Top Bar */}
        <header style={{height: '70px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', position: 'sticky', top: 0, zIndex: 100}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#1f2937', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
              {sidebarOpen ? '←' : '→'}
            </button>
            <h1 style={{fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: 0}}>Admin Panel</h1>
          </div>
          
          <div style={{display: 'flex', alignItems: 'center', gap: '30px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280'}}>
              <span style={{width: '8px', height: '8px', background: '#10B981', borderRadius: '50%'}}></span>
              <span>System Online</span>
            </div>
            <div style={{fontSize: '14px', color: '#6b7280', fontWeight: '500'}}>
              {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div style={{flex: 1, padding: '30px', background: '#f8f9fa', overflowY: 'auto'}}>
          <Outlet />
        </div>

        {/* Footer */}
        <footer style={{background: 'white', padding: '20px 30px', borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: '14px', color: '#6b7280'}}>
          <p>© {new Date().getFullYear()} BPMP Papua - KASBI Admin Panel v2.0</p>
          <p style={{fontSize: '12px', opacity: '0.7'}}>Hak Cipta Dilindungi Undang-Undang</p>
        </footer>
      </main>
    </div>
  );
}