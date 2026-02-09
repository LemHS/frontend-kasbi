import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { chatService } from "../services/chatbot.service"; // Import the service
import "../styles/chatbot.css";
import kasbiLogo from "../assets/images/kasbi-logo.png";
import { 
  Menu, 
  X, 
  Send, 
  Clock, 
  User, 
  Download, 
  Calendar, 
  Phone, 
  HelpCircle, 
  MessageSquare 
} from "lucide-react";

export default function Chatbot() {
  const location = useLocation();
  const isAdminChatbot = location.pathname.includes("/admin/chatbot");

  // --- 1. INITIALIZE THREAD ID FROM LOCAL STORAGE ---
  const [threadId, setThreadId] = useState(() => {
    return localStorage.getItem("chat_thread_id") || null;
  });

  const [messages, setMessages] = useState([
    {
      id: "init-1",
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

  // User Info
  const storedUser = JSON.parse(localStorage.getItem("user_data")) || {};
  const userInfo = {
    name: storedUser.username || "Pengguna BPMP",
    email: storedUser.role ? `${storedUser.role}@kasbi.id` : "user@kasbi.id"
  };

  const endRef = useRef(null);
  const textareaRef = useRef(null);

  // Constants (Quick Questions, etc...)
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

  // Mobile Check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto Scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto Resize Textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "60px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [input]);

  // --- 2. FETCH HISTORY IF THREAD ID EXISTS ---
  useEffect(() => {
    const fetchHistory = async () => {
      if (!threadId) return;

      try {
        // Updated to use Service
        const result = await chatService.getHistory(threadId);
        const historyData = result.data.chats; // accessing response.data -> chats

        if (historyData && historyData.length > 0) {
          const formattedHistory = historyData.map((chat, index) => ({
            id: `history-${index}`,
            sender: chat.role === "user" ? "user" : "bot", 
            text: chat.message,
            time: new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));

          // Keep the initial greeting, then append history
          setMessages((prev) => {
            const greeting = prev.find(m => m.id === "init-1");
            return greeting ? [greeting, ...formattedHistory] : formattedHistory;
          });
        }
      } catch (error) {
        console.error("Failed to load history:", error);
        // If thread is not found (404), clear local storage so we start fresh
        if (error.response && error.response.status === 404) {
          localStorage.removeItem("chat_thread_id");
          setThreadId(null);
        }
      }
    };

    fetchHistory();
  }, [threadId]); 

  // --- MAIN SEND LOGIC ---
  const sendMessage = async (text) => {
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

    try {
      // Updated to use Service
      // Note: integer parsing is now handled inside the service, but passing raw threadId is fine
      const result = await chatService.sendMessage(text, threadId);
      const data = result.data; 

      // --- 3. SAVE THREAD ID TO LOCAL STORAGE ---
      if (data.thread_id) {
        setThreadId(data.thread_id);
        localStorage.setItem("chat_thread_id", data.thread_id);
      }

      const botReply = {
        id: Date.now() + 1,
        sender: "bot",
        text: data.answer || "Maaf, saya tidak mendapatkan jawaban dari server.", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);

    } catch (error) {
      console.error("Chat Error:", error);
      const errorReply = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Maaf, terjadi kesalahan saat menghubungi server KASBI. Silakan coba lagi nanti.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
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

  const containerStyle = {
    display: 'flex',
    height: isAdminChatbot ? 'calc(100vh - 140px)' : 'calc(100vh - 120px)',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '500px'
  };

  return (
    <div 
      className={`chat-container ${isAdminChatbot ? 'admin-view' : 'user-view'}`}
      style={containerStyle}
    >
      {/* FLOATING ACTION BUTTON (Mobile) */}
      {isMobile && !showQuickQuestions && (
        <button 
          className="floating-quick-btn"
          onClick={() => setShowQuickQuestions(true)}
        >
          <MessageSquare size={24} />
          <span className="floating-badge">{QUICK_QUESTIONS.length}</span>
        </button>
      )}

      {/* MODAL QUICK QUESTIONS (Mobile) */}
      {isMobile && showQuickQuestions && (
        <div className="mobile-quick-modal">
          <div className="modal-header">
            <h3>🎯 Pertanyaan Cepat</h3>
            <button className="modal-close" onClick={() => setShowQuickQuestions(false)}>
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
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && !isAdminChatbot && (
        <aside className="chat-sidebar desktop-sidebar">
          <div className="sidebar-header">
            <img src={kasbiLogo} className="sidebar-logo" alt="Logo BPMP" />
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
                <button key={index} className="quick-btn" onClick={() => sendMessage(q.text)}>
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
              <div className="user-avatar"><User size={24} /></div>
              <div className="user-details">
                <div className="user-name">{userInfo.name}</div>
                <div className="user-email">{userInfo.email}</div>
                <div className="user-status">
                  <span className="status-dot active"></span> Online
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="footer-time">
              <Clock size={12} />
              <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long' })}</span>
            </div>
            <div className="footer-copyright">© BPMP Papua — KASBI</div>
          </div>
        </aside>
      )}

      {/* Main Chat Area */}
      <main className="chat-main">
        <header className="chat-header">
          <div className="header-left">
            {isMobile && !isAdminChatbot && (
              <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
                <Menu size={24} />
              </button>
            )}
            <img src={kasbiLogo} className="header-logo" alt="KASBI Logo" />
            <div className="header-text">
              <h1 className="header-title">KASBI Chatbot</h1>
              <p className="header-subtitle">Kawan Setia Berbagi Informasi</p>
            </div>
          </div>
          
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
            <div key={msg.id} className={`msg-row ${msg.sender === "user" ? "right" : "left"}`}>
              <div className={`msg-bubble ${msg.sender}`}>
                <div className="msg-content">
                  {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                </div>
                <div className="msg-footer">
                  <span className="msg-sender">{msg.sender === 'bot' ? '🤖 KASBI' : '👤 Anda'}</span>
                  <span className="msg-time">{msg.time}</span>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg-row left">
              <div className="msg-bubble bot">
                <div className="typing-indicator">
                  <div className="typing-dots"><span></span><span></span><span></span></div>
                  <div className="typing-text">KASBI sedang berpikir...</div>
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} className="scroll-anchor" />
        </div>

        {/* Quick Actions */}
        {!isAdminChatbot && (
          <div className="quick-actions-bar">
            {QUICK_ACTIONS.map((action, index) => (
              <button
                key={index}
                className="quick-action-btn"
                onClick={() => handleQuickAction(action)}
                style={{ '--action-color': action.color }}
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
            />
            <div className="input-hint">
              Tekan <kbd>Enter</kbd> untuk mengirim • <kbd>Shift + Enter</kbd> untuk baris baru
            </div>
          </div>
          <button 
            onClick={() => sendMessage(input)} 
            className="send-button"
            disabled={!input.trim() || loading}
          >
            <Send size={20} />
            <span className="send-text">Kirim</span>
          </button>
        </div>
      </main>

      {/* Mobile Sidebar Drawer */}
      {isMobile && sidebarOpen && !isAdminChatbot && (
        <>
          <div className="mobile-sidebar-drawer">
            <div className="drawer-header">
              <img src={kasbiLogo} className="drawer-logo" alt="Logo" />
              <h3>KASBI Assistant</h3>
              <button className="drawer-close" onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="drawer-content">
              <div className="drawer-section">
                 <h4>👤 Profil Pengguna</h4>
                 <div className="drawer-user-info">
                   <div className="user-avatar"><User size={20} /></div>
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
                      onClick={() => { sendMessage(q.text); setSidebarOpen(false); }}
                    >
                      <span className="quick-icon">{q.icon}</span>
                      <span className="quick-text">{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        </>
      )}
    </div>
  );
}