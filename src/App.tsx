
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { useEffect } from "react";
import { initializeDemoProducts } from "@/lib/supabase";

// Pages
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Auth from "@/pages/Auth";
import Checkout from "@/pages/Checkout";
import Account from "@/pages/Account";
import AccountProfile from "@/pages/AccountProfile";
import AccountOrders from "@/pages/AccountOrders";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Initialize app data
function AppInitializer() {
  const location = useLocation();
  
  useEffect(() => {
    // Initialize demo products
    initializeDemoProducts();
  }, []);
  
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/account" element={<Account />}>
                <Route index element={<AccountProfile />} />
                <Route path="orders" element={<AccountOrders />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AppInitializer />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
