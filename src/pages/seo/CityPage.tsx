import { useParams, Link, Navigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SEOHead from "@/components/seo/SEOHead";
import { createBreadcrumbSchema, createFAQSchema, createLocalBusinessSchema } from "@/lib/seoSchemas";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin, Phone, Truck, Clock, FileCheck, CheckCircle } from "lucide-react";

const cityData: Record<string, {
    name: string;
    state: string;
    description: string;
    localMarkets: string[];
    shippingDays: string;
    advantages: string[];
    faqs: { question: string; answer: string }[];
}> = {
    bengaluru: {
        name: "Bengaluru",
        state: "Karnataka",
        description: "Source wholesale sarees directly from our Bengaluru headquarters. Same-day dispatch, local showroom visit, and personalized service for Karnataka retailers.",
        localMarkets: ["Chickpet", "Commercial Street", "Avenue Road", "Jayanagar 4th Block", "Malleshwaram"],
        shippingDays: "Same day / Next day",
        advantages: ["Visit our showroom in person", "Same-day dispatch", "No shipping charges within city", "Cash on delivery available", "Personal account manager"],
        faqs: [
            { question: "Can I visit the Meghdoot Textiles showroom in Bengaluru?", answer: "Yes! Our showroom is at No.82, J M Road, Avenue Road Cross, Bangalore - 560002. Open Monday-Saturday, 9 AM to 6 PM. We recommend calling ahead at +91 93425 03401." },
            { question: "Do you deliver within Bengaluru city?", answer: "Yes, we offer same-day delivery within Bengaluru for orders placed before 2 PM. No shipping charges for Bengaluru city orders above ₹5,000." },
            { question: "Is COD available in Bengaluru?", answer: "Yes, Cash on Delivery is available for Bengaluru customers for orders up to ₹25,000. This is higher than our standard COD limit for other cities." },
            { question: "Can I pick up my order from your warehouse?", answer: "Yes, self-pickup is available at our Bengaluru facility. This saves shipping time and costs. Call us to schedule a pickup time." }
        ]
    },
    mumbai: {
        name: "Mumbai",
        state: "Maharashtra",
        description: "Wholesale sarees for Mumbai retailers. Serving boutiques across Mumbai, Thane, and Navi Mumbai with competitive pricing and reliable logistics.",
        localMarkets: ["Dadar", "Mulund", "Borivali", "Andheri", "Bandra", "Colaba"],
        shippingDays: "3-5 days",
        advantages: ["Regular shipments to Mumbai", "Competitive pricing", "Wide variety for fashion-forward market", "Credit terms for established buyers"],
        faqs: [
            { question: "How long does shipping to Mumbai take?", answer: "Standard shipping to Mumbai takes 3-5 business days. Express shipping (1-2 days) is available at additional cost. We ship via reliable courier partners." },
            { question: "Do you have a showroom in Mumbai?", answer: "Currently, we don't have a Mumbai showroom. However, our sales team visits Mumbai regularly for trade shows and client meetings. Contact us to schedule a meeting." },
            { question: "What do Mumbai customers typically order?", answer: "Mumbai retailers often order fashion-forward designs, party wear, and designer sarees. The cosmopolitan market demands trendy, contemporary styles alongside traditional options." },
            { question: "Do you supply to wholesale markets in Mumbai?", answer: "Yes, we supply to retailers in major Mumbai markets including Dadar, Mulund, and Borivali. Many Mumbai-based boutiques and online sellers source from us." }
        ]
    },
    delhi: {
        name: "Delhi",
        state: "Delhi NCR",
        description: "Wholesale sarees for Delhi NCR retailers. Serving Delhi, Noida, Gurgaon, and Faridabad with diverse collections for North Indian preferences.",
        localMarkets: ["Chandni Chowk", "Karol Bagh", "Lajpat Nagar", "Sarojini Nagar", "South Extension"],
        shippingDays: "4-6 days",
        advantages: ["North Indian designs", "Wedding season ready", "Bulk order discounts", "Festive collections"],
        faqs: [
            { question: "How long does shipping to Delhi take?", answer: "Standard shipping to Delhi NCR takes 4-6 business days. Express shipping (2-3 days) available. We use premium logistics for safe, timely delivery." },
            { question: "What saree styles sell well in Delhi?", answer: "Delhi market loves Banarasi, heavy silk, and wedding sarees. North Indian wedding season (Oct-Feb) drives huge demand. Festive sarees for Diwali and Karva Chauth also popular." },
            { question: "Do you offer credit terms for Delhi buyers?", answer: "Yes, we offer 15-30 day credit terms for established Delhi retailers with good order history. First orders require advance payment." },
            { question: "Can you supply for Delhi wedding exhibitions?", answer: "Yes, we've supplied sarees for many wedding exhibitions in Delhi NCR. Contact us 4-6 weeks in advance for exhibition requirements." }
        ]
    },
    kolkata: {
        name: "Kolkata",
        state: "West Bengal",
        description: "Wholesale sarees for Kolkata retailers. Specializing in silk, tant, and jamdani sarees popular in Bengal market.",
        localMarkets: ["New Market", "Gariahat", "College Street", "Hatibagan", "Lake Market"],
        shippingDays: "4-6 days",
        advantages: ["Bengal-style sarees", "Puja season expertise", "Tant and handloom options", "Traditional designs"],
        faqs: [
            { question: "Do you stock Bengal-style sarees?", answer: "Yes, we have extensive collections suitable for Bengal market including silk sarees, tant-style sarees, and designs popular for Durga Puja and Bengali weddings." },
            { question: "How to order for Durga Puja season?", answer: "Place Puja orders by August for timely delivery. We recommend stocking red and white sarees which are in highest demand during this period." },
            { question: "What is the shipping time to Kolkata?", answer: "Standard shipping takes 4-6 business days. Express shipping available for urgent orders. Safe packaging especially important for silk sarees." },
            { question: "Do you have jamdani-style sarees?", answer: "Yes, we stock jamdani-inspired designs as well as other traditional Bengal favorites. Great for retailers catering to Bengali clientele." }
        ]
    },
    chennai: {
        name: "Chennai",
        state: "Tamil Nadu",
        description: "Wholesale sarees for Chennai and Tamil Nadu retailers. Strong in silk sarees, Kanjivaram, and South Indian wedding collections.",
        localMarkets: ["T. Nagar", "Mylapore", "Pondy Bazaar", "Purasaiwalkam", "Kanchipuram"],
        shippingDays: "3-5 days",
        advantages: ["South Indian designs", "Silk expertise", "Wedding collections", "Temple saree range"],
        faqs: [
            { question: "How close are you to Chennai?", answer: "We're based in Bengaluru, just 350 km from Chennai. Shipping typically takes 3-5 days. Many Chennai retailers visit our Bengaluru showroom as well." },
            { question: "Do you stock Kanjivaram sarees?", answer: "Yes, we have genuine Kanjivaram-style silk sarees as well as affordable Kanjivaram-look alternatives. Both are popular in Tamil Nadu market." },
            { question: "What about temple sarees?", answer: "Yes, we stock temple border sarees which are a staple in South Indian weddings and functions. Available in various colors and price points." },
            { question: "Is there special pricing for Tamil Nadu retailers?", answer: "We offer competitive pricing for all regions. Bulk orders qualify for additional discounts. Contact us for special trade pricing." }
        ]
    },
    surat: {
        name: "Surat",
        state: "Gujarat",
        description: "Wholesale sarees for Surat retailers. Complementing Surat's textile expertise with unique designs and competitive pricing.",
        localMarkets: ["Ring Road", "Sahara Darwaza", "Textile Market", "Raghukul Market"],
        shippingDays: "4-6 days",
        advantages: ["Unique designs", "Quality competition", "Trade-friendly terms", "Complementary stock"],
        faqs: [
            { question: "Why order from Bengaluru when Surat is a textile hub?", answer: "We offer unique designs not commonly found in Surat markets, especially South Indian styles and handloom varieties. Many Surat retailers diversify stock with our products." },
            { question: "What is the shipping time to Surat?", answer: "Standard shipping takes 4-6 days. We ship regularly to Gujarat and have reliable logistics partnerships for safe delivery." },
            { question: "Do you offer trade terms for Surat wholesalers?", answer: "Yes, we work with Surat-based wholesalers and retailers. Competitive pricing, bulk discounts, and credit terms available for established accounts." },
            { question: "What products do Surat customers typically order?", answer: "Surat retailers often order silk sarees, traditional handloom varieties, and designer pieces that complement their local synthetic and printed saree offerings." }
        ]
    },
    hyderabad: {
        name: "Hyderabad",
        state: "Telangana",
        description: "Wholesale sarees for Hyderabad and Telangana retailers. Serving the vibrant Hyderabad market with diverse collections.",
        localMarkets: ["Begum Bazaar", "Charminar", "Abids", "Ameerpet", "Kukatpally"],
        shippingDays: "3-5 days",
        advantages: ["Close proximity", "Pochampally styles", "Wedding collections", "Fast shipping"],
        faqs: [
            { question: "How long does shipping to Hyderabad take?", answer: "Just 3-5 days from Bengaluru. Express shipping available for next-day delivery. We have regular shipments to Hyderabad." },
            { question: "Do you stock Pochampally sarees?", answer: "Yes, we have Pochampally-style ikat designs which are popular in Telangana. Both pure handloom and affordable alternatives available." },
            { question: "What wedding sarees sell well in Hyderabad?", answer: "Kanchi silk, Banarasi, and heavy embroidered sarees are popular for Hyderabad weddings. We stock designs suitable for Telugu wedding traditions." },
            { question: "Can I visit from Hyderabad?", answer: "Yes! Many Hyderabad retailers visit our Bengaluru showroom. It's a 6-7 hour drive or short flight. We can arrange showroom appointments." }
        ]
    },
    pune: {
        name: "Pune",
        state: "Maharashtra",
        description: "Wholesale sarees for Pune and Western Maharashtra retailers. Catering to the growing Pune retail market.",
        localMarkets: ["Laxmi Road", "FC Road", "Koregaon Park", "Hadapsar", "Pimpri-Chinchwad"],
        shippingDays: "4-5 days",
        advantages: ["Regular Maharashtra shipments", "Paithani alternatives", "Modern designs", "Credit terms"],
        faqs: [
            { question: "What is the shipping time to Pune?", answer: "Standard shipping takes 4-5 days. Express options available. We ship regularly to Maharashtra and have good logistics coverage." },
            { question: "Do you stock Maharashtrian-style sarees?", answer: "Yes, we have Paithani-style sarees and Nauvari-inspired designs popular in Maharashtra. Also contemporary designs for urban Pune market." },
            { question: "What does the Pune market prefer?", answer: "Pune has a mix of traditional and modern preferences. Cotton sarees for daily wear, contemporary designs for young professionals, and traditional silks for occasions." },
            { question: "Do you offer trade discounts for Pune retailers?", answer: "Yes, standard trade discounts apply. Bulk orders get additional discounts. We have many satisfied Pune-based retail customers." }
        ]
    },
    ahmedabad: {
        name: "Ahmedabad",
        state: "Gujarat",
        description: "Wholesale sarees for Ahmedabad and Gujarat retailers. Festive collections and designs for the Gujarat market.",
        localMarkets: ["CG Road", "Manek Chowk", "Law Garden", "SG Highway", "Satellite"],
        shippingDays: "4-6 days",
        advantages: ["Navratri collections", "Festive designs", "Bandhani alternatives", "Trade pricing"],
        faqs: [
            { question: "Do you have sarees for Navratri?", answer: "Yes! Navratri is huge in Gujarat and we stock colorful chaniya cholis, ghagras, and festive sarees specifically for this season. Order by August for best selection." },
            { question: "What about Bandhani sarees?", answer: "We stock Bandhani-style sarees that are popular in Gujarat. Both traditional and contemporary designs available." },
            { question: "How long does shipping to Ahmedabad take?", answer: "Standard shipping takes 4-6 days. We have regular shipments to Gujarat and reliable delivery partnerships." },
            { question: "Is there bulk pricing for Gujarat wholesalers?", answer: "Yes, attractive bulk pricing for wholesale quantities. Contact us for special pricing on large orders." }
        ]
    },
    jaipur: {
        name: "Jaipur",
        state: "Rajasthan",
        description: "Wholesale sarees for Jaipur and Rajasthan retailers. Serving the vibrant Rajasthani market with diverse collections.",
        localMarkets: ["Johari Bazaar", "Bapu Bazaar", "Tripolia Bazaar", "MI Road", "Chandpole"],
        shippingDays: "5-7 days",
        advantages: ["Lehariya alternatives", "Wedding collections", "Tourist-friendly designs", "Bulk discounts"],
        faqs: [
            { question: "Do you stock Rajasthani-style sarees?", answer: "Yes, we have Lehariya-inspired designs, Bandhej alternatives, and colorful Rajasthani-style prints that complement local offerings." },
            { question: "What is shipping time to Jaipur?", answer: "Standard shipping takes 5-7 days. Express shipping available for faster delivery. Safe packaging for transit." },
            { question: "Jaipur has many tourists – do you have tourist-friendly sarees?", answer: "Yes! We have affordable yet attractive sarees perfect for tourist shops. Good variety, competitive pricing, and easy reorder process." },
            { question: "What wedding sarees sell in Rajasthan?", answer: "Red and pink heavy sarees for brides, plus Banarasi and silk varieties for wedding guests. Rajasthani weddings demand vibrant colors." }
        ]
    }
};

