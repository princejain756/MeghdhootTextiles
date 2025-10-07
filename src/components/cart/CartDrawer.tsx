import { useMemo } from "react";
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

type CartDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const items = useMemo(
    () => [
      { id: "1", name: "Festive Saree Set", note: "MOQ 6", price: 1299, qty: 6 },
      { id: "2", name: "Occasion Kurti Capsule", note: "MOQ 8", price: 799, qty: 8 },
    ],
    [],
  );
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Your cart</DrawerTitle>
          <DrawerDescription>Review selections and reserve pricing.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-4">
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.id} className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg border border-border/60 bg-card p-3 text-sm">
                <div>
                  <div className="font-medium text-foreground">{it.name}</div>
                  <div className="text-muted-foreground">{it.note}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{(it.price * it.qty).toLocaleString("en-IN")}</div>
                  <div className="text-xs text-muted-foreground">{it.qty} pcs × ₹{it.price.toLocaleString("en-IN")}</div>
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
        </div>
        <DrawerFooter>
          <Button className="w-full">Proceed to checkout</Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Continue shopping</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

