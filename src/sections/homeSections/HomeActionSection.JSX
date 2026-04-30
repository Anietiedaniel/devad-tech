import { motion } from "framer-motion";
import { ArrowRight, PhoneCall, Mail } from "lucide-react";

export default function HomeActionSection() {
  return (
    <section className="relative bg-black text-white py-32 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-[600px] h-[601px] bg-indigo-600/10 blur-[180px] rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold leading-tight"
        >
          Ready to Build a{" "}
          <span className="text-indigo-500">Smart System?</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto"
        >
          Let’s design and build intelligent solutions for your home, business, or industry.  
          From idea to deployment — we handle everything.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >

          {/* Primary CTA */}
          <button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300">
            Start a Project
            <ArrowRight size={18} />
          </button>

          {/* Secondary CTA */}
          <button className="border border-zinc-600 hover:border-white px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300">
            <PhoneCall size={18} />
            Contact Us
          </button>

          {/* Optional Email CTA */}
          <button className="border border-zinc-600 hover:border-indigo-500 px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300">
            <Mail size={18} />
            Get Consultation
          </button>

        </motion.div>

        {/* Small trust line */}
        <p className="mt-10 text-sm text-gray-500">
          Fast response • Professional engineering • Real-world deployment
        </p>

      </div>
    </section>
  );
}
