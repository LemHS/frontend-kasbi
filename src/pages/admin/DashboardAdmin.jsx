import { useState, useEffect } from "react";
import "../../styles/admin.css"; // Pastikan path CSS ini sesuai
import { adminService } from "../../services/admin.service";
import { 
  Users, 
  MessageSquare, 
  Activity, 
  Calendar,
  Loader
} from "lucide-react";
import Swal from "sweetalert2";

export default function DashboardAdmin() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Format tanggal ISO yang aman untuk backend (contoh: "2026-03-14T11:16:50Z")
      const currentDate = new Date().toISOString(); 
      const response = await adminService.getDashboard(currentDate);
      
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Gagal memuat dashboard:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal memuat data dashboard. Silakan coba lagi.',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Helper untuk membuat label bulan dari 0 sampai 5 (6 bulan terakhir)
  const getMonthLabels = () => {
    const labels = [];
    const date = new Date();
    // Set ke tanggal 1 bulan ini
    date.setDate(1); 
    
    for (let i = 0; i < 6; i++) {
      labels.push(
        date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      );
      // Mundur 1 bulan
      date.setMonth(date.getMonth() - 1);
    }
    return labels;
  };

  const monthLabels = getMonthLabels();

  if (isLoading) {
    return (
      <div className="admin-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader size={48} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <h1 className="page-title">
            <Activity size={28} />
            Dashboard Statistik
          </h1>
          <p className="text-gray-500" style={{ marginTop: '8px' }}>
            Ringkasan data pengguna dan interaksi AI (Per awal bulan)
          </p>
        </div>
      </header>

      {/* Top Cards - Menampilkan data bulan teratas (month_0) */}
      <div className="dashboard-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '24px' }}>
        
        {/* Card Total Users */}
        <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="text-gray-500" style={{ fontSize: '14px', fontWeight: 500 }}>Total Pengguna</p>
              <h2 style={{ fontSize: '32px', fontWeight: 700, margin: '8px 0', color: '#111827' }}>
                {data.user_counts?.month_0 || 0}
              </h2>
            </div>
            <div style={{ padding: '12px', background: '#DBEAFE', borderRadius: '50%' }}>
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Card Total Chats */}
        <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="text-gray-500" style={{ fontSize: '14px', fontWeight: 500 }}>Total Interaksi Chat</p>
              <h2 style={{ fontSize: '32px', fontWeight: 700, margin: '8px 0', color: '#111827' }}>
                {data.chat_counts?.month_0 || 0}
              </h2>
            </div>
            <div style={{ padding: '12px', background: '#D1FAE5', borderRadius: '50%' }}>
              <MessageSquare size={24} className="text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Tren 6 Bulan Terakhir */}
      <div className="table-container" style={{ marginTop: '32px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} className="text-gray-600" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#374151' }}>Tren 6 Bulan Terakhir</h3>
        </div>
        <table className="dokumen-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', textAlign: 'left' }}>
              <th style={{ padding: '16px 20px', color: '#6B7280', fontWeight: 500, fontSize: '14px' }}>Periode (Awal Bulan)</th>
              <th style={{ padding: '16px 20px', color: '#6B7280', fontWeight: 500, fontSize: '14px' }}>Kumulatif Pengguna</th>
              <th style={{ padding: '16px 20px', color: '#6B7280', fontWeight: 500, fontSize: '14px' }}>Kumulatif Chat</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
                <td style={{ padding: '16px 20px', color: '#111827', fontWeight: 500 }}>
                  {monthLabels[index]}
                </td>
                <td style={{ padding: '16px 20px', color: '#4B5563' }}>
                  {data.user_counts?.[`month_${index}`] || 0}
                </td>
                <td style={{ padding: '16px 20px', color: '#4B5563' }}>
                  {data.chat_counts?.[`month_${index}`] || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}