import { Link } from "react-router-dom";
import "../../styles/admin-dashboard.css";
import { 
  MessageSquare, 
  FileText, 
  Users, 
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function AdminDashboard() {
  const stats = {
    totalUsers: 154,
    activeChats: 23,
    totalDocuments: 89,
    pendingApprovals: 12
  };

  const recentActivities = [
    { id: 1, user: "Admin BPMP", action: "Upload dokumen baru", time: "5 menit lalu", type: "upload" },
    { id: 2, user: "User123", action: "Mengajukan pertanyaan", time: "15 menit lalu", type: "chat" },
    { id: 3, user: "Staff ULT", action: "Approved dokumen", time: "1 jam lalu", type: "approval" },
    { id: 4, user: "System", action: "Backup database selesai", time: "2 jam lalu", type: "system" },
    { id: 5, user: "Admin", action: "Update pengaturan sistem", time: "3 jam lalu", type: "system" }
  ];

  const quickActions = [
    {
      title: "Kelola Chatbot",
      description: "Atur pertanyaan dan respons KASBI",
      icon: <MessageSquare size={24} />,
      link: "/admin/chatbot",
      color: "#3B82F6"
    },
    {
      title: "Upload Dokumen",
      description: "Tambah dokumen baru ke sistem",
      icon: <FileText size={24} />,
      link: "/admin/dokumen",
      color: "#10B981"
    },
    {
      title: "Kelola Pengguna",
      description: "Atur akses dan peran pengguna",
      icon: <Users size={24} />,
      link: "/admin/pengguna",
      color: "#8B5CF6"
    },
    {
      title: "Laporan & Analitik",
      description: "Lihat statistik penggunaan",
      icon: <BarChart3 size={24} />,
      link: "/admin/laporan",
      color: "#F59E0B"
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Selamat Datang, Administrator! 👋</h1>
          <p>Sistem Admin BPMP Papua - KASBI Chatbot v2.0</p>
        </div>
        <div className="welcome-stats">
          <div className="stat-item">
            <Clock size={20} />
            <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="stat-item">
            <Activity size={20} />
            <span>Sistem: Online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#DBEAFE', color: '#1D4ED8' }}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Pengguna</h3>
            <p className="stat-number">{stats.totalUsers}</p>
            <p className="stat-change">+12 bulan ini</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#DCFCE7', color: '#166534' }}>
            <MessageSquare size={24} />
          </div>
          <div className="stat-content">
            <h3>Chat Aktif</h3>
            <p className="stat-number">{stats.activeChats}</p>
            <p className="stat-change">3 hari terakhir</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#FEF3C7', color: '#92400E' }}>
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Dokumen</h3>
            <p className="stat-number">{stats.totalDocuments}</p>
            <p className="stat-change">+5 minggu ini</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#FEE2E2', color: '#991B1B' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Menunggu Persetujuan</h3>
            <p className="stat-number">{stats.pendingApprovals}</p>
            <p className="stat-change">Perlu ditinjau</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2 className="section-title">Aksi Cepat</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <Link to={action.link} key={index} className="quick-action-card">
              <div className="action-icon" style={{ background: action.color + '20', color: action.color }}>
                {action.icon}
              </div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <div className="action-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="section">
        <h2 className="section-title">Aktivitas Terbaru</h2>
        <div className="activities-list">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'upload' && <FileText size={18} />}
                {activity.type === 'chat' && <MessageSquare size={18} />}
                {activity.type === 'approval' && <CheckCircle size={18} />}
                {activity.type === 'system' && <Activity size={18} />}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-user">{activity.user}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
                <p className="activity-action">{activity.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="section">
        <h2 className="section-title">Status Sistem</h2>
        <div className="system-status">
          <div className="status-item active">
            <CheckCircle size={20} />
            <span>Chatbot KASBI: Online</span>
          </div>
          <div className="status-item active">
            <CheckCircle size={20} />
            <span>Database: Connected</span>
          </div>
          <div className="status-item active">
            <CheckCircle size={20} />
            <span>Storage: 78% Used</span>
          </div>
          <div className="status-item active">
            <CheckCircle size={20} />
            <span>Backup: Up to date</span>
          </div>
        </div>
      </div>
    </div>
  );
}