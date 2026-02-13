import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";
import kasbiLogo from "../assets/images/kasbi-logo.png";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Password dan Konfirmasi Password tidak sama.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setErrorMsg("Password minimal 8 karakter.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "user" // Currently defaults to user, but logic below handles 'admin' if changed
      };

      const result = await register(payload);

      if (result.success) {
        // --- NEW REDIRECT LOGIC ---
        const userData = JSON.parse(localStorage.getItem("user_data"));
        
        if (userData && userData.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/chatbot");
        }
        // --------------------------
      } else {
        setErrorMsg(result.message || "Gagal mendaftar.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan sistem.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="register-wrapperr">
      <div className="reg-bg reg-bg-1"></div>
      <div className="reg-bg reg-bg-2"></div>

      <div className="register-card">
        <div className="reg-header">
          <img src={kasbiLogo} className="reg-logo-kasbi" alt="KASBI" />
          <h2 className="reg-title">Buat Akun Baru</h2>
          <p className="reg-subtitle">
            Daftar untuk mengakses layanan BPMP Papua
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="reg-input-group">
            <input 
              type="text" 
              name="username"
              placeholder="Username" 
              className="reg-input"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
            />
          </div>

          <div className="reg-input-group">
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              className="reg-input" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="reg-input-group password-field">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password (Min. 8 Karakter)"
              className="reg-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="reg-input-group password-field">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Konfirmasi Password"
              className="reg-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errorMsg && <p className="error-text" style={{color: 'red', fontSize: '0.9rem', marginBottom: '10px', textAlign: 'center'}}>{errorMsg}</p>}

          <button className="reg-btn" disabled={loading}>
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="reg-switch">
          Sudah punya akun?{" "}
          <Link to="/login" className="reg-link">Masuk di sini</Link>
        </p>

        <p className="reg-footer">© BPMP Papua • Sistem Chatbot KASBI</p>
      </div>
    </div>
  );
}