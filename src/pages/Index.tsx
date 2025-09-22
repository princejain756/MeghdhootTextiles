import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import CatalogSection from "@/components/CatalogSection";
import WhySection from "@/components/WhySection";
import PhoneShowcase from "@/components/PhoneShowcase";
import Footer from "@/components/Footer";
import InstagramGallery from "@/components/InstagramGallery";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <CatalogSection />
        <WhySection />
        <PhoneShowcase />
        <InstagramGallery />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
