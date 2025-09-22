import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Search,
  ShoppingCart,
  MessageCircle,
  Phone,
  UserRound,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import FomoBar from "@/components/fomo/FomoBar";
import CartDrawer from "@/components/cart/CartDrawer";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import logomegh from "@/assets/logomegh.png";

const headerLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Catalogs", to: "/catalogs" },
  { label: "About", to: "/about" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const desktopSearchRef = useRef<HTMLInputElement | null>(null);

  const gotoPortal = () => {
    navigate(user?.role === "ADMIN" ? "/admin" : "/dashboard");
  };

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  // Global shortcut: Cmd/Ctrl + K to jump to catalogs search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        navigate(`/catalogs?q=${encodeURIComponent("")}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  function submitGlobalSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) {
      navigate("/catalogs");
    } else {
      navigate(`/catalogs?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <FomoBar />

      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 93425 03401</span>
              </div>
              <div className="hidden md:block">GST: 24AACCM6639C1ZP (Gujarat)</div>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:block">Dispatch in 2-5 days</span>
              <Button
                size="sm"
                variant="secondary"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <a href="https://wa.me/919342503401" target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src={logomegh} 
              alt="MeghDoot Textiles" 
              className="h-24 w-auto object-contain ml-8"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {headerLinks.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <form onSubmit={submitGlobalSearch} className="relative hidden lg:flex items-center">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                ref={desktopSearchRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, fabrics, catalogs"
                aria-label="Global search"
                className="w-72 pl-10 pr-14"
              />
              <span className="pointer-events-none absolute right-2 select-none rounded-md border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">⌘K</span>
            </form>

            <Button variant="ghost" size="sm" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent p-0 text-xs text-accent-foreground">
                0
              </Badge>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-flex">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    Signed in as <span className="font-medium text-foreground">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={gotoPortal}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {user.role === "ADMIN" ? "Admin console" : "My dashboard"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link to="/login" className="gap-2">
                    <UserRound className="h-4 w-4" /> Login
                  </Link>
                </Button>
                <Button asChild size="sm" className="hidden md:inline-flex">
                  <Link to="/trade-account">Create Trade Account</Link>
                </Button>
              </>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  {headerLinks.map((item) => (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          "text-lg transition-colors",
                          isActive ? "text-primary" : "hover:text-accent"
                        )
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                  <div className="border-t pt-4">
                    {user ? (
                      <div className="flex flex-col gap-2">
                        <Button onClick={() => {
                          gotoPortal();
                          setIsOpen(false);
                        }}>
                          Go to portal
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsOpen(false);
                            handleLogout();
                          }}
                        >
                          Sign out
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button asChild>
                          <Link to="/trade-account" onClick={() => setIsOpen(false)}>
                            Create Trade Account
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to="/login" onClick={() => setIsOpen(false)}>
                            Login
                          </Link>
                        </Button>
                      </div>
                    )}
                    <form
                      className="mt-4 flex items-center gap-2 rounded-lg border bg-secondary p-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const q = searchTerm.trim();
                        setIsOpen(false);
                        navigate(q ? `/catalogs?q=${encodeURIComponent(q)}` : "/catalogs");
                      }}
                    >
                      <Search className="h-4 w-4" />
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products, fabrics, catalogs"
                      />
                    </form>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
    <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
};

export default Header;
