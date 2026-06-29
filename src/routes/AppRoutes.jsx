import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ScrollToTop from "../utils/Scroll";
import Home from "../pages/Home";
import CoursesPage from "../pages/Courses";
import CourseDetailPage from "../pages/CourseDetail";
import CareerPathsPage from "../pages/CareerPath";
import AboutUs from "../pages/About";
import ContactUs from "../pages/Contact";
import RegisterPage from "../pages/Register";
import LoginPage from "../pages/Login";
import ForgotPasswordPage from "../pages/ForgotPassword";
import VerifyEmailPage from "../pages/VerifyEmail";

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Auth standalone pages */}
        <Route path="verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />

        {/* Main site with layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
          <Route path="/career-paths" element={<CareerPathsPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<ContactUs />} />
        </Route>
      </Routes>
    </>
  );
}
