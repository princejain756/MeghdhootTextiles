import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { generateWhatsAppOrderMessage, generateWhatsAppLink, type OrderDetails } from "@/lib/whatsappOrderTemplate";
import { useNavigate } from "react-router-dom";
import { User, Building, Phone, CreditCard, MessageCircle } from "lucide-react";

const guestOrderSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  businessName: z.string().min(2, "Business name is required"),
  gst: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

type GuestOrderForm = z.infer<typeof guestOrderSchema>;

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { user } = useAuth();
  const { state, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState<"login" | "guest">(user ? "login" : "guest");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GuestOrderForm>({
    resolver: zodResolver(guestOrderSchema),
    defaultValues: {
      customerName: user?.fullName || "",
      phone: user?.phone || "",
      businessName: user?.companyName || "",
      gst: "",
      email: user?.email || "",
    },
  });

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogin = () => {
    navigate("/login");
    onOpenChange(false);
  };

  const handleGuestCheckout = async (data: GuestOrderForm) => {
    setIsSubmitting(true);
    
    try {
      const orderDetails: OrderDetails = {
        customerName: data.customerName,
        phone: data.phone,
        businessName: data.businessName,
        gst: data.gst,
        email: data.email,
        isGuestOrder: !user,
      };

      // Generate WhatsApp message
      const whatsappMessage = generateWhatsAppOrderMessage(state.items, orderDetails, subtotal);
      const whatsappLink = generateWhatsAppLink(whatsappMessage);

      // TODO: Save order to admin panel
      await saveOrderToAdmin(orderDetails, state.items, subtotal);

      // Open WhatsApp
      window.open(whatsappLink, "_blank");

      // Clear cart and close dialog
      clearCart();
      onOpenChange(false);
      
      // Show success message
      alert("Order sent to WhatsApp! We will confirm availability and delivery timeline shortly.");
    } catch (error) {
      console.error("Error processing order:", error);
      alert("Error processing order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveOrderToAdmin = async (orderDetails: OrderDetails, items: typeof state.items, total: number) => {
    const orderData = {
      customerDetails: orderDetails,
      items: items,
      subtotal: total,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    };

    try {
      const response = await fetch('/api/orders/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to save order');
      }

      const result = await response.json();
      console.log('Order saved successfully:', result);
    } catch (error) {
      console.warn("Could not save order to admin panel:", error);
      // Continue with WhatsApp flow even if admin save fails
    }
  };

  if (state.items.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cart Empty</DialogTitle>
            <DialogDescription>
              Add some items to your cart before checking out.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => onOpenChange(false)}>Continue Shopping</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Review your order and provide contact details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.note}</p>
                    <p className="text-sm">Qty: {item.quantity} pcs × ₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center font-semibold">
                <span>Total ({totalItems} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Checkout Options</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={orderType} onValueChange={setOrderType as any}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="login" id="login" />
                  <Label htmlFor="login" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Login with Trade Account</span>
                      {user && <Badge variant="secondary">Logged In</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get special pricing and faster checkout
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="guest" id="guest" />
                  <Label htmlFor="guest" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>Continue as Guest</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Provide business details for this order
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Login Option */}
          {orderType === "login" && !user && (
            <Card>
              <CardHeader>
                <CardTitle>Login Required</CardTitle>
                <CardDescription>
                  Login to your trade account for faster checkout and special pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleLogin} className="w-full">
                  Go to Login
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Guest Checkout Form */}
          {(orderType === "guest" || (orderType === "login" && user)) && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
                <CardDescription>
                  We'll send your order via WhatsApp for confirmation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleGuestCheckout)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" {...field} />
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
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter business name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="gst"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GST Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter GST number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button 
                        type="submit" 
                        className="flex-1" 
                        disabled={isSubmitting}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Processing..." : "Send Order via WhatsApp"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}