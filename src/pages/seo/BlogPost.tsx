import { useParams, Link, Navigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SEOHead from "@/components/seo/SEOHead";
import { createBreadcrumbSchema, createBlogPostSchema, createFAQSchema } from "@/lib/seoSchemas";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, User, Calendar, ArrowLeft, Phone, BookOpen } from "lucide-react";
import { blogPosts } from "./BlogIndex";

// Blog content data - simplified for brevity, would normally be longer
const blogContent: Record<string, {
    faqs: { question: string; answer: string }[];
    sections: { title: string; content: string }[];
}> = {
    "start-saree-business": {
        sections: [
            { title: "Why Start a Saree Business?", content: "The Indian saree market is worth over ₹50,000 crore and growing. With 25+ years in the industry, we've seen countless retailers build successful businesses. Sarees remain essential for weddings, festivals, and daily wear across India." },
            { title: "Initial Investment Required", content: "Starting a saree business requires ₹2-10 lakh depending on your model. Online-only can start with ₹50,000-2 lakh. Physical store needs ₹5-10 lakh including inventory, rent, and setup." },
            { title: "Sourcing Your Inventory", content: "Source from wholesale suppliers like Meghdoot Textiles. Start with 200-500 sarees across different categories. Focus on cotton for daily wear, silk for occasions, and designer pieces for boutique appeal." },
            { title: "Pricing Strategy", content: "Mark up 40-80% depending on category. Daily wear: 40-50% margin. Designer: 60-80% margin. Premium silk: 50-70% margin. Always know your competition's pricing." },
            { title: "Marketing Your Business", content: "Start with WhatsApp for existing contacts. Build Instagram presence with daily saree posts. Join local business groups. Participate in exhibitions. Word of mouth is powerful in this industry." }
        ],
        faqs: [
            { question: "How much money do I need to start a saree business?", answer: "Minimum ₹50,000 for online-only model, ₹2-5 lakh for small physical store, ₹5-10 lakh for proper showroom." },
            { question: "Where should I buy sarees wholesale?", answer: "Wholesale markets in Surat, Varanasi, or directly from manufacturers like Meghdoot Textiles. Direct sourcing gives better margins." },
            { question: "Is GST registration required?", answer: "Yes, if turnover exceeds ₹40 lakh (₹20 lakh in special category states). Get GST for professional business image and ITC benefits." },
            { question: "How many sarees should I start with?", answer: "Start with 200-500 pieces. Include mix of daily wear (50%), occasion wear (30%), and designer (20%)." },
            { question: "What is the profit margin on sarees?", answer: "40-80% depending on category. Average is 50-60%. Premium pieces can go higher." },
            { question: "Should I sell online or offline?", answer: "Start with both if possible. Online has lower costs. Offline builds trust. Hybrid model works best." }
        ]
    },
    // Default content for other blog posts
    default: {
        sections: [
            { title: "Introduction", content: "Welcome to this comprehensive guide. We'll cover everything you need to know about this topic based on our 25+ years of experience in the wholesale textile industry." },
            { title: "Key Insights", content: "Understanding the fundamentals is crucial for success in the textile retail business. Our experience shows that retailers who follow best practices consistently outperform others." },
            { title: "Practical Tips", content: "Start with proper planning, source from reliable suppliers, maintain good inventory management, and focus on customer service. These basics never fail." },
            { title: "Next Steps", content: "Apply these insights to your business. Contact Meghdoot Textiles for wholesale sourcing support. We're here to help you succeed." }
        ],
        faqs: [
            { question: "How can this help my business?", answer: "These insights come from 25+ years of industry experience. Apply them to see real improvements in your retail operations." },
            { question: "Where can I get more guidance?", answer: "Contact our team at +91 93425 03401. We offer merchandising support and business consultation to our trade partners." },
            { question: "Is this applicable to my market?", answer: "Yes, these principles apply across India. Adapt specifics to your local market preferences." }
        ]
    }
};

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();

    const post = blogPosts.find(p => p.slug === slug);
    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    const content = blogContent[slug || ""] || blogContent.default;

    const schema = [
        createBreadcrumbSchema([
            { name: "Home", url: "https://meghdoottextiles.com/" },
            { name: "Blog", url: "https://meghdoottextiles.com/blog" },
            { name: post.title, url: `https://meghdoottextiles.com/blog/${slug}` }
        ]),
        createBlogPostSchema({
            title: post.title,
            description: post.description,
            datePublished: "2024-01-15",
            url: `https://meghdoottextiles.com/blog/${slug}`
        }),
        createFAQSchema(content.faqs)
    ];

    return (
        <PageLayout>
            <SEOHead
                title={`${post.title} | Meghdoot Textiles Blog`}
                description={post.description}
                canonical={`https://meghdoottextiles.com/blog/${slug}`}
                keywords={`${post.category.toLowerCase()}, saree business, textile retail, wholesale guide`}
                ogType="article"
                schema={schema}
            />

            <div className="min-h-screen bg-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                    <div className="container mx-auto px-4 py-12">
                        <div className="max-w-3xl mx-auto">
                            <Link to="/blog" className="inline-flex items-center text-white/70 hover:text-white mb-6">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Blog
                            </Link>
                            <Badge className="bg-white/20 text-white mb-4">{post.category}</Badge>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                            <p className="text-lg text-white/90 mb-6">{post.description}</p>
                            <div className="flex items-center gap-6 text-sm text-white/70">
                                <span className="flex items-center">
                                    <User className="h-4 w-4 mr-2" />
                                    Meghdoot Textiles
                                </span>
                                <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {post.readTime} read
                                </span>
                                <span className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    January 2024
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto">
                        <article className="prose prose-lg max-w-none">
                            {content.sections.map((section, i) => (
                                <section key={i} className="mb-8">
                                    <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                                    <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                                </section>
                            ))}
                        </article>

                        {/* FAQs */}
                        <div className="mt-12 pt-8 border-t">
                            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {content.faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-6">
                                        <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>

                        {/* CTA */}
                        <Card className="mt-12 bg-gradient-to-r from-primary to-primary/80 text-white">
                            <CardContent className="p-8 text-center">
                                <h3 className="text-xl font-bold mb-4">Need Wholesale Sourcing Help?</h3>
                                <p className="text-white/90 mb-6">Contact Meghdoot Textiles for quality wholesale sarees, kurtis, and lehengas.</p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <a href="https://wa.me/919342503401" target="_blank" rel="noopener noreferrer">
                                        <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                                            <Phone className="h-5 w-5 mr-2" />
                                            WhatsApp: +91 93425 03401
                                        </Button>
                                    </a>
                                    <Link to="/blog">
                                        <Button size="lg" className="bg-white/20 text-white border-2 border-white hover:bg-white hover:text-primary">
                                            <BookOpen className="h-5 w-5 mr-2" />
                                            More Articles
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default BlogPost;
