import HeroSection from '@/components/organisms/HeroSection';
import FeaturedPrograms from '@/components/organisms/FeaturedPrograms';
import RecentInsights from '@/components/organisms/RecentInsights';
import TestimonialsSection from '@/components/organisms/TestimonialsSection';

const HomePage = () => {
  return (
    <div className="pt-16">
      <HeroSection />
      <FeaturedPrograms />
      <RecentInsights />
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;