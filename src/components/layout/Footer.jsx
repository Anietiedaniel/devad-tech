import { NavLink } from "react-router-dom";
import { Cpu, Mail, Phone, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import logo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="relative bg-[#050b1a] border-t border-white/10 text-gray-300 overflow-hidden">

      {/* Glow Background */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <img
              src={logo}
              alt="logo"
              className="w-11 h-11 logo-glow transition-all duration-500"
            />
            <div>
              <h2 className="text-white font-semibold text-lg">DEVAD</h2>
              <p className="text-xs text-cyan-400 tracking-[0.25em]">
                TECHNOLOGIES
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed">
            Engineering intelligent systems in AI, robotics, embedded systems,
            and IoT — transforming ideas into real-world innovation.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <a
              href="#"
              className="p-2 bg-zinc-800 rounded-lg hover:bg-indigo-600 transition"
            >
              <FaGithub size={16} />
            </a>

            <a
              href="#"
              className="p-2 bg-zinc-800 rounded-lg hover:bg-indigo-600 transition"
            >
              <FaLinkedin size={16} />
            </a>

            <a
              href="#"
              className="p-2 bg-zinc-800 rounded-lg hover:bg-indigo-600 transition"
            >
              <FaTwitter size={16} />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-5">Quick Links</h3>

          <div className="flex flex-col gap-3 text-sm">
            <NavLink to="/" className="hover:text-indigo-400 transition">
              Home
            </NavLink>
            <NavLink to="/services" className="hover:text-indigo-400 transition">
              Services
            </NavLink>
            <NavLink to="/projects" className="hover:text-indigo-400 transition">
              Projects
            </NavLink>
            <NavLink to="/training" className="hover:text-indigo-400 transition">
              Training
            </NavLink>
            <NavLink to="/about" className="hover:text-indigo-400 transition">
              About
            </NavLink>
          </div>
        </div>

        {/* EXPERTISE */}
        <div>
          <h3 className="text-white font-semibold mb-5">Expertise</h3>

          <div className="flex flex-col gap-3 text-sm">
            <p className="flex items-center gap-2">
              <Cpu size={16} /> Smart Home Automation
            </p>
            <p className="flex items-center gap-2">
              <Cpu size={16} /> Business & Office Automation
            </p>
            <p className="flex items-center gap-2">
              <Cpu size={16} /> Industrial Machine Control
            </p>
            <p className="flex items-center gap-2">
              <Cpu size={16} /> AI & Smart Software Systems
            </p>
            <p className="flex items-center gap-2">
              <Cpu size={16} /> Robotics & Intelligent Machines
            </p>
            <p className="flex items-center gap-2">
              <Cpu size={16} /> Security & Monitoring Solutions
            </p>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-5">Contact</h3>

          <div className="flex flex-col gap-3 text-sm">
            <p className="flex items-center gap-2">
              <Mail size={20} /> devadtechnologies@gmail.com
            </p>

            <p className="flex items-center gap-2">
              <Phone size={16} /> +234 810 655 1348, +234 803 508 0609
            </p>

            <p className="flex items-center gap-2">
              <MapPin size={16} /> Rivers State, Nigeria
            </p>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} DEVAD Technologies. All rights reserved.
      </div>

    </footer>
  );
}
