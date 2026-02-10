import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SEOHead from "@/components/seo/SEOHead";
import { createBreadcrumbSchema } from "@/lib/seoSchemas";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ArrowRight, Search } from "lucide-react";

const blogPosts = [
    { slug: "start-saree-business", title: "How to Start a Saree Business in India – Complete Guide", description: "Step-by-step guide to starting a profitable saree retail business. Investment, sourcing, pricing, and marketing strategies.", category: "Business Startup", readTime: "12 min" },
    { slug: "wholesale-saree-markets-india", title: "Top Wholesale Saree Markets in India – Buyer's Guide", description: "Comprehensive guide to the best wholesale saree markets in India. Compare Surat, Varanasi, Chennai, Kolkata markets.", category: "Sourcing", readTime: "10 min" },
    { slug: "saree-profit-margin-guide", title: "Saree Profit Margins – How Much Can Retailers Earn?", description: "Complete breakdown of profit margins in saree retail. Category-wise analysis and pricing strategies.", category: "Business", readTime: "8 min" },
    { slug: "cotton-saree-types-guide", title: "Types of Cotton Sarees – Complete Retailer's Guide", description: "All cotton saree varieties explained. South cotton, Chanderi, Chettinad, Mangalagiri with pricing and stocking tips.", category: "Product Guide", readTime: "10 min" },
    { slug: "start-kurti-business", title: "How to Start a Kurti Business in India", description: "Complete guide to starting a kurti retail business. Online, offline, and hybrid models explained.", category: "Business Startup", readTime: "11 min" },
    { slug: "wedding-lehenga-buying-guide-retailers", title: "Wedding Lehenga Buying Guide for Retailers", description: "How to stock wedding lehengas. Categories, pricing, quality checks, and seasonal strategies.", category: "Product Guide", readTime: "9 min" },
    { slug: "diwali-saree-collection-guide", title: "Diwali Saree Collection – Retailer's Stocking Guide", description: "What sarees to stock for Diwali season. Colors, styles, timing, and marketing tips.", category: "Seasonal", readTime: "7 min" },
    { slug: "gst-guide-saree-retailers", title: "GST Guide for Saree Retailers", description: "Complete GST guide for textile retailers. Registration, rates, ITC, invoicing, and compliance.", category: "Compliance", readTime: "9 min" },
    { slug: "silk-saree-types-guide", title: "Types of Silk Sarees – Premium Collection Guide", description: "Kanjivaram, Banarasi, Patola, Tussar explained. Quality identification and stocking recommendations.", category: "Product Guide", readTime: "11 min" },
    { slug: "saree-boutique-management-tips", title: "Saree Boutique Management – Expert Tips", description: "Run a profitable saree boutique. Inventory, display, staff, customer service, and technology.", category: "Operations", readTime: "10 min" },
    { slug: "moq-meaning-wholesale", title: "MOQ in Wholesale – What Retailers Need to Know", description: "Understanding Minimum Order Quantity. Typical MOQs, negotiation tips, and how it affects your business.", category: "Business", readTime: "6 min" },
    { slug: "sell-sarees-online-guide", title: "How to Sell Sarees Online – Complete Guide", description: "Sell sarees on Instagram, Amazon, and your own website. Photography, pricing, and marketing strategies.", category: "E-commerce", readTime: "12 min" },
    { slug: "wedding-sarees-wholesale-guide", title: "Wedding Sarees Wholesale – Seasonal Stocking Guide", description: "Stock wedding sarees for maximum profit. Timing, categories, pricing, and marketing during wedding season.", category: "Product Guide", readTime: "8 min" },
    { slug: "georgette-vs-chiffon-sarees", title: "Georgette vs Chiffon Sarees – Fabric Comparison", description: "Detailed comparison of georgette and chiffon fabrics. Drape, pricing, and sales performance.", category: "Product Guide", readTime: "6 min" },
    { slug: "plus-size-kurtis-wholesale", title: "Plus Size Kurtis Wholesale – Untapped Opportunity", description: "Growing demand for plus size kurtis. Sizing, sourcing, pricing, and marketing strategies.", category: "Product Guide", readTime: "7 min" },
    { slug: "navratri-lehenga-collection-guide", title: "Navratri Lehenga Collection – Retailer's Guide", description: "Stock for Navratri season. Chaniya choli, color significance, and timing your orders.", category: "Seasonal", readTime: "7 min" },
    { slug: "saree-reseller-business-guide", title: "Saree Reseller Business – Start from Home", description: "Start a saree reselling business with low investment. Platforms, suppliers, and success tips.", category: "Business Startup", readTime: "8 min" },
    { slug: "saree-fabric-care-guide", title: "Saree Fabric Care Guide for Retailers", description: "Care instructions for cotton, silk, and georgette sarees. Help your customers maintain their purchases.", category: "Customer Service", readTime: "6 min" },
    { slug: "export-sarees-usa-guide", title: "Export Indian Sarees to USA – NRI Market Guide", description: "Sell sarees to NRI customers in USA. Business models, shipping, pricing, and legal requirements.", category: "Export", readTime: "9 min" },
    { slug: "kurti-sizing-guide-retailers", title: "Kurti Sizing Guide for Retailers", description: "Standard kurti measurements S to XXXL. Stocking ratios and size conversion tips.", category: "Operations", readTime: "5 min" },
    { slug: "types-banarasi-sarees", title: "Types of Banarasi Sarees – Complete Guide", description: "Katan, Organza, Georgette, Tanchoi, Tissue Banarasi varieties explained with pricing.", category: "Product Guide", readTime: "8 min" },
    { slug: "summer-saree-collection-tips", title: "Summer Saree Collection – What to Stock", description: "Best sarees for summer season. Fabrics, colors, and marketing strategies.", category: "Seasonal", readTime: "6 min" },
    { slug: "instagram-marketing-saree-business", title: "Instagram Marketing for Saree Business", description: "Grow your saree business on Instagram. Content, hashtags, engagement, and advertising.", category: "Marketing", readTime: "10 min" },
    { slug: "saree-blouse-business-guide", title: "Saree Blouse Business – Add-on Revenue Guide", description: "Add blouse business to your saree shop. Ready-made, stitching services, and upselling.", category: "Business", readTime: "7 min" },
    { slug: "karva-chauth-saree-collection", title: "Karva Chauth Saree Collection Guide", description: "Stock for Karva Chauth. Popular colors, styles, and marketing to married women.", category: "Seasonal", readTime: "6 min" },
    { slug: "daily-wear-sarees-wholesale", title: "Daily Wear Sarees Wholesale – Steady Revenue", description: "Building consistent revenue with daily wear sarees. Fabrics, pricing, and stocking strategies.", category: "Product Guide", readTime: "7 min" },
    { slug: "wholesale-payment-terms-guide", title: "Wholesale Payment Terms – Retailer's Guide", description: "Understanding payment terms in wholesale. Advance, credit, COD, and negotiation.", category: "Business", readTime: "6 min" },
    { slug: "saree-photography-tips", title: "Saree Photography Tips for Online Selling", description: "Photograph sarees for online sales. Lighting, setup, key shots, and Instagram optimization.", category: "E-commerce", readTime: "8 min" },
    { slug: "office-wear-sarees-guide", title: "Office Wear Sarees – Professional Collection Guide", description: "Stock sarees for working women. Fabrics, colors, and styles for office wear.", category: "Product Guide", readTime: "6 min" },
    { slug: "wholesale-vs-retail-saree-buying", title: "Wholesale vs Retail Saree Buying – Key Differences", description: "Comparing wholesale and retail purchasing. Price differences, MOQs, and when to choose each.", category: "Business", readTime: "5 min" }
];

