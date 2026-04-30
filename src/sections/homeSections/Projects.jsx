import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import robot from "../../assets/robotics.png"

export default function HomeFeaturedProjects() {
  const projects = [
    {
      title: "Autonomous Fire Suppression Rover",
      description:
        "AI-powered robotic system designed for remote fire detection and automated extinguishing in hazardous environments.",
      image: robot,
    },
    {
      title: "Industrial IoT Monitoring Platform",
      description:
        "Real-time smart monitoring system for industrial equipment using embedded sensors and cloud analytics.",
      image: robot,
    },
    {
      title: "AI Vision Inspection System",
      description:
        "Computer vision-based defect detection system engineered for manufacturing quality control.",
      image: robot,
    },
  ];

  return (
    <section className="relative bg-black text-white py-28 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[160px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Featured <span className="text-indigo-500">Projects</span>
            </h2>
            <p className="mt-4 text-gray-400 max-w-xl">
              A glimpse into the intelligent systems we have engineered and deployed.
            </p>
          </div>

          <a
            href="/projects"
            className="flex items-center gap-2 text-indigo-500 hover:text-white transition"
          >
            View All Projects <ArrowRight size={18} />
          </a>
        </motion.div>

        {/* Projects Grid */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-10">

          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.7 }}
              viewport={{ once: true }}
              className="group bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">
                  {project.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
