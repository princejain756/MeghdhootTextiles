import { useParams, Link, Navigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SEOHead from "@/components/seo/SEOHead";
import { createBreadcrumbSchema, createFAQSchema, createOrganizationSchema } from "@/lib/seoSchemas";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, MapPin, Clock, FileCheck, Truck, Award, Star, CheckCircle } from "lucide-react";

const brandPages: Record<string, {
    title: string;
    metaTitle: string;
    metaDescription: string;
    description: string;
    highlights: string[];
    faqs: { question: string; answer: string }[];
}> = {
    "meghdoot-saree-catalog": {
        title: "Meghdoot Saree Catalog",
        metaTitle: "Meghdoot Saree Catalog 2024 | Wholesale Collection | 500+ Designs",
        metaDescription: "Browse Meghdoot Textiles saree catalog. 500+ wholesale designs including cotton, silk, Banarasi, designer sarees. MOQ 25 pcs. GST invoicing.",
        description: "Explore our complete wholesale saree catalog featuring 500+ designs across all categories. From everyday cotton to bridal silk, find the perfect collection for your retail business.",
        highlights: ["500+ saree designs", "Cotton, silk, designer categories", "New arrivals every month", "Digital catalog access for trade customers", "WhatsApp catalog sharing"],
        faqs: [
            { question: "How do I access the complete Meghdoot saree catalog?", answer: "Register as a trade customer on our website or WhatsApp us at +91 93425 03401. We'll share our digital catalog with wholesale pricing." },
            { question: "How often do you update your saree catalog?", answer: "We add 50-100 new designs every month. Seasonal collections launch before major festivals. Trade customers get early access." },
            { question: "Can I get product images for my store?", answer: "Yes, trade customers get access to high-resolution product images for their online stores and marketing." },
            { question: "Do you have printed catalogs?", answer: "We focus on digital catalogs for real-time updates. Physical catalogs are available at our Bengaluru showroom." }
        ]
    },
    "meghdoot-textiles-wholesale": {
        title: "Meghdoot Textiles Wholesale",
        metaTitle: "Meghdoot Textiles Wholesale | Official Supplier | 25+ Years Experience",
        metaDescription: "Meghdoot Textiles - India's trusted wholesale textile supplier. 25+ years experience. Sarees, kurtis, lehengas at factory prices. GST invoicing.",
        description: "Meghdoot Textiles is your trusted wholesale partner for quality Indian ethnic wear. With 25+ years of experience, we serve 1000+ retailers across India with commitment to quality and service.",
        highlights: ["25+ years in textile wholesale", "1000+ retail partners across India", "Factory-direct pricing", "GST invoicing on all orders", "Dedicated account managers"],
        faqs: [
            { question: "Why choose Meghdoot Textiles as my wholesale supplier?", answer: "25+ years of experience, factory-direct pricing, 500+ designs, GST invoicing, reliable shipping, and dedicated customer support make us the preferred choice." },
            { question: "Where is Meghdoot Textiles located?", answer: "Our headquarters and showroom are in Bengaluru at No.82, J M Road, Avenue Road Cross, Bangalore - 560002. We ship pan-India." },
            { question: "Do you work with new retailers?", answer: "Absolutely! We support new retailers with guidance on stocking, pricing, and marketing. Start with our standard MOQ and grow together." },
            { question: "What makes your products different?", answer: "Quality focus, diverse range from budget to premium, consistent availability, and proper business documentation (GST invoices) set us apart." }
        ]
    },
    "meghdoot-sarees-wholesale-price": {
        title: "Meghdoot Sarees Wholesale Price",
        metaTitle: "Meghdoot Sarees Wholesale Price List 2024 | Factory Rates",
        metaDescription: "Get Meghdoot Textiles wholesale saree prices. Factory-direct rates. Cotton ₹250+, Silk ₹800+, Designer ₹500+. MOQ 25 pcs. Contact for pricing.",
        description: "Get competitive wholesale prices on quality sarees from Meghdoot Textiles. Our pricing enables healthy retail margins while maintaining product quality.",
        highlights: ["Cotton sarees from ₹250", "Silk sarees from ₹800", "Designer sarees from ₹500", "Bulk discounts available", "Credit terms for trade customers"],
        faqs: [
            { question: "What is the price range for wholesale sarees?", answer: "Cotton: ₹250-1,200. Silk: ₹800-5,000. Banarasi: ₹1,500-8,000. Designer: ₹500-3,000. Wedding: ₹1,000-10,000+. Contact for exact pricing." },
            { question: "Do you offer bulk discounts?", answer: "Yes, orders above 100 pieces per design get 5-10% additional discount. Larger orders get better rates. Contact us for volume pricing." },
            { question: "How do prices compare to other wholesalers?", answer: "Our factory-direct model ensures competitive pricing. We focus on value - quality at fair prices, not just lowest prices with quality compromise." },
            { question: "Are prices inclusive of GST?", answer: "Prices mentioned are usually ex-GST. GST will be added as per applicable rates (5% for most textiles). We provide proper GST invoices." }
        ]
    },
    "meghdoot-kurtis-catalog": {
        title: "Meghdoot Kurtis Catalog",
        metaTitle: "Meghdoot Kurtis Catalog 2024 | Wholesale Collection | S-XXXL",
        metaDescription: "Browse Meghdoot Textiles kurti catalog. Cotton, Anarkali, designer kurtis. All sizes S-XXXL. MOQ 50 pcs. GST invoicing.",
        description: "Explore our complete wholesale kurti catalog featuring styles from everyday cotton to designer Anarkalis. All sizes S to XXXL available.",
        highlights: ["Complete size range S-XXXL", "Cotton, rayon, designer ranges", "Kurti sets with bottoms", "Monthly new arrivals", "Digital catalog access"],
        faqs: [
            { question: "What kurti styles are in the catalog?", answer: "Straight kurtis, A-line, Anarkali, short kurtis, long kurtis, kurti sets with palazzos/pants/dupattas." },
            { question: "Do all designs come in all sizes?", answer: "Most designs are available S to XXXL. Some designer pieces may have limited size runs. Check individual listings." },
            { question: "How do I access the kurti catalog?", answer: "WhatsApp us at +91 93425 03401 with your business details. We'll share catalog access within 24 hours." },
            { question: "Can I mix sizes in one order?", answer: "Yes, you can order assorted sizes. Standard ratio or custom ratio based on your market needs." }
        ]
    },
    "meghdoot-lehengas-catalog": {
        title: "Meghdoot Lehengas Catalog",
        metaTitle: "Meghdoot Lehengas Catalog 2024 | Bridal & Party Wear | Complete Sets",
        metaDescription: "Browse Meghdoot Textiles lehenga catalog. Bridal, party wear, festive lehengas. Complete sets with choli & dupatta. MOQ 15 pcs.",
        description: "Explore our wholesale lehenga catalog featuring bridal masterpieces to party wear styles. All sets include lehenga, choli, and dupatta.",
        highlights: ["Bridal & party wear range", "Complete sets included", "Heavy embroidered options", "Festive & Navratri collections", "Premium fabric quality"],
        faqs: [
            { question: "Do lehengas come as complete sets?", answer: "Yes, all our lehengas are complete sets including lehenga skirt, choli (semi-stitched/unstitched), and dupatta." },
            { question: "What is the price range for wholesale lehengas?", answer: "Party wear: ₹1,200-4,000. Bridal: ₹5,000-15,000+. Festive: ₹1,500-3,500." },
            { question: "Do you have Navratri chaniya cholis?", answer: "Yes, we stock special Navratri collections. Order by August for best selection. Colorful, twirl-worthy designs available." },
            { question: "Can I order samples before bulk?", answer: "Yes, order 2-3 sample pieces first. Sample pricing is slightly higher but counts toward bulk order." }
        ]
    }
};