const categories = [...new Set(blogPosts.map(post => post.category))];

const BlogIndex = () => {
    const schema = [
        createBreadcrumbSchema([
            { name: "Home", url: "https://meghdoottextiles.com/" },
            { name: "Blog", url: "https://meghdoottextiles.com/blog" }
        ])
    ];

    return (
        <PageLayout>
            <SEOHead
                title="Wholesale Textile Business Blog | Guides & Tips | Meghdoot Textiles"
                description="Expert guides for saree, kurti, and lehenga retailers. Learn about sourcing, pricing, marketing, and growing your textile business."
                canonical="https://meghdoottextiles.com/blog"
                keywords="saree business tips, wholesale textile guide, retail tips India, saree boutique guide"
                schema={schema}
            />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
                {/* Hero */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                    <div className="container mx-auto px-4 py-12">
                        <div className="max-w-4xl mx-auto text-center">
                            <Badge className="bg-white/20 text-white mb-4">
                                <BookOpen className="h-3 w-3 mr-1" />
                                Retailer's Resource Hub
                            </Badge>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">Wholesale Textile Business Blog</h1>
                            <p className="text-lg text-white/90">
                                Expert guides, tips, and insights for saree, kurti, and lehenga retailers. 25+ years of industry knowledge, shared.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((cat, i) => (
                            <Badge key={i} variant="outline" className="px-3 py-1 cursor-pointer hover:bg-slate-100">
                                {cat}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Blog Posts */}
                <div className="container mx-auto px-4 pb-16">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogPosts.map((post) => (
                            <Link key={post.slug} to={`/blog/${post.slug}`}>
                                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                                            <span className="text-xs text-muted-foreground flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {post.readTime}
                                            </span>
                                        </div>
                                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                                            {post.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="line-clamp-2">{post.description}</CardDescription>
                                        <div className="mt-4 text-sm text-primary flex items-center">
                                            Read more <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default BlogIndex;
export { blogPosts };
