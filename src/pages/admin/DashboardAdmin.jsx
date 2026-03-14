import { useState, useEffect } from "react";
import { adminService } from "../../services/admin.service";
import { 
  Users, 
  MessageSquare, 
  Activity, 
  Calendar,
  Loader,
  AlertCircle
} from "lucide-react";

export default function DashboardAdmin() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Kirim tanggal saat ini dalam format ISO agar bisa dibaca datetime backend
      const currentDate = new Date().toISOString(); 
      const response = await adminService.getDashboard(currentDate);
      
      // adminService mengembalikan response.data dari Axios
      // Yang mana bentuknya adalah { status_code: 200, message: "...", data: { user_counts, chat_counts } }
      if (response && response.data) {
        setData(response.data);
      } else {
        throw new Error("Format data tidak sesuai");
      }
    } catch (err) {
      console.error("Gagal memuat dashboard:", err);
      setError(err.message || "Gagal memuat data dari server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Membuat label 6 bulan terakhir (Bulan Ini, Bulan Lalu, dst.)
  const getMonthLabels = () => {
    const labels = [];
    const date = new Date();
    date.setDate(1); // Set ke awal bulan agar akurat saat dikurangi
    
    for (let i = 0; i < 6; i++) {
      labels.push(
        date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      );
      date.setMonth(date.getMonth() - 1); // Mundur 1 bulan
    }
    return labels;
  };

  const monthLabels = getMonthLabels();

  // Tampilan Loading
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader size={48} className="animate-spin text-blue-500" />
        <span style={{ marginLeft: '12px', color: '#6B7280', fontWeight: 500 }}>Memuat statistik...</span>
      </div>
    );
  }

  // Tampilan Error
  if (error || !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
        <AlertCircle size={48} color="#EF4444" style={{ marginBottom: '16px' }} />
        <h2 style={{ color: '#EF4444', margin: 0 }}>Gagal Memuat Dashboard</h2>
        <p style={{ color: '#6B7280' }}>{error}</p>
        <button 
          onClick={fetchDashboardData}
          style={{ marginTop: '16px', padding: '8px 16px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
          <Activity size={28} className="text-blue-600" />
          Dashboard Statistik
        </h1>
        <p style={{ color: '#6B7280', margin: '8px 0 0 0' }}>
          Ringkasan pertumbuhan pengguna dan interaksi AI (Kumulatif per awal bulan)
        </p>
      </header>

      {/* Top Cards - Menampilkan data terbaru (month_0) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Card Users */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#6B7280', fontSize: '14px', fontWeight: 500, margin: 0 }}>Total Pengguna</p>
              <h2 style={{ fontSize: '36px', fontWeight: 700, margin: '8px 0 0 0', color: '#111827' }}>
                {data.user_counts?.month_0 || 0}
              </h2>
            </div>
            <div style={{ padding: '12px', background: '#DBEAFE', borderRadius: '50%' }}>
              <Users size={24} color="#2563EB" />
            </div>
          </div>
        </div>

        {/* Card Chats */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#6B7280', fontSize: '14px', fontWeight: 500, margin: 0 }}>Total Interaksi Chat</p>
              <h2 style={{ fontSize: '36px', fontWeight: 700, margin: '8px 0 0 0', color: '#111827' }}>
                {data.chat_counts?.month_0 || 0}
              </h2>
            </div>
            <div style={{ padding: '12px', background: '#D1FAE5', borderRadius: '50%' }}>
              <MessageSquare size={24} color="#059669" />
            </div>
          </div>
        </div>

      </div>

      {/* Tabel Riwayat 6 Bulan */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="#4B5563" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#374151' }}>Tren Pertumbuhan (6 Bulan Terakhir)</h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                <th style={{ padding: '16px 20px', color: '#6B7280', fontWeight: 500, fontSize: '14px', borderBottom: '1px solid #E5E7EB' }}>Periode (Awal Bulan)</th>
                <th style={{ padding: '16px 20px', color: '#6B7280', fontWeight: 500, fontSize: '14px', borderBottom: '1px solid #E5E7EB' }}>Kumulatif Pengguna</th>
                <th style={{ padding: '16px 20px', color: '#6B7280', fontWeight: 500, fontSize: '14px', borderBottom: '1px solid #E5E7EB' }}>Kumulatif Interaksi Chat</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <tr key={index} style={{ borderBottom: index !== 5 ? '1px solid #E5E7EB' : 'none', transition: 'background 0.2s' }}>
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

    </div>
  );
}