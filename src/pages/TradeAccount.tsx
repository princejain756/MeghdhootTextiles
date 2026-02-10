import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
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
import { useAuth } from "@/context/AuthContext";
import FullScreenLoader from "@/components/FullScreenLoader";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const passwordRequirements =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.";

const tradeRegisterSchema = z
  .object({
    businessName: z.string().min(2, "Enter your business name"),
    contactPerson: z.string().min(3, "Enter the contact person's name"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(10, "Enter a valid phone number"),
    gstNumber: z.string().optional(),
    address: z.string().min(5, "Enter your business address"),
    city: z.string().min(2, "Enter city"),
    state: z.string().min(2, "Enter state"),
    pincode: z.string().min(4, "Enter pincode"),
    businessType: z.string().min(2, "Enter business type"),
    annualTurnover: z.string().optional(),
    productInterest: z.string().optional(),
    experience: z.string().optional(),
    website: z.string().url("Enter a valid URL").optional().or(z.literal("").transform(() => undefined)),
    additionalInfo: z.string().optional(),
    termsAccepted: z.literal(true, { errorMap: () => ({ message: "You must accept Terms & Privacy" }) }),

    // Account credentials
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z
      .string()
      .min(8, passwordRequirements)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, passwordRequirements),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type TradeRegisterFormValues = z.infer<typeof tradeRegisterSchema>;

const TradeAccount = () => {
  const { user, register: registerMutation, isLoading } = useAuth();
  const navigate = useNavigate();

  const form = useForm<TradeRegisterFormValues>({
    resolver: zodResolver(tradeRegisterSchema),
    defaultValues: {
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
      termsAccepted: false,
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      navigate(user.role === "ADMIN" || user.role === "UPLOADER" ? "/admin" : "/dashboard", { replace: true });
    }
  }, [navigate, user]);

  if (isLoading) {
    return <FullScreenLoader label="Preparing Trade Hub" />;
  }

  const onSubmit = async (values: TradeRegisterFormValues) => {
    try {
      await registerMutation.mutateAsync({
        email: values.email,
        username: values.username,
        password: values.password,
        fullName: values.contactPerson,
        companyName: values.businessName,
        phone: values.phone,
        // Address
        addressLine1: values.address,
        city: values.city,
        state: values.state,
        postalCode: values.pincode,
        country: "IN",
        // Trade profile
        gstNumber: values.gstNumber || undefined,
        businessType: values.businessType,
        annualTurnover: values.annualTurnover || undefined,
        productInterest: values.productInterest || undefined,
        experience: values.experience || undefined,
        website: values.website || undefined,
        additionalInfo: values.additionalInfo || undefined,
        termsAccepted: values.termsAccepted,
      });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(error);
    }
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
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Business Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          Business Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Business Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your business name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="contactPerson"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Person *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="business@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                  <Input placeholder="+91 98765 43210" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="gstNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>GST Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="29AACCM6639C1ZF" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="businessType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Business Type *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Retailer, Wholesaler, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Address Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Business Address
                        </h3>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address *</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Complete business address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City *</FormLabel>
                                <FormControl>
                                  <Input placeholder="City" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State *</FormLabel>
                                <FormControl>
                                  <Input placeholder="State" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="pincode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pincode *</FormLabel>
                                <FormControl>
                                  <Input placeholder="123456" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
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
                          <FormField
                            control={form.control}
                            name="annualTurnover"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Annual Turnover</FormLabel>
                                <FormControl>
                                  <Input placeholder="₹10 Lakhs - ₹1 Crore" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Years in Business</FormLabel>
                                <FormControl>
                                  <Input placeholder="5+ years" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="productInterest"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Interest</FormLabel>
                              <FormControl>
                                <Input placeholder="Sarees, Lehengas, Kurtis, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://yourwebsite.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="additionalInfo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Information</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Tell us more about your business and requirements..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator />

                      {/* Account credentials */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Account Credentials
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username *</FormLabel>
                                <FormControl>
                                  <Input placeholder="mytradehandle" autoComplete="username" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password *</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password *</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Terms and Submit */}
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="termsAccepted"
                          render={({ field }) => (
                            <div className="flex items-start space-x-2">
                              <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} />
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
                                <FormMessage />
                              </div>
                            </div>
                          )}
                        />

                        <Button type="submit" className="w-full" size="lg" disabled={registerMutation.isPending}>
                          {registerMutation.isPending ? "Creating account…" : "Create Trade Account"}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                          Already trading with us? {""}
                          <Link to="/login" className="font-medium text-primary hover:underline">
                            Sign in
                          </Link>
                        </p>
                      </div>
                    </form>
                  </Form>
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
