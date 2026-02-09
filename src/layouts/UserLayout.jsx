import { useState, useEffect, useRef } from "react";
import "../styles/user-layout.css";
import kasbiLogo from "../assets/images/kasbi-logo.png";
import { Send, MessageSquare, Clock, User, LogOut, ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { chatService } from "../services/chatbot.service"; // Updated import

export default function ChatbotUser() {
  const navigate = useNavigate();
  
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // User Data
  const storedUser = JSON.parse(localStorage.getItem("user_data")) || {};
  const userInfo = {
    name: storedUser.username || "Pengguna BPMP",
    email: storedUser.username ? `${storedUser.username}@kasbi.id` : "user@bpmp.papua.go.id"
  };

  const endRef = useRef(null);
  const textareaRef = useRef(null);

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

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
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

  // --- 2. FETCH HISTORY LOGIC ---
  useEffect(() => {
    const fetchHistory = async () => {
      if (!threadId) return;

      try {
        // Updated to use Service
        const result = await chatService.getHistory(threadId);
        const historyData = result.data.chats; // Accessing response.data -> chats

        if (historyData && historyData.length > 0) {
          const formattedHistory = historyData.map((chat, index) => ({
            id: `history-${index}`,
            // Backend sends 'user' or 'chatbot'. Frontend expects 'user' or 'bot'.
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
        // If thread invalid/not found, clear storage to start fresh
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
    if (isMobile) setSidebarOpen(false);

    try {
      // Updated to use Service
      // Service handles the payload structure
      const result = await chatService.sendMessage(text, threadId);
      const data = result.data; // Accessing response.data

      // --- 3. SAVE THREAD ID TO LOCAL STORAGE ---
      if (data.thread_id) {
        setThreadId(data.thread_id);
        localStorage.setItem("chat_thread_id", data.thread_id);
      }

      const reply = {
        id: Date.now() + 1,
        sender: "bot",
        text: data.answer || "Maaf, saya tidak mendapatkan jawaban.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, reply]);

    } catch (error) {
      console.error("Chat API Error:", error);
      const errorMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Maaf, terjadi kesalahan saat menghubungi server KASBI. Silakan coba lagi.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
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
      {/* SIDEBAR KIRI */}
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

      {/* MAIN CHAT AREA */}
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

        {/* MESSAGES */}
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
                  <div className="typing-text">KASBI sedang berpikir...</div>
                </div>
              </div>
            )}

            <div ref={endRef} className="scroll-anchor" />
          </div>
        </div>

        {/* INPUT */}
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

      {/* OVERLAY */}
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