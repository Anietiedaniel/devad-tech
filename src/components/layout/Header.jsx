import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Cpu,
  Briefcase,
  GraduationCap,
  Info,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo.png";

const HEADER_HEIGHT = 80;

// Simple throttle utility
const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  // Throttled scroll handler
  const handleScroll = useCallback(
    throttle(() => {
      setScrolled(window.scrollY > 10);
    }, 16), // ~60fps
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Memoized navigation links
  const navLinks = useMemo(
    () => [
      { name: "Home", path: "/", icon: Home },
      { name: "Services", path: "/services", icon: Cpu },
      { name: "Projects", path: "/projects", icon: Briefcase },
      { name: "Training", path: "/training", icon: GraduationCap },
      { name: "About", path: "/about", icon: Info },
      { name: "Contact", path: "/contact", icon: Mail },
    ],
    []
  );

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050b1a]/98 shadow-lg shadow-cyan-900/20 border-b border-cyan-500/20"
          : "bg-[#050b1a]/92 border-b border-white/10"
      } backdrop-blur-lg`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="DEVAD Technologies Logo"
            className="w-11 h-11 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <div className="leading-tight">
            <h1 className="text-lg font-semibold text-white tracking-wider">
              DEVAD
            </h1>
            <p className="text-xs text-cyan-400 tracking-[0.25em]">
              TECHNOLOGIES
            </p>
          </div>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `relative text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <div className="relative group">
                  {link.name}
                  <span
                    className={`absolute left-0 bottom-0 h-[2px] w-full scale-x-0 origin-left transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "group-hover:scale-x-100"
                    }`}
                  >
                    <span className="electric-underline"></span>
                  </span>
                </div>
              )}
            </NavLink>
          ))}

          <NavLink
            to="/contact"
            className="ml-6 px-6 py-2.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/40 hover:scale-105 active:scale-95"
          >
            Request a Custom Build
          </NavLink>
        </nav>

        {/* Mobile Toggle */}
        <div className="lg:hidden text-white">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed left-0 w-full bg-black/80 backdrop-blur-xl z-40 lg:hidden"
              style={{
                top: HEADER_HEIGHT,
                height: `calc(100vh - ${HEADER_HEIGHT}px)`,
              }}
              onClick={closeMenu}
            />

            {/* Menu */}
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-[#050b1a] border-t border-white/10 fixed left-0 w-full z-50"
              style={{ top: HEADER_HEIGHT }}
            >
              <div className="flex flex-col px-6 py-6 gap-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-cyan-500/10 text-cyan-400"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      <Icon size={20} />
                      <span className="text-lg font-medium">{link.name}</span>
                    </NavLink>
                  );
                })}

                <NavLink
                  to="/contact"
                  onClick={closeMenu}
                  className="mt-4 px-5 py-3 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold text-center transition-all active:scale-95"
                >
                  Request a Custom Build
                </NavLink>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}


