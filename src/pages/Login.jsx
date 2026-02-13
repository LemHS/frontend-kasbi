import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import tutWuri from "../assets/images/tut-wuri.png";
import kasbiLogo from "../assets/images/kasbi-logo.png";
import "../styles/auth.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const isEmailFormat = email.includes("@");

      const credentials = {
        password: password,
        email: isEmailFormat ? email : null,
        username: isEmailFormat ? null : email,
      };

      const result = await login(credentials);

      if (result.success) {
        // --- NEW REDIRECT LOGIC ---
        // Read the user data saved by AuthContext to check the role
        const userData = JSON.parse(localStorage.getItem("user_data"));
        
        if (userData && userData.role === "admin") {
          navigate("/admin/chatbot");
        } else if (userData && userData.role === "superadmin") {
          navigate("/admin/chatbot");
        } else {
          navigate("/chatbot");
        }
        // --------------------------
      } else {
        setErrorMsg(result.message || "Email/Username atau password salah");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
      console.error(err);
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
          <img src={kasbiLogo} className="kasbi-logo" alt="KASBI Logo" />

          <h2 className="login-title">Login KASBI</h2>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Email atau Username"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
            <Link to="/register" className="register-link">
              Daftar akun
            </Link>
          </p>

          <p className="login-footer">© BPMP Papua • Chatbot KASBI</p>
        </div>
      </div>
    </div>
  );
}