// Create pages for kurtis and lehengas in Bengaluru
const productCityData: Record<string, { product: string; city: string }> = {
    "wholesale-kurtis-bengaluru": { product: "Kurtis", city: "Bengaluru" },
    "wholesale-lehengas-bengaluru": { product: "Lehengas", city: "Bengaluru" }
};

const CityPage = () => {
    // Get the slug from the current URL path since we're using static routes
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const citySlug = pathname.slice(1); // Remove leading /

    // Parse the URL to get product and city
    let product = "Sarees";
    let city = "";

    // Check if it's a special product-city combo
    if (citySlug && productCityData[citySlug]) {
        product = productCityData[citySlug].product;
        city = productCityData[citySlug].city.toLowerCase();
    } else if (citySlug?.startsWith("wholesale-sarees-")) {
        city = citySlug.replace("wholesale-sarees-", "");
    } else if (citySlug?.startsWith("wholesale-kurtis-")) {
        product = "Kurtis";
        city = citySlug.replace("wholesale-kurtis-", "");
    } else if (citySlug?.startsWith("wholesale-lehengas-")) {
        product = "Lehengas";
        city = citySlug.replace("wholesale-lehengas-", "");
    }

    const data = cityData[city];

    if (!data) {
        return <Navigate to="/shop" replace />;
    }

    const pageTitle = `Wholesale ${product} in ${data.name}`;
    const canonicalUrl = `https://meghdoottextiles.com/${citySlug}`;

    const schema = [
        createBreadcrumbSchema([
            { name: "Home", url: "https://meghdoottextiles.com/" },
            { name: `Wholesale ${product}`, url: `https://meghdoottextiles.com/wholesale-${product.toLowerCase()}` },
            { name: data.name, url: canonicalUrl }
        ]),
        createFAQSchema(data.faqs),
        createLocalBusinessSchema(data.name)
    ];

    return (
        <PageLayout>
            <SEOHead
                title={`${pageTitle} | Your Local Supplier | Meghdoot Textiles`}
                description={`Buy wholesale ${product.toLowerCase()} in ${data.name}, ${data.state}. ${data.shippingDays} delivery. GST invoicing. 25+ years experience. Contact: +91 93425 03401.`}
                canonical={canonicalUrl}
                keywords={`wholesale ${product.toLowerCase()} ${data.name}, ${product.toLowerCase()} supplier ${data.name}, bulk ${product.toLowerCase()} ${data.state}`}
                schema={schema}
            />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                {/* Hero */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <div className="container mx-auto px-4 py-12">
                        <div className="max-w-4xl mx-auto text-center">
                            <Badge className="bg-white/20 text-white mb-4">
                                <MapPin className="h-3 w-3 mr-1" />
                                {data.state}
                            </Badge>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{pageTitle}</h1>
                            <p className="text-lg text-white/90 mb-6">{data.description}</p>
                            <div className="flex items-center justify-center gap-4">
                                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                                    <Truck className="h-4 w-4 mr-2" />
                                    {data.shippingDays} delivery
                                </Badge>
                                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                                    <FileCheck className="h-4 w-4 mr-2" />
                                    GST Invoice
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Local Markets */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center">We Serve Retailers In</h2>
                        <div className="flex flex-wrap justify-center gap-3">
                            {data.localMarkets.map((market, i) => (
                                <Badge key={i} variant="outline" className="px-4 py-2">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {market}
                                </Badge>
                            ))}
                            <Badge variant="outline" className="px-4 py-2 bg-blue-50">
                                + Entire {data.state}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Advantages */}
                <div className="bg-white py-12">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-6 text-center">Why {data.name} Retailers Choose Us</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {data.advantages.map((advantage, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                                        <span>{advantage}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQs */}
                <div className="container mx-auto px-4 py-12">
                    <h2 className="text-2xl font-bold mb-6 text-center">Questions from {data.name} Retailers</h2>
                    <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="space-y-4">
                            {data.faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-6 bg-white">
                                    <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl font-bold mb-4">Ready to Order Wholesale {product} in {data.name}?</h2>
                        <p className="text-lg text-white/90 mb-6">Contact us today for catalog access and trade pricing.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="https://wa.me/919342503401" target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                                    <Phone className="h-5 w-5 mr-2" />
                                    WhatsApp: +91 93425 03401
                                </Button>
                            </a>
                            <Link to="/trade-account">
                                <Button size="lg" className="bg-white/20 text-white border-2 border-white hover:bg-white hover:text-blue-600">
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

export default CityPage;
