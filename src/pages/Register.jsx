import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import ResponseModal from "./ResponseModal";

function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 180, 255, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 255, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

function CircuitLines({ side }) {
  const isLeft = side === "left";
  return (
    <svg
      className={`absolute top-0 ${isLeft ? "left-0" : "right-0"} h-full w-64 opacity-20 pointer-events-none`}
      viewBox="0 0 200 600"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={
          isLeft
            ? "M200 50 H120 V150 H60 V250 H100 V350 H40 V450 H130 V550"
            : "M0 80 H80 V180 H140 V280 H90 V380 H160 V480 H70 V560"
        }
        stroke="#00b4ff"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        className="animate-pulse"
      />
      {[60, 160, 260, 360, 460].map((y, i) => (
        <circle
          key={i}
          cx={isLeft ? [120, 60, 100, 40, 130][i] : [80, 140, 90, 160, 70][i]}
          cy={y}
          r="4"
          fill="#00d4ff"
          className="animate-pulse"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </svg>
  );
}

// Reusable input field
function InputField({ id, type = "text", placeholder, value, onChange, icon, focusedField, setFocusedField, rightSlot }) {
  return (
    <div className="relative group">
      <div
        className="absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          background: "linear-gradient(135deg, #0066ff22, #00d4ff11)",
          opacity: focusedField === id ? 1 : 0,
          border: "1px solid rgba(0,180,255,0.4)",
          borderRadius: "12px",
        }}
      />
      <div
        className="relative flex items-center rounded-xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${focusedField === id ? "rgba(0,180,255,0.5)" : "rgba(100,150,255,0.15)"}`,
          transition: "border-color 0.3s",
        }}
      >
        <div className="pl-4 pr-3 flex items-center">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{
              color: focusedField === id ? "#38bdf8" : "rgba(150,180,255,0.5)",
              transition: "color 0.3s",
            }}
          >
            {icon}
          </svg>
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocusedField(id)}
          onBlur={() => setFocusedField(null)}
          className="flex-1 py-3.5 pr-4 bg-transparent outline-none text-sm"
          style={{
            color: "rgba(220,235,255,0.9)",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "14px",
            letterSpacing: "0.02em",
          }}
        />
        {rightSlot}
      </div>
    </div>
  );
}

const ICONS = {
  user: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  email: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  lock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
  phone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
};

