import type { CartItem } from "@/context/CartContext";

export interface OrderDetails {
  customerName: string;
  phone: string;
  businessName: string;
  gst?: string;
  email?: string;
  isGuestOrder: boolean;
}

export const generateWhatsAppOrderMessage = (
  items: CartItem[],
  customerDetails: OrderDetails,
  subtotal: number
): string => {
  const itemsList = items
    .map((item, index) => 
      `${index + 1}. ${item.name}\n   Qty: ${item.quantity} pcs\n   Rate: Rs ${item.price.toLocaleString()}\n   Total: Rs ${(item.price * item.quantity).toLocaleString()}\n   ${item.note || ""}`
    )
    .join("\n\n");

  const orderMessage = `PURCHASE ORDER

Customer Details:
Name: ${customerDetails.customerName}
Business: ${customerDetails.businessName}
Phone: ${customerDetails.phone}${customerDetails.gst ? `\nGST: ${customerDetails.gst}` : ""}${customerDetails.email ? `\nEmail: ${customerDetails.email}` : ""}

Order Items:
${itemsList}

Order Summary:
Subtotal: Rs ${subtotal.toLocaleString()}
Total Items: ${items.reduce((sum, item) => sum + item.quantity, 0)} pcs

Order Type: ${customerDetails.isGuestOrder ? "Guest Order" : "Trade Account Order"}

Please confirm availability and delivery timeline.`;

  return orderMessage;
};

export const generateWhatsAppLink = (message: string, phoneNumber: string = "919342503401"): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};