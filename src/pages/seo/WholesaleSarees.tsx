import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SEOHead from "@/components/seo/SEOHead";
import { createBreadcrumbSchema, createFAQSchema, createProductSchema } from "@/lib/seoSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
    Package,
    Truck,
    FileCheck,
    Clock,
    MapPin,
    Phone,
    ArrowRight,
    CheckCircle,
    Star,
    IndianRupee
} from "lucide-react";

const WholesaleSarees = () => {
    const faqs = [
        { question: "What is the minimum order quantity (MOQ) for wholesale sarees?", answer: "Our standard MOQ is 25 pieces per design for most saree categories. For premium silk and designer sarees, MOQ starts from 15 pieces. We offer flexibility for first-time buyers and can discuss customized MOQ based on your requirements." },
        { question: "Do you provide GST invoices for wholesale orders?", answer: "Yes, we provide proper GST invoices for all wholesale orders. Our GST number is 29AACCM6639C1ZF (Karnataka). This helps you claim input tax credit and maintain proper business records." },
        { question: "What payment methods do you accept?", answer: "We accept bank transfer (NEFT/RTGS/IMPS), UPI payments, and credit/debit cards. For established trade customers, we offer 15-30 day credit terms based on order history. Advance payment is required for first orders." },
        { question: "How long does shipping take?", answer: "Standard shipping takes 3-7 business days across India. Express shipping (1-3 days) is available at additional cost. We ship from Bengaluru and have tie-ups with reliable logistics partners for safe delivery." },
        { question: "Can I visit your showroom before ordering?", answer: "Absolutely! Our Bengaluru showroom is open Monday-Saturday, 9 AM to 6 PM. Visit us at No.82, J M Road, Avenue Road Cross, Bangalore - 560002. We recommend calling ahead to ensure our wholesale team is available." },
        { question: "Do you offer customization or private labeling?", answer: "Yes, we offer private labeling for orders above 500 pieces. Customization options include custom blouse pieces, pallu designs, and packaging with your brand name. Lead time for custom orders is 15-21 days." },
        { question: "What is your return policy for wholesale orders?", answer: "We accept returns for quality issues within 7 days of delivery. Products must be unused with original tags. Manufacturing defects are replaced free of cost. Return shipping costs apply for non-defective returns." },
        { question: "Do you ship internationally?", answer: "Currently, we focus on domestic wholesale (India). For international inquiries, especially from NRI retailers in USA, UK, UAE, please contact us directly. We can arrange international shipping for bulk orders." },
        { question: "How do I become a registered wholesale buyer?", answer: "Register on our website or WhatsApp us your business details including GST number, shop address, and trade license. Approval takes 24-48 hours. Registered buyers get access to wholesale pricing and exclusive catalogs." },
        { question: "What types of sarees do you stock?", answer: "We stock 500+ varieties including cotton sarees, silk sarees, Banarasi, Kanjivaram, designer sarees, party wear, daily wear, and wedding collections. Our range covers price points from ₹200 to ₹10,000+ per piece." },
        { question: "Do you provide product images for my online store?", answer: "Yes, we provide high-resolution product images and videos for all catalog items. Trade account holders get access to our digital asset library. We also offer photography services for custom orders." },
        { question: "What support do you offer new retailers?", answer: "We offer merchandising guidance, pricing recommendations, display ideas, and marketing support. Our 25+ years of experience means we understand what sells in different markets. We're invested in your success." }
    ];

    const categories = [
        { name: "Cotton Sarees", slug: "cotton", price: "₹250-₹1,200", desc: "Daily wear, office wear, summer collections" },
        { name: "Silk Sarees", slug: "silk", price: "₹800-₹5,000", desc: "Kanjivaram, Banarasi, Patola, Tussar" },
        { name: "Banarasi Sarees", slug: "banarasi", price: "₹1,500-₹8,000", desc: "Wedding, bridal, heavy zari work" },
        { name: "Wedding Sarees", slug: "wedding", price: "₹1,000-₹10,000", desc: "Bridal, reception, sangeet collections" },
        { name: "Daily Wear", slug: "daily-wear", price: "₹200-₹600", desc: "Comfortable, affordable, fast-selling" },
        { name: "Party Wear", slug: "party-wear", price: "₹500-₹3,000", desc: "Designer, embroidered, trendy styles" },
        { name: "Designer Sarees", slug: "designer", price: "₹800-₹5,000", desc: "Boutique quality, unique designs" },
    ];

    const schema = [
        createBreadcrumbSchema([
            { name: "Home", url: "https://meghdoottextiles.com/" },
            { name: "Wholesale Sarees", url: "https://meghdoottextiles.com/wholesale-sarees" }
        ]),
        createFAQSchema(faqs),
        createProductSchema({
            name: "Wholesale Sarees Collection",
            description: "Premium wholesale sarees from Meghdoot Textiles. 500+ varieties including cotton, silk, Banarasi, designer sarees. MOQ from 25 pieces. GST invoicing available.",
            priceRange: "₹200 - ₹10,000",
            category: "Sarees"
        })
    ];

    return (
        <PageLayout>
            <SEOHead
                title="Wholesale Sarees | Bulk Catalog | MOQ 25 Pcs | GST Invoice - Meghdoot Textiles"
                description="Buy wholesale sarees at factory prices from Meghdoot Textiles. 500+ designs including cotton, silk, Banarasi, designer sarees. MOQ 25 pieces. GST invoicing, 25+ years experience. Pan-India shipping."
                canonical="https://meghdoottextiles.com/wholesale-sarees"
                keywords="wholesale sarees, bulk sarees, saree manufacturer, saree supplier, wholesale sarees India, saree wholesaler Bengaluru"
                schema={schema}
            />

            <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-rose-600 to-amber-600 text-white">
                    <div className="container mx-auto px-4 py-16">
                        <div className="max-w-4xl mx-auto text-center">
                            <Badge className="bg-white/20 text-white mb-4">25+ Years of Excellence</Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Wholesale Sarees at Factory Prices
                            </h1>
                            <p className="text-xl text-white/90 mb-8">
                                India's trusted wholesale saree supplier. 500+ designs, MOQ from 25 pieces, GST invoicing, and pan-India delivery. Partner with Meghdoot Textiles for your retail success.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a href="https://wa.me/919342503401" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="bg-white text-rose-600 hover:bg-white/90">
                                        <Phone className="h-5 w-5 mr-2" />
                                        WhatsApp: +91 93425 03401
                                    </Button>
                                </a>
                                <Link to="/catalogs">
                                    <Button size="lg" className="bg-white/20 text-white border-2 border-white hover:bg-white hover:text-rose-600">
                                        View Catalog
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Signals */}
                <div className="container mx-auto px-4 -mt-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: <Package className="h-6 w-6" />, label: "MOQ 25 Pieces", desc: "Flexible minimums" },
                            { icon: <FileCheck className="h-6 w-6" />, label: "GST Invoice", desc: "Proper billing" },
                            { icon: <Truck className="h-6 w-6" />, label: "Pan-India Shipping", desc: "3-7 days delivery" },
                            { icon: <Clock className="h-6 w-6" />, label: "25+ Years", desc: "Trusted supplier" },
                        ].map((item, i) => (
                            <Card key={i} className="text-center">
                                <CardContent className="pt-6">
                                    <div className="flex justify-center mb-2 text-rose-600">{item.icon}</div>
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
                        <h2 className="text-3xl font-bold mb-4">Wholesale Saree Categories</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Explore our complete range of wholesale sarees. Click on any category to see detailed collections, pricing, and MOQ information.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat) => (
                            <Link key={cat.slug} to={`/wholesale-sarees/${cat.slug}`}>
                                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            {cat.name}
                                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-rose-600 transition-colors" />
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-4">{cat.desc}</p>
                                        <div className="flex items-center gap-2">
                                            <IndianRupee className="h-4 w-4 text-green-600" />
                                            <span className="font-semibold text-green-600">{cat.price}</span>
                                            <span className="text-sm text-muted-foreground">per piece</span>
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
                            <h2 className="text-3xl font-bold mb-4">Why Retailers Choose Meghdoot Textiles</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                25+ years of serving retailers across India. Here's what makes us your ideal wholesale partner.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { title: "Factory Direct Prices", desc: "No middlemen. Source directly from manufacturers and get the best margins for your retail business." },
                                { title: "500+ Unique Designs", desc: "Fresh collections every season. Stand out from competitors with exclusive designs your customers won't find elsewhere." },
                                { title: "Flexible MOQ", desc: "Start small with 25 pieces per design. Test new styles without heavy investment. Scale up as you grow." },
                                { title: "Quality Guaranteed", desc: "Rigorous quality checks. Every piece inspected before dispatch. Easy returns for any manufacturing defects." },
                                { title: "Fast Dispatch", desc: "Same-day dispatch for in-stock items. Reliable logistics partners for safe, timely delivery across India." },
                                { title: "Dedicated Support", desc: "Personal account manager for trade customers. WhatsApp support, merchandising guidance, and marketing help." },
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

                {/* City Links */}
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">We Serve Retailers Across India</h2>
                        <p className="text-muted-foreground">
                            Fast shipping to all major cities. Click your city for local wholesale information.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {["Bengaluru", "Mumbai", "Delhi", "Kolkata", "Chennai", "Hyderabad", "Surat", "Ahmedabad", "Pune", "Jaipur"].map((city) => (
                            <Link key={city} to={`/wholesale-sarees-${city.toLowerCase()}`}>
                                <Badge variant="outline" className="px-4 py-2 text-sm hover:bg-rose-50 cursor-pointer">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {city}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* FAQs */}
                <div className="bg-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Everything you need to know about wholesale saree purchasing from Meghdoot Textiles.
                            </p>
                        </div>

                        <div className="max-w-3xl mx-auto">
                            <Accordion type="single" collapsible className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-6">
                                        <AccordionTrigger className="text-left font-medium">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-rose-600 to-amber-600 text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Wholesale Order?</h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Join 1000+ retailers who trust Meghdoot Textiles. Get started with your first order today.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="https://wa.me/919342503401" target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="bg-white text-rose-600 hover:bg-white/90">
                                    <Phone className="h-5 w-5 mr-2" />
                                    Call: +91 93425 03401
                                </Button>
                            </a>
                            <Link to="/trade-account">
                                <Button size="lg" className="bg-white/20 text-white border-2 border-white hover:bg-white hover:text-rose-600">
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

export default WholesaleSarees;
