import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ScrollToTop from "../utils/Scroll"; // Your utility import

import Home from "../pages/Home";
import CoursesPage from "../pages/Courses";
import CourseDetailPage from "../pages/CourseDetail";
import CareerPathsPage from "../pages/CareerPath";
import AboutUs from "../pages/About";
import ContactUs from "../pages/Contact";

import LoginPage from "../pages/Login";

export default function AppRoutes() {
  return (
    <>
      {/* 1. Put it right here! It will listen to the router context and fire on every change */}
      <ScrollToTop />

      {/* 2. Your standard routes wrapper handles the view swapping below it */}
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
          <Route path="/career-paths" element={<CareerPathsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<ContactUs />} />
        </Route>
      </Routes>
    </>
  );
}