
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authService } from "../services/auth.service";

// ─── Particles Background ───────────────────────────────────────────────────
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

// ─── Circuit Lines Visuals ───────────────────────────────────────────────────
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

// ─── Success Checkmark Icon ──────────────────────────────────────────────────
function SuccessIcon() {
  return (
    <div className="relative w-20 h-20 mx-auto">
      <div
        className="absolute inset-0 rounded-full animate-ping opacity-20"
        style={{ background: "radial-gradient(circle, #10b981, transparent)" }}
      />
      <div
        className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(0,200,120,0.08))",
          border: "1px solid rgba(16,185,129,0.4)",
          boxShadow: "0 0 30px rgba(16,185,129,0.2)",
        }}
      >
        <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────
export default function ResetPasswordPage() {
  const { token } = useParams(); // Collects :token cleanly from react-router layout link
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  
  // Specific track states for input highlighting
  const [focusedPass, setFocusedPass] = useState(false);
  const [focusedConfirm, setFocusedConfirm] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const cardStyle = {
    transform: mounted ? "translateY(0)" : "translateY(30px)",
    opacity: mounted ? 1 : 0,
    transition: "all 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
  };

  const fadeIn = (delay = 0) => ({
    transform: mounted ? "translateY(0)" : "translateY(10px)",
    opacity: mounted ? 1 : 0,
    transition: `all 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s`,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please complete both password entry tracks.");
      return;
    }

    if (password.length < 6) {
      setError("Password metrics require a minimum of 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password inputs do not match standard verification parity.");
      return;
    }

    try {
      setLoading(true);
      // Fits backend parameters: token via URL params, password inside body
      await authService.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Token expired or security connection dropped. Please request a new link.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #020b18 0%, #041428 40%, #061c35 70%, #030e1c 100%)",
      }}
    >
      <Particles />

      {/* Ambient Glow nodes */}
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

      {/* Cyber Circuit Overlays */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        <CircuitLines side="left" />
        <div className="absolute right-0 top-0 h-full w-64">
          <CircuitLines side="right" />
        </div>
      </div>

      {/* Central Glassmorphic Interface Card */}
      <div className="relative w-full max-w-sm mx-4" style={{ zIndex: 10, ...cardStyle }}>
        <div
          className="absolute -inset-0.5 rounded-2xl opacity-60"
          style={{
            background: "linear-gradient(135deg, #0066ff44, #00d4ff33, #0066ff22)",
            filter: "blur(1px)",
          }}
        />

        <div
          className="relative rounded-2xl p-10 overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(6,20,45,0.95) 0%, rgba(4,14,32,0.98) 100%)",
            border: "1px solid rgba(0,180,255,0.25)",
            boxShadow: "0 0 60px rgba(0,100,255,0.15), 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,200,255,0.6), transparent)",
            }}
          />

          {/* ── DATA FORM MATRIX ENTRY ── */}
          {!success && (
            <div className="space-y-6">
              <div className="text-center" style={fadeIn(0.2)}>
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,102,255,0.15), rgba(0,180,255,0.08))",
                    border: "1px solid rgba(0,180,255,0.3)",
                  }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#38bdf8" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
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
                  Reset Password
                </h2>
                <p
                  className="text-sm mt-2 leading-relaxed"
                  style={{
                    color: "rgba(180,210,255,0.6)",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  Establish secure authentication tokens for infrastructure verification access.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" style={fadeIn(0.3)}>
                {/* Password Input Node */}
                <div className="relative group">
                  <div
                    className="absolute inset-0 rounded-xl transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(135deg, #0066ff22, #00d4ff11)",
                      opacity: focusedPass ? 1 : 0,
                      border: "1px solid rgba(0,180,255,0.4)",
                      borderRadius: "12px",
                    }}
                  />
                  <div
                    className="relative flex items-center rounded-xl overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${focusedPass ? "rgba(0,180,255,0.5)" : "rgba(100,150,255,0.15)"}`,
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
                          color: focusedPass ? "#38bdf8" : "rgba(150,180,255,0.5)",
                          transition: "color 0.3s",
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      onFocus={() => setFocusedPass(true)}
                      onBlur={() => setFocusedPass(false)}
                      className="flex-1 py-3.5 pr-4 bg-transparent outline-none text-sm"
                      style={{
                        color: "rgba(220,235,255,0.9)",
                        fontFamily: "'Rajdhani', sans-serif",
                        fontSize: "14px",
                        letterSpacing: "0.1em",
                      }}
                    />
                  </div>
                </div>

                {/* Confirm Password Input Node */}
                <div className="relative group">
                  <div
                    className="absolute inset-0 rounded-xl transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(135deg, #0066ff22, #00d4ff11)",
                      opacity: focusedConfirm ? 1 : 0,
                      border: "1px solid rgba(0,180,255,0.4)",
                      borderRadius: "12px",
                    }}
                  />
                  <div
                    className="relative flex items-center rounded-xl overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${focusedConfirm ? "rgba(0,180,255,0.5)" : "rgba(100,150,255,0.15)"}`,
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
                          color: focusedConfirm ? "#38bdf8" : "rgba(150,180,255,0.5)",
                          transition: "color 0.3s",
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                      onFocus={() => setFocusedConfirm(true)}
                      onBlur={() => setFocusedConfirm(false)}
                      className="flex-1 py-3.5 pr-4 bg-transparent outline-none text-sm"
                      style={{
                        color: "rgba(220,235,255,0.9)",
                        fontFamily: "'Rajdhani', sans-serif",
                        fontSize: "14px",
                        letterSpacing: "0.1em",
                      }}
                    />
                  </div>
                </div>

                {error && (
                  <p
                    className="text-xs px-1"
                    style={{ color: "#ef4444", fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    ✗ {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden rounded-xl py-3.5 font-bold text-sm tracking-widest transition-all duration-300 group cursor-pointer"
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
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        COMPILING LOGS...
                      </>
                    ) : (
                      <>
                        UPDATE SECURITY KEY
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
            </div>
          )}

          {/* ── EXECUTION SUCCESS SYSTEM STATE ── */}
          {success && (
            <div className="space-y-6 text-center" style={fadeIn(0.2)}>
              <SuccessIcon />

              <div>
                <h2
                  className="text-xl font-bold mt-6"
                  style={{
                    background: "linear-gradient(90deg, #10b981, #34d399)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontFamily: "'Orbitron', sans-serif",
                  }}
                >
                  Update Complete
                </h2>
                <p
                  className="text-sm mt-2 leading-relaxed"
                  style={{
                    color: "rgba(180,210,255,0.6)",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  Your new authentication keys have updated across nodes. Security configurations validated.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full relative overflow-hidden rounded-xl py-3.5 font-bold text-sm tracking-widest transition-all duration-300 group cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#fff",
                  fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
                  fontSize: "13px",
                  letterSpacing: "0.15em",
                  boxShadow: "0 0 30px rgba(16,185,129,0.3)",
                }}
              >
                <span className="relative flex items-center justify-center gap-2">
                  PROCEED TO LOG IN
                </span>
              </button>
            </div>
          )}

          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,150,255,0.3), transparent)",
            }}
          />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');

        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(300%) skewX(-20deg); }
        }

        input::placeholder {
          color: rgba(150, 180, 255, 0.35);
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: normal;
        }

        * { -webkit-font-smoothing: antialiased; }
      `}</style>
    </div>
  );
}
