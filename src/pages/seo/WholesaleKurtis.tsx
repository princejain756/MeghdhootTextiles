import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SEOHead from "@/components/seo/SEOHead";
import { createBreadcrumbSchema, createFAQSchema, createProductSchema } from "@/lib/seoSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Package, Truck, FileCheck, Clock, MapPin, Phone, ArrowRight, CheckCircle, IndianRupee } from "lucide-react";

const WholesaleKurtis = () => {
    const faqs = [
        { question: "What is the MOQ for wholesale kurtis?", answer: "Standard MOQ is 50 pieces per design for regular kurtis. For designer and embroidered kurtis, MOQ starts from 30 pieces. We offer assorted packs for first-time buyers to test multiple designs." },
        { question: "What sizes do you stock?", answer: "We stock sizes from S to XXXL (36 to 50). Most designs are available in the popular size range of M, L, XL, XXL. Plus sizes (XXL, XXXL) are available in select designs. Custom sizing is available for bulk orders." },
        { question: "Do you provide proper GST invoices?", answer: "Yes, all wholesale orders come with proper GST invoices. Our GST number is 29AACCM6639C1ZF (Karnataka). This enables you to claim input tax credit on your purchases." },
        { question: "What kurti styles do you offer?", answer: "We offer straight kurtis, A-line kurtis, Anarkali kurtis, short kurtis, long kurtis, kurti sets with pants/palazzos, and embroidered designer kurtis. Fabrics include cotton, rayon, viscose, georgette, and blends." },
        { question: "Can I get kurti sets (kurti + bottom)?", answer: "Yes, we have extensive collections of kurti sets including kurti with palazzo, kurti with pants, kurti with dupatta, and complete 3-piece sets. These typically have higher margins and customer preference." },
        { question: "How do I place a wholesale order?", answer: "Browse our online catalog, WhatsApp us your selections at +91 93425 03401, or visit our Bengaluru showroom. We'll confirm availability, share pricing, and guide you through the ordering process." },
        { question: "What is the typical profit margin on kurtis?", answer: "Retailers typically achieve 40-60% margins on our wholesale kurtis. Cotton daily wear offers higher volumes with 40% margins, while designer kurtis can fetch 60-80% margins with slower turnover." },
        { question: "Do you offer exchange or returns?", answer: "We accept exchanges for manufacturing defects within 7 days. Size exchanges are available if intimated within 48 hours of delivery. Custom or altered pieces cannot be exchanged." }
    ];

    const categories = [
        { name: "Cotton Kurtis", slug: "cotton", price: "₹180-₹500", desc: "Daily wear, office wear, summer collections" },
        { name: "Anarkali Kurtis", slug: "anarkali", price: "₹400-₹1,500", desc: "Floor length, festive, wedding guest" },
        { name: "Festive Kurtis", slug: "festive", price: "₹350-₹1,200", desc: "Embroidered, designer, party wear" },
    ];

    const schema = [
        createBreadcrumbSchema([
            { name: "Home", url: "https://meghdoottextiles.com/" },
            { name: "Wholesale Kurtis", url: "https://meghdoottextiles.com/wholesale-kurtis" }
        ]),
        createFAQSchema(faqs),
        createProductSchema({
            name: "Wholesale Kurtis Collection",
            description: "Premium wholesale kurtis from Meghdoot Textiles. Cotton, Anarkali, designer kurtis. MOQ from 50 pieces. All sizes S-XXXL.",
            priceRange: "₹180 - ₹1,500",
            category: "Kurtis"
        })
    ];

    return (
        <PageLayout>
            <SEOHead
                title="Wholesale Kurtis | Bulk Kurti Catalog | MOQ 50 Pcs | GST Invoice - Meghdoot Textiles"
                description="Buy wholesale kurtis at factory prices. Cotton, Anarkali, designer kurtis. All sizes S-XXXL. MOQ 50 pieces. GST invoicing, 25+ years experience. Pan-India shipping."
                canonical="https://meghdoottextiles.com/wholesale-kurtis"
                keywords="wholesale kurtis, bulk kurtis, kurti manufacturer, kurti supplier, wholesale kurtis India, ladies kurti wholesale"
                schema={schema}
            />

            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <div className="container mx-auto px-4 py-16">
                        <div className="max-w-4xl mx-auto text-center">
                            <Badge className="bg-white/20 text-white mb-4">All Sizes S to XXXL</Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Wholesale Kurtis at Factory Prices
                            </h1>
                            <p className="text-xl text-white/90 mb-8">
                                India's trusted wholesale kurti supplier. Cotton, Anarkali, designer collections. MOQ from 50 pieces. Complete size range for every customer.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a href="https://wa.me/919342503401" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="bg-white text-teal-600 hover:bg-white/90">
                                        <Phone className="h-5 w-5 mr-2" />
                                        WhatsApp: +91 93425 03401
                                    </Button>
                                </a>
                                <Button size="lg" className="bg-white/20 text-white border-2 border-white hover:bg-white hover:text-teal-600">
                                    View Catalog
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Signals */}
                <div className="container mx-auto px-4 -mt-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: <Package className="h-6 w-6" />, label: "MOQ 50 Pieces", desc: "Per design" },
                            { icon: <FileCheck className="h-6 w-6" />, label: "GST Invoice", desc: "Proper billing" },
                            { icon: <Truck className="h-6 w-6" />, label: "Pan-India Shipping", desc: "3-7 days" },
                            { icon: <Clock className="h-6 w-6" />, label: "25+ Years", desc: "Experience" },
                        ].map((item, i) => (
                            <Card key={i} className="text-center">
                                <CardContent className="pt-6">
                                    <div className="flex justify-center mb-2 text-purple-600">{item.icon}</div>
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
                        <h2 className="text-3xl font-bold mb-4">Wholesale Kurti Categories</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Explore our complete range of wholesale kurtis. Click any category for detailed collections.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {categories.map((cat) => (
                            <Link key={cat.slug} to={`/wholesale-kurtis/${cat.slug}`}>
                                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            {cat.name}
                                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
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
                            <h2 className="text-3xl font-bold mb-4">Why Retailers Choose Our Kurtis</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                { title: "Complete Size Range", desc: "S to XXXL in most designs. Never miss a sale due to size unavailability." },
                                { title: "Trendy Designs", desc: "New collections every month. Stay ahead of fashion trends in your market." },
                                { title: "Quality Fabrics", desc: "Premium cotton, soft rayon, breathable viscose. Customers love the feel." },
                                { title: "Ready Stock", desc: "Most items ship same day. No waiting for production." },
                                { title: "Great Margins", desc: "40-60% profit margins. Competitive pricing for your success." },
                                { title: "Combo Offers", desc: "Kurti sets with bottoms for higher ticket size and customer satisfaction." },
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
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Start Your Wholesale Kurti Order</h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Join 1000+ retailers who trust Meghdoot Textiles for quality kurtis.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="https://wa.me/919342503401" target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="bg-white text-teal-600 hover:bg-white/90">
                                    <Phone className="h-5 w-5 mr-2" />
                                    Call: +91 93425 03401
                                </Button>
                            </a>
                            <Link to="/trade-account">
                                <Button size="lg" className="bg-white/20 text-white border-2 border-white hover:bg-white hover:text-teal-600">
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

export default WholesaleKurtis;
