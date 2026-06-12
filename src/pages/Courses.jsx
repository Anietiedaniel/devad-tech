import { useState } from "react";
import { COURSES } from "../data/course";
import CoursesHero from "../sections/coursesSections/coursesHero";
import CourseGrid from "../sections/coursesSections/courseGrid";
import FeaturedCourses from "../sections/coursesSections/featured";
// import StudentSuccessStories from "./StudentSuccessStories";
// import CoursesFAQ from "../sections/coursesSections/Coursefaq";
// import CoursesFooterCTA from "./CoursesFooterCTA";

// Usage with your own router:
// import CoursesPage from "./pages/courses/CoursesPage";
// <Route path="/courses" element={<CoursesPage />} />
// Pass onNavigate prop or use useNavigate() inside

export default function CoursesPage({ onNavigate }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [priceMax, setPriceMax] = useState(400000);

  const categories = ["All", ...new Set(COURSES.map((c) => c.category))];
  const levels = ["All", "Beginner", "Beginner → Advanced", "Intermediate", "Advanced"];

  const filtered = COURSES.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || c.category === category;
    const matchLevel = level === "All" || c.level === level;
    const matchPrice = c.price <= priceMax;
    return matchSearch && matchCat && matchLevel && matchPrice;
  });

  // If using React Router, replace onNavigate with:
  // const navigate = useNavigate();
  // const handleNavigate = (slug) => navigate(`/courses/${slug}`);

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-10">
      <CoursesHero
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        level={level}
        setLevel={setLevel}
        priceMax={priceMax}
        setPriceMax={setPriceMax}
        categories={categories}
        levels={levels}
      />
      
      <CourseGrid
        courses={COURSES}
        filtered={filtered}
        categories={categories}
        category={category}
        setCategory={setCategory}
        onNavigate={onNavigate}
      />

      <FeaturedCourses courses={COURSES} onNavigate={onNavigate} />

      {/* <StudentSuccessStories testimonials={TESTIMONIALS} /> */}
      <CoursesFAQ />
    </div>
  );
}