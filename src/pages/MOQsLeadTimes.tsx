import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  Star,
  Award,
  Truck,
  Users,
  Calculator,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Zap,
  Shield
} from "lucide-react";
import PageLayout from "@/components/PageLayout";

const MOQsLeadTimes = () => {
  const productCategories = [
    {
      category: "Sarees",
      moq: "25 pieces",
      leadTime: "7-10 days",
      description: "Cotton, Silk, Georgette, Chiffon sarees",
      features: ["Custom colors", "Size variations", "Packaging options"],
      popular: true
    },
    {
      category: "Lehengas",
      moq: "15 pieces",
      leadTime: "10-15 days",
      description: "Bridal and party wear lehengas",
      features: ["Heavy embroidery", "Custom measurements", "Matching accessories"],
      popular: true
    },
    {
      category: "Kurtis & Tunics",
      moq: "50 pieces",
      leadTime: "5-7 days",
      description: "Casual and formal kurtis",
      features: ["Multiple sizes", "Fabric options", "Design variations"],
      popular: false
    },
    {
      category: "Dress Materials",
      moq: "100 meters",
      leadTime: "3-5 days",
      description: "Unstitched dress materials",
      features: ["Fabric variety", "Color options", "Bulk pricing"],
      popular: false
    },
    {
      category: "Blouses",
      moq: "30 pieces",
      leadTime: "5-8 days",
      description: "Matching and contrast blouses",
      features: ["Size chart", "Custom fit", "Design options"],
      popular: false
    },
    {
      category: "Dupattas",
      moq: "40 pieces",
      leadTime: "3-5 days",
      description: "Matching and standalone dupattas",
      features: ["Fabric variety", "Color matching", "Bulk orders"],
      popular: false
    },
    {
      category: "Kids Wear",
      moq: "75 pieces",
      leadTime: "5-7 days",
      description: "Ethnic wear for children",
      features: ["Age groups", "Size ranges", "Safe materials"],
      popular: false
    },
    {
      category: "Men's Ethnic Wear",
      moq: "20 pieces",
      leadTime: "7-10 days",
      description: "Kurtas, Sherwanis, and traditional wear",
      features: ["Size variations", "Fabric options", "Custom tailoring"],
      popular: false
    }
  ];

  const leadTimeFactors = [
    {
      factor: "Order Quantity",
      impact: "Higher quantities may require longer production time",
      icon: <Package className="h-5 w-5" />
    },
    {
      factor: "Design Complexity",
      impact: "Intricate designs and embroidery take more time",
      icon: <Star className="h-5 w-5" />
    },
    {
      factor: "Fabric Availability",
      impact: "Special fabrics may need to be sourced",
      icon: <FileText className="h-5 w-5" />
    },
    {
      factor: "Custom Requirements",
      impact: "Custom colors, sizes, or designs add to timeline",
      icon: <Calculator className="h-5 w-5" />
    },
    {
      factor: "Seasonal Demand",
      impact: "Peak seasons may extend lead times",
      icon: <TrendingUp className="h-5 w-5" />
    }
  ];

  const benefits = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Quality Assurance",
      description: "Every piece is quality checked before dispatch"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Reliable Delivery",
      description: "On-time delivery with tracking updates"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Dedicated Support",
      description: "Personal account manager for your orders"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Fast Processing",
      description: "Quick order processing and production start"
    }
  ];

  const rushOrderOptions = [
    {
      service: "Express Production",
      timeline: "3-5 days",
      surcharge: "25%",
      description: "Priority production for urgent orders"
    },
    {
      service: "Rush Delivery",
      timeline: "1-2 days",
      surcharge: "15%",
      description: "Express shipping for completed orders"
    },
    {
      service: "Same Day Dispatch",
      timeline: "Same day",
      surcharge: "35%",
      description: "For orders placed before 12 PM"
    }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full">
                  <Package className="h-12 w-12" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                MOQs & Lead Times
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Comprehensive information about minimum order quantities and production timelines for all our product categories
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Clock className="h-4 w-4 mr-2" />
                  Fast Production
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Competitive MOQs
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  Quality Assured
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* Product Categories */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Product Categories & MOQs</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Minimum order quantities and lead times vary by product category. All prices are competitive and include quality assurance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productCategories.map((product, index) => (
                <Card key={index} className={`relative ${product.popular ? 'ring-2 ring-primary' : ''}`}>
                  {product.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {product.category}
                      {product.popular && <Star className="h-5 w-5 text-yellow-500" />}
                    </CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{product.moq}</div>
                        <div className="text-sm text-muted-foreground">Minimum Order</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{product.leadTime}</div>
                        <div className="text-sm text-muted-foreground">Lead Time</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {product.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-16" />

          {/* Lead Time Factors */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Lead Time Factors</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Several factors can influence production timelines. Understanding these helps in better planning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadTimeFactors.map((factor, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-primary mt-1">
                        {factor.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{factor.factor}</h3>
                        <p className="text-sm text-muted-foreground">{factor.impact}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-16" />

          {/* Rush Order Options */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Rush Order Options</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Need your order faster? We offer express production and delivery options for urgent requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rushOrderOptions.map((option, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <CardTitle className="text-lg">{option.service}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-3xl font-bold text-primary">{option.timeline}</div>
                      <div className="text-sm text-muted-foreground">Timeline</div>
                      <div className="text-2xl font-bold text-accent">{option.surcharge}</div>
                      <div className="text-sm text-muted-foreground">Additional Surcharge</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-16" />

          {/* Benefits Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Our Production</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We ensure quality, reliability, and customer satisfaction in every order.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="text-primary mb-4 flex justify-center">
                      {benefit.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Need Custom MOQs or Special Arrangements?</h2>
              <p className="text-lg mb-6 text-primary-foreground/90">
                Contact our team to discuss custom minimum order quantities, special pricing, or expedited production options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  WhatsApp Us
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Us
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default MOQsLeadTimes;
