import { useState, useEffect, useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ResponseModal from "../components/ResponseModal";

function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
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
  email: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  lock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
};

function EyeIcon({ open }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const [modal, setModal] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
  });

  const navigate = useNavigate();
  const { login, googleLogin } = useAuth(); 

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const showModal = (type, title, message) =>
    setModal({ open: true, type, title, message });

  const closeModal = () => {
    const currentType = modal.type;
    setModal((prev) => ({ ...prev, open: false }));

    if (currentType === "success") {
      navigate("/dashboard");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      if (!googleToken) return;

      showModal("loading", "Authenticating...", "Verifying secure credentials with Google.");

      if (!googleLogin) {
        throw new Error("Google Authentication method is uninitialized in context.");
      }

      // Capture the auth context payload response directly
      const session = await googleLogin(googleToken);
      
      // If your context returns false or undefined tokens on background network failures, intercept it
      if (session === false) {
        throw new Error("Handshake authorized but security token validation dropped.");
      }

      showModal("success", "Welcome Back!", "Login successful. Redirecting to your workspace.");
    } catch (err) {
      console.error("Google Auth execution failed:", err);
      const errMsg = err.response?.data?.message || err.message || "Google sign-in verification failed.";
      showModal("error", "Authentication Failed", errMsg);
    }
  };

  const handleGoogleError = () => {
    showModal("error", "Sign In Failed", "Google handshake initialization failed.");
  };

  const validate = () => {
    const { email, password } = form;
    if (!email) {
      showModal("warning", "Missing field", "Please fill in your email address.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showModal("warning", "Invalid email", "Please enter a valid email address.");
      return false;
    }
    if (!password) {
      showModal("warning", "Missing field", "Please fill in your password.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      showModal("loading", "Signing In…", "Please wait a moment while we establish a secure connection.");
      
      // Await your context engine execution pipeline
      const result = await login({
        email: form.email,
        password: form.password,
      });

      // Defensive Check: If your backend returns 200 but context execution properties indicate failure
      if (result === false) {
        throw new Error("Authentication succeeded but session state context initialization failed.");
      }

      showModal("success", "Welcome Back!", "You've signed in successfully.");
    } catch (err) {
      console.error("Login verification breakdown:", err);
      const msg = err.response?.data?.message || err.message || "Operation failed. Please verify entry variables.";
      showModal("error", "Execution Terminated", msg);
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
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden py-24"
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
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,200,255,0.6), transparent)" }} />

          {/* Header */}
          <div className="text-center mb-6" style={fadeIn(0.25)}>
            <h2
              className="text-xl font-bold uppercase tracking-wider"
              style={{
                background: "linear-gradient(90deg, #38bdf8, #60a5fa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              Welcome Back
            </h2>
            <p className="text-sm mt-1" style={{ color: "rgba(180,210,255,0.65)" }}>
              Secure access panel to your console
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3" style={fadeIn(0.35)}>
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

            <div className="space-y-2">
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
              
              <div className="text-right px-1">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="font-bold transition-all duration-200 hover:brightness-125 cursor-pointer opacity-80 hover:opacity-100"
                  style={{ color: "#38bdf8", fontFamily: "'Orbitron', sans-serif", fontSize: "11px", letterSpacing: "0.05em" }}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden rounded-xl py-3.5 font-bold text-sm tracking-widest transition-all duration-300 group mt-5 cursor-pointer"
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
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer-effect"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
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
                    AUTHORIZING ACCESS...
                  </>
                ) : (
                  <>
                    SIGN IN
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

          <div className="flex items-center my-5" style={fadeIn(0.45)}>
            <div className="flex-1 h-px bg-slate-800" />
            <span className="px-3 text-xs tracking-wider" style={{ color: "rgba(150,180,255,0.35)", fontFamily: "'Orbitron', sans-serif" }}>OR</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Google Login Provider */}
          <div style={fadeIn(0.55)} className="w-full flex justify-center min-h-[40px] GoogleLoginWrapper cursor-pointer">
            <div className="w-[350px] overflow-hidden rounded-xl bg-[#0b1426] flex justify-center cursor-pointer">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="continue_with"
                theme="filled_dark"
                shape="rectangular"
                width="350px"
              />
            </div>
          </div>

          {/* Footer Routing Block */}
          <p
            className="text-center text-sm mt-5"
            style={{
              color: "rgba(150,180,255,0.55)",
              fontFamily: "'Rajdhani', sans-serif",
              ...fadeIn(0.65),
            }}
          >
            Don't have an account yet?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-bold transition-all duration-200 hover:brightness-125 cursor-pointer"
              style={{ color: "#38bdf8", fontFamily: "'Orbitron', sans-serif", fontSize: "12px" }}
            >
              Register
            </button>
          </p>

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
        @keyframes shimmerAnimation {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(300%) skewX(-20deg); }
        }
        .shimmer-effect {
          transform: skewX(-20deg);
          animation: shimmerAnimation 1.5s infinite;
        }
        input::placeholder {
          color: rgba(150, 180, 255, 0.35);
          font-family: 'Rajdhani', sans-serif;
        }
        .GoogleLoginWrapper iframe {
          background-color: transparent !important;
          color-scheme: dark !important;
        }
        * { -webkit-font-smoothing: antialiased; }
      `}</style>
    </div>
  );
}
