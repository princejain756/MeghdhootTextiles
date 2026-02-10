import { useParams, Link, Navigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SEOHead from "@/components/seo/SEOHead";
import { createBreadcrumbSchema, createFAQSchema, createProductSchema } from "@/lib/seoSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Package, Truck, FileCheck, Phone, ArrowRight, CheckCircle, IndianRupee } from "lucide-react";

// Category data for all product types
const categoryData: Record<string, Record<string, {
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    priceRange: string;
    moq: string;
    features: string[];
    faqs: { question: string; answer: string }[];
    gradient: string;
    accentColor: string;
}>> = {
    sarees: {
        cotton: {
            title: "Cotton Sarees Wholesale",
            description: "Breathable, comfortable cotton sarees for daily wear, office wear, and summer collections.",
            metaTitle: "Cotton Sarees Wholesale | Bulk Cotton Saree | MOQ 25 Pcs",
            metaDescription: "Buy wholesale cotton sarees at factory prices. South cotton, Chanderi, Chettinad, Mangalagiri. MOQ 25 pieces. GST invoicing. Pan-India shipping.",
            keywords: "cotton sarees wholesale, bulk cotton sarees, south cotton sarees wholesale, daily wear sarees",
            priceRange: "₹250 - ₹1,200",
            moq: "25 pieces",
            features: ["Breathable fabrics", "Machine washable", "Everyday comfort", "Multiple regional styles"],
            faqs: [
                { question: "What types of cotton sarees do you stock?", answer: "We stock South cotton, Chanderi cotton, Chettinad cotton, Mangalagiri, Kota Doria, and cotton blends. Each has unique characteristics for different markets." },
                { question: "Are cotton sarees good for summer?", answer: "Yes, cotton sarees are ideal for summer due to their breathability. They're also perfect for office wear and daily use. Fast-selling in hot and humid regions." },
                { question: "What is the MOQ for cotton sarees?", answer: "Standard MOQ is 25 pieces per design. We offer assorted packs for first-time buyers to test different styles." },
                { question: "How should retailers store cotton sarees?", answer: "Store in cool, dry place away from direct sunlight. Cotton sarees can be folded and stacked. Minimal care required compared to silk." }
            ],
            gradient: "from-emerald-600 to-teal-600",
            accentColor: "emerald"
        },
        silk: {
            title: "Silk Sarees Wholesale",
            description: "Premium silk sarees including Kanjivaram, Banarasi, Patola, and Tussar varieties.",
            metaTitle: "Silk Sarees Wholesale | Kanjivaram, Banarasi | MOQ 15 Pcs",
            metaDescription: "Buy wholesale silk sarees at factory prices. Kanjivaram, Banarasi, Patola, Tussar. Premium quality. MOQ 15 pieces. GST invoicing.",
            keywords: "silk sarees wholesale, Kanjivaram wholesale, Banarasi silk wholesale, pure silk sarees",
            priceRange: "₹800 - ₹5,000",
            moq: "15 pieces",
            features: ["Pure silk options", "Traditional weaves", "Wedding quality", "Heirloom pieces"],
            faqs: [
                { question: "Do you stock pure silk sarees?", answer: "Yes, we have both pure silk and art silk options. Pure silk sarees come with silk mark certification for authentication." },
                { question: "What is the difference between Kanjivaram and Banarasi?", answer: "Kanjivaram is heavier with temple borders from Tamil Nadu. Banarasi features intricate brocade work from Varanasi. Both are premium wedding choices." },
                { question: "What margins can retailers expect on silk sarees?", answer: "Silk sarees typically offer 50-70% margins. Wedding season (Oct-Feb) sees highest demand and best turnover." },
                { question: "How to identify quality silk?", answer: "Check weight, luster, and weave tightness. Pure silk has a distinctive sheen and feels cool to touch. We provide quality certificates for premium pieces." }
            ],
            gradient: "from-amber-600 to-yellow-600",
            accentColor: "amber"
        },
        banarasi: {
            title: "Banarasi Sarees Wholesale",
            description: "Authentic Banarasi sarees with traditional zari work, brocade patterns, and rich heritage.",
            metaTitle: "Banarasi Sarees Wholesale | Pure Zari | Wedding Collection",
            metaDescription: "Buy wholesale Banarasi sarees at factory prices. Katan, Organza, Georgette Banarasi. Heavy zari work. MOQ 15 pieces. GST invoicing.",
            keywords: "Banarasi sarees wholesale, pure Banarasi wholesale, wedding Banarasi sarees, zari sarees",
            priceRange: "₹1,500 - ₹8,000",
            moq: "15 pieces",
            features: ["Authentic Varanasi weave", "Pure zari options", "Bridal quality", "Investment pieces"],
            faqs: [
                { question: "Are these authentic Banarasi sarees?", answer: "Yes, our Banarasi sarees are sourced directly from Varanasi weavers. We offer GI-tagged authentic Banarasi with proper certification." },
                { question: "What types of Banarasi do you stock?", answer: "We stock Katan silk, Organza, Georgette, Tanchoi, Tissue, and Butidar Banarasi. Each has different weight, texture, and price points." },
                { question: "When is the best time to stock Banarasi?", answer: "Wedding season (October-February) is peak demand. Also Diwali and Karva Chauth. Stock 2-3 months before major wedding seasons." },
                { question: "Do you offer Banarasi lehengas?", answer: "Yes, we have Banarasi fabric lehengas and heavy Banarasi bridal sets. These are popular for North Indian weddings." }
            ],
            gradient: "from-rose-600 to-pink-600",
            accentColor: "rose"
        },
        wedding: {
            title: "Wedding Sarees Wholesale",
            description: "Premium wedding sarees for brides, reception, and wedding guest collections.",
            metaTitle: "Wedding Sarees Wholesale | Bridal Sarees | Reception Collection",
            metaDescription: "Buy wholesale wedding sarees at factory prices. Bridal, reception, sangeet sarees. Premium embroidery. MOQ 15 pieces. GST invoicing.",
            keywords: "wedding sarees wholesale, bridal sarees wholesale, reception sarees, sangeet sarees",
            priceRange: "₹1,000 - ₹10,000",
            moq: "15 pieces",
            features: ["Bridal quality", "Heavy embroidery", "Designer patterns", "Complete wedding range"],
            faqs: [
                { question: "What wedding occasions do your sarees cover?", answer: "We have sarees for bridal wear, reception, sangeet, mehendi, wedding guest, and mother-of-the-bride. Complete wedding wardrobe solutions." },
                { question: "Do wedding sarees come with blouse pieces?", answer: "Yes, all wedding sarees include matching blouse piece. Some premium pieces include ready-made blouses or stitching options." },
                { question: "What is the typical margin on wedding sarees?", answer: "Wedding sarees offer 60-80% margins. High-ticket items with strong demand during wedding season." },
                { question: "How to build a wedding saree collection?", answer: "Stock across price points: ₹1-3K for guests, ₹3-6K for family, ₹6K+ for brides. Cover different colors and regional preferences." }
            ],
            gradient: "from-red-600 to-rose-600",
            accentColor: "red"
        },
        "daily-wear": {
            title: "Daily Wear Sarees Wholesale",
            description: "Affordable, comfortable sarees for everyday wear. High-volume, fast-selling category.",
            metaTitle: "Daily Wear Sarees Wholesale | Affordable Bulk Sarees | MOQ 50 Pcs",
            metaDescription: "Buy wholesale daily wear sarees at lowest prices. Cotton, crepe, georgette. MOQ 50 pieces. High margins, fast selling. GST invoicing.",
            keywords: "daily wear sarees wholesale, affordable sarees wholesale, crepe sarees bulk, simple sarees wholesale",
            priceRange: "₹200 - ₹600",
            moq: "50 pieces",
            features: ["Affordable pricing", "Easy maintenance", "Fast-selling", "Consistent demand"],
            faqs: [
                { question: "What fabrics work best for daily wear?", answer: "Cotton, crepe, and lightweight georgette are most popular. Easy to maintain, comfortable for all-day wear, and priced for repeat purchases." },
                { question: "What is the typical customer for daily wear sarees?", answer: "Working women, teachers, homemakers who wear sarees regularly. They prioritize comfort and affordability over heavy embellishment." },
                { question: "How often do customers repurchase?", answer: "Daily wear customers are repeat buyers. They typically purchase 4-6 sarees per year as these see regular use and washing." },
                { question: "What colors sell best in daily wear?", answer: "Neutrals (beige, grey, navy), pastels, and maroons are evergreen. Simple prints and minimal borders preferred." }
            ],
            gradient: "from-slate-600 to-gray-600",
            accentColor: "slate"
        },
        "party-wear": {
            title: "Party Wear Sarees Wholesale",
            description: "Designer party wear sarees for evening events, cocktails, and festive occasions.",
            metaTitle: "Party Wear Sarees Wholesale | Designer Sarees | Sequin & Embroidered",
            metaDescription: "Buy wholesale party wear sarees at factory prices. Sequin, embroidered, designer sarees. MOQ 25 pieces. Trendy styles. GST invoicing.",
            keywords: "party wear sarees wholesale, designer sarees wholesale, sequin sarees, embroidered sarees wholesale",
            priceRange: "₹500 - ₹3,000",
            moq: "25 pieces",
            features: ["Trendy designs", "Sequin & embroidery", "Event-ready", "Bollywood inspired"],
            faqs: [
                { question: "What makes a saree 'party wear'?", answer: "Party wear features embellishments like sequins, beads, embroidery, or shimmer fabrics. They're designed to stand out at evening events and celebrations." },
                { question: "What fabrics are popular for party wear?", answer: "Georgette with sequins, net sarees, shimmer georgette, and art silk with embroidery. Fabrics that drape well and catch light." },
                { question: "How often should I refresh party wear collection?", answer: "Update 20-30% of collection each season. Party wear is trend-sensitive and customers expect fresh styles. Follow Bollywood trends." },
                { question: "What age group buys party wear sarees?", answer: "Primarily 25-45 age group. Young professionals, social-media-savvy customers who attend frequent events and value trendy styles." }
            ],
            gradient: "from-purple-600 to-fuchsia-600",
            accentColor: "purple"
        },
        designer: {
            title: "Designer Sarees Wholesale",
            description: "Boutique-quality designer sarees with unique patterns and premium craftsmanship.",
            metaTitle: "Designer Sarees Wholesale | Boutique Quality | Exclusive Collection",
            metaDescription: "Buy wholesale designer sarees at factory prices. Boutique quality, unique patterns. MOQ 20 pieces. Exclusive designs. GST invoicing.",
            keywords: "designer sarees wholesale, boutique sarees wholesale, exclusive sarees, premium sarees wholesale",
            priceRange: "₹800 - ₹5,000",
            moq: "20 pieces",
            features: ["Boutique quality", "Unique patterns", "Premium finish", "Limited editions"],
            faqs: [
                { question: "What makes these 'designer' sarees?", answer: "Designer sarees feature unique patterns, superior fabric quality, and premium finishing. They're boutique-grade pieces not found in mainstream markets." },
                { question: "Can I get exclusive designs for my store?", answer: "Yes, we offer exclusive designs for established retailers with orders of 100+ pieces. These won't be sold to other retailers in your city." },
                { question: "What margins do designer sarees offer?", answer: "Designer sarees typically offer 60-80% margins. Higher ticket size compensates for slower turnover compared to daily wear." },
                { question: "How to market designer sarees?", answer: "Focus on quality photography, social media presence, and personal styling consultations. Designer sarees sell through relationship and trust." }
            ],
            gradient: "from-indigo-600 to-violet-600",
            accentColor: "indigo"
        }
    },
    kurtis: {
        cotton: {
            title: "Cotton Kurtis Wholesale",
            description: "Comfortable cotton kurtis for daily wear, office wear, and casual occasions.",
            metaTitle: "Cotton Kurtis Wholesale | Daily Wear | All Sizes S-XXXL",
            metaDescription: "Buy wholesale cotton kurtis at factory prices. All sizes S-XXXL. Daily wear, office wear. MOQ 50 pieces. GST invoicing. Pan-India shipping.",
            keywords: "cotton kurtis wholesale, daily wear kurtis wholesale, office wear kurtis, ladies kurti wholesale",
            priceRange: "₹180 - ₹500",
            moq: "50 pieces",
            features: ["Breathable cotton", "All sizes S-XXXL", "Machine washable", "Office appropriate"],
            faqs: [
                { question: "What sizes do cotton kurtis come in?", answer: "We stock sizes S to XXXL (38-50). Full size range available in most designs for maximum customer coverage." },
                { question: "Are these suitable for office wear?", answer: "Yes, we have specific office-appropriate designs with minimal prints, solid colors, and professional cuts. Very popular category." },
                { question: "What is the MOQ for cotton kurtis?", answer: "Standard MOQ is 50 pieces per design. Assorted size packs available: typically S/M/L/XL/XXL ratio based on market demand." },
                { question: "How to care for cotton kurtis?", answer: "Machine washable in cold water. Iron on medium heat. Cotton kurtis are low-maintenance, ideal for daily wear." }
            ],
            gradient: "from-teal-600 to-cyan-600",
            accentColor: "teal"
        },
        anarkali: {
            title: "Anarkali Kurtis Wholesale",
            description: "Floor-length Anarkali kurtis for festive, wedding guest, and special occasions.",
            metaTitle: "Anarkali Kurtis Wholesale | Floor Length | Festive Collection",
            metaDescription: "Buy wholesale Anarkali kurtis at factory prices. Floor length, festive wear. All sizes. MOQ 30 pieces. GST invoicing. Pan-India shipping.",
            keywords: "Anarkali kurtis wholesale, floor length kurtis, festive kurtis wholesale, party wear kurtis",
            priceRange: "₹400 - ₹1,500",
            moq: "30 pieces",
            features: ["Floor length designs", "Festive ready", "Wedding guest wear", "Premium fabrics"],
            faqs: [
                { question: "What occasions are Anarkali kurtis for?", answer: "Festive occasions, wedding functions (sangeet, mehendi), religious ceremonies, and special celebrations. Not for daily wear." },
                { question: "What fabrics are used in Anarkali kurtis?", answer: "Georgette, net, silk blends, and embroidered rayon. Flowing fabrics that create the signature Anarkali silhouette." },
                { question: "Do Anarkalis come with bottoms?", answer: "Most Anarkali sets include matching bottom (churidar or palazzo). Some premium sets include dupatta as well." },
                { question: "What is the demand pattern for Anarkalis?", answer: "Peak demand during festive season (Diwali, Navratri) and wedding season. Steady demand throughout year for special occasions." }
            ],
            gradient: "from-fuchsia-600 to-pink-600",
            accentColor: "fuchsia"
        },
        festive: {
            title: "Festive Kurtis Wholesale",
            description: "Embroidered and designer kurtis for Diwali, Eid, Puja, and festive celebrations.",
            metaTitle: "Festive Kurtis Wholesale | Embroidered | Diwali, Eid, Puja",
            metaDescription: "Buy wholesale festive kurtis at factory prices. Embroidered, designer styles. MOQ 30 pieces. Diwali, Eid, Puja collections. GST invoicing.",
            keywords: "festive kurtis wholesale, embroidered kurtis wholesale, Diwali kurtis, designer kurtis wholesale",
            priceRange: "₹350 - ₹1,200",
            moq: "30 pieces",
            features: ["Festival ready", "Embroidered", "Designer patterns", "Gift worthy"],
            faqs: [
                { question: "When should I stock festive kurtis?", answer: "Stock 1-2 months before major festivals. Key periods: August-October (Navratri, Diwali), March-April (Eid, Holi), October (Puja)." },
                { question: "What embroidery styles are popular?", answer: "Chikankari, mirror work, thread embroidery, and sequin work. Regional preferences vary - stock based on your market." },
                { question: "What colors sell best for festivals?", answer: "Bright colors: red, yellow, green, pink for Navratri/Diwali. Pastels and whites for Eid. Golds and reds for Durga Puja." },
                { question: "What margins can I expect on festive kurtis?", answer: "Festive kurtis offer 50-70% margins. Premium during festival periods due to high demand and willingness to pay." }
            ],
            gradient: "from-orange-600 to-amber-600",
            accentColor: "orange"
        }
    },
    lehengas: {
        bridal: {
            title: "Bridal Lehengas Wholesale",
            description: "Heavy bridal lehengas with intricate embroidery for wedding day and reception.",
            metaTitle: "Bridal Lehengas Wholesale | Heavy Embroidery | Wedding Collection",
            metaDescription: "Buy wholesale bridal lehengas at factory prices. Heavy embroidery, complete sets. MOQ 10 pieces. Wedding specialist stock. GST invoicing.",
            keywords: "bridal lehengas wholesale, wedding lehengas wholesale, heavy lehenga wholesale, designer bridal lehenga",
            priceRange: "₹5,000 - ₹15,000",
            moq: "10 pieces",
            features: ["Heavy embroidery", "Complete sets", "Bridal quality", "Reception ready"],
            faqs: [
                { question: "What makes these bridal quality?", answer: "Heavy embroidery (zari, resham, stonework), premium fabrics (raw silk, velvet, net), and complete sets with matching choli and dupatta." },
                { question: "Do bridal lehengas come with choli?", answer: "Yes, all bridal lehengas are complete sets with lehenga, matching choli/blouse (semi-stitched or unstitched), and dupatta." },
                { question: "What are the popular bridal colors?", answer: "Red remains #1 for North Indian brides. Pink, maroon, and gold are trending. South Indian brides often prefer gold and cream." },
                { question: "What is the margin on bridal lehengas?", answer: "Bridal lehengas offer 60-100% margins. High-ticket items where customers prioritize quality over price." }
            ],
            gradient: "from-red-600 to-rose-600",
            accentColor: "red"
        },
        "party-wear": {
            title: "Party Wear Lehengas Wholesale",
            description: "Designer party wear lehengas for sangeet, engagement, and festive occasions.",
            metaTitle: "Party Wear Lehengas Wholesale | Designer | Sangeet Collection",
            metaDescription: "Buy wholesale party wear lehengas at factory prices. Sangeet, engagement, festive styles. MOQ 15 pieces. Complete sets. GST invoicing.",
            keywords: "party wear lehengas wholesale, sangeet lehengas, engagement lehengas wholesale, festive lehengas",
            priceRange: "₹1,200 - ₹4,000",
            moq: "15 pieces",
            features: ["Party ready", "Trendy designs", "Comfortable weight", "Multiple occasions"],
            faqs: [
                { question: "What occasions are party lehengas for?", answer: "Sangeet, engagement, mehendi, cocktail parties, Navratri, Diwali, and wedding guest wear. Versatile occasion wear." },
                { question: "How are party lehengas different from bridal?", answer: "Lighter weight, less heavy embroidery, more focus on trendy designs. Easier to move and dance in. Lower price point." },
                { question: "What fabrics are used for party lehengas?", answer: "Georgette, net, crepe, and light silk blends. Comfortable for extended wear during events." },
                { question: "What are the trending styles?", answer: "Crop top lehengas, Indo-western styles, ruffled lehengas, and mirror work. Follow Bollywood for latest trends." }
            ],
            gradient: "from-purple-600 to-violet-600",
            accentColor: "purple"
        }
    }
};

const CategoryPage = () => {
    const { category } = useParams<{ category: string }>();

    // Get productType from the current URL path
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const productType = pathname.startsWith('/wholesale-sarees') ? 'wholesale-sarees' :
        pathname.startsWith('/wholesale-kurtis') ? 'wholesale-kurtis' :
            pathname.startsWith('/wholesale-lehengas') ? 'wholesale-lehengas' : null;

    // Map URL to data keys
    const productKey = productType === "wholesale-sarees" ? "sarees" :
        productType === "wholesale-kurtis" ? "kurtis" :
            productType === "wholesale-lehengas" ? "lehengas" : null;

    if (!productKey || !category || !categoryData[productKey]?.[category]) {
        return <Navigate to="/shop" replace />;
    }

    const data = categoryData[productKey][category];
    const parentPath = `/${productType}`;
    const parentName = productType?.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()) || '';

    const schema = [
        createBreadcrumbSchema([
            { name: "Home", url: "https://meghdoottextiles.com/" },
            { name: parentName, url: `https://meghdoottextiles.com${parentPath}` },
            { name: data.title, url: `https://meghdoottextiles.com${parentPath}/${category}` }
        ]),
        createFAQSchema(data.faqs),
        createProductSchema({
            name: data.title,
            description: data.description,
            priceRange: data.priceRange,
            category: parentName
        })
    ];

    return (
        <PageLayout>
            <SEOHead
                title={data.metaTitle}
                description={data.metaDescription}
                canonical={`https://meghdoottextiles.com${parentPath}/${category}`}
                keywords={data.keywords}
                schema={schema}
            />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
                {/* Hero */}
                <div className={`bg-gradient-to-r ${data.gradient} text-white`}>
                    <div className="container mx-auto px-4 py-12">
                        <div className="max-w-4xl mx-auto text-center">
                            <Badge className="bg-white/20 text-white mb-4">MOQ: {data.moq}</Badge>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{data.title}</h1>
                            <p className="text-lg text-white/90 mb-6">{data.description}</p>
                            <div className="flex items-center justify-center gap-2 text-xl">
                                <IndianRupee className="h-5 w-5" />
                                <span className="font-bold">{data.priceRange}</span>
                                <span className="text-white/80">per piece</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Signals */}
                <div className="container mx-auto px-4 -mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {[
                            { icon: <Package className="h-5 w-5" />, label: `MOQ ${data.moq}` },
                            { icon: <FileCheck className="h-5 w-5" />, label: "GST Invoice" },
                            { icon: <Truck className="h-5 w-5" />, label: "Pan-India Shipping" },
                            { icon: <Phone className="h-5 w-5" />, label: "WhatsApp Support" },
                        ].map((item, i) => (
                            <Card key={i} className="text-center py-4">
                                <CardContent className="p-0 flex flex-col items-center gap-1">
                                    <span className={`text-${data.accentColor}-600`}>{item.icon}</span>
                                    <span className="text-sm font-medium">{item.label}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Features */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center">Key Features</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {data.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                                    <span>{feature}</span>
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
                                {data.faqs.map((faq, index) => (
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
                <div className={`bg-gradient-to-r ${data.gradient} text-white py-12`}>
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl font-bold mb-4">Ready to Order {data.title}?</h2>
                        <p className="text-lg text-white/90 mb-6">Contact us for pricing and catalog access.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="https://wa.me/919342503401" target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="bg-white text-gray-900 hover:bg-white/90">
                                    <Phone className="h-5 w-5 mr-2" />
                                    WhatsApp: +91 93425 03401
                                </Button>
                            </a>
                            <Link to={parentPath}>
                                <Button size="lg" className="bg-white/20 text-white border-2 border-white hover:bg-white hover:text-gray-900">
                                    <ArrowRight className="h-5 w-5 mr-2" />
                                    View All Categories
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default CategoryPage;
