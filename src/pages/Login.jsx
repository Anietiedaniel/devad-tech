import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ResponseModal from "./ResponseModal"; // adjust path as needed

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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Modal state
  const [modal, setModal] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const showModal = (type, title, message) =>
    setModal({ open: true, type, title, message });

  const closeModal = () => {
    // Save type before resetting state to safely handle redirect after success
    const currentType = modal.type;
    setModal((prev) => ({ ...prev, open: false }));
    
    if (currentType === "success") {
      navigate("/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showModal("warning", "Missing Fields", "Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      showModal("loading", "Signing In…", "Please wait a moment while we establish a secure connection.");

      await login({ email, password });

      showModal("success", "Welcome Back!", "You've signed in successfully.");
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Login failed. Please verify your credentials and try again.";
      showModal("error", "Sign In Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden py-40"
      style={{
        background:
          "linear-gradient(135deg, #020b18 0%, #041428 40%, #061c35 70%, #030e1c 100%)",
      }}
    >
      <Particles />

      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #0066ff 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8"
          style={{
            background: "radial-gradient(circle, #00aaff 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <CircuitLines side="left" />
        <div className="absolute right-0 top-0 h-full w-64">
          <CircuitLines side="right" />
        </div>
      </div>

      {/* Login Card */}
      <div
        className="relative w-full max-w-md mx-4"
        style={{
          zIndex: 10,
          transform: mounted ? "translateY(0)" : "translateY(30px)",
          opacity: mounted ? 1 : 0,
          transition: "all 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div
          className="absolute -inset-0.5 rounded-2xl opacity-60"
          style={{
            background:
              "linear-gradient(135deg, #0066ff44, #00d4ff33, #0066ff22)",
            filter: "blur(1px)",
          }}
        />

        <div
          className="relative rounded-2xl p-8 overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, rgba(6,20,45,0.95) 0%, rgba(4,14,32,0.98) 100%)",
            border: "1px solid rgba(0,180,255,0.25)",
            boxShadow:
              "0 0 60px rgba(0,100,255,0.15), 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,200,255,0.6), transparent)",
            }}
          />

          <div
            className="text-center mb-6"
            style={{
              transform: mounted ? "translateY(0)" : "translateY(10px)",
              opacity: mounted ? 1 : 0,
              transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.25s",
            }}
          >
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
              Welcome Back!
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "rgba(180,210,255,0.65)" }}
            >
              Sign in to continue your learning journey
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            style={{
              transform: mounted ? "translateY(0)" : "translateY(10px)",
              opacity: mounted ? 1 : 0,
              transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.35s",
            }}
          >
            {/* Email field */}
            <div className="relative group">
              <div
                className="absolute inset-0 rounded-xl transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, #0066ff22, #00d4ff11)",
                  opacity: focusedField === "email" ? 1 : 0,
                  border: "1px solid rgba(0,180,255,0.4)",
                  borderRadius: "12px",
                }}
              />
              <div
                className="relative flex items-center rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${
                    focusedField === "email"
                      ? "rgba(0,180,255,0.5)"
                      : "rgba(100,150,255,0.15)"
                  }`,
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
                      color:
                        focusedField === "email"
                          ? "#38bdf8"
                          : "rgba(150,180,255,0.5)",
                      transition: "color 0.3s",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 py-3.5 pr-4 bg-transparent outline-none text-sm"
                  style={{
                    color: "rgba(220,235,255,0.9)",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "14px",
                    letterSpacing: "0.02em",
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="relative group">
              <div
                className="absolute inset-0 rounded-xl transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, #0066ff22, #00d4ff11)",
                  opacity: focusedField === "password" ? 1 : 0,
                  border: "1px solid rgba(0,180,255,0.4)",
                  borderRadius: "12px",
                }}
              />
              <div
                className="relative flex items-center rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${
                    focusedField === "password"
                      ? "rgba(0,180,255,0.5)"
                      : "rgba(100,150,255,0.15)"
                  }`,
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
                      color:
                        focusedField === "password"
                          ? "#38bdf8"
                          : "rgba(150,180,255,0.5)",
                      transition: "color 0.3s",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 py-3.5 bg-transparent outline-none text-sm"
                  style={{
                    color: "rgba(220,235,255,0.9)",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "14px",
                    letterSpacing: "0.02em",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="px-4 flex items-center transition-colors duration-200"
                  style={{
                    color: showPass ? "#38bdf8" : "rgba(150,180,255,0.5)",
                  }}
                >
                  {showPass ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-xs font-medium transition-all duration-200 hover:brightness-125 cursor-pointer"
                style={{
                  color: "#38bdf8",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "0.03em",
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden rounded-xl py-3.5 font-bold text-sm tracking-widest transition-all duration-300 group"
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
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                  transform: "skewX(-20deg)",
                  animation: "shimmer 1.5s infinite",
                }}
              />
              <span className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    SIGNING IN...
                  </>
                ) : (
                  <>
                    SIGN IN
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div
            className="flex items-center gap-4 my-5"
            style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.8s 0.5s" }}
          >
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(100,150,255,0.2))",
              }}
            />
            <span
              className="text-xs font-semibold tracking-widest"
              style={{
                color: "rgba(150,180,255,0.45)",
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              OR
            </span>
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(90deg, rgba(100,150,255,0.2), transparent)",
              }}
            />
          </div>

          {/* OAuth Buttons */}
          <div
            className="flex justify-center gap-4"
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.8s 0.55s",
            }}
          >
            {[
              {
                name: "Google",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                ),
              },
              {
                name: "GitHub",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                ),
              },
              {
                name: "Microsoft",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <rect x="1" y="1" width="10" height="10" fill="#f25022" />
                    <rect x="13" y="1" width="10" height="10" fill="#7fba00" />
                    <rect x="1" y="13" width="10" height="10" fill="#00a4ef" />
                    <rect x="13" y="13" width="10" height="10" fill="#ffb900" />
                  </svg>
                ),
              },
            ].map(({ name, icon }) => (
              <button
                key={name}
                type="button"
                className="flex items-center justify-center w-16 h-12 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(100,150,255,0.2)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0,100,255,0.12)";
                  e.currentTarget.style.borderColor = "rgba(0,180,255,0.4)";
                  e.currentTarget.style.boxShadow =
                    "0 0 15px rgba(0,150,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(100,150,255,0.2)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(0,0,0,0.3)";
                }}
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Register Link */}
          <p
            className="text-center text-sm mt-5"
            style={{
              color: "rgba(150,180,255,0.55)",
              fontFamily: "'Rajdhani', sans-serif",
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.8s 0.65s",
            }}
          >
            New here?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-bold transition-all duration-200 hover:brightness-125 cursor-pointer"
              style={{
                color: "#38bdf8",
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "12px",
              }}
            >
              Create an account
            </button>
          </p>

          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,150,255,0.3), transparent)",
            }}
          />
        </div>
      </div>

      {/* Response Modal */}
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