import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import NewArrivals from "./pages/NewArrivals";
import Catalogs from "./pages/Catalogs";
import WholesaleOrdering from "./pages/WholesaleOrdering";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TradeAccount from "./pages/TradeAccount";
import BulkInquiry from "./pages/BulkInquiry";
import MOQsLeadTimes from "./pages/MOQsLeadTimes";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import SizeGuide from "./pages/SizeGuide";
import FAQs from "./pages/FAQs";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import ProtectedRoute from "@/components/routing/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import SupportChatWidget from "@/components/chat/SupportChatWidget";
import ScrollToTop from "@/components/ScrollToTop";

// SEO Pages
import WholesaleSarees from "./pages/seo/WholesaleSarees";
import WholesaleKurtis from "./pages/seo/WholesaleKurtis";
import WholesaleLehengas from "./pages/seo/WholesaleLehengas";
import CategoryPage from "./pages/seo/CategoryPage";
import CityPage from "./pages/seo/CityPage";
import BlogIndex from "./pages/seo/BlogIndex";
import BlogPost from "./pages/seo/BlogPost";
import BrandDefensePage from "./pages/seo/BrandDefensePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/catalogs" element={<Catalogs />} />
              <Route path="/wholesale-ordering" element={<WholesaleOrdering />} />
              <Route path="/about" element={<About />} />
              <Route path="/products/:id" element={<Product />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute
                    roles={["ADMIN", "UPLOADER"]}
                    permissions={["PRODUCTS", "CATALOGS", "ORDERS", "SUPPORT", "CUSTOMERS", "UPLOADS"]}
                  >
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/trade-account" element={<TradeAccount />} />
              <Route path="/bulk-inquiry" element={<BulkInquiry />} />
              <Route path="/moqs-lead-times" element={<MOQsLeadTimes />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/size-guide" element={<SizeGuide />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/contact" element={<Contact />} />

              {/* SEO Pillar Pages */}
              <Route path="/wholesale-sarees" element={<WholesaleSarees />} />
              <Route path="/wholesale-kurtis" element={<WholesaleKurtis />} />
              <Route path="/wholesale-lehengas" element={<WholesaleLehengas />} />

              {/* SEO Category Pages */}
              <Route path="/wholesale-sarees/:category" element={<CategoryPage />} />
              <Route path="/wholesale-kurtis/:category" element={<CategoryPage />} />
              <Route path="/wholesale-lehengas/:category" element={<CategoryPage />} />

              {/* SEO City Pages */}
              <Route path="/wholesale-sarees-bengaluru" element={<CityPage />} />
              <Route path="/wholesale-sarees-mumbai" element={<CityPage />} />
              <Route path="/wholesale-sarees-delhi" element={<CityPage />} />
              <Route path="/wholesale-sarees-kolkata" element={<CityPage />} />
              <Route path="/wholesale-sarees-chennai" element={<CityPage />} />
              <Route path="/wholesale-sarees-surat" element={<CityPage />} />
              <Route path="/wholesale-sarees-hyderabad" element={<CityPage />} />
              <Route path="/wholesale-sarees-pune" element={<CityPage />} />
              <Route path="/wholesale-sarees-ahmedabad" element={<CityPage />} />
              <Route path="/wholesale-sarees-jaipur" element={<CityPage />} />
              <Route path="/wholesale-kurtis-bengaluru" element={<CityPage />} />
              <Route path="/wholesale-lehengas-bengaluru" element={<CityPage />} />

              {/* SEO Brand Defense Pages */}
              <Route path="/meghdoot-saree-catalog" element={<BrandDefensePage />} />
              <Route path="/meghdoot-textiles-wholesale" element={<BrandDefensePage />} />
              <Route path="/meghdoot-sarees-wholesale-price" element={<BrandDefensePage />} />
              <Route path="/meghdoot-kurtis-catalog" element={<BrandDefensePage />} />
              <Route path="/meghdoot-lehengas-catalog" element={<BrandDefensePage />} />

              {/* SEO Blog Pages */}
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogPost />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>
          {/* Global support chat widget */}
          <SupportChatWidget />
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
