import { motion } from "framer-motion";
import { MessageCircle, DraftingCompass, Cpu, Wrench, Rocket, LifeBuoy } from "lucide-react";

export default function HomeProcessSection() {
  const steps = [
    {
      icon: <MessageCircle size={28} />,
      title: "Consultation & Planning",
      description:
        "We start by understanding your needs — whether it's a smart home, business automation, or industrial system. We analyze requirements and define the right solution.",
    },
    {
      icon: <DraftingCompass size={28} />,
      title: "System Design",
      description:
        "Our engineers design the full architecture — hardware, software, automation flow, and safety considerations — ensuring everything is structured and scalable.",
    },
    {
      icon: <Cpu size={28} />,
      title: "Development & Integration",
      description:
        "We build and integrate intelligent components including embedded systems, AI software, control systems, and cloud connectivity.",
    },
    {
      icon: <Wrench size={28} />,
      title: "Testing & Optimization",
      description:
        "Every system is thoroughly tested for performance, safety, and reliability to ensure it works flawlessly in real-world environments.",
    },
    {
      icon: <Rocket size={28} />,
      title: "Deployment",
      description:
        "We install, configure, and deploy the solution — ensuring smooth implementation with minimal disruption.",
    },
    {
      icon: <LifeBuoy size={28} />,
      title: "Ongoing Support",
      description:
        "We provide continuous monitoring, maintenance, upgrades, and technical support to ensure long-term efficiency.",
    },
  ];

  return (
    <section className="relative bg-black text-white py-28 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            How <span className="text-indigo-500">We Work</span>
          </h2>

          <p className="mt-6 text-gray-400 text-lg">
            A structured engineering process that ensures reliability,
            performance, and long-term success.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-10">

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-8 hover:border-indigo-500 transition-all duration-300"
            >
              <div className="mb-5 text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>

              <h3 className="text-xl font-semibold mb-4">
                {step.title}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
