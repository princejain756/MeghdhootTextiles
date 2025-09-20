import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, Search, ShoppingCart, MessageCircle, User, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Catalogs", href: "/catalogs" },
    { label: "How to Order", href: "/wholesale-ordering" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      {/* Top bar with contact info */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 93425 03401</span>
              </div>
              <div className="hidden md:block">
                GST: 24AACCM6639C1ZP (Gujarat)
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:block">Dispatch in 2-5 days</span>
              <Button
                size="sm"
                variant="secondary"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp Us
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="font-bold text-xl text-primary">
              MeghDoot <span className="gradient-text">Textiles</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium hover:text-accent transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden lg:flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search catalogs..."
                className="pl-10 w-64"
              />
            </div>

            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground">
                0
              </Badge>
            </Button>

            {/* Login */}
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>

            <Button size="sm" className="hidden md:inline-flex">
              Create Trade Account
            </Button>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  {navigationItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block px-2 py-1 text-lg hover:text-accent transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <Button className="w-full mb-2">
                      Create Trade Account
                    </Button>
                    <div className="flex items-center justify-center gap-2 p-2 bg-secondary rounded-lg">
                      <Search className="h-4 w-4" />
                      <Input placeholder="Search catalogs..." />
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;