import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import catalogImage from "@/assets/catalog-showcase.jpg";

const CategoriesSection = () => {
  const categories = [
    {
      name: "Sarees",
      description: "Premium silk, cotton, and designer sarees for every occasion",
      catalogCount: "150+ Catalogs",
      popular: true,
      image: catalogImage,
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      name: "Salwar Suits",
      description: "Elegant suits and dress materials in latest designs",
      catalogCount: "120+ Catalogs", 
      popular: true,
      image: catalogImage,
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      name: "Kurtis",
      description: "Casual and formal kurtis in cotton, rayon, and silk",
      catalogCount: "200+ Catalogs",
      popular: false,
      image: catalogImage,
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      name: "Lehengas",
      description: "Bridal and party wear lehengas with intricate work",
      catalogCount: "80+ Catalogs",
      popular: false,
      image: catalogImage,
      gradient: "from-amber-500/20 to-orange-500/20"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-section-title text-primary mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our extensive collection of authentic Indian ethnic wear, 
            carefully curated for wholesale and retail partners
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {categories.map((category, index) => (
            <Card key={category.name} className="group overflow-hidden border-0 bg-gradient-card hover:shadow-strong transition-all duration-500 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="relative h-64 overflow-hidden">
                  {/* Background image */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} group-hover:opacity-80 transition-opacity duration-300`} />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                    <div className="flex items-start justify-between">
                      {category.popular && (
                        <Badge className="bg-accent text-accent-foreground border-0">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-white/90 mb-3 leading-relaxed">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-accent font-medium">
                          {category.catalogCount}
                        </span>
                        <Button 
                          size="sm" 
                          className="bg-white/20 text-white border-white/30 hover:bg-white hover:text-primary backdrop-blur-sm transition-all duration-300 group-hover:translate-x-1"
                          variant="outline"
                        >
                          Explore
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* New arrivals banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 md:p-12 text-center text-white">
          <div className="relative z-10">
            <Badge className="mb-4 bg-accent text-accent-foreground">
              <Sparkles className="h-4 w-4 mr-2" />
              New Arrivals
            </Badge>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Fresh Collections Added Weekly
            </h3>
            <p className="text-white/90 max-w-2xl mx-auto mb-6">
              Stay ahead of fashion trends with our constantly updated inventory. 
              New catalogs added every week from top designers and manufacturers.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              View New Arrivals
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;