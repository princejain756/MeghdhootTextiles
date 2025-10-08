import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Scale, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Info,
  Calendar,
  Building2,
  Users,
  CreditCard,
  Package,
  Truck,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Gavel,
  Lock
} from "lucide-react";
import PageLayout from "@/components/PageLayout";

const TermsConditions = () => {
  const lastUpdated = "January 15, 2024";
  const effectiveDate = "January 15, 2024";

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <CheckCircle className="h-5 w-5" />,
      content: `By accessing and using the Meghdoot Textiles website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.

      These Terms and Conditions ("Terms") govern your use of our website, products, and services. Your continued use of our services constitutes acceptance of these terms.`
    },
    {
      id: "definitions",
      title: "Definitions",
      icon: <Info className="h-5 w-5" />,
      content: `**Company:** Meghdoot Textiles Private Limited, a company incorporated under the Companies Act, 2013.

      **Services:** All products, services, and content provided through our website and business operations.

      **User/Customer:** Any individual or entity that accesses or uses our services.

      **Website:** The online platform accessible at meghdoottextiles.com and related domains.

      **Products:** All textile products, including but not limited to sarees, lehengas, kurtis, and other ethnic wear items.

      **Trade Account:** A business account for wholesale customers with special pricing and terms.`
    },
    {
      id: "use-of-services",
      title: "Use of Services",
      icon: <Shield className="h-5 w-5" />,
      content: `**Permitted Use:**
      - Browse and view our product catalog
      - Create and manage your account
      - Place orders for products
      - Access trade-specific features (for trade account holders)
      - Contact our customer support team

      **Prohibited Activities:**
      - Use our services for any unlawful purpose
      - Attempt to gain unauthorized access to our systems
      - Interfere with the proper functioning of our website
      - Copy, modify, or distribute our content without permission
      - Use automated systems to access our services
      - Engage in any activity that could harm our business or reputation`
    },
    {
      id: "account-registration",
      title: "Account Registration",
      icon: <Users className="h-5 w-5" />,
      content: `**Account Creation:**
      - You must provide accurate and complete information
      - You are responsible for maintaining account security
      - One account per person or business entity
      - You must be at least 18 years old to create an account

      **Account Responsibilities:**
      - Keep your login credentials confidential
      - Notify us immediately of any unauthorized access
      - Update your information when it changes
      - Comply with all applicable laws and regulations

      **Account Suspension:**
      - We reserve the right to suspend accounts for violations
      - Suspended accounts may lose access to certain features
      - We will provide notice before account suspension when possible`
    },
    {
      id: "products-pricing",
      title: "Products and Pricing",
      icon: <Package className="h-5 w-5" />,
      content: `**Product Information:**
      - Product descriptions and images are for reference only
      - Actual products may vary slightly from images
      - We reserve the right to modify product specifications
      - Colors may appear different due to monitor settings

      **Pricing:**
      - All prices are in Indian Rupees (INR) unless specified
      - Prices are subject to change without notice
      - Trade account holders may receive special pricing
      - Additional charges may apply for customization or rush orders

      **Availability:**
      - Products are subject to availability
      - We may discontinue products without notice
      - Out-of-stock items will be clearly marked
      - We will notify you if ordered items become unavailable`
    },
    {
      id: "orders-payment",
      title: "Orders and Payment",
      icon: <CreditCard className="h-5 w-5" />,
      content: `**Order Process:**
      - Orders are subject to acceptance by us
      - We reserve the right to refuse any order
      - Order confirmation will be sent via email
      - Changes to orders may not be possible after processing

      **Payment Terms:**
      - Payment must be made in full before order processing
      - We accept various payment methods as displayed
      - All payments are processed securely
      - Refunds will be processed according to our refund policy

      **Order Modifications:**
      - Changes must be requested within 24 hours of order placement
      - Modifications are subject to product availability
      - Additional charges may apply for changes
      - We cannot guarantee all modification requests can be accommodated`
    },
    {
      id: "shipping-delivery",
      title: "Shipping and Delivery",
      icon: <Truck className="h-5 w-5" />,
      content: `**Shipping Information:**
      - We ship to addresses within India
      - Shipping costs are calculated at checkout
      - Delivery times are estimates and not guaranteed
      - Risk of loss transfers to you upon delivery

      **Delivery Process:**
      - Orders are processed within 1-2 business days
      - Production time varies by product type
      - Tracking information will be provided when available
      - You are responsible for providing accurate delivery addresses

      **Delivery Issues:**
      - Contact us immediately if delivery issues occur
      - We will work with shipping partners to resolve problems
      - Damaged packages must be reported within 48 hours
      - We are not responsible for delays caused by shipping partners`
    },
    {
      id: "returns-refunds",
      title: "Returns and Refunds",
      icon: <Scale className="h-5 w-5" />,
      content: `**Return Policy:**
      - Returns must be initiated within 7 days of delivery
      - Products must be in original condition with tags
      - Custom or personalized items cannot be returned
      - Return shipping costs are the customer's responsibility

      **Refund Process:**
      - Refunds will be processed within 5-7 business days
      - Refunds will be issued to the original payment method
      - Processing fees may be deducted from refunds
      - We reserve the right to refuse returns that don't meet criteria

      **Quality Issues:**
      - Report quality issues immediately upon receipt
      - We will investigate and resolve legitimate claims
      - Replacement or refund will be provided for defective products
      - Photos may be required to process quality claims`
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: <Lock className="h-5 w-5" />,
      content: `**Ownership:**
      - All content on our website is owned by Meghdoot Textiles
      - This includes text, images, logos, and design elements
      - Our products and designs are protected by intellectual property laws
      - Unauthorized use is strictly prohibited

      **User Content:**
      - You retain ownership of content you submit to us
      - By submitting content, you grant us a license to use it
      - We may use your content for marketing and promotional purposes
      - You are responsible for ensuring you have rights to submitted content

      **Trademarks:**
      - "Meghdoot Textiles" and related marks are our trademarks
      - Use of our trademarks without permission is prohibited
      - Other trademarks belong to their respective owners`
    },
    {
      id: "privacy-data",
      title: "Privacy and Data Protection",
      icon: <Shield className="h-5 w-5" />,
      content: `**Data Collection:**
      - We collect information as described in our Privacy Policy
      - Your privacy is important to us
      - We implement appropriate security measures
      - Data is used only for legitimate business purposes

      **Data Usage:**
      - Personal information is used to provide our services
      - We may use data for marketing with your consent
      - Data may be shared with service providers as needed
      - We comply with applicable data protection laws

      **Your Rights:**
      - You have rights regarding your personal data
      - You can request access, correction, or deletion
      - You can opt-out of marketing communications
      - Contact us to exercise your data rights`
    },
    {
      id: "limitation-liability",
      title: "Limitation of Liability",
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `**Disclaimer:**
      - Our services are provided "as is" without warranties
      - We disclaim all warranties, express or implied
      - We do not guarantee uninterrupted or error-free service
      - Product information is provided for reference only

      **Limitation:**
      - Our liability is limited to the amount you paid for services
      - We are not liable for indirect or consequential damages
      - We are not responsible for third-party actions
      - Some jurisdictions may not allow liability limitations

      **Indemnification:**
      - You agree to indemnify us against certain claims
      - This includes claims arising from your use of our services
      - You are responsible for your actions and content
      - We reserve the right to defend ourselves against claims`
    },
    {
      id: "governing-law",
      title: "Governing Law and Disputes",
      icon: <Gavel className="h-5 w-5" />,
      content: `**Governing Law:**
      - These terms are governed by Indian law
      - Any disputes will be subject to Indian jurisdiction
      - We are based in Gujarat, India
      - Local laws may apply to your location

      **Dispute Resolution:**
      - We encourage resolving disputes through communication
      - Formal disputes should be addressed through proper channels
      - Arbitration may be required for certain disputes
      - We will work in good faith to resolve issues

      **Jurisdiction:**
      - Courts in Surat, Gujarat will have jurisdiction
      - You consent to the jurisdiction of these courts
      - We may seek injunctive relief in any court of competent jurisdiction`
    },
    {
      id: "modifications",
      title: "Modifications to Terms",
      icon: <Calendar className="h-5 w-5" />,
      content: `**Right to Modify:**
      - We may modify these terms at any time
      - Changes will be posted on our website
      - Continued use constitutes acceptance of changes
      - We will notify users of significant changes

      **Notification:**
      - Email notifications for major changes
      - Website banners for important updates
      - In-app notifications where applicable
      - Check our website regularly for updates

      **Effective Date:**
      - Changes become effective immediately upon posting
      - Previous versions remain available for reference
      - Your continued use indicates acceptance
      - Contact us if you disagree with changes`
    },
    {
      id: "termination",
      title: "Termination",
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `**Termination by You:**
      - You may terminate your account at any time
      - Contact us to close your account
      - Outstanding orders will be processed
      - Some data may be retained for legal compliance

      **Termination by Us:**
      - We may terminate accounts for violations
      - We may suspend services for maintenance
      - We reserve the right to discontinue services
      - We will provide reasonable notice when possible

      **Effect of Termination:**
      - Access to services will cease
      - Outstanding obligations remain in effect
      - Data retention policies apply
      - Certain provisions survive termination`
    }
  ];

  const contactInfo = {
    email: "legal@meghdoottextiles.com",
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
                  <FileText className="h-12 w-12" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Terms & Conditions
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Please read these terms carefully before using our services. By using our website and services, you agree to be bound by these terms.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Effective: {effectiveDate}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Updated: {lastUpdated}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Scale className="h-4 w-4 mr-2" />
                  Legally Binding
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Table of Contents */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Table of Contents</CardTitle>
                <CardDescription>Quick navigation to different sections of these terms and conditions</CardDescription>
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

            {/* Terms and Conditions Sections */}
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
                  <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
                  <p className="text-lg text-primary-foreground/90">
                    If you have any questions about these Terms and Conditions, please contact our legal team.
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
                    Contact Legal Team
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

export default TermsConditions;
