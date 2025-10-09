import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Users,
  Star,
  Award,
  Shield,
  CheckCircle,
  Info,
  Send,
  Building2,
  Calendar,
  Globe,
  MessageCircle
} from "lucide-react";
import PageLayout from "@/components/PageLayout";

const Contact = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
    preferredContact: ""
  });

  // Handle URL parameters for pre-filling form
  useEffect(() => {
    const category = searchParams.get('category');
    const subject = searchParams.get('subject');
    
    if (category || subject) {
      setFormData(prev => ({
        ...prev,
        category: category || prev.category,
        subject: subject || prev.subject,
        message: category === 'samples' 
          ? "I would like to request samples of your latest collection. Please provide details about availability, pricing, and shipping options."
          : prev.message
      }));
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Handle form submission
  };

  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Speak directly with our team",
      contact: "+91 93425 03401",
      availability: "Mon-Sat, 9 AM - 6 PM",
      color: "text-green-600"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "WhatsApp",
      description: "Quick responses via WhatsApp",
      contact: "+91 93425 03401",
      availability: "24/7 Support",
      color: "text-green-600"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Detailed queries via email",
      contact: "info@meghdoottextiles.com",
      availability: "Response within 24 hours",
      color: "text-blue-600"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Our Showroom",
      description: "Meet us in person",
      contact: "Surat, Gujarat",
      availability: "Mon-Sat, 9 AM - 6 PM",
      color: "text-purple-600"
    }
  ];

  const departments = [
    {
      name: "General Inquiries",
      email: "info@meghdoottextiles.com",
      phone: "+91 93425 03401",
      description: "General questions about our products and services"
    },
    {
      name: "Trade Account Support",
      email: "trade@meghdoottextiles.com",
      phone: "+91 93425 03401",
      description: "Support for trade account holders and bulk orders"
    },
    {
      name: "Customer Service",
      email: "support@meghdoottextiles.com",
      phone: "+91 93425 03401",
      description: "Order support, returns, and customer service"
    },
    {
      name: "Technical Support",
      email: "tech@meghdoottextiles.com",
      phone: "+91 93425 03401",
      description: "Website issues and technical assistance"
    }
  ];

  const officeLocations = [
    {
      name: "Main Operations Center",
      address: "Kamela Darwaja, Umarwada, Ring Road\n(Opp. Millennium Textile Market Back Gate)\nSurat – 395002, Gujarat, India",
      phone: "+91 93425 03401",
      email: "info@meghdoottextiles.com",
      hours: "Mon-Sat: 9:00 AM - 6:00 PM",
      features: ["Showroom", "Warehouse", "Design Studio", "Customer Service"]
    },
    {
      name: "Bengaluru Sales Store",
      address: "No.82, J M Road, Avenue Road cross\nBangalore - 560002",
      phone: "+91 93425 03401",
      email: "info@meghdoottextiles.com",
      hours: "Mon-Fri: 10:00 AM - 5:00 PM",
      features: ["Sales Office", "Sample Room", "Customer Service"]
    },
    {
      name: "Kolkata Sales Store",
      address: "6th Floor, 95B, Park Street\nOpp : Deputy Commissioner Office\nKolkata, West Bengal 700016",
      phone: "+91 93425 03401",
      email: "info@meghdoottextiles.com",
      hours: "Mon-Fri: 10:00 AM - 5:00 PM",
      features: ["Sales Office", "Sample Room"]
    }
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
    { day: "Public Holidays", hours: "Closed" }
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
                  <MessageSquare className="h-12 w-12" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Contact Us
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Get in touch with our team for any questions, support, or business inquiries. We're here to help!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Clock className="h-4 w-4 mr-2" />
                  24/7 Support
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Users className="h-4 w-4 mr-2" />
                  Expert Team
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  Trusted Service
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* Contact Methods */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose your preferred way to contact us. We're available through multiple channels for your convenience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`${method.color} mb-4 flex justify-center`}>
                      {method.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                    <p className="font-medium text-sm mb-1">{method.contact}</p>
                    <p className="text-xs text-muted-foreground">{method.availability}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="trade">Trade Account</SelectItem>
                            <SelectItem value="support">Customer Support</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="samples">Sample Request</SelectItem>
                            <SelectItem value="bulk">Bulk Order</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="Brief subject of your inquiry"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                      <Select value={formData.preferredContact} onValueChange={(value) => handleInputChange("preferredContact", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="How would you like us to respond?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone Call</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="any">Any method is fine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Please provide details about your inquiry..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Office Locations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Our Offices
                  </CardTitle>
                  <CardDescription>
                    Visit us at any of our locations across India
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {officeLocations.map((office, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold mb-2">{office.name}</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                          <span className="whitespace-pre-line">{office.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 shrink-0" />
                          <span>{office.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 shrink-0" />
                          <span>{office.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 shrink-0" />
                          <span>{office.hours}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {office.features.map((feature, featureIndex) => (
                            <Badge key={featureIndex} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {businessHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="font-medium">{schedule.day}</span>
                        <span className="text-muted-foreground">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Departments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Department Contacts
                  </CardTitle>
                  <CardDescription>
                    Reach out to specific departments for specialized support
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {departments.map((dept, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{dept.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{dept.description}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <span>{dept.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-green-600" />
                          <span>{dept.phone}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-16" />

          {/* Quick Actions */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                <p className="text-lg text-primary-foreground/90">
                  Need immediate assistance? Use these quick contact options
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90 h-auto p-6">
                  <div className="text-center">
                    <MessageCircle className="h-8 w-8 mx-auto mb-3" />
                    <div className="font-semibold">WhatsApp</div>
                    <div className="text-sm opacity-80">Instant Support</div>
                  </div>
                </Button>
                
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90 h-auto p-6">
                  <div className="text-center">
                    <Phone className="h-8 w-8 mx-auto mb-3" />
                    <div className="font-semibold">Call Now</div>
                    <div className="text-sm opacity-80">+91 93425 03401</div>
                  </div>
                </Button>
                
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90 h-auto p-6">
                  <div className="text-center">
                    <Mail className="h-8 w-8 mx-auto mb-3" />
                    <div className="font-semibold">Email Us</div>
                    <div className="text-sm opacity-80">info@meghdoottextiles.com</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
