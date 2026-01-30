import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../styles/chatbot.css"; // IMPORT CSS DI SINI
import kasbiLogo from "../assets/images/kasbi-logo.png";
import { Menu, X, Send, Clock, User, Download, Calendar, Phone, HelpCircle, MessageSquare } from "lucide-react";

export default function Chatbot() {
  const location = useLocation();
  const isAdminChatbot = location.pathname.includes("/admin/chatbot");

  // TAMBAHKAN console.log untuk debugging
  console.log("Chatbot mounted - isAdminChatbot:", isAdminChatbot);
  console.log("Current path:", location.pathname);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Halo! 😊 Saya KASBI (Kawan Setia Berbagi Informasi), chatbot resmi BPMP Papua. Ada yang bisa saya bantu hari ini?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user_info")) || {};
  const userInfo = {
    name: storedUser.name || "Pengguna BPMP",
    email: storedUser.email || "user@bpmp.papua.go.id"
  };

  const endRef = useRef(null);
  const textareaRef = useRef(null);

  const QUICK_QUESTIONS = [
    { text: "Apa itu BPMP Papua?", icon: "🏛️" },
    { text: "Program prioritas BPMP Papua?", icon: "🎯" },
    { text: "Cara menghubungi ULT BPMP?", icon: "📞" },
    { text: "Tugas dan fungsi BPMP?", icon: "📋" },
    { text: "Lokasi kantor BPMP Papua", icon: "📍" },
    { text: "Layanan apa saja yang tersedia?", icon: "🛎️" }
  ];

  const QUICK_ACTIONS = [
    { text: "Unduh Formulir", icon: <Download size={16} />, color: "#4CAF50" },
    { text: "Jadwal Kegiatan", icon: <Calendar size={16} />, color: "#2196F3" },
    { text: "Kontak Penting", icon: <Phone size={16} />, color: "#FF9800" },
    { text: "FAQ", icon: <HelpCircle size={16} />, color: "#9C27B0" }
  ];

  // PERBAIKI: Ubah threshold mobile dari 992 ke 768
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // DARI 992 KE 768
      console.log("Window width:", window.innerWidth, "isMobile:", window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "60px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [input]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);
    setSidebarOpen(false);
    setShowQuickQuestions(false);

    setTimeout(() => {
      const responses = {
        "Apa itu BPMP Papua?": "BPMP Papua adalah Balai Pengembangan Multimedia Pendidikan yang bertugas mengembangkan konten pendidikan digital untuk wilayah Papua.",
        "Program prioritas BPMP Papua?": "Program prioritas BPMP Papua meliputi:\n• Pengembangan bahan ajar digital\n• Pelatihan guru dalam teknologi pendidikan\n• Infrastruktur TIK pendidikan\n• Konten edukasi berbasis budaya Papua",
        "Cara menghubungi ULT BPMP?": "Anda dapat menghubungi Unit Layanan Teknis (ULT) BPMP Papua melalui:\n📧 Email: ult@bpmp.papua.go.id\n📞 Telepon: (0967) 531-123\n📍 Lokasi: Gedung Teknologi Lantai 3",
        "Tugas dan fungsi BPMP?": "Tugas utama BPMP Papua:\n• Mengembangkan multimedia pendidikan\n• Menyediakan layanan teknologi informasi\n• Melaksanakan pelatihan dan pendampingan\n• Mengelola sistem informasi pendidikan",
        "Lokasi kantor BPMP Papua": "Kantor BPMP Papua beralamat di:\nJl. Pendidikan No. 123, Kota Jayapura\nProvinsi Papua 99111\n\n📱 (0967) 531-000\n📧 info@bpmp.papua.go.id",
        "Layanan apa saja yang tersedia?": "Layanan yang tersedia:\n• Konsultasi teknologi pendidikan\n• Pengembangan konten digital\n• Pelatihan multimedia\n• Sistem informasi sekolah\n• Helpdesk teknis\n• Resource sharing",
        "Unduh Formulir": "📄 Formulir tersedia di:\nhttps://bpmp.papua.go.id/download\n\nJenis formulir:\n1. Permohonan layanan\n2. Pengajuan pelatihan\n3. Laporan kegiatan\n4. Permintaan teknis",
        "Jadwal Kegiatan": "📅 Jadwal kegiatan terbaru:\n• Pelatihan Guru Digital: 15-17 Maret\n• Workshop Multimedia: 22 Maret\n• Sosialisasi Sistem: 28 Maret\n\nLihat lengkap: https://bpmp.papua.go.id/kalender",
        "Kontak Penting": "📞 Kontak penting BPMP Papua:\n• Call Center: 1500-123\n• Email: info@bpmp.papua.go.id\n• Teknis: support@bpmp.papua.go.id\n• ULT: ult@bpmp.papua.go.id\n\n🕒 Jam layanan: 08:00-16:00 WIT",
        "FAQ": "❓ Pertanyaan yang sering diajukan:\n1. Cara akses materi?\n2. Prosedur pelatihan?\n3. Syarat pengajuan?\n4. Troubleshooting?\n\nLihat semua: https://bpmp.papua.go.id/faq"
      };

      const replyText = responses[text] || 
        "Maaf, saya belum memahami pertanyaan Anda. Coba tanyakan hal lain tentang BPMP Papua atau pilih pertanyaan dari menu.";
      
      const reply = {
        id: Date.now() + 1,
        sender: "bot",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, reply]);
      setLoading(false);
    }, 1000 + Math.random() * 500);
  };

  const handleQuickAction = (action) => {
    sendMessage(action.text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        sendMessage(input);
      }
    }
  };

  // TAMBAHKAN: Fallback styling jika CSS gagal load
  const containerStyle = {
    display: 'flex',
    height: isAdminChatbot ? 'calc(100vh - 140px)' : 'calc(100vh - 120px)',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '500px' // Fallback minimum height
  };

  return (
    <div 
      className={`chat-container ${isAdminChatbot ? 'admin-view' : 'user-view'}`}
      style={containerStyle} // FALLBACK STYLE
    >
      {/* FLOATING ACTION BUTTON untuk Quick Questions di Mobile */}
      {isMobile && !showQuickQuestions && (
        <button 
          className="floating-quick-btn"
          onClick={() => setShowQuickQuestions(true)}
          title="Pertanyaan Cepat"
          aria-label="Buka pertanyaan cepat"
        >
          <MessageSquare size={24} />
          <span className="floating-badge">{QUICK_QUESTIONS.length}</span>
        </button>
      )}

      {/* MODAL QUICK QUESTIONS untuk Mobile */}
      {isMobile && showQuickQuestions && (
        <div className="mobile-quick-modal">
          <div className="modal-header">
            <h3>🎯 Pertanyaan Cepat</h3>
            <button 
              className="modal-close"
              onClick={() => setShowQuickQuestions(false)}
              aria-label="Tutup modal"
            >
              <X size={24} />
            </button>
          </div>
          <div className="modal-content">
            {QUICK_QUESTIONS.map((q, index) => (
              <button 
                key={index} 
                className="mobile-quick-btn"
                onClick={() => {
                  sendMessage(q.text);
                  setShowQuickQuestions(false);
                }}
              >
                <span className="quick-icon">{q.icon}</span>
                <span className="quick-text">{q.text}</span>
              </button>
            ))}
          </div>
          <div className="modal-footer">
            <button 
              className="modal-cancel"
              onClick={() => setShowQuickQuestions(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Hanya untuk user view, bukan admin */}
      {!isMobile && !isAdminChatbot && (
        <aside className="chat-sidebar desktop-sidebar">
          <div className="sidebar-header">
            <img src={kasbiLogo} className="sidebar-logo" alt="Logo BPMP Papua" />
            <div className="sidebar-header-text">
              <h3>KASBI Assistant</h3>
              <p>BPMP Papua</p>
            </div>
          </div>
          
          <div className="sidebar-section">
            <h4 className="sidebar-title">
              <span className="title-icon">💡</span>
              Pertanyaan Cepat
            </h4>
            <div className="quick-list">
              {QUICK_QUESTIONS.map((q, index) => (
                <button 
                  key={index} 
                  className="quick-btn" 
                  onClick={() => sendMessage(q.text)}
                >
                  <span className="quick-icon">{q.icon}</span>
                  <span className="quick-text">{q.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section user-section">
            <h4 className="sidebar-title">
              <span className="title-icon">👤</span>
              Profil Pengguna
            </h4>
            <div className="user-info-card">
              <div className="user-avatar">
                <User size={24} />
              </div>
              <div className="user-details">
                <div className="user-name">{userInfo.name}</div>
                <div className="user-email">{userInfo.email}</div>
                <div className="user-status">
                  <span className="status-dot active"></span>
                  Online
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="footer-time">
              <Clock size={12} />
              <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long' })}</span>
            </div>
            <div className="footer-copyright">
              © BPMP Papua — KASBI
            </div>
          </div>
        </aside>
      )}

      {/* Main Chat Area */}
      <main className="chat-main">
        {/* Header */}
        <header className="chat-header">
          <div className="header-left">
            {/* Mobile menu hanya untuk user view */}
            {isMobile && !isAdminChatbot && (
              <button 
                className="mobile-menu-btn"
                onClick={() => setSidebarOpen(true)}
                aria-label="Buka menu"
              >
                <Menu size={24} />
              </button>
            )}
            <img src={kasbiLogo} className="header-logo" alt="KASBI Logo" />
            <div className="header-text">
              <h1 className="header-title">KASBI Chatbot</h1>
              <p className="header-subtitle">Kawan Setia Berbagi Informasi</p>
            </div>
          </div>
          
          {/* Status hanya untuk user view */}
          {!isMobile && !isAdminChatbot && (
            <div className="header-status">
              <div className="status-indicator">
                <span className="status-dot active"></span>
                <span className="status-text">Tersambung ke server BPMP Papua</span>
              </div>
            </div>
          )}
        </header>

        {/* Chat Messages */}
        <div className="chat-box">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`msg-row ${msg.sender === "user" ? "right" : "left"}`}
            >
              <div className={`msg-bubble ${msg.sender}`}>
                <div className="msg-content">
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <div className="msg-footer">
                  <span className="msg-sender">
                    {msg.sender === 'bot' ? '🤖 KASBI' : '👤 Anda'}
                  </span>
                  <span className="msg-time">{msg.time}</span>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg-row left">
              <div className="msg-bubble bot">
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="typing-text">KASBI sedang mengetik...</div>
                </div>
              </div>
            </div>
          )}

          <div ref={endRef} className="scroll-anchor" />
        </div>

        {/* Quick Actions - Hanya untuk user view */}
        {!isAdminChatbot && (
          <div className="quick-actions-bar">
            {QUICK_ACTIONS.map((action, index) => (
              <button
                key={index}
                className="quick-action-btn"
                onClick={() => handleQuickAction(action)}
                style={{ '--action-color': action.color }}
                title={action.text}
              >
                <span className="action-icon">{action.icon}</span>
                <span className="action-text">{action.text}</span>
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="chat-input-area">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              value={input}
              placeholder="Tulis pertanyaan Anda tentang BPMP Papua..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows="1"
              className="chat-textarea"
              aria-label="Input pesan untuk chatbot"
            />
            <div className="input-hint">
              Tekan <kbd>Enter</kbd> untuk mengirim • <kbd>Shift + Enter</kbd> untuk baris baru
            </div>
          </div>
          <button 
            onClick={() => sendMessage(input)} 
            className="send-button"
            disabled={!input.trim() || loading}
            aria-label="Kirim pesan"
          >
            <Send size={20} />
            <span className="send-text">Kirim</span>
          </button>
        </div>
      </main>

      {/* Mobile Sidebar Drawer - Hanya untuk user view */}
      {isMobile && sidebarOpen && !isAdminChatbot && (
        <div className="mobile-sidebar-drawer">
          <div className="drawer-header">
            <img src={kasbiLogo} className="drawer-logo" alt="Logo BPMP Papua" />
            <h3>KASBI Assistant</h3>
            <button 
              className="drawer-close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Tutup drawer"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="drawer-content">
            <div className="drawer-section">
              <h4>👤 Profil Pengguna</h4>
              <div className="drawer-user-info">
                <div className="user-avatar">
                  <User size={20} />
                </div>
                <div>
                  <div className="user-name">{userInfo.name}</div>
                  <div className="user-email">{userInfo.email}</div>
                </div>
              </div>
            </div>

            <div className="drawer-section">
              <h4>💡 Pertanyaan Cepat</h4>
              <div className="drawer-quick-questions">
                {QUICK_QUESTIONS.map((q, index) => (
                  <button 
                    key={index}
                    className="drawer-quick-btn"
                    onClick={() => {
                      sendMessage(q.text);
                      setSidebarOpen(false);
                    }}
                  >
                    <span className="quick-icon">{q.icon}</span>
                    <span className="quick-text">{q.text}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="drawer-section">
              <h4>📊 Status Sistem</h4>
              <div className="system-status">
                <div className="status-item">
                  <span className="status-dot active"></span>
                  <span>Server: Online</span>
                </div>
                <div className="status-item">
                  <span className="status-dot active"></span>
                  <span>Database: Connected</span>
                </div>
                <div className="status-item">
                  <Clock size={14} />
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="drawer-footer">
            <div className="footer-time">
              {new Date().toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
            <div className="footer-copyright">
              © BPMP Papua — KASBI
            </div>
          </div>
        </div>
      )}

      {/* Overlay untuk mobile drawer */}
      {isMobile && sidebarOpen && !isAdminChatbot && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
          aria-label="Tutup overlay"
        />
      )}
    </div>
  );
}