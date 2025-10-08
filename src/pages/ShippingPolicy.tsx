import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Truck, 
  Package, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Calendar,
  Shield,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  Users,
  Star,
  Award,
  Zap,
  Globe,
  CreditCard,
  Building2
} from "lucide-react";
import PageLayout from "@/components/PageLayout";

const ShippingPolicy = () => {
  const lastUpdated = "January 15, 2024";

  const sections = [
    {
      id: "overview",
      title: "Shipping Policy Overview",
      icon: <Info className="h-5 w-5" />,
      content: `At Meghdoot Textiles, we are committed to delivering your orders safely and on time. This Shipping Policy outlines our delivery processes, timelines, and terms to ensure a smooth shopping experience.

      We partner with reliable shipping carriers to ensure your orders reach you in perfect condition. Our team carefully packages each item to protect it during transit.`
    },
    {
      id: "shipping-areas",
      title: "Shipping Areas and Coverage",
      icon: <Globe className="h-5 w-5" />,
      content: `**Domestic Shipping:**
      - We ship to all states and union territories in India
      - Free shipping on orders above ₹5,000
      - Standard shipping charges apply for orders below ₹5,000
      - Remote areas may have additional delivery time

      **Serviceable Areas:**
      - All major cities and towns
      - Tier 1, 2, and 3 cities
      - Rural areas with postal service
      - Some remote locations may have restrictions

      **International Shipping:**
      - Currently not available
      - Planning to launch international shipping soon
      - Contact us for special international requests
      - Customs and duties will apply for international orders

      **Restricted Areas:**
      - Areas with security restrictions
      - Locations without postal service
      - Some remote islands and territories
      - Contact us to check serviceability`
    },
    {
      id: "shipping-methods",
      title: "Shipping Methods and Carriers",
      icon: <Truck className="h-5 w-5" />,
      content: `**Standard Shipping:**
      - Delivery time: 3-7 business days
      - Carriers: India Post, Blue Dart, Delhivery
      - Tracking available for all shipments
      - Safe and secure packaging

      **Express Shipping:**
      - Delivery time: 1-3 business days
      - Carriers: Blue Dart, Delhivery Express
      - Additional charges apply
      - Priority handling and delivery

      **Same Day Delivery:**
      - Available in select cities
      - Orders placed before 12 PM
      - Additional charges apply
      - Subject to product availability

      **Cash on Delivery (COD):**
      - Available for orders up to ₹10,000
      - Additional COD charges apply
      - Valid ID required for delivery
      - Payment in cash only`
    },
    {
      id: "processing-times",
      title: "Order Processing Times",
      icon: <Clock className="h-5 w-5" />,
      content: `**Order Processing:**
      - Orders placed before 2 PM: Same day processing
      - Orders placed after 2 PM: Next business day processing
      - Weekend orders: Processed on Monday
      - Holiday orders: Processed on next business day

      **Production Time:**
      - Ready-to-ship items: 1-2 business days
      - Custom orders: 5-10 business days
      - Bulk orders: 7-15 business days
      - Seasonal items: May take longer during peak season

      **Packaging Time:**
      - Quality check: 4-6 hours
      - Packaging: 2-4 hours
      - Labeling and dispatch: 1-2 hours
      - Total processing: 1-2 business days

      **Dispatch Schedule:**
      - Monday to Friday: Daily dispatch
      - Saturday: Limited dispatch
      - Sunday: No dispatch
      - Holidays: No dispatch`
    },
    {
      id: "shipping-costs",
      title: "Shipping Costs and Charges",
      icon: <CreditCard className="h-5 w-5" />,
      content: `**Free Shipping:**
      - Orders above ₹5,000: Free standard shipping
      - Applies to all domestic locations
      - Express shipping charges still apply
      - COD charges still apply

      **Standard Shipping Charges:**
      - Orders below ₹5,000: ₹150
      - Orders ₹5,000-₹10,000: ₹100
      - Orders above ₹10,000: Free
      - Remote areas: Additional ₹50

      **Express Shipping Charges:**
      - Additional ₹200 for express delivery
      - Available for orders above ₹2,000
      - 1-3 business days delivery
      - Tracking included

      **COD Charges:**
      - ₹50 for orders up to ₹5,000
      - ₹100 for orders ₹5,000-₹10,000
      - Not available for orders above ₹10,000
      - Additional to shipping charges

      **Special Charges:**
      - Oversized items: Additional ₹200
      - Fragile items: Additional ₹100
      - Insurance: ₹50 (optional)
      - Signature confirmation: ₹25`
    },
    {
      id: "tracking-delivery",
      title: "Order Tracking and Delivery",
      icon: <Package className="h-5 w-5" />,
      content: `**Tracking Information:**
      - Tracking number provided via email and SMS
      - Real-time tracking on carrier websites
      - Delivery updates via SMS
      - Estimated delivery date provided

      **Delivery Process:**
      - Delivery attempts: Up to 3 attempts
      - Delivery time: 9 AM to 8 PM
      - Weekend delivery available in select areas
      - Contact delivery person for specific timing

      **Delivery Requirements:**
      - Valid ID required for delivery
      - Someone must be available to receive
      - Authorized person can receive on your behalf
      - Delivery address must be complete and accurate

      **Failed Delivery:**
      - Package returned to nearest hub
      - Contact us to reschedule delivery
      - Additional delivery charges may apply
      - Package held for 7 days maximum`
    },
    {
      id: "packaging-handling",
      title: "Packaging and Handling",
      icon: <Shield className="h-5 w-5" />,
      content: `**Packaging Standards:**
      - Waterproof and tear-resistant packaging
      - Bubble wrap for delicate items
      - Cardboard boxes for protection
      - Sealed with tamper-evident tape

      **Special Handling:**
      - Silk items: Special silk packaging
      - Embroidered items: Extra protection
      - Heavy items: Reinforced packaging
      - Fragile items: Fragile stickers

      **Quality Assurance:**
      - Each item inspected before packaging
      - Quality check at multiple stages
      - Photographs taken for high-value items
      - Insurance available for valuable orders

      **Eco-Friendly Packaging:**
      - Recyclable materials used
      - Minimal plastic usage
      - Biodegradable packing materials
      - Reusable packaging where possible`
    },
    {
      id: "delivery-issues",
      title: "Delivery Issues and Resolution",
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `**Common Delivery Issues:**
      - Delayed delivery due to weather
      - Incorrect address provided
      - Recipient not available
      - Package damaged in transit

      **Resolution Process:**
      - Contact us immediately with order number
      - We will investigate the issue
      - Work with shipping partner for resolution
      - Provide updates every 24 hours

      **Damaged Packages:**
      - Report within 48 hours of delivery
      - Take photographs of damage
      - Do not discard packaging materials
      - We will arrange replacement or refund

      **Lost Packages:**
      - Report within 7 days of expected delivery
      - We will file claim with shipping partner
      - Investigation may take 5-10 business days
      - Full refund or replacement provided

      **Wrong Address:**
      - Contact us immediately
      - We will attempt to redirect package
      - Additional charges may apply
      - Delivery may be delayed`
    },
    {
      id: "special-circumstances",
      title: "Special Circumstances",
      icon: <Building2 className="h-5 w-5" />,
      content: `**Bulk Orders:**
      - Special shipping arrangements
      - Dedicated logistics team
      - Custom delivery schedules
      - Volume discounts available

      **Trade Account Orders:**
      - Priority shipping for trade customers
      - Dedicated account manager
      - Custom delivery terms
      - Special packaging requirements

      **Seasonal Orders:**
      - Extended delivery times during festivals
      - Special handling for festival items
      - Additional charges may apply
      - Early ordering recommended

      **Corporate Orders:**
      - Special delivery arrangements
      - Bulk packaging options
      - Custom invoicing
      - Dedicated support team

      **Rush Orders:**
      - Same day processing available
      - Express delivery options
      - Additional charges apply
      - Subject to product availability`
    },
    {
      id: "holidays-restrictions",
      title: "Holidays and Restrictions",
      icon: <Calendar className="h-5 w-5" />,
      content: `**Holiday Schedule:**
      - No processing on national holidays
      - Limited service during festivals
      - Extended delivery times during peak season
      - Check our website for holiday updates

      **Peak Season:**
      - Diwali, Eid, Christmas periods
      - Extended processing times
      - Additional delivery charges may apply
      - Early ordering recommended

      **Weather Restrictions:**
      - Delivery may be delayed due to weather
      - Safety is our priority
      - We will notify customers of delays
      - Alternative arrangements made when possible

      **Security Restrictions:**
      - Some areas may have security restrictions
      - Delivery may be delayed or restricted
      - We will inform customers of limitations
      - Alternative delivery options explored`
    },
    {
      id: "international-shipping",
      title: "International Shipping (Coming Soon)",
      icon: <Globe className="h-5 w-5" />,
      content: `**Planned International Service:**
      - Shipping to major countries planned
      - Customs and duties will apply
      - International tracking available
      - Special packaging for international transit

      **Target Countries:**
      - United States and Canada
      - United Kingdom and Europe
      - Australia and New Zealand
      - Middle East and Southeast Asia

      **International Charges:**
      - Shipping charges based on weight and destination
      - Customs duties and taxes extra
      - Insurance recommended for valuable items
      - Delivery time: 7-21 business days

      **Customs Information:**
      - Accurate product descriptions provided
      - Commercial invoice included
      - Customs clearance assistance
      - Duties and taxes are customer's responsibility`
    },
    {
      id: "contact-support",
      title: "Shipping Support and Contact",
      icon: <Users className="h-5 w-5" />,
      content: `**Shipping Support Team:**
      - Dedicated team for shipping queries
      - Available Monday to Saturday, 9 AM to 6 PM
      - Quick response to shipping questions
      - Assistance with delivery issues

      **Contact Methods:**
      - Email: shipping@meghdoottextiles.com
      - Phone: +91 93425 03401
      - WhatsApp: +91 93425 03401
      - Live chat on our website

      **Information to Provide:**
      - Order number and date
      - Delivery address
      - Issue description
      - Preferred contact method

      **Response Time:**
      - Email queries: within 24 hours
      - Phone calls: immediate during business hours
      - WhatsApp: within 2 hours during business hours
      - Live chat: immediate response

      **Escalation Process:**
      - Level 1: Customer service representative
      - Level 2: Shipping supervisor
      - Level 3: Operations manager
      - Level 4: Customer experience head`
    }
  ];

  const contactInfo = {
    email: "shipping@meghdoottextiles.com",
    phone: "+91 93425 03401",
    address: "Kamela Darwaja, Umarwada, Ring Road, Surat – 395002, Gujarat, India"
  };

  const shippingMethods = [
    {
      method: "Standard Shipping",
      time: "3-7 days",
      cost: "₹150",
      features: ["Tracking", "Insurance", "Safe Packaging"]
    },
    {
      method: "Express Shipping",
      time: "1-3 days",
      cost: "₹350",
      features: ["Priority", "Tracking", "Insurance", "Fast Delivery"]
    },
    {
      method: "Same Day",
      time: "Same day",
      cost: "₹500",
      features: ["Immediate", "Limited Cities", "Before 12 PM"]
    },
    {
      method: "COD",
      time: "3-7 days",
      cost: "₹200",
      features: ["Cash Payment", "ID Required", "Up to ₹10K"]
    }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full">
                  <Truck className="h-12 w-12" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Shipping Policy
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Fast, reliable, and secure delivery across India. Learn about our shipping methods, timelines, and terms.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Truck className="h-4 w-4 mr-2" />
                  Pan-India Delivery
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  Safe Packaging
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Clock className="h-4 w-4 mr-2" />
                  Fast Delivery
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Shipping Methods */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Shipping Methods</CardTitle>
                <CardDescription>Choose the shipping method that best suits your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {shippingMethods.map((method, index) => (
                    <Card key={index} className="text-center">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{method.method}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary mb-2">{method.time}</div>
                        <div className="text-sm text-muted-foreground mb-4">Delivery Time</div>
                        <div className="text-xl font-bold text-accent mb-2">{method.cost}</div>
                        <div className="text-sm text-muted-foreground mb-4">Shipping Cost</div>
                        <ul className="space-y-1 text-sm">
                          {method.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Table of Contents */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Policy Sections</CardTitle>
                <CardDescription>Navigate through different sections of our shipping policy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {sections.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      {section.icon}
                      <span>{section.title}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Policy Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card key={section.id} id={section.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {section.icon}
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {section.content.split('\n').map((paragraph, pIndex) => {
                        if (paragraph.trim() === '') return null;
                        
                        // Handle bold text
                        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                          return (
                            <h4 key={pIndex} className="font-semibold text-base mb-2">
                              {paragraph.slice(2, -2)}
                            </h4>
                          );
                        }
                        
                        // Handle list items
                        if (paragraph.startsWith('- ')) {
                          return (
                            <li key={pIndex} className="ml-4 mb-1">
                              {paragraph.slice(2)}
                            </li>
                          );
                        }
                        
                        return (
                          <p key={pIndex} className="mb-4 leading-relaxed">
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator className="my-16" />

            {/* Contact Information */}
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-4">Need Help with Shipping?</h2>
                  <p className="text-lg text-primary-foreground/90">
                    Our shipping support team is here to help you with delivery questions and issues.
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
                    Contact Shipping Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ShippingPolicy;
