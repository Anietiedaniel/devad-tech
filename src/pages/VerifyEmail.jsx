import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

// ─── Particles ───────────────────────────────────────────────────────────────
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

// ─── Circuit Lines ────────────────────────────────────────────────────────────
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

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="relative w-20 h-20 mx-auto">
      {/* Outer ring */}
      <svg className="absolute inset-0 w-full h-full animate-spin" viewBox="0 0 80 80">
        <circle
          cx="40" cy="40" r="36"
          fill="none"
          stroke="rgba(0,180,255,0.15)"
          strokeWidth="4"
        />
        <circle
          cx="40" cy="40" r="36"
          fill="none"
          stroke="url(#spinGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="60 165"
        />
        <defs>
          <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0066ff" />
            <stop offset="100%" stopColor="#00d4ff" />
          </linearGradient>
        </defs>
      </svg>
      {/* Inner pulse */}
      <div
        className="absolute inset-0 m-auto w-10 h-10 rounded-full animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(0,180,255,0.3) 0%, transparent 70%)",
        }}
      />
      {/* Email icon center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#38bdf8" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  );
}

// ─── Success Icon ─────────────────────────────────────────────────────────────
function SuccessIcon() {
  return (
    <div className="relative w-20 h-20 mx-auto">
      <div
        className="absolute inset-0 rounded-full animate-ping opacity-20"
        style={{ background: "radial-gradient(circle, #22c55e, transparent)" }}
      />
      <div
        className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(0,200,100,0.08))",
          border: "1px solid rgba(34,197,94,0.4)",
          boxShadow: "0 0 30px rgba(34,197,94,0.2)",
        }}
      >
        <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  );
}

// ─── Error Icon ───────────────────────────────────────────────────────────────
function ErrorIcon() {
  return (
    <div className="relative w-20 h-20 mx-auto">
      <div
        className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(200,0,50,0.08))",
          border: "1px solid rgba(239,68,68,0.4)",
          boxShadow: "0 0 30px rgba(239,68,68,0.2)",
        }}
      >
        <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const hasCalled = useRef(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  // Auto-verify on mount
  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    if (!token) {
      setStatus("error");
      setMessage("No verification token found. Please use the link sent to your email.");
      return;
    }

    authService
      .verifyEmail(token)
      .then(() => {
        setStatus("success");
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message ||
          "This verification link is invalid or has expired. Please request a new one.";
        setStatus("error");
        setMessage(msg);
      });
  }, [token]);

  // Countdown redirect on success
  useEffect(() => {
    if (status !== "success") return;
    if (countdown === 0) {
      navigate("/login");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, countdown, navigate]);

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

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #020b18 0%, #041428 40%, #061c35 70%, #030e1c 100%)",
      }}
    >
      <Particles />

      {/* Glow spots */}
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

      {/* Circuit lines */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <CircuitLines side="left" />
        <div className="absolute right-0 top-0 h-full w-64">
          <CircuitLines side="right" />
        </div>
      </div>

      {/* Card */}
      <div
        className="relative w-full max-w-sm mx-4"
        style={{ zIndex: 10, ...cardStyle }}
      >
        {/* Glow border */}
        <div
          className="absolute -inset-0.5 rounded-2xl opacity-60"
          style={{
            background:
              "linear-gradient(135deg, #0066ff44, #00d4ff33, #0066ff22)",
            filter: "blur(1px)",
          }}
        />

        <div
          className="relative rounded-2xl p-10 overflow-hidden text-center"
          style={{
            background:
              "linear-gradient(160deg, rgba(6,20,45,0.95) 0%, rgba(4,14,32,0.98) 100%)",
            border: "1px solid rgba(0,180,255,0.25)",
            boxShadow:
              "0 0 60px rgba(0,100,255,0.15), 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Top shimmer */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,200,255,0.6), transparent)",
            }}
          />

          {/* ── VERIFYING STATE ── */}
          {status === "verifying" && (
            <div className="space-y-6" style={fadeIn(0.2)}>
              <Spinner />
              <div>
                <h2
                  className="text-xl font-bold mt-6"
                  style={{
                    background: "linear-gradient(90deg, #38bdf8, #60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontFamily: "'Orbitron', sans-serif",
                  }}
                >
                  Verifying Your Email
                </h2>
                <p
                  className="text-sm mt-2"
                  style={{
                    color: "rgba(180,210,255,0.6)",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  Please hold on while we confirm your account.
                </p>
              </div>
            </div>
          )}

          {/* ── SUCCESS STATE ── */}
          {status === "success" && (
            <div className="space-y-6" style={fadeIn(0.2)}>
              <SuccessIcon />
              <div>
                <h2
                  className="text-xl font-bold mt-6"
                  style={{
                    background: "linear-gradient(90deg, #22c55e, #4ade80)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontFamily: "'Orbitron', sans-serif",
                  }}
                >
                  Email Verified!
                </h2>
                <p
                  className="text-sm mt-2"
                  style={{
                    color: "rgba(180,210,255,0.6)",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  Your account is now active. You can sign in and start learning.
                </p>
              </div>

              {/* Countdown bar */}
              <div className="space-y-2">
                <p
                  className="text-xs"
                  style={{
                    color: "rgba(150,180,255,0.5)",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  Redirecting to login in{" "}
                  <span style={{ color: "#38bdf8", fontWeight: 700 }}>
                    {countdown}s
                  </span>
                </p>
                <div
                  className="w-full h-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(100,150,255,0.1)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(countdown / 5) * 100}%`,
                      background:
                        "linear-gradient(90deg, #0066ff, #00d4ff)",
                      transition: "width 1s linear",
                    }}
                  />
                </div>
              </div>

              <button
                onClick={() => navigate("/login")}
                className="w-full relative overflow-hidden rounded-xl py-3.5 font-bold text-sm tracking-widest transition-all duration-300 group cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, #0066ff 0%, #0099ff 50%, #00c8ff 100%)",
                  color: "#fff",
                  fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
                  fontSize: "13px",
                  letterSpacing: "0.15em",
                  boxShadow:
                    "0 0 30px rgba(0,150,255,0.4), 0 4px 15px rgba(0,100,255,0.3)",
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
                <span className="relative flex items-center justify-center gap-2">
                  GO TO LOGIN
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
                </span>
              </button>
            </div>
          )}

          {/* ── ERROR STATE ── */}
          {status === "error" && (
            <div className="space-y-6" style={fadeIn(0.2)}>
              <ErrorIcon />
              <div>
                <h2
                  className="text-xl font-bold mt-6"
                  style={{
                    background: "linear-gradient(90deg, #ef4444, #f87171)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontFamily: "'Orbitron', sans-serif",
                  }}
                >
                  Verification Failed
                </h2>
                <p
                  className="text-sm mt-2 leading-relaxed"
                  style={{
                    color: "rgba(180,210,255,0.6)",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  {message}
                </p>
              </div>

              <button
                onClick={() => navigate("/login")}
                className="w-full relative overflow-hidden rounded-xl py-3.5 font-bold text-sm tracking-widest transition-all duration-300 group cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "#38bdf8",
                  fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
                  fontSize: "13px",
                  letterSpacing: "0.15em",
                  border: "1px solid rgba(0,180,255,0.25)",
                }}
              >
                <span className="relative flex items-center justify-center gap-2">
                  BACK TO LOGIN
                </span>
              </button>
            </div>
          )}

          {/* Bottom shimmer */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,150,255,0.3), transparent)",
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

        * { -webkit-font-smoothing: antialiased; }
      `}</style>
    </div>
  );
}
