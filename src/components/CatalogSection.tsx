import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, ShoppingCart, Lock, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

type CatalogCard = {
  id: string;
  name: string;
  fabric: string;
  setSize: string; // e.g. "12 pieces"
  category: string;
  dispatch: string; // e.g. "3-4 days"
  image: string; // URL
  pdfUrl?: string; // URL for quick view
};

function humanizeFilename(path: string): string {
  const name = path
    .replace(/^.*\//, "")
    .replace(/\.[A-Za-z0-9]+$/, "");
  return name
    .replace(/\s*\(\d+\)\s*/g, " ")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/\s*\(\d+\)\s*/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const CatalogSection = () => {
  const navigate = useNavigate();
  const { addItem, setIsOpen } = useCart();

  // Load local images and PDFs eagerly and pair them by normalized filename
  const { catalogs } = useMemo(() => {
    const imageModules = import.meta.glob("/src/assets/CatalogImages/*.{png,jpg,jpeg,webp}", {
      eager: true,
      as: "url",
    }) as Record<string, string>;
    const pdfModules = import.meta.glob("/src/assets/Catalogs/*.pdf", {
      eager: true,
      as: "url",
    }) as Record<string, string>;

    const pdfByKey = new Map<string, { url: string; title: string }>();
    Object.entries(pdfModules).forEach(([path, url]) => {
      const key = normalizeKey(path);
      pdfByKey.set(key, { url, title: humanizeFilename(path) });
    });

    const items: CatalogCard[] = Object.entries(imageModules).map(([path, imageUrl], idx) => {
      const key = normalizeKey(path);
      const pdf = pdfByKey.get(key);
      const title = humanizeFilename(path);
      const id = `CAT${String(idx + 1).padStart(3, "0")}`;
      return {
        id,
        name: title,
        fabric: "Assorted",
        setSize: "12 pieces",
        category: "Sarees",
        dispatch: "3-5 days",
        image: imageUrl,
        pdfUrl: pdf?.url,
      } as CatalogCard;
    });

    return { catalogs: items };
  }, []);

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
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        if (catalog.pdfUrl) {
                          navigate(`/catalogs?pdf=${encodeURIComponent(catalog.pdfUrl)}`);
                        } else {
                          navigate("/catalogs");
                        }
                      }}
                      title={catalog.pdfUrl ? "Quick View" : "View catalogs"}
                    >
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      if (catalog.pdfUrl) {
                        navigate(`/catalogs?pdf=${encodeURIComponent(catalog.pdfUrl)}`);
                      } else {
                        navigate("/catalogs");
                      }
                    }}
                  >
                    Quick View
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      // Parse set size like "12 pieces" to use as MOQ
                      const moqMatch = /\d+/.exec(catalog.setSize);
                      const moq = moqMatch ? parseInt(moqMatch[0], 10) : 1;
                      addItem({
                        id: catalog.id,
                        name: catalog.name,
                        price: 0,
                        quantity: 1,
                        moq,
                      });
                      setIsOpen(true);
                    }}
                  >
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
          <Button size="lg" variant="outline" className="px-8" onClick={() => navigate("/catalogs") }>
            View All Catalogs
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CatalogSection;
