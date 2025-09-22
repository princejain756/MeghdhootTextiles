import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Package, 
  Calculator, 
  Clock, 
  CheckCircle,
  Star,
  Award,
  Truck,
  Users,
  TrendingUp,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Building2
} from "lucide-react";
import PageLayout from "@/components/PageLayout";

const BulkInquiry = () => {
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
    productCategory: "",
    quantity: "",
    budget: "",
    deliveryTimeline: "",
    specialRequirements: "",
    preferredContact: "",
    additionalInfo: "",
    termsAccepted: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Bulk inquiry form submitted:", formData);
  };

  const productCategories = [
    "Sarees",
    "Lehengas",
    "Kurtis & Tunics",
    "Dress Materials",
    "Blouses",
    "Dupattas",
    "Kids Wear",
    "Men's Ethnic Wear",
    "Accessories",
    "Other"
  ];

  const benefits = [
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Custom Pricing",
      description: "Get personalized quotes based on your volume"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Fast Response",
      description: "Receive quotes within 24 hours"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Bulk Discounts",
      description: "Special rates for large quantity orders"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Priority Processing",
      description: "Faster production and delivery for bulk orders"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Dedicated Support",
      description: "Personal account manager for your inquiry"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Detailed Quotes",
      description: "Comprehensive pricing with all specifications"
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Submit Inquiry",
      description: "Fill out the form with your requirements"
    },
    {
      step: 2,
      title: "Review & Quote",
      description: "We'll review and send detailed pricing"
    },
    {
      step: 3,
      title: "Negotiate Terms",
      description: "Discuss pricing, timeline, and specifications"
    },
    {
      step: 4,
      title: "Place Order",
      description: "Confirm order and proceed with production"
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
                  <FileText className="h-12 w-12" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Bulk Inquiry Form
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Get custom pricing and quotes for your bulk orders. Our team will provide detailed specifications and competitive rates.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Clock className="h-4 w-4 mr-2" />
                  24hr Response
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Calculator className="h-4 w-4 mr-2" />
                  Custom Pricing
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                  <Package className="h-4 w-4 mr-2" />
                  Bulk Discounts
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
                    Why Choose Us
                  </CardTitle>
                  <CardDescription>
                    Benefits of our bulk inquiry process
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
                  <CardTitle className="text-sm">Process Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {processSteps.map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {step.step}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{step.title}</h4>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Order Inquiry</CardTitle>
                  <CardDescription>
                    Provide detailed information about your bulk order requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Business Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Business Information
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
                          <Label htmlFor="gstNumber">GST Number</Label>
                          <Input
                            id="gstNumber"
                            value={formData.gstNumber}
                            onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                            placeholder="24AACCM6639C1ZP"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                          <Select value={formData.preferredContact} onValueChange={(value) => handleInputChange("preferredContact", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select contact method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone Call</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                              <SelectItem value="video">Video Call</SelectItem>
                            </SelectContent>
                          </Select>
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

                    {/* Product Requirements */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Product Requirements
                      </h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="productCategory">Product Category *</Label>
                        <Select value={formData.productCategory} onValueChange={(value) => handleInputChange("productCategory", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product category" />
                          </SelectTrigger>
                          <SelectContent>
                            {productCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity Required *</Label>
                          <Input
                            id="quantity"
                            value={formData.quantity}
                            onChange={(e) => handleInputChange("quantity", e.target.value)}
                            placeholder="e.g., 100 pieces, 50 sets"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budget">Budget Range</Label>
                          <Input
                            id="budget"
                            value={formData.budget}
                            onChange={(e) => handleInputChange("budget", e.target.value)}
                            placeholder="e.g., ₹50,000 - ₹1,00,000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deliveryTimeline">Delivery Timeline *</Label>
                        <Input
                          id="deliveryTimeline"
                          value={formData.deliveryTimeline}
                          onChange={(e) => handleInputChange("deliveryTimeline", e.target.value)}
                          placeholder="e.g., 2-3 weeks, 1 month"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialRequirements">Special Requirements</Label>
                        <Textarea
                          id="specialRequirements"
                          value={formData.specialRequirements}
                          onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
                          placeholder="Any specific requirements, customizations, or special instructions..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="additionalInfo">Additional Information</Label>
                        <Textarea
                          id="additionalInfo"
                          value={formData.additionalInfo}
                          onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                          placeholder="Any other details about your inquiry..."
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
                        Submit Bulk Inquiry
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

export default BulkInquiry;