function EyeIcon({ open }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

// Password strength meter
function StrengthBar({ password }) {
  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const score = getStrength(password);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#38bdf8", "#22c55e"];

  if (!password) return null;

  return (
    <div className="mt-2 px-1">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{
              background: i <= score ? colors[score] : "rgba(100,150,255,0.15)",
            }}
          />
        ))}
      </div>
      <p className="text-xs" style={{ color: colors[score], fontFamily: "'Rajdhani', sans-serif" }}>
        {labels[score]}
      </p>
    </div>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const showModal = (type, title, message) =>
    setModal({ open: true, type, title, message });

  const closeModal = () => {
    if (modal.type === "success") navigate("/login");
    setModal((prev) => ({ ...prev, open: false }));
  };

  const validate = () => {
    const { firstName, lastName, email, password, confirmPassword } = form;
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showModal("warning", "Missing fields", "Please fill in all required fields.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showModal("warning", "Invalid email", "Please enter a valid email address.");
      return false;
    }
    if (password.length < 8) {
      showModal("warning", "Weak password", "Password must be at least 8 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      showModal("error", "Passwords don't match", "Please make sure both passwords are identical.");
      return false;
    }
    if (!agreed) {
      showModal("warning", "Terms required", "Please agree to the Terms & Privacy Policy to continue.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      showModal("loading", "Creating account…", "Please wait a moment.");

      await authService.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
      });

      showModal(
        "success",
        "Account created!",
        "Welcome aboard! Please check your email to verify your account, then sign in."
      );
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Registration failed. Please try again.";
      showModal("error", "Registration failed", msg);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    transform: mounted ? "translateY(0)" : "translateY(30px)",
    opacity: mounted ? 1 : 0,
    transition: "all 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
  };

  const fadeIn = (delay) => ({
    transform: mounted ? "translateY(0)" : "translateY(10px)",
    opacity: mounted ? 1 : 0,
    transition: `all 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s`,
  });

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden py-16"
      style={{
        background: "linear-gradient(135deg, #020b18 0%, #041428 40%, #061c35 70%, #030e1c 100%)",
      }}
    >
      <Particles />

      {/* Glow spots */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #0066ff 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, #00aaff 0%, transparent 70%)", filter: "blur(50px)" }} />
      </div>

      {/* Circuit lines */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        <CircuitLines side="left" />
        <div className="absolute right-0 top-0 h-full w-64">
          <CircuitLines side="right" />
        </div>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md mx-4" style={{ zIndex: 10, ...cardStyle }}>
        {/* Glow border */}
        <div
          className="absolute -inset-0.5 rounded-2xl opacity-60"
          style={{
            background: "linear-gradient(135deg, #0066ff44, #00d4ff33, #0066ff22)",
            filter: "blur(1px)",
          }}
        />

        <div
          className="relative rounded-2xl p-8 overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(6,20,45,0.95) 0%, rgba(4,14,32,0.98) 100%)",
            border: "1px solid rgba(0,180,255,0.25)",
            boxShadow: "0 0 60px rgba(0,100,255,0.15), 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Top shimmer */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,200,255,0.6), transparent)" }} />

          {/* Header */}
          <div className="text-center mb-6" style={fadeIn(0.25)}>
            <h2
              className="text-xl font-bold"
              style={{
                background: "linear-gradient(90deg, #38bdf8, #60a5fa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              Create Account
            </h2>
            <p className="text-sm mt-1" style={{ color: "rgba(180,210,255,0.65)" }}>
              Start your learning journey today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" style={fadeIn(0.35)}>

            {/* First + Last name row */}
            <div className="grid grid-cols-2 gap-3">
              <InputField
                id="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={set("firstName")}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                icon={ICONS.user}
              />
              <InputField
                id="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={set("lastName")}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                icon={ICONS.user}
              />
            </div>

            {/* Email */}
            <InputField
              id="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={set("email")}
              focusedField={focusedField}
              setFocusedField={setFocusedField}
              icon={ICONS.email}
            />

            {/* Phone (optional) */}
            <InputField
              id="phone"
              type="tel"
              placeholder="Phone number (optional)"
              value={form.phone}
              onChange={set("phone")}
              focusedField={focusedField}
              setFocusedField={setFocusedField}
              icon={ICONS.phone}
            />

            {/* Password */}
            <div>
              <InputField
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={set("password")}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                icon={ICONS.lock}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="px-4 flex items-center transition-colors duration-200"
                    style={{ color: showPass ? "#38bdf8" : "rgba(150,180,255,0.5)" }}
                  >
                    <EyeIcon open={showPass} />
                  </button>
                }
              />
              <StrengthBar password={form.password} />
            </div>

            {/* Confirm password */}
            <InputField
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              focusedField={focusedField}
              setFocusedField={setFocusedField}
              icon={ICONS.lock}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="px-4 flex items-center transition-colors duration-200"
                  style={{ color: showConfirm ? "#38bdf8" : "rgba(150,180,255,0.5)" }}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              }
            />

            {/* Confirm password match indicator */}
            {form.confirmPassword && (
              <p
                className="text-xs px-1 -mt-2"
                style={{
                  color: form.password === form.confirmPassword ? "#22c55e" : "#ef4444",
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                {form.password === form.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}

            {/* Terms checkbox */}
            <label
              className="flex items-start gap-3 cursor-pointer group mt-1"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              <div
                onClick={() => setAgreed(!agreed)}
                className="mt-0.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all duration-200"
                style={{
                  background: agreed ? "linear-gradient(135deg, #0066ff, #00c8ff)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${agreed ? "rgba(0,180,255,0.8)" : "rgba(100,150,255,0.25)"}`,
                  boxShadow: agreed ? "0 0 10px rgba(0,150,255,0.3)" : "none",
                }}
              >
                {agreed && (
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-xs leading-relaxed" style={{ color: "rgba(150,180,255,0.65)" }}>
                I agree to the{" "}
                <span className="font-semibold hover:brightness-125 transition-all" style={{ color: "#38bdf8" }}>
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="font-semibold hover:brightness-125 transition-all" style={{ color: "#38bdf8" }}>
                  Privacy Policy
                </span>
              </span>
            </label>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden rounded-xl py-3.5 font-bold text-sm tracking-widest transition-all duration-300 group mt-2"
              style={{
                background: loading
                  ? "rgba(0,100,200,0.5)"
                  : "linear-gradient(135deg, #0066ff 0%, #0099ff 50%, #00c8ff 100%)",
                color: "#fff",
                fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.15em",
                boxShadow: loading
                  ? "none"
                  : "0 0 30px rgba(0,150,255,0.4), 0 4px 15px rgba(0,100,255,0.3)",
                transform: loading ? "scale(0.99)" : "scale(1)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                  transform: "skewX(-20deg)",
                  animation: "shimmer 1.5s infinite",
                }}
              />
              <span className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    CREATING ACCOUNT...
                  </>
                ) : (
                  <>
                    CREATE ACCOUNT
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Sign in link */}
          <p
            className="text-center text-sm mt-5"
            style={{
              color: "rgba(150,180,255,0.55)",
              fontFamily: "'Rajdhani', sans-serif",
              ...fadeIn(0.65),
            }}
          >
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-bold transition-all duration-200 hover:brightness-125"
              style={{ color: "#38bdf8", fontFamily: "'Orbitron', sans-serif", fontSize: "12px" }}
            >
              Sign in
            </button>
          </p>

          {/* Bottom shimmer */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,150,255,0.3), transparent)" }}
          />
        </div>
      </div>

      <ResponseModal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        buttonText="Continue"
        showClose={false}
        disableBackdropClose={modal.type === "loading"}
        onClose={closeModal}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');

        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(300%) skewX(-20deg); }
        }

        input::placeholder {
          color: rgba(150, 180, 255, 0.35);
          font-family: 'Rajdhani', sans-serif;
        }

        * { -webkit-font-smoothing: antialiased; }
      `}</style>
    </div>
  );
}