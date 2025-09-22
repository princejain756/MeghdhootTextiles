import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  RotateCcw, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Calendar,
  Package,
  Shield,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Truck,
  Users,
  Star,
  Award
} from "lucide-react";
import PageLayout from "@/components/PageLayout";

const RefundPolicy = () => {
  const lastUpdated = "January 15, 2024";

  const sections = [
    {
      id: "overview",
      title: "Refund Policy Overview",
      icon: <Info className="h-5 w-5" />,
      content: `At MeghDoot Textiles, we strive to ensure your complete satisfaction with every purchase. This Refund Policy outlines the terms and conditions under which refunds, exchanges, and returns are processed.

      We understand that sometimes products may not meet your expectations, and we are committed to resolving any issues promptly and fairly. Please read this policy carefully before making a purchase.`
    },
    {
      id: "eligibility",
      title: "Refund Eligibility",
      icon: <CheckCircle className="h-5 w-5" />,
      content: `**Eligible for Refund:**
      - Products received in damaged condition
      - Products that differ significantly from the description
      - Manufacturing defects or quality issues
      - Wrong products sent due to our error
      - Products not delivered within promised timeframe

      **Not Eligible for Refund:**
      - Custom or personalized items
      - Products damaged due to customer negligence
      - Items returned after the return period
      - Products without original tags and packaging
      - Items that have been worn or used
      - Products returned without proper documentation

      **Return Period:**
      - Standard returns: 7 days from delivery date
      - Quality issues: 15 days from delivery date
      - Damaged products: 48 hours from delivery date`
    },
    {
      id: "return-process",
      title: "Return Process",
      icon: <RotateCcw className="h-5 w-5" />,
      content: `**Step 1: Contact Us**
      - Email us at returns@meghdoottextiles.com
      - Call us at +91 93425 03401
      - Provide your order number and reason for return
      - Include photos if reporting damage or defects

      **Step 2: Return Authorization**
      - We will review your request within 24 hours
      - Approved returns will receive a Return Authorization Number (RAN)
      - We will provide detailed return instructions
      - Keep the RAN for tracking purposes

      **Step 3: Package and Ship**
      - Pack items in original packaging with tags
      - Include the RAN and return form
      - Ship to the address provided by us
      - Use a trackable shipping method
      - Keep shipping receipt for reference

      **Step 4: Inspection and Processing**
      - We inspect returned items within 3-5 business days
      - Refund will be processed if items meet return criteria
      - You will receive email confirmation of refund status
      - Refunds are processed within 5-7 business days`
    },
    {
      id: "refund-methods",
      title: "Refund Methods",
      icon: <CreditCard className="h-5 w-5" />,
      content: `**Original Payment Method:**
      - Refunds are processed to the original payment method
      - Credit card refunds: 5-7 business days
      - Bank transfer refunds: 7-10 business days
      - UPI refunds: 2-3 business days

      **Store Credit:**
      - Available for eligible returns
      - Valid for 12 months from issue date
      - Can be used for future purchases
      - Non-transferable and non-refundable

      **Exchange Policy:**
      - Exchanges available for size/color changes
      - Subject to product availability
      - Price difference may apply
      - Original return policy applies to exchanged items

      **Processing Time:**
      - Standard processing: 5-7 business days
      - Rush processing: 2-3 business days (additional fee)
      - International refunds: 10-15 business days`
    },
    {
      id: "quality-issues",
      title: "Quality Issues and Defects",
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `**Quality Assurance:**
      - All products undergo quality checks before dispatch
      - We maintain high standards for materials and workmanship
      - Quality issues are rare but handled with priority

      **Reporting Quality Issues:**
      - Report immediately upon receiving the product
      - Provide clear photos of the defect
      - Include detailed description of the issue
      - Keep original packaging and tags

      **Resolution Process:**
      - Quality team reviews within 24 hours
      - We may request additional photos or information
      - Resolution options: full refund, replacement, or repair
      - We cover all costs for quality-related returns

      **Common Quality Issues:**
      - Stitching defects or loose threads
      - Color bleeding or fading
      - Fabric defects or holes
      - Size discrepancies from specifications
      - Missing or damaged embellishments`
    },
    {
      id: "shipping-returns",
      title: "Shipping and Return Costs",
      icon: <Truck className="h-5 w-5" />,
      content: `**Return Shipping Costs:**
      - Customer's responsibility for standard returns
      - We provide prepaid return labels for quality issues
      - Damaged product returns: we cover shipping costs
      - Wrong product returns: we cover shipping costs

      **Return Shipping Methods:**
      - Use trackable shipping methods only
      - Recommended: India Post, Blue Dart, Delhivery
      - Keep shipping receipt and tracking number
      - Insurance recommended for valuable items

      **International Returns:**
      - Subject to customs and import regulations
      - Customer responsible for return shipping
      - Refund amount may be reduced by return shipping costs
      - Processing time may be extended

      **Lost Returns:**
      - We are not responsible for lost return packages
      - Use trackable shipping methods
      - Contact us if return is not received within 10 days
      - We may request proof of shipping`
    },
    {
      id: "special-circumstances",
      title: "Special Circumstances",
      icon: <Shield className="h-5 w-5" />,
      content: `**Bulk Orders:**
      - Different return policies may apply
      - Contact us before placing bulk orders
      - Custom terms may be negotiated
      - Quality standards remain the same

      **Trade Account Returns:**
      - Extended return period for trade customers
      - Special handling for large quantity returns
      - Dedicated support for trade returns
      - Custom return arrangements available

      **Seasonal Products:**
      - Festival and seasonal items have shorter return periods
      - Check product page for specific return terms
      - Some seasonal items may be non-returnable
      - Clear communication of return deadlines

      **Custom Orders:**
      - Custom items are generally non-returnable
      - Exceptions for manufacturing defects
      - Customization errors on our part are covered
      - Discuss return options before ordering`
    },
    {
      id: "refund-timeline",
      title: "Refund Timeline",
      icon: <Clock className="h-5 w-5" />,
      content: `**Processing Timeline:**
      - Return request review: 24 hours
      - Return authorization: 24-48 hours
      - Return shipping: 3-7 days (depending on location)
      - Inspection and processing: 3-5 business days
      - Refund processing: 5-7 business days

      **Total Timeline:**
      - Standard returns: 10-15 business days
      - Express processing: 5-8 business days
      - International returns: 15-20 business days

      **Tracking Your Refund:**
      - Email notifications at each step
      - Check your account for refund status
      - Contact us if refund is delayed
      - We provide tracking information when available

      **Delayed Refunds:**
      - Contact us if refund is delayed beyond timeline
      - We will investigate and provide updates
      - Additional processing may be required
      - We will expedite delayed refunds when possible`
    },
    {
      id: "exceptions",
      title: "Policy Exceptions",
      icon: <FileText className="h-5 w-5" />,
      content: `**Discretionary Refunds:**
      - We may provide refunds outside normal policy
      - Case-by-case evaluation for special circumstances
      - Customer satisfaction is our priority
      - Contact us to discuss your situation

      **Force Majeure:**
      - Natural disasters or unforeseen circumstances
      - Government regulations or restrictions
      - Supply chain disruptions
      - We will work with customers during such events

      **Fraud Prevention:**
      - We reserve the right to investigate suspicious returns
      - May request additional documentation
      - Refunds may be delayed during investigation
      - We protect against return fraud

      **Policy Updates:**
      - We may update this policy from time to time
      - Changes will be posted on our website
      - Existing orders are subject to policy at time of purchase
      - We will notify customers of significant changes`
    },
    {
      id: "contact-support",
      title: "Contact and Support",
      icon: <Users className="h-5 w-5" />,
      content: `**Return Support Team:**
      - Dedicated team for return and refund queries
      - Available Monday to Saturday, 9 AM to 6 PM
      - Quick response to return-related questions
      - Assistance with return process

      **Contact Methods:**
      - Email: returns@meghdoottextiles.com
      - Phone: +91 93425 03401
      - WhatsApp: +91 93425 03401
      - Live chat on our website

      **Information to Provide:**
      - Order number and date
      - Product details and issue description
      - Photos of the product (if applicable)
      - Preferred resolution method

      **Response Time:**
      - Email queries: within 24 hours
      - Phone calls: immediate during business hours
      - WhatsApp: within 2 hours during business hours
      - Live chat: immediate response`
    }
  ];

  const contactInfo = {
    email: "returns@meghdoottextiles.com",
    phone: "+91 93425 03401",
    address: "Kamela Darwaja, Umarwada, Ring Road, Surat – 395002, Gujarat, India"
  };

  const returnSteps = [
    {
      step: 1,
      title: "Contact Us",
      description: "Email or call us with your order details and reason for return"
    },
    {
      step: 2,
      title: "Get Authorization",
      description: "Receive Return Authorization Number and instructions"
    },
    {
      step: 3,
      title: "Package & Ship",
      description: "Pack items properly and ship to our return address"
    },
    {
      step: 4,
      title: "Receive Refund",
      description: "Get your refund processed within 5-7 business days"
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
                  <RotateCcw className="h-12 w-12" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Refund Policy
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Your satisfaction is our priority. Learn about our fair and transparent refund and return process.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Clock className="h-4 w-4 mr-2" />
                  7 Day Returns
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  Quality Assured
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Easy Process
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Return Process Steps */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Simple Return Process</CardTitle>
                <CardDescription>Follow these easy steps to return your order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {returnSteps.map((step, index) => (
                    <div key={index} className="text-center">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                        {step.step}
                      </div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Table of Contents */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Policy Sections</CardTitle>
                <CardDescription>Navigate through different sections of our refund policy</CardDescription>
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

            {/* Refund Policy Sections */}
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
                  <h2 className="text-2xl font-bold mb-4">Need Help with Returns?</h2>
                  <p className="text-lg text-primary-foreground/90">
                    Our dedicated return support team is here to help you with any questions or issues.
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
                    Start Return Process
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

export default RefundPolicy;
