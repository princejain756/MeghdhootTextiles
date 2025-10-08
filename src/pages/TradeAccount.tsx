import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Shield, 
  CheckCircle,
  Star,
  Award,
  Truck,
  Clock,
  Users,
  TrendingUp
} from "lucide-react";
import PageLayout from "@/components/PageLayout";

const TradeAccount = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    businessType: "",
    annualTurnover: "",
    productInterest: "",
    experience: "",
    website: "",
    additionalInfo: "",
    termsAccepted: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Trade account form submitted:", formData);
  };

  const benefits = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Verified Trade Account",
      description: "Get verified status with priority customer support"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Wholesale Pricing",
      description: "Access exclusive trade prices and bulk discounts"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Priority Shipping",
      description: "Faster dispatch and delivery for trade customers"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Dedicated Support",
      description: "Personal account manager for your business needs"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Trade Catalogs",
      description: "Exclusive access to new collections and designs"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Early Access",
      description: "Be the first to see new arrivals and limited editions"
    }
  ];

  const requirements = [
    "Valid GST registration certificate",
    "Business registration documents",
    "Bank account details for payments",
    "Minimum order value: ₹10,000",
    "Valid business address in India"
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
                  <Building2 className="h-12 w-12" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Create Your Trade Account
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Join thousands of retailers, boutiques, and resellers who trust Meghdoot Textiles for their wholesale ethnic wear needs
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Award className="h-4 w-4 mr-2" />
                  25+ Years Experience
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Users className="h-4 w-4 mr-2" />
                  5000+ Trade Partners
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Star className="h-4 w-4 mr-2" />
                  4.8/5 Rating
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Benefits Section */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Trade Benefits
                  </CardTitle>
                  <CardDescription>
                    Exclusive advantages for verified trade partners
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="text-primary mt-1">
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{benefit.title}</h4>
                        <p className="text-xs text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-sm">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>
                    Please provide accurate business details for verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Business Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Business Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Business Name *</Label>
                          <Input
                            id="businessName"
                            value={formData.businessName}
                            onChange={(e) => handleInputChange("businessName", e.target.value)}
                            placeholder="Enter your business name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPerson">Contact Person *</Label>
                          <Input
                            id="contactPerson"
                            value={formData.contactPerson}
                            onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                            placeholder="Full name"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="business@example.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+91 98765 43210"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="gstNumber">GST Number *</Label>
                          <Input
                            id="gstNumber"
                            value={formData.gstNumber}
                            onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                            placeholder="24AACCM6639C1ZP"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessType">Business Type *</Label>
                          <Input
                            id="businessType"
                            value={formData.businessType}
                            onChange={(e) => handleInputChange("businessType", e.target.value)}
                            placeholder="Retailer, Wholesaler, etc."
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Address Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Business Address
                      </h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Complete business address"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            placeholder="City"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State *</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                            placeholder="State"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode *</Label>
                          <Input
                            id="pincode"
                            value={formData.pincode}
                            onChange={(e) => handleInputChange("pincode", e.target.value)}
                            placeholder="123456"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Business Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Additional Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="annualTurnover">Annual Turnover</Label>
                          <Input
                            id="annualTurnover"
                            value={formData.annualTurnover}
                            onChange={(e) => handleInputChange("annualTurnover", e.target.value)}
                            placeholder="₹10 Lakhs - ₹1 Crore"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">Years in Business</Label>
                          <Input
                            id="experience"
                            value={formData.experience}
                            onChange={(e) => handleInputChange("experience", e.target.value)}
                            placeholder="5+ years"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="productInterest">Product Interest</Label>
                        <Input
                          id="productInterest"
                          value={formData.productInterest}
                          onChange={(e) => handleInputChange("productInterest", e.target.value)}
                          placeholder="Sarees, Lehengas, Kurtis, etc."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website (Optional)</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="additionalInfo">Additional Information</Label>
                        <Textarea
                          id="additionalInfo"
                          value={formData.additionalInfo}
                          onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                          placeholder="Tell us more about your business and requirements..."
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Terms and Submit */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => handleInputChange("termsAccepted", checked as boolean)}
                          required
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I agree to the{" "}
                            <a href="/terms-conditions" className="text-primary hover:underline">
                              Terms & Conditions
                            </a>{" "}
                            and{" "}
                            <a href="/privacy-policy" className="text-primary hover:underline">
                              Privacy Policy
                            </a>
                          </label>
                        </div>
                      </div>

                      <Button type="submit" className="w-full" size="lg">
                        Create Trade Account
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TradeAccount;