const BrandDefensePage = () => {
    const { slug } = useParams<{ slug: string }>();

    if (!slug || !brandPages[slug]) {
        return <Navigate to="/shop" replace />;
    }

    const page = brandPages[slug];

    const schema = [
        createBreadcrumbSchema([
            { name: "Home", url: "https://meghdoottextiles.com/" },
            { name: page.title, url: `https://meghdoottextiles.com/${slug}` }
        ]),
        createFAQSchema(page.faqs),
        createOrganizationSchema()
    ];

    return (
        <PageLayout>
            <SEOHead
                title={page.metaTitle}
                description={page.metaDescription}
                canonical={`https://meghdoottextiles.com/${slug}`}
                keywords={`${page.title.toLowerCase()}, Meghdoot Textiles, wholesale textiles, saree wholesale`}
                schema={schema}
            />

            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50">
                {/* Hero */}
                <div className="bg-gradient-to-r from-amber-700 to-rose-700 text-white">
                    <div className="container mx-auto px-4 py-12">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="flex justify-center mb-4">
                                <Badge className="bg-white/20 text-white px-4 py-2">
                                    <Award className="h-4 w-4 mr-2" />
                                    Official Meghdoot Textiles Page
                                </Badge>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{page.title}</h1>
                            <p className="text-lg text-white/90">{page.description}</p>
                        </div>
                    </div>
                </div>

                {/* Trust Signals */}
                <div className="container mx-auto px-4 -mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {[
                            { icon: <Clock className="h-5 w-5" />, label: "25+ Years" },
                            { icon: <Star className="h-5 w-5" />, label: "1000+ Retailers" },
                            { icon: <FileCheck className="h-5 w-5" />, label: "GST Invoice" },
                            { icon: <Truck className="h-5 w-5" />, label: "Pan-India" },
                        ].map((item, i) => (
                            <Card key={i} className="text-center py-3">
                                <CardContent className="p-0 flex flex-col items-center gap-1">
                                    <span className="text-amber-700">{item.icon}</span>
                                    <span className="text-sm font-medium">{item.label}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Highlights */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center">What You Get</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {page.highlights.map((highlight, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                                    <span>{highlight}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FAQs */}
                <div className="bg-white py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
                        <div className="max-w-3xl mx-auto">
                            <Accordion type="single" collapsible className="space-y-4">
                                {page.faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-6">
                                        <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-amber-700 to-rose-700 text-white py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl font-bold mb-4">Ready to Partner with Meghdoot Textiles?</h2>
                        <p className="text-lg text-white/90 mb-6">Join 1000+ retailers who trust us for quality wholesale textiles.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="https://wa.me/919342503401" target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="bg-white text-amber-700 hover:bg-white/90">
                                    <Phone className="h-5 w-5 mr-2" />
                                    WhatsApp: +91 93425 03401
                                </Button>
                            </a>
                            <Link to="/trade-account">
                                <Button size="lg" className="bg-white/20 text-white border-2 border-white hover:bg-white hover:text-amber-700">
                                    Open Trade Account
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-8 text-white/70 text-sm flex items-center justify-center gap-2">
                            <MapPin className="h-4 w-4" />
                            No.82, J M Road, Avenue Road Cross, Bangalore - 560002
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default BrandDefensePage;
