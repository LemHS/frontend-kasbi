import { useState } from "react";
import "../styles/auth.css";
import tutWuri from "../assets/images/tut-wuri.png";
import kasbiLogo from "../assets/images/kasbi-logo.png";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="register-wrapperr">

      {/* Decorative Background */}
      <div className="reg-bg reg-bg-1"></div>
      <div className="reg-bg reg-bg-2"></div>

      {/* CARD */}
      <div className="register-card">

        {/* HEADER SECTION */}
        <div className="reg-header">
          {/* <img src={tutWuri} className="reg-logo-tutwuri" alt="Tut Wuri" /> */}
          <img src={kasbiLogo} className="reg-logo-kasbi" alt="KASBI" />
          <h2 className="reg-title">Buat Akun Baru</h2>
          <p className="reg-subtitle">
            Daftar untuk mengakses layanan BPMP Papua
          </p>
        </div>

        {/* FORM INPUTS */}
        <div className="reg-input-group">
          <input type="text" placeholder="Username" className="reg-input" />
        </div>

        <div className="reg-input-group">
          <input type="text" placeholder="Nama Lengkap" className="reg-input" />
        </div>

        <div className="reg-input-group">
          <input type="email" placeholder="Email" className="reg-input" />
        </div>

        {/* Password */}
        <div className="reg-input-group password-field">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="reg-input"
          />
          <button
            className="eye-btn"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="reg-input-group password-field">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Konfirmasi Password"
            className="reg-input"
          />
          <button
            className="eye-btn"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* BUTTON */}
        <button className="reg-btn">Daftar Sekarang</button>

        {/* SWITCH LOGIN */}
        <p className="reg-switch">
          Sudah punya akun?{" "}
          <a href="/login" className="reg-link">Masuk di sini</a>
        </p>

        {/* FOOTER */}
        <p className="reg-footer">© BPMP Papua • Sistem Chatbot KASBI</p>
      </div>
    </div>
  );
}
