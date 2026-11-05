import StudioCategories from "./shared/StudioCategories";
import FeaturedStudios from "./shared/FeaturedStudios";
import WhyChooseUs from "./shared/WhyChooseUs";
import HowItWorks from "./shared/HowItWorks";
import About from "./shared/About";
import Banner from "./shared/Banner";

// Featured Studios streams data from MongoDB, so navigations here are not
// guaranteed to be instant (same as the studios pages).
export const instant = false;

export default function Home() {
  return (
    <>
      <Banner />
      <About />
      <StudioCategories />
      <FeaturedStudios />
      <HowItWorks />
      <WhyChooseUs />
    </>
  );
}
