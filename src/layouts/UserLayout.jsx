import { useState, useEffect, useRef } from "react";
import "../styles/user-layout.css";
import kasbiLogo from "../assets/images/kasbi-logo.png";
import { Send, MessageSquare, Clock, User, LogOut, ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChatbotUser() {
  const navigate = useNavigate();
  
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
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar default terbuka
  const [isMobile, setIsMobile] = useState(false);

  // Ambil user info dari localStorage
  const storedUser = JSON.parse(localStorage.getItem("user_info")) || {};
  const userInfo = {
    name: storedUser.name || "Pengguna BPMP",
    email: storedUser.email || "user@bpmp.papua.go.id"
  };

  const endRef = useRef(null);
  const textareaRef = useRef(null);

  // QUICK QUESTIONS untuk user biasa
  const QUICK_QUESTIONS = [
    { text: "Apa itu BPMP Papua?", icon: "🏛️" },
    { text: "Program prioritas BPMP?", icon: "🎯" },
    { text: "Cara hubungi ULT BPMP?", icon: "📞" },
    { text: "Tugas dan fungsi BPMP?", icon: "📋" },
    { text: "Lokasi kantor BPMP", icon: "📍" },
    { text: "Layanan yang tersedia", icon: "🛎️" },
    { text: "Ajukan pelatihan", icon: "👨‍🏫" },
    { text: "Download formulir", icon: "📄" },
    { text: "Jadwal kegiatan", icon: "📅" },
    { text: "FAQ", icon: "❓" }
  ];

  // Cek mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false); // Di mobile, sidebar default tertutup
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto scroll ke pesan terbaru
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
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
    if (isMobile) setSidebarOpen(false); // Tutup sidebar di mobile saat kirim pesan

    // Simulasi response AI
    setTimeout(() => {
      const responses = {
        "Apa itu BPMP Papua?": "BPMP Papua adalah Balai Pengembangan Multimedia Pendidikan yang bertugas mengembangkan konten pendidikan digital untuk wilayah Papua.",
        "Program prioritas BPMP?": "Program prioritas BPMP Papua meliputi:\n• Pengembangan bahan ajar digital\n• Pelatihan guru teknologi pendidikan\n• Infrastruktur TIK pendidikan\n• Konten edukasi budaya Papua",
        "Cara hubungi ULT BPMP?": "Hubungi ULT BPMP melalui:\n📧 Email: ult@bpmp.papua.go.id\n📞 Telp: (0967) 531-123\n📍 Lokasi: Gedung Teknologi Lantai 3",
        "Tugas dan fungsi BPMP?": "Tugas utama BPMP Papua:\n• Mengembangkan multimedia pendidikan\n• Menyediakan layanan teknologi informasi\n• Melaksanakan pelatihan\n• Mengelola sistem informasi",
        "Lokasi kantor BPMP": "Alamat:\nJl. Pendidikan No. 123, Jayapura\nPapua 99111\n\n📱 (0967) 531-000\n📧 info@bpmp.papua.go.id",
        "Layanan yang tersedia": "Layanan:\n• Konsultasi teknologi pendidikan\n• Pengembangan konten digital\n• Pelatihan multimedia\n• Sistem informasi sekolah",
        "Ajukan pelatihan": "Ajukan pelatihan:\n1. Download formulir di website\n2. Isi formulir lengkap\n3. Submit ke email pelatihan\n4. Tunggu konfirmasi tim",
        "Download formulir": "Formulir online:\n🌐 https://bpmp.papua.go.id/download\n\nPilih formulir:\n• Permohonan Layanan\n• Pengajuan Pelatihan\n• Laporan Kegiatan",
        "Jadwal kegiatan": "Jadwal terbaru:\n• Pelatihan Guru: 15-17 Maret\n• Workshop: 22 Maret\n• Sosialisasi: 28 Maret\n\nLihat lengkap di website",
        "FAQ": "Pertanyaan sering diajukan:\n1. Cara akses materi?\n2. Prosedur pelatihan?\n3. Syarat pengajuan?\n\nLihat semua di halaman FAQ website"
      };

      const replyText = responses[text] || 
        "Terima kasih atas pertanyaannya. Untuk informasi lebih detail, silakan hubungi langsung ke kantor BPMP Papua.";

      const reply = {
        id: Date.now() + 1,
        sender: "bot",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, reply]);
      setLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        sendMessage(input);
      }
    }
  };

  return (
    <div className="chatbot-user-layout">
      {/* SIDEBAR KIRI - Quick Questions */}
      <aside className={`chat-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </div>
          {sidebarOpen && (
            <>
              <div className="sidebar-title">
                <MessageSquare size={18} />
                <span>Pertanyaan Cepat</span>
              </div>
              <div className="quick-questions-list">
                {QUICK_QUESTIONS.map((q, index) => (
                  <button
                    key={index}
                    className="quick-question-btn"
                    onClick={() => sendMessage(q.text)}
                    title={q.text}
                  >
                    <span className="question-icon">{q.icon}</span>
                    {sidebarOpen && <span className="question-text">{q.text}</span>}
                  </button>
                ))}
              </div>
              <div className="sidebar-footer">
                <Clock size={12} />
                <span>BPMP Papua</span>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* MAIN CHAT AREA - Full width di kanan */}
      <main className="chat-main-area">
        {/* HEADER */}
        <header className="chat-header">
          <div className="header-left">
            {isMobile && (
              <button 
                className="mobile-menu-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
              >
                <MessageSquare size={20} />
              </button>
            )}
            <img src={kasbiLogo} alt="KASBI Logo" className="header-logo" />
            <div className="header-text">
              <h1>KASBI Chatbot</h1>
              <p>BPMP Papua - Kawan Setia Berbagi Informasi</p>
            </div>
          </div>
          
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                <User size={18} />
              </div>
              <div className="user-details">
                <div className="user-name">{userInfo.name}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* CHAT MESSAGES - FULL WIDTH */}
        <div className="chat-messages-container">
          <div className="chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-row ${msg.sender === "user" ? "user-message" : "bot-message"}`}
              >
                <div className="message-bubble">
                  <div className="message-content">
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  <div className="message-footer">
                    <span className="message-sender">
                      {msg.sender === 'bot' ? '🤖 KASBI' : '👤 Anda'}
                    </span>
                    <span className="message-time">
                      <Clock size={10} /> {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row bot-message">
                <div className="message-bubble typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="typing-text">KASBI sedang mengetik...</div>
                </div>
              </div>
            )}

            <div ref={endRef} className="scroll-anchor" />
          </div>
        </div>

        {/* INPUT AREA */}
        <div className="chat-input-area">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              value={input}
              placeholder="Tulis pertanyaan Anda tentang BPMP Papua..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows="2"
              className="chat-input"
              aria-label="Input pesan untuk chatbot"
            />
            <div className="input-hint">
              Tekan <kbd>Enter</kbd> untuk mengirim • <kbd>Shift + Enter</kbd> untuk baris baru
            </div>
          </div>
          <button
            onClick={() => sendMessage(input)}
            className="send-btn"
            disabled={!input.trim() || loading}
          >
            <Send size={20} />
            <span>Kirim</span>
          </button>
        </div>

        {/* FOOTER */}
        <footer className="chat-footer">
          <div className="footer-content">
            <Clock size={12} />
            <span>
              {new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
            <span className="footer-separator">•</span>
            <span>BPMP Papua - KASBI Chatbot</span>
          </div>
        </footer>
      </main>

      {/* OVERLAY untuk mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
          aria-label="Tutup sidebar"
        />
      )}
    </div>
  );
}