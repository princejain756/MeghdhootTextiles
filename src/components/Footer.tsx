import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Facebook, 
  Youtube,
  ShoppingCart,
  Shield,
  Award,
  Truck
} from "lucide-react";
import logomegh from "@/assets/logomegh.png";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const OperationsLocations = () => {
  const [open, setOpen] = useState(false);

  const locations = [
    {
      name: "Surat Sales Store",
      address:
        "Kamela Darwaja, Umarwada, Ring Road, (Opp. Millennium Textile Market Back Gate), Surat – 395002, Gujarat, India",
    },
    {
      name: "Bengaluru Sales Store",
      address: "No.82, J M Road, Avenue Road cross, Bangalore - 560002",
    },
    {
      name: "Kolkata Sales Store",
      address:
        "6th Floor, 95B, Park Street, Opp : Deputy Commissioner Office, Kolkata, West Bengal 700016",
    },
  ];

  const mapsUrl = (addr: string) => `https://www.google.com/maps?q=${encodeURIComponent(addr)}`;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground hover:text-accent transition-colors"
        aria-expanded={open}
        aria-controls="operations-locations"
      >
        Operations {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && (
        <div
          id="operations-locations"
          className="rounded-md border border-primary-foreground/20 bg-background/10 p-3"
        >
          <ul className="space-y-2">
            {locations.map((loc) => (
              <li key={loc.name}>
                <a
                  href={mapsUrl(loc.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded px-2 py-2 hover:bg-background/20 transition-colors"
                  title={`Open in Google Maps: ${loc.name}`}
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                    <div>
                      <div className="text-sm font-medium">{loc.name}</div>
                      <div className="text-xs text-primary-foreground/80">{loc.address}</div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter section */}
      <div className="border-b border-primary-foreground/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-semibold mb-4">
              Stay Updated with Latest Catalogs
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Get early access to new collections and trade-only offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email address"
                className="bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="mb-4">
                <img 
                  src={logomegh} 
                  alt="Meghdoot Textiles" 
                  className="h-16 w-auto object-contain"
                />
              </div>
              <p className="text-primary-foreground/80 mb-4">
                Manufacturer & Wholesaler of Indian Ethnicwear from Bengaluru, Surat & Kolkata. Serving retailers, 
                resellers and boutiques with premium quality ethnic wear since 1998.
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge className="bg-background/10 text-primary-foreground border-primary-foreground/20">
                <Shield className="h-4 w-4 mr-2" />
                GST Registered
              </Badge>
              <Badge className="bg-background/10 text-primary-foreground border-primary-foreground/20">
                <Award className="h-4 w-4 mr-2" />
                25+ Years
              </Badge>
              <Badge className="bg-background/10 text-primary-foreground border-primary-foreground/20">
                <Truck className="h-4 w-4 mr-2" />
                Pan-India Shipping
              </Badge>
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              {/* Operations locations toggle */}
              <OperationsLocations />
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent" />
                <span className="font-medium">+91 93425 03401</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent" />
                <span>blr@meghdoottextiles.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Shop All Categories", path: "/shop" },
                { name: "New Arrivals", path: "/new-arrivals" },
                { name: "Featured Catalogs", path: "/catalogs" },
                { name: "How to Order", path: "/wholesale-ordering" },
                { name: "Size Guide", path: "/size-guide" },
                { name: "FAQs", path: "/faqs" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.path} 
                    className="text-primary-foreground/80 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Business</h3>
            <ul className="space-y-2 mb-6">
              {[
                { name: "Create Trade Account", path: "/trade-account" },
                { name: "Bulk Inquiry Form", path: "/bulk-inquiry" },
                { name: "MOQs & Lead Times", path: "/moqs-lead-times" },
                { name: "Privacy Policy", path: "/privacy-policy" },
                { name: "Terms & Conditions", path: "/terms-conditions" },
                { name: "Refund Policy", path: "/refund-policy" },
                { name: "Shipping Policy", path: "/shipping-policy" }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.path} 
                    className="text-primary-foreground/80 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social links */}
            <div>
              <h4 className="font-medium mb-3">Connect With Us</h4>
              <div className="flex gap-3">
                <Button size="sm" variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-background/10 p-2">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-background/10 p-2">
                  <Youtube className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-background/10 p-2">
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-background/10 p-2">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div>© 2024 Meghdoot Textiles Private Limited. All rights reserved.</div>
              <div className="hidden md:block">CIN: U51311KA1998PTC024014</div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span>GST: 24AACCM6639C1ZP (Gujarat)</span>
              <span>29AACCM6639C1ZF (Karnataka)</span>
              <span>19AACCM6639C1ZG (West Bengal)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
