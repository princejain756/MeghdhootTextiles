import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import CheckoutDialog from "@/components/CheckoutDialog";
import { Minus, Plus, Trash2 } from "lucide-react";

type CartDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { state, removeItem, updateQuantity } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    onOpenChange(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Your cart</DrawerTitle>
            <DrawerDescription>
              {totalItems > 0 
                ? `Review ${totalItems} item${totalItems > 1 ? 's' : ''} and reserve pricing.`
                : "Your cart is empty."
              }
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-4">
            {state.items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Your cart is empty</p>
                <p className="text-sm">Add some products to get started</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg border border-border/60 bg-card p-3 text-sm">
                      <div>
                        <div className="font-medium text-foreground">{item.name}</div>
                        <div className="text-muted-foreground">{item.note}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center text-sm">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                        <div className="text-xs text-muted-foreground">{item.quantity} pcs × ₹{item.price.toLocaleString("en-IN")}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
              </>
            )}
          </div>
          <DrawerFooter>
            {state.items.length > 0 ? (
              <Button className="w-full" onClick={handleCheckout}>
                Proceed to checkout
              </Button>
            ) : (
              <DrawerClose asChild>
                <Button className="w-full">Continue shopping</Button>
              </DrawerClose>
            )}
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">Continue shopping</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      <CheckoutDialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen} />
    </>
  );
}

