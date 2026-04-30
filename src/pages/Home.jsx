import HeroSection from "../sections/homeSections/HeroSection";
import HomeAuthoritySection from "../sections/homeSections/HomeAuthoritySection";
import HomeProcessSection from "../sections/homeSections/Process";
import HomeFeaturedProjects from "../sections/homeSections/Projects"
import HomeActionSection from "../sections/homeSections/HomeActionSection";
import HomeTestimonialSection from "../sections/homeSections/Testimonial";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HomeAuthoritySection />
      <HomeProcessSection />
      <HomeFeaturedProjects />
      <HomeTestimonialSection />
      <HomeCTASection />
      
      {/* Other home sections will go here later */}
    </>
  );
}