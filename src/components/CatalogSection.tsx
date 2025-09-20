import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, ShoppingCart, Lock, ArrowRight } from "lucide-react";
import catalogImage from "@/assets/catalog-showcase.jpg";

const CatalogSection = () => {
  const catalogs = [
    {
      id: "SAR001",
      name: "Premium Silk Sarees Collection",
      fabric: "Pure Silk",
      setSize: "12 pieces",
      category: "Sarees",
      dispatch: "3-4 days",
      image: catalogImage,
    },
    {
      id: "SLW002", 
      name: "Designer Salwar Suits",
      fabric: "Georgette & Crepe",
      setSize: "8 pieces",
      category: "Salwar Suits",
      dispatch: "2-3 days",
      image: catalogImage,
    },
    {
      id: "KUR003",
      name: "Casual Kurtis Collection",
      fabric: "Cotton & Rayon",
      setSize: "15 pieces",
      category: "Kurtis",
      dispatch: "4-5 days", 
      image: catalogImage,
    },
    {
      id: "LEH004",
      name: "Bridal Lehengas Premium",
      fabric: "Silk & Net",
      setSize: "6 pieces",
      category: "Lehengas",
      dispatch: "5-7 days",
      image: catalogImage,
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-section-title text-primary mb-4">
            Featured Catalogs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of premium ethnic wear, 
            carefully selected for retail and wholesale partners
          </p>
        </div>

        {/* Catalog grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {catalogs.map((catalog) => (
            <Card key={catalog.id} className="glass-card group hover:shadow-strong transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={catalog.image}
                    alt={catalog.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary text-primary-foreground">
                      {catalog.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <CardTitle className="text-card-title mb-2 group-hover:text-accent transition-colors">
                  {catalog.name}
                </CardTitle>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Catalog ID:</span>
                    <span className="font-medium">{catalog.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fabric:</span>
                    <span className="font-medium">{catalog.fabric}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Set Size:</span>
                    <span className="font-medium">{catalog.setSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dispatch:</span>
                    <span className="font-medium text-success">{catalog.dispatch}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                  <Lock className="h-4 w-4" />
                  <span>Login to view trade pricing</span>
                </div>
                <div className="flex gap-2 w-full">
                  <Button variant="outline" size="sm" className="flex-1">
                    Quick View
                  </Button>
                  <Button size="sm" className="flex-1">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View all catalogs CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="px-8">
            View All Catalogs
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CatalogSection;