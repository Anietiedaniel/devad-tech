import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import robot from "../../assets/robotics.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white pt-24 md:pt-28 lg:pt-0">

      {/* Tech Grid Background */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Glow Accent */}
      <div className="absolute w-[600px] h-[600px] bg-indigo-600/20 blur-[150px] rounded-full top-[-100px] right-[-100px]" />

      <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Building{" "}
            <span className="text-indigo-500">
              Smart Systems
            </span>
            <br />
            <span className="text-white/90">
              for the Future
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-xl mx-auto md:mx-0">
            Advanced AI, robotics, and embedded technologies engineered for real-world impact.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
            <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300">
              Explore Our Services
              <ArrowRight size={18} />
            </button>

            <button className="border border-gray-500 hover:border-white px-6 py-3 rounded-xl transition-all duration-300">
              View Our Projects
            </button>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          className="relative flex justify-center md:justify-end"
        >
          <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
            <img
              src={robot}
              alt="Smart Robotics System"
              className="w-full drop-shadow-[0_20px_40px_rgba(99,102,241,0.5)]"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}