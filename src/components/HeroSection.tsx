import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Truck, Award, Users } from "lucide-react";
import heroImage from "@/assets/hero-sarees.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Premium Indian ethnic wear collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-75" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl">
          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge className="trust-badge">
              <Shield className="h-4 w-4" />
              GST Registered
            </Badge>
            <Badge className="trust-badge">
              <Award className="h-4 w-4" />
              25+ Years Experience
            </Badge>
            <Badge className="trust-badge">
              <Users className="h-4 w-4" />
              1000+ Happy Retailers
            </Badge>
          </div>

          {/* Main heading */}
          <h1 className="text-hero text-primary-foreground mb-6">
            Wholesale Indian Ethnicwear from{" "}
            <span className="gradient-text">Surat</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
            Sarees, Suits & Kurtis curated for retailers, resellers and boutiques.
            Premium quality, competitive pricing, reliable dispatch.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 animate-glow"
            >
              Create Trade Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-background/20 text-primary-foreground border-primary-foreground/30 hover:bg-background/30 text-lg px-8 py-6 backdrop-blur-sm"
            >
              Browse Catalogs
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold">Dispatch in 2–5 days</div>
                <div className="text-sm opacity-80">Fast nationwide shipping</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold">GST Invoicing</div>
                <div className="text-sm opacity-80">Compliant documentation</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold">Pan-India Shipping</div>
                <div className="text-sm opacity-80">Nationwide coverage</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;