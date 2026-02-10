import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SEOHead from "@/components/seo/SEOHead";
import { createBreadcrumbSchema, createFAQSchema, createProductSchema } from "@/lib/seoSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Package, Truck, FileCheck, Clock, Phone, ArrowRight, CheckCircle, IndianRupee, Sparkles } from "lucide-react";

const WholesaleLehengas = () => {
    const faqs = [
        { question: "What is the MOQ for wholesale lehengas?", answer: "Standard MOQ is 15 pieces per design for ready-made lehengas. For bridal and heavy embroidered pieces, MOQ is 10 pieces. We offer flexibility for first orders to help you test the market." },
        { question: "Do lehengas come with choli and dupatta?", answer: "Yes, all our lehengas are complete sets with lehenga skirt, choli/blouse, and dupatta. Some designs offer semi-stitched cholis for customer customization. We mention this clearly in product descriptions." },
        { question: "What sizes are available?", answer: "Standard sizes from S to XXL are available in most designs. Bridal lehengas often come with adjustable waist and can be further customized. We can arrange custom sizing for bulk orders of 25+ pieces." },
        { question: "What is the price range for wholesale lehengas?", answer: "Our wholesale lehengas range from ₹1,200 for party wear to ₹15,000+ for heavy bridal pieces. Most popular range is ₹2,000-₹5,000 covering festive, party, and wedding guest lehengas." },
        { question: "How do I inspect quality before bulk ordering?", answer: "We recommend ordering 2-3 sample pieces first. Sample orders have slightly higher pricing but count toward your first bulk order. You can also visit our Bengaluru showroom to inspect quality firsthand." },
        { question: "What occasions are your lehengas suitable for?", answer: "We stock lehengas for all occasions: bridal, reception, sangeet, wedding guest, festive (Navratri, Diwali), party wear, and engagement. Each category has different styling and price points." },
        { question: "Do you offer private labeling for lehengas?", answer: "Yes, private labeling is available for orders of 50+ pieces. We can add your brand tags, care labels, and custom packaging. Lead time is 2-3 weeks for private label orders." },
        { question: "What is the best-selling lehenga category?", answer: "Party wear and festive lehengas in the ₹2,000-₹4,000 range are our bestsellers. Navratri-specific chaniya cholis see huge demand in August-September. Bridal lehengas peak during wedding season (Oct-Feb)." }
    ];

    const categories = [
        { name: "Bridal Lehengas", slug: "bridal", price: "₹5,000-₹15,000", desc: "Heavy embroidery, wedding day, reception" },
        { name: "Party Wear Lehengas", slug: "party-wear", price: "₹1,200-₹4,000", desc: "Sangeet, engagement, festive occasions" },
    ];

    const schema = [
        createBreadcrumbSchema([
            { name: "Home", url: "https://meghdoottextiles.com/" },
            { name: "Wholesale Lehengas", url: "https://meghdoottextiles.com/wholesale-lehengas" }
        ]),
        createFAQSchema(faqs),
        createProductSchema({
            name: "Wholesale Lehengas Collection",
            description: "Premium wholesale lehengas from Meghdoot Textiles. Bridal, party wear, festive collections. Complete sets with choli and dupatta. MOQ from 15 pieces.",
            priceRange: "₹1,200 - ₹15,000",
            category: "Lehengas"
        })
    ];

    return (
        <PageLayout>
            <SEOHead
                title="Wholesale Lehengas | Bridal & Party Wear | MOQ 15 Pcs | GST Invoice - Meghdoot Textiles"
                description="Buy wholesale lehengas at factory prices. Bridal, party wear, festive collections. Complete sets with choli & dupatta. MOQ 15 pieces. GST invoicing, pan-India shipping."
                canonical="https://meghdoottextiles.com/wholesale-lehengas"
                keywords="wholesale lehengas, bulk lehengas, lehenga manufacturer, bridal lehenga wholesale, party wear lehenga wholesale"
                schema={schema}
            />

            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-amber-600 to-rose-600 text-white">
                    <div className="container mx-auto px-4 py-16">
                        <div className="max-w-4xl mx-auto text-center">
                            <Badge className="bg-white/20 text-white mb-4">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Bridal & Party Collections
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Wholesale Lehengas at Factory Prices
                            </h1>
                            <p className="text-xl text-white/90 mb-8">
                                Premium bridal and party wear lehengas for retailers. Complete sets with choli and dupatta. MOQ from 15 pieces. Perfect for boutiques and wedding specialists.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a href="https://wa.me/919342503401" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="bg-white text-fuchsia-600 hover:bg-white/90">
                                        <Phone className="h-5 w-5 mr-2" />
                                        WhatsApp: +91 93425 03401
                                    </Button>
                                </a>
                                <Button size="lg" className="bg-white/20 text-white border-2 border-white hover:bg-white hover:text-fuchsia-600">
                                    View Bridal Catalog
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Signals */}
                <div className="container mx-auto px-4 -mt-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: <Package className="h-6 w-6" />, label: "MOQ 15 Pieces", desc: "Low minimum" },
                            { icon: <FileCheck className="h-6 w-6" />, label: "GST Invoice", desc: "Proper billing" },
                            { icon: <Truck className="h-6 w-6" />, label: "Pan-India Shipping", desc: "Safe delivery" },
                            { icon: <Clock className="h-6 w-6" />, label: "Complete Sets", desc: "Choli + Dupatta" },
                        ].map((item, i) => (
                            <Card key={i} className="text-center">
                                <CardContent className="pt-6">
                                    <div className="flex justify-center mb-2 text-amber-600">{item.icon}</div>
                                    <div className="font-semibold">{item.label}</div>
                                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Categories */}
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Wholesale Lehenga Categories</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            From bridal grandeur to party elegance. Click any category for detailed collections.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {categories.map((cat) => (
                            <Link key={cat.slug} to={`/wholesale-lehengas/${cat.slug}`}>
                                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            {cat.name}
                                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-amber-600 transition-colors" />
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-4">{cat.desc}</p>
                                        <div className="flex items-center gap-2">
                                            <IndianRupee className="h-4 w-4 text-green-600" />
                                            <span className="font-semibold text-green-600">{cat.price}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="bg-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Why Boutiques Choose Our Lehengas</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                { title: "Complete Sets", desc: "Every lehenga comes with matching choli and dupatta. No need to source separately." },
                                { title: "Premium Fabrics", desc: "Georgette, net, silk, velvet, and art silk in rich colors and finishes." },
                                { title: "Expert Craftsmanship", desc: "Intricate embroidery, zari work, sequins, and stone work by skilled artisans." },
                                { title: "Trending Designs", desc: "Latest Bollywood-inspired styles updated every season." },
                                { title: "High Margins", desc: "50-80% profit margins on bridal and designer pieces." },
                                { title: "Wedding Season Ready", desc: "Large inventory for peak demand. Never miss a bridal sale." },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <CheckCircle className="h-6 w-6 text-green-600 shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold mb-2">{item.title}</h3>
                                        <p className="text-muted-foreground text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FAQs */}
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="space-y-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-6">
                                    <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-amber-600 to-rose-600 text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Stock Premium Lehengas for Your Boutique</h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Wedding season is always around the corner. Start your wholesale order today.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="https://wa.me/919342503401" target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="bg-white text-amber-600 hover:bg-white/90">
                                    <Phone className="h-5 w-5 mr-2" />
                                    Call: +91 93425 03401
                                </Button>
                            </a>
                            <Link to="/trade-account">
                                <Button size="lg" className="bg-white/20 text-white border-2 border-white hover:bg-white hover:text-fuchsia-600">
                                    Open Trade Account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default WholesaleLehengas;
