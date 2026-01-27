import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import tutWuri from "../assets/images/tut-wuri.png";
import kasbiLogo from "../assets/images/kasbi-logo.png";
import "../styles/auth.css";
import { loginRequest } from "../services/auth.service";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const result = await loginRequest(email, password);

      localStorage.setItem("access_token", result.data.access_token);
      localStorage.setItem("refresh_token", result.data.refresh_token);

      window.location.href = "/chatbot";
    } catch (err) {
      setErrorMsg(err.message || "Email atau password salah");
    }

    setLoading(false);
  }

  return (
    <div className="login-container">
      {/* LEFT */}
      <div className="login-left">
        <img src={tutWuri} alt="Tut Wuri" className="logo-tutwuri" />
        <h1 className="left-title">BPMP PAPUA</h1>
        <p className="left-desc">
          Platform digital resmi BPMP Papua untuk layanan informasi dan chatbot
          KASBI.
        </p>
      </div>

      {/* RIGHT */}
      <div className="login-right">
        <div className="login-card">
          <img src={kasbiLogo} className="kasbi-logo" />

          <h2 className="login-title">Login KASBI</h2>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Email atau Username"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errorMsg && <p className="error-text">{errorMsg}</p>}

            <button className="login-btn" disabled={loading}>
              {loading ? "Loading..." : "Masuk"}
            </button>
          </form>

          <p className="register-text">
            Belum punya akun?{" "}
            <a href="/register" className="register-link">
              Daftar akun
            </a>
          </p>

          <p className="login-footer">© BPMP Papua • Chatbot KASBI</p>
        </div>
      </div>
    </div>
  );
}
