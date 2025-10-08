import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Users, 
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
  Building2,
  MessageSquare
} from "lucide-react";
import PageLayout from "@/components/PageLayout";

const PrivacyPolicy = () => {
  const lastUpdated = "January 15, 2024";

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <Info className="h-5 w-5" />,
      content: `Meghdoot Textiles Private Limited ("we," "our," or "us") is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.

      By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this Privacy Policy, please do not access our website or use our services.`
    },
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: <Database className="h-5 w-5" />,
      content: `We collect information you provide directly to us and information we obtain automatically when you use our services.

      **Personal Information:**
      - Name, email address, phone number
      - Business name, GST number, address
      - Payment and billing information
      - Communication preferences

      **Automatically Collected Information:**
      - IP address and device information
      - Browser type and version
      - Pages visited and time spent on our website
      - Referring website information
      - Cookies and similar tracking technologies`
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      icon: <Eye className="h-5 w-5" />,
      content: `We use the information we collect for various business purposes, including:

      **Service Provision:**
      - Processing and fulfilling your orders
      - Providing customer support
      - Managing your trade account
      - Sending order confirmations and updates

      **Communication:**
      - Responding to your inquiries
      - Sending marketing communications (with your consent)
      - Providing important service updates
      - Customer satisfaction surveys

      **Business Operations:**
      - Improving our products and services
      - Analyzing website usage and trends
      - Preventing fraud and ensuring security
      - Complying with legal obligations`
    },
    {
      id: "information-sharing",
      title: "Information Sharing and Disclosure",
      icon: <Users className="h-5 w-5" />,
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:

      **Service Providers:**
      - Payment processors for transaction processing
      - Shipping companies for order delivery
      - IT service providers for website maintenance
      - Marketing agencies for promotional activities

      **Legal Requirements:**
      - When required by law or legal process
      - To protect our rights and property
      - To prevent fraud or illegal activities
      - In case of business transfers or mergers

      **Business Partners:**
      - Only with your explicit consent
      - For joint marketing activities
      - To provide enhanced services`
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <Lock className="h-5 w-5" />,
      content: `We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

      **Security Measures:**
      - SSL encryption for data transmission
      - Secure servers and databases
      - Regular security audits and updates
      - Access controls and authentication
      - Employee training on data protection

      **Data Retention:**
      - We retain your information only as long as necessary
      - Legal requirements may require longer retention
      - You can request deletion of your data
      - Anonymized data may be retained for analytics`
    },
    {
      id: "your-rights",
      title: "Your Rights and Choices",
      icon: <CheckCircle className="h-5 w-5" />,
      content: `You have certain rights regarding your personal information:

      **Access and Portability:**
      - Request access to your personal data
      - Receive a copy of your data in a portable format
      - Update or correct your information

      **Control and Deletion:**
      - Opt-out of marketing communications
      - Request deletion of your account
      - Restrict processing of your data
      - Object to certain uses of your data

      **Communication Preferences:**
      - Update your contact preferences
      - Unsubscribe from marketing emails
      - Choose communication channels
      - Set notification preferences`
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      icon: <FileText className="h-5 w-5" />,
      content: `We use cookies and similar technologies to enhance your browsing experience and analyze website usage.

      **Types of Cookies:**
      - Essential cookies for website functionality
      - Analytics cookies for usage statistics
      - Marketing cookies for personalized content
      - Preference cookies for user settings

      **Cookie Management:**
      - You can control cookies through browser settings
      - Disabling cookies may affect website functionality
      - We provide cookie consent options
      - Third-party cookies are subject to their own policies`
    },
    {
      id: "third-party",
      title: "Third-Party Services",
      icon: <Building2 className="h-5 w-5" />,
      content: `Our website may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these external sites.

      **Third-Party Integrations:**
      - Payment gateways (Razorpay, PayPal)
      - Social media platforms
      - Analytics services (Google Analytics)
      - Marketing tools and platforms

      **External Links:**
      - We encourage you to review third-party privacy policies
      - We do not control third-party data practices
      - Your interactions with third parties are governed by their policies`
    },
    {
      id: "children-privacy",
      title: "Children's Privacy",
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.

      **Protection Measures:**
      - We do not target children in our marketing
      - We do not knowingly collect data from children
      - If we discover we have collected data from a child, we will delete it
      - Parents can contact us to review or delete their child's data`
    },
    {
      id: "international-transfers",
      title: "International Data Transfers",
      icon: <MapPin className="h-5 w-5" />,
      content: `Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place.

      **Transfer Safeguards:**
      - Adequacy decisions by relevant authorities
      - Standard contractual clauses
      - Binding corporate rules
      - Certification schemes and codes of conduct`
    },
    {
      id: "changes",
      title: "Changes to This Privacy Policy",
      icon: <Calendar className="h-5 w-5" />,
      content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.

      **Notification Methods:**
      - Email notification for significant changes
      - Website banner for important updates
      - In-app notifications where applicable
      - Continued use constitutes acceptance of changes`
    }
  ];

  const contactInfo = {
    email: "privacy@meghdoottextiles.com",
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
                  <Shield className="h-12 w-12" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Last Updated: {lastUpdated}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  GDPR Compliant
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Lock className="h-4 w-4 mr-2" />
                  Secure & Protected
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
                <CardDescription>Quick navigation to different sections of this privacy policy</CardDescription>
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

            {/* Privacy Policy Sections */}
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
                  <h2 className="text-2xl font-bold mb-4">Questions About This Privacy Policy?</h2>
                  <p className="text-lg text-primary-foreground/90">
                    If you have any questions about this Privacy Policy or our data practices, please contact us.
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
                    Contact Privacy Team
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

export default PrivacyPolicy;
