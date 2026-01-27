import { useState, useEffect, useRef } from "react";
import "../styles/chatbot.css";
import kasbiLogo from "../assets/images/kasbi-logo.png";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Halo, saya KASBI. Ada yang bisa saya bantu seputar BPMP Papua?",
      time: new Date().toLocaleTimeString(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const QUICK_QUESTIONS = [
    "Apa itu BPMP Papua?",
    "Program prioritas BPMP Papua?",
    "Cara menghubungi ULT BPMP?",
    "Tugas dan fungsi BPMP?",
  ];

  // Auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Maaf, server KASBI belum merespons. Pastikan backend aktif.",
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, reply]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="chat-container">

      {/* SIDEBAR */}
      <aside className="chat-sidebar">
        <img src={kasbiLogo} className="sidebar-logo" alt="logo" />

        <h3 className="sidebar-title">Pertanyaan Cepat</h3>
        <div className="quick-list">
          {QUICK_QUESTIONS.map((q) => (
            <button key={q} className="quick-btn" onClick={() => sendMessage(q)}>
              {q}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          © BPMP Papua — KASBI
        </div>
      </aside>

      {/* CHAT SECTION */}
      <main className="chat-main">
        <header className="chat-header">
          <img src={kasbiLogo} className="header-logo" alt="" />
          <div>
            <h2 className="header-title">KASBI Chatbot</h2>
            <p className="header-sub">Kawan Setia Berbagi Informasi</p>
          </div>
        </header>

        {/* CHAT BUBBLES */}
        <div className="chat-box">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`msg-row ${msg.sender === "user" ? "right" : "left"}`}
            >
              <div className={`msg-bubble ${msg.sender}`}>
                {msg.text}
                <div className="msg-time">{msg.time}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg-row left">
              <div className="msg-bubble bot">
                <div className="dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="msg-time">KASBI sedang memproses...</div>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* INPUT */}
        <div className="chat-input">
          <textarea
            value={input}
            placeholder="Tulis pertanyaan Anda..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
          />

          <button onClick={() => sendMessage(input)} className="send-btn">
            Kirim
          </button>
        </div>
      </main>
    </div>
  );
}
