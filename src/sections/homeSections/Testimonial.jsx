import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function HomeTestimonialSection() {
  const testimonials = [
    {
      name: "Industrial Client",
      role: "Manufacturing Company",
      text: "DEVAD built a smart monitoring system that reduced machine downtime and improved efficiency across our factory.",
    },
    {
      name: "Home Automation User",
      role: "Residential Client",
      text: "The smart home system is incredible — I can control lights, security, and fire alerts from my phone anywhere.",
    },
    {
      name: "Business Owner",
      role: "Office Automation Client",
      text: "Their automation system streamlined our operations and improved how we manage energy and security.",
    },
  ];

  return (
    <section className="relative bg-black text-white py-28 overflow-hidden">

      {/* Soft glow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            What People <span className="text-indigo-500">Say</span>
          </h2>

          <p className="mt-6 text-gray-400 text-lg">
            Real feedback from clients using our smart systems in homes, offices, and industries.
          </p>
        </motion.div>

        {/* Floating testimonials layout */}
        <div className="mt-20 relative">

          {/* glowing center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-indigo-600/20 hidden md:block" />

          <div className="space-y-14">

            {testimonials.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex md:items-center gap-6 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Quote Icon */}
                <div className="text-indigo-500">
                  <Quote size={40} />
                </div>

                {/* Text Block */}
                <div className="bg-zinc-900/40 border border-zinc-800 backdrop-blur-xl p-6 rounded-2xl max-w-xl hover:border-indigo-500 transition">
                  <p className="text-gray-300 leading-relaxed">
                    {item.text}
                  </p>

                  <div className="mt-4">
                    <h4 className="text-white font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-400">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
