import { motion } from "framer-motion";
import { Home, Building2, Factory, ShieldCheck } from "lucide-react";

export default function HomeAuthoritySection() {
    const pillars = [
      {
        icon: <Home size={36} />,
        title: "Smart Solutions for Homes",
        description:
          "We build intelligent systems that make homes safer and smarter — including fire protection systems, automation, remote monitoring, and smart control devices you can manage from anywhere.",
      },
      {
        icon: <Building2 size={36} />,
        title: "Office & Business Automation",
        description:
          "From security systems and energy control to workflow automation, we help businesses operate more efficiently using modern smart technologies.",
      },
      {
        icon: <Factory size={36} />,
        title: "Industrial & Heavy-Duty Systems",
        description:
          "We design reliable control systems, robotic solutions, and monitoring tools built to perform in demanding industrial environments.",
      },
      {
        icon: <ShieldCheck size={36} />,
        title: "Built to Last & Easy to Use",
        description:
          "Our systems are designed for durability, safety, and long-term performance — while remaining simple enough for anyone to operate.",
      },
    ];

  return (
    <section className="relative bg-black text-white py-28 overflow-hidden">
      
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/5 via-transparent to-transparent" />

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
            Why Choose <span className="text-indigo-500">DEVAD</span>
          </h2>

        <p className="mt-6 text-gray-400 text-lg">
          We design and build smart systems for homes, offices, businesses, and industries — making everyday operations smarter, safer and more efficient.
        </p>
        </motion.div>

        {/* Features List */}
        <div className="mt-20 space-y-16">

          {pillars.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.7 }}
              viewport={{ once: true }}
              className="group flex flex-col md:flex-row md:items-start gap-8 border-b border-zinc-800 pb-12"
            >
              {/* Icon */}
              <div className="text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-400 leading-relaxed max-w-2xl">
                  {item.description}
                </p>
              </div>

            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}