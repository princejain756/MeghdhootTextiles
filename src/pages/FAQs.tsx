import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin,
  Users,
  Star,
  Award,
  Clock,
  Shield,
  CheckCircle,
  Info,
  ArrowRight,
  Filter
} from "lucide-react";
import PageLayout from "@/components/PageLayout";

const FAQs = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      id: "general",
      title: "General Questions",
      icon: <HelpCircle className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: "ordering",
      title: "Ordering & Payment",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "bg-green-100 text-green-800"
    },
    {
      id: "shipping",
      title: "Shipping & Delivery",
      icon: <Clock className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-800"
    },
    {
      id: "sizing",
      title: "Sizing & Fitting",
      icon: <Users className="h-5 w-5" />,
      color: "bg-orange-100 text-orange-800"
    },
    {
      id: "returns",
      title: "Returns & Exchanges",
      icon: <Shield className="h-5 w-5" />,
      color: "bg-red-100 text-red-800"
    },
    {
      id: "trade",
      title: "Trade Account",
      icon: <Award className="h-5 w-5" />,
      color: "bg-indigo-100 text-indigo-800"
    }
  ];

  const faqData = {
    general: [
      {
        question: "What is Meghdoot Textiles?",
        answer: "Meghdoot Textiles is a leading wholesale supplier of Indian ethnic wear, serving retailers, boutiques, and resellers across India. We specialize in sarees, kurtis, lehengas, and other traditional garments with over 25 years of experience in the textile industry."
      },
      {
        question: "Do you have a physical store?",
        answer: "Yes, we have our main operations center in Surat, Gujarat. You can visit us at Kamela Darwaja, Umarwada, Ring Road (Opp. Millennium Textile Market Back Gate), Surat – 395002. We also have showrooms in select cities for trade customers."
      },
      {
        question: "What are your business hours?",
        answer: "Our business hours are Monday to Saturday, 9:00 AM to 6:00 PM IST. We're closed on Sundays and public holidays. For urgent queries, you can reach us via WhatsApp at +91 93425 03401."
      },
      {
        question: "Do you offer international shipping?",
        answer: "Currently, we only ship within India. However, we're working on international shipping capabilities and plan to launch this service soon. Contact us for special international requests or bulk orders."
      }
    ],
    ordering: [
      {
        question: "How do I place an order?",
        answer: "You can place orders through our website by browsing our catalogs, adding items to cart, and proceeding to checkout. For trade customers, we also accept orders via WhatsApp, email, or phone. Contact our sales team for personalized assistance."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept various payment methods including UPI, net banking, credit/debit cards, and bank transfers. For trade customers, we also offer credit terms and flexible payment options. Cash on Delivery (COD) is available for orders up to ₹10,000."
      },
      {
        question: "Is there a minimum order quantity?",
        answer: "Yes, we have different MOQs (Minimum Order Quantities) for different product categories. For sarees, it's typically 25 pieces; for kurtis, 50 pieces; and for lehengas, 15 pieces. Trade account holders may have different MOQs based on their agreement."
      },
      {
        question: "Can I modify my order after placing it?",
        answer: "Order modifications are possible within 24 hours of placement, subject to product availability. Contact our customer service team immediately with your order number and requested changes. Additional charges may apply for modifications."
      },
      {
        question: "Do you offer bulk discounts?",
        answer: "Yes, we offer attractive bulk discounts based on order quantity and your trade account status. The more you order, the better the discount. Contact our sales team for custom pricing on large orders."
      }
    ],
    shipping: [
      {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 3-7 business days across India. Express shipping is available for 1-3 days delivery. Processing time is 1-2 business days for ready stock items. Custom orders may take 5-15 days depending on complexity."
      },
      {
        question: "What are your shipping charges?",
        answer: "Shipping is free for orders above ₹5,000. For orders below ₹5,000, standard shipping charges are ₹150. Express shipping costs an additional ₹200. COD charges range from ₹50-₹100 depending on order value."
      },
      {
        question: "Do you provide tracking information?",
        answer: "Yes, we provide tracking information via email and SMS once your order is dispatched. You can track your package in real-time using the tracking number provided. Our customer service team is also available to help with tracking queries."
      },
      {
        question: "What if my package is damaged or lost?",
        answer: "We take full responsibility for damaged or lost packages. Report any issues within 48 hours of delivery with photos. We'll arrange for replacement or refund immediately. We work with reliable shipping partners to minimize such incidents."
      },
      {
        question: "Can I track my order status?",
        answer: "Yes, you can track your order status through our website using your order number, or contact our customer service team. We also send regular updates via WhatsApp and email about your order progress."
      }
    ],
    sizing: [
      {
        question: "How do I determine my size?",
        answer: "We provide detailed size charts for all product categories. Measure your bust, waist, and hip using a flexible measuring tape. Our size guide includes measurements in inches and centimeters. If you're between sizes, we recommend sizing up for comfort."
      },
      {
        question: "Do you offer custom sizing?",
        answer: "Yes, we offer custom sizing for special occasions and bulk orders. Contact our team with your measurements and requirements. Custom sizing may take additional time and may have different pricing. We also provide size exchange within 7 days of delivery."
      },
      {
        question: "What if the size doesn't fit?",
        answer: "We offer size exchanges within 7 days of delivery. The item must be in original condition with tags attached. Return shipping costs are the customer's responsibility unless it's a sizing error on our part. Contact us immediately to initiate the exchange process."
      },
      {
        question: "Do you have plus sizes available?",
        answer: "Yes, we carry sizes from XS to XXL for most products, and some items are available in plus sizes up to 4XL. Check individual product pages for available sizes. We're constantly expanding our size range based on customer demand."
      }
    ],
    returns: [
      {
        question: "What is your return policy?",
        answer: "We offer returns within 7 days of delivery for standard items. Products must be in original condition with tags attached. Custom or personalized items cannot be returned. Quality issues can be reported within 15 days. Return shipping costs are the customer's responsibility."
      },
      {
        question: "How do I initiate a return?",
        answer: "Contact our customer service team via email, phone, or WhatsApp with your order number and reason for return. We'll provide a Return Authorization Number (RAN) and detailed instructions. Pack the item properly and ship it to our return address."
      },
      {
        question: "How long does it take to process a refund?",
        answer: "Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method. You'll receive email confirmation once the refund is processed."
      },
      {
        question: "What items cannot be returned?",
        answer: "Custom or personalized items, items without original tags, worn or used items, and items returned after the return period cannot be returned. Items damaged due to customer negligence are also not eligible for return."
      },
      {
        question: "Do you offer exchanges?",
        answer: "Yes, we offer exchanges for size changes, color changes, or different products of equal value. Exchange requests must be made within 7 days of delivery. Price differences may apply for exchanges to higher-value items."
      }
    ],
    trade: [
      {
        question: "How do I create a trade account?",
        answer: "You can create a trade account by filling out our online application form or contacting our sales team directly. You'll need to provide business registration documents, GST number, and other relevant business information. Our team will review and approve your application within 24-48 hours."
      },
      {
        question: "What are the benefits of a trade account?",
        answer: "Trade account holders enjoy wholesale pricing, priority customer support, dedicated account managers, early access to new collections, flexible payment terms, and exclusive trade catalogs. You also get access to our business intelligence and merchandising support."
      },
      {
        question: "What documents do I need for a trade account?",
        answer: "You'll need your business registration certificate, GST registration, bank account details, and a valid business address. For some accounts, we may also require trade references or previous business experience documentation."
      },
      {
        question: "Do you offer credit terms for trade customers?",
        answer: "Yes, we offer flexible credit terms for established trade customers based on their creditworthiness and order history. Terms typically range from 15-30 days. Contact our credit team to discuss your specific requirements and eligibility."
      },
      {
        question: "Can I get custom catalogs for my store?",
        answer: "Yes, we offer custom catalog creation for trade customers. Our team can create personalized assortments based on your target market, price points, and style preferences. Custom catalogs include product imagery, pricing, and marketing materials."
      }
    ]
  };

  const filteredFAQs = Object.entries(faqData).reduce((acc, [category, faqs]) => {
    const filtered = faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as typeof faqData);

  const contactInfo = {
    email: "support@meghdoottextiles.com",
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
                  <HelpCircle className="h-12 w-12" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Find answers to common questions about our products, services, and policies
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Search className="h-4 w-4 mr-2" />
                  Searchable FAQs
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  24/7 Support
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  Trusted Answers
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* Search Section */}
          <div className="mb-12">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4"
                  />
                </div>
                {searchQuery && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    Found {Object.values(filteredFAQs).flat().length} results for "{searchQuery}"
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* FAQ Categories */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
              <p className="text-muted-foreground">Select a category to view related questions</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {faqCategories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted"
                  onClick={() => {
                    const element = document.getElementById(category.id);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {category.icon}
                  <span className="text-xs text-center">{category.title}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="space-y-12">
            {Object.entries(filteredFAQs).map(([categoryKey, faqs]) => {
              const category = faqCategories.find(cat => cat.id === categoryKey);
              return (
                <div key={categoryKey} id={categoryKey}>
                  <div className="flex items-center gap-3 mb-6">
                    {category?.icon}
                    <h2 className="text-2xl font-bold">{category?.title}</h2>
                    <Badge className={category?.color}>
                      {faqs.length} questions
                    </Badge>
                  </div>
                  
                  <Accordion type="single" collapsible className="space-y-4">
                    {faqs.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`${categoryKey}-${index}`}
                        className="border border-border rounded-lg"
                      >
                        <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                          <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span className="font-medium">{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <div className="ml-8 text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>

          {Object.keys(filteredFAQs).length === 0 && searchQuery && (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any FAQs matching "{searchQuery}". Try different keywords or browse by category.
                </p>
                <Button onClick={() => setSearchQuery("")} variant="outline">
                  Clear search
                </Button>
              </CardContent>
            </Card>
          )}

          <Separator className="my-16" />

          {/* Contact Section */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
                <p className="text-lg text-primary-foreground/90">
                  Can't find what you're looking for? Our support team is here to help you 24/7.
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
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default FAQs;
