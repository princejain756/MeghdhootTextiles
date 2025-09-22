import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ruler, 
  User, 
  Shirt, 
  Heart, 
  Info, 
  CheckCircle,
  AlertTriangle,
  Download,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Users,
  Star,
  Award,
  Clock,
  Shield
} from "lucide-react";
import PageLayout from "@/components/PageLayout";

const SizeGuide = () => {
  const sizeCharts = {
    sarees: {
      title: "Saree Size Guide",
      description: "Measurements for different saree styles and draping preferences",
      measurements: [
        { name: "Blouse Size", xs: "32", s: "34", m: "36", l: "38", xl: "40", xxl: "42" },
        { name: "Bust (inches)", xs: "32-33", s: "34-35", m: "36-37", l: "38-39", xl: "40-41", xxl: "42-43" },
        { name: "Waist (inches)", xs: "26-27", s: "28-29", m: "30-31", l: "32-33", xl: "34-35", xxl: "36-37" },
        { name: "Hip (inches)", xs: "34-35", s: "36-37", m: "38-39", l: "40-41", xl: "42-43", xxl: "44-45" },
        { name: "Saree Length", xs: "5.5m", s: "5.5m", m: "6m", l: "6m", xl: "6.5m", xxl: "6.5m" }
      ],
      notes: [
        "Saree length includes 1m for pleats and pallu",
        "Blouse measurements are for fitted styles",
        "Add 2-3 inches for loose-fitting blouses",
        "Standard saree width is 1.1m"
      ]
    },
    kurtis: {
      title: "Kurti Size Guide",
      description: "Comprehensive sizing for kurtis, tunics, and tops",
      measurements: [
        { name: "Size", xs: "XS", s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" },
        { name: "Bust (inches)", xs: "32-34", s: "34-36", m: "36-38", l: "38-40", xl: "40-42", xxl: "42-44" },
        { name: "Waist (inches)", xs: "26-28", s: "28-30", m: "30-32", l: "32-34", xl: "34-36", xxl: "36-38" },
        { name: "Hip (inches)", xs: "34-36", s: "36-38", m: "38-40", l: "40-42", xl: "42-44", xxl: "44-46" },
        { name: "Length (inches)", xs: "38-40", s: "40-42", m: "42-44", l: "44-46", xl: "46-48", xxl: "48-50" },
        { name: "Shoulder (inches)", xs: "13-14", s: "14-15", m: "15-16", l: "16-17", xl: "17-18", xxl: "18-19" }
      ],
      notes: [
        "Length measurements are for regular fit kurtis",
        "Add 2-3 inches for long kurtis",
        "Measurements are body measurements, not garment measurements",
        "Kurtis have 2-3 inches ease for comfortable fit"
      ]
    },
    lehengas: {
      title: "Lehenga Size Guide",
      description: "Sizing for lehengas, skirts, and bottom wear",
      measurements: [
        { name: "Size", xs: "XS", s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" },
        { name: "Waist (inches)", xs: "26-28", s: "28-30", m: "30-32", l: "32-34", xl: "34-36", xxl: "36-38" },
        { name: "Hip (inches)", xs: "34-36", s: "36-38", m: "38-40", l: "40-42", xl: "42-44", xxl: "44-46" },
        { name: "Length (inches)", xs: "38-40", s: "40-42", m: "42-44", l: "44-46", xl: "46-48", xxl: "48-50" },
        { name: "Ghera (inches)", xs: "2.5-3", s: "3-3.5", m: "3.5-4", l: "4-4.5", xl: "4.5-5", xxl: "5-5.5" }
      ],
      notes: [
        "Ghera is the circumference of the lehenga",
        "Length is measured from waist to hem",
        "Lehengas have drawstring or hook closure",
        "Custom sizing available for special occasions"
      ]
    },
    menswear: {
      title: "Men's Ethnic Wear Size Guide",
      description: "Sizing for kurtas, sherwanis, and men's traditional wear",
      measurements: [
        { name: "Size", xs: "XS", s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" },
        { name: "Chest (inches)", xs: "36-38", s: "38-40", m: "40-42", l: "42-44", xl: "44-46", xxl: "46-48" },
        { name: "Waist (inches)", xs: "30-32", s: "32-34", m: "34-36", l: "36-38", xl: "38-40", xxl: "40-42" },
        { name: "Length (inches)", xs: "40-42", s: "42-44", m: "44-46", l: "46-48", xl: "48-50", xxl: "50-52" },
        { name: "Shoulder (inches)", xs: "16-17", s: "17-18", m: "18-19", l: "19-20", xl: "20-21", xxl: "21-22" },
        { name: "Sleeve (inches)", xs: "22-23", s: "23-24", m: "24-25", l: "25-26", xl: "26-27", xxl: "27-28" }
      ],
      notes: [
        "Chest measurement is taken under arms",
        "Length is measured from shoulder to hem",
        "Sleeve length is from shoulder to cuff",
        "Add 2-3 inches for loose fit"
      ]
    }
  };

  const measuringTips = [
    {
      icon: <Ruler className="h-6 w-6" />,
      title: "Use a Flexible Measuring Tape",
      description: "Always use a soft, flexible measuring tape for accurate measurements. Avoid using metal rulers or stiff measuring tools."
    },
    {
      icon: <User className="h-6 w-6" />,
      title: "Measure Over Fitted Clothing",
      description: "Wear fitted undergarments or thin clothing when taking measurements. Avoid measuring over bulky sweaters or jackets."
    },
    {
      icon: <Shirt className="h-6 w-6" />,
      title: "Keep Tape Parallel to Ground",
      description: "Ensure the measuring tape is parallel to the ground and not twisted. Take measurements at the widest part of each area."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Measure Your Best Fit",
      description: "If you have a well-fitting garment, measure it and add 2-3 inches for ease. This gives you a good starting point."
    }
  ];

  const commonQuestions = [
    {
      question: "What if I'm between sizes?",
      answer: "If you're between sizes, we recommend sizing up for a more comfortable fit. Our garments have some ease built in, but sizing up ensures you're not restricted."
    },
    {
      question: "Do you offer custom sizing?",
      answer: "Yes! We offer custom sizing for special occasions and bulk orders. Contact our team with your measurements and we'll create a perfect fit for you."
    },
    {
      question: "How do I measure for a saree blouse?",
      answer: "For saree blouses, measure your bust at the fullest part, waist at the narrowest part, and shoulder from one shoulder point to the other."
    },
    {
      question: "What's the difference between body measurements and garment measurements?",
      answer: "Body measurements are your actual body size, while garment measurements include ease for comfortable movement. Our size charts show body measurements."
    },
    {
      question: "Can I exchange if the size doesn't fit?",
      answer: "Yes, we offer size exchanges within 7 days of delivery. Please keep the original tags and packaging for easy exchange processing."
    }
  ];

  const contactInfo = {
    email: "sizing@meghdoottextiles.com",
    phone: "+91 93425 03401",
    address: "Kamela Darwaja, Umarwada, Ring Road, Surat – 395002, Gujarat, India"
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full">
                  <Ruler className="h-12 w-12" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Size Guide
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Find your perfect fit with our comprehensive sizing guide. Accurate measurements ensure the best shopping experience.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Ruler className="h-4 w-4 mr-2" />
                  Accurate Measurements
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  Size Exchange
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Users className="h-4 w-4 mr-2" />
                  Custom Sizing
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* Size Charts */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Size Charts by Category</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Select your category below to view detailed size charts and measurements
              </p>
            </div>

            <Tabs defaultValue="sarees" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="sarees">Sarees</TabsTrigger>
                <TabsTrigger value="kurtis">Kurtis</TabsTrigger>
                <TabsTrigger value="lehengas">Lehengas</TabsTrigger>
                <TabsTrigger value="menswear">Men's Wear</TabsTrigger>
              </TabsList>

              {Object.entries(sizeCharts).map(([key, chart]) => (
                <TabsContent key={key} value={key} className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Ruler className="h-5 w-5" />
                        {chart.title}
                      </CardTitle>
                      <CardDescription>{chart.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3 font-semibold">Measurement</th>
                              <th className="text-center p-3 font-semibold">XS</th>
                              <th className="text-center p-3 font-semibold">S</th>
                              <th className="text-center p-3 font-semibold">M</th>
                              <th className="text-center p-3 font-semibold">L</th>
                              <th className="text-center p-3 font-semibold">XL</th>
                              <th className="text-center p-3 font-semibold">XXL</th>
                            </tr>
                          </thead>
                          <tbody>
                            {chart.measurements.map((row, index) => (
                              <tr key={index} className="border-b hover:bg-muted/50">
                                <td className="p-3 font-medium">{row.name}</td>
                                <td className="p-3 text-center">{row.xs}</td>
                                <td className="p-3 text-center">{row.s}</td>
                                <td className="p-3 text-center">{row.m}</td>
                                <td className="p-3 text-center">{row.l}</td>
                                <td className="p-3 text-center">{row.xl}</td>
                                <td className="p-3 text-center">{row.xxl}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Important Notes:</h4>
                        <ul className="space-y-2">
                          {chart.notes.map((note, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <Separator className="my-16" />

          {/* Measuring Tips */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How to Measure</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Follow these tips to get accurate measurements for the perfect fit
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {measuringTips.map((tip, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="text-primary mb-4 flex justify-center">
                      {tip.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-16" />

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Size Guide FAQs</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Common questions about sizing and measurements
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {commonQuestions.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg flex items-start gap-2">
                        <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground ml-7">{faq.answer}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-16" />

          {/* Contact Section */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Need Help with Sizing?</h2>
                <p className="text-lg text-primary-foreground/90">
                  Our sizing experts are here to help you find the perfect fit. Contact us for personalized sizing advice.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white/10 rounded-full">
                      <Mail className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-sm text-primary-foreground/80">{contactInfo.email}</p>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white/10 rounded-full">
                      <Phone className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-sm text-primary-foreground/80">{contactInfo.phone}</p>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white/10 rounded-full">
                      <MapPin className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Visit Us</h3>
                  <p className="text-sm text-primary-foreground/80">{contactInfo.address}</p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Get Sizing Help
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default SizeGuide;
