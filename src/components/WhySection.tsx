import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Truck, 
  Award, 
  Users, 
  Clock, 
  CheckCircle,
  MapPin,
  CreditCard
} from "lucide-react";

const WhySection = () => {
  const benefits = [
    {
      icon: Shield,
      title: "GST Compliant",
      description: "Multi-state GST registration ensures proper invoicing and compliance for your business.",
      badge: "Verified"
    },
    {
      icon: Truck,
      title: "Fast Dispatch",
      description: "Typical dispatch in 2-5 working days with reliable shipping partners across India.",
      badge: "Express"
    },
    {
      icon: Award,
      title: "25+ Years Experience",
      description: "Established textile business with proven track record in wholesale ethnic wear.",
      badge: "Trusted"
    },
    {
      icon: Users,
      title: "1000+ Happy Retailers",
      description: "Serving boutiques, resellers and retailers with consistent quality and service.",
      badge: "Popular"
    },
    {
      icon: MapPin,
      title: "Surat Hub",
      description: "Located in India's textile capital with direct access to premium fabric manufacturers.",
      badge: "Strategic"
    },
    {
      icon: CreditCard,
      title: "Trade Pricing",
      description: "Competitive wholesale pricing with transparent margins for retail partners.",
      badge: "Profitable"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-section-title text-primary mb-4">
            Why Choose Meghdoot Textiles?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We understand the challenges of retail business. Our wholesale platform 
            is designed to help you succeed with reliable supply, quality products, and professional service.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={benefit.title} 
                className="glass-card hover:shadow-strong transition-all duration-300 group border-0"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-accent/10 text-accent rounded-lg group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge className="bg-accent/10 text-accent border-accent/20">
                      {benefit.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-card-title group-hover:text-accent transition-colors">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom stats */}
        <div className="mt-16 p-8 bg-gradient-primary rounded-2xl text-primary-foreground">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">25+</div>
              <div className="text-primary-foreground/80 text-sm">Years in Business</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-primary-foreground/80 text-sm">Happy Retailers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-primary-foreground/80 text-sm">Active Catalogs</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">2-5</div>
              <div className="text-primary-foreground/80 text-sm">Days Dispatch</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;