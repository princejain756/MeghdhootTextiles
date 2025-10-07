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
import ProtectedRoute from "@/components/routing/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import SupportChatWidget from "@/components/chat/SupportChatWidget";

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
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route path="/catalogs" element={<Catalogs />} />
            <Route path="/wholesale-ordering" element={<WholesaleOrdering />} />
            <Route path="/about" element={<About />} />
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
                <ProtectedRoute roles={["ADMIN"]}>
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        {/* Global support chat widget */}
        <SupportChatWidget />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
