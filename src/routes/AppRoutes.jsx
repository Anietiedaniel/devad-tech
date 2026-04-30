import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

import Home from "../pages/Home";
import Services from "../pages/Services";
// import Projects from "../pages/Projects";
// import Training from "../pages/Training";
// import About from "../pages/About";
// import Contact from "../pages/Contact";

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        {/* <Route path="projects" element={<Projects />} />
        <Route path="training" element={<Training />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} /> */}
      </Route>

    </Routes>
  );
}