
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const { user, signOut } = useAuth();
  const { cartItems } = useCart();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Get cart items count
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <header 
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 py-4 px-4 sm:px-6",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary transition-transform hover:scale-105">
          SimpleStore
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={cn(
              "text-foreground/80 hover:text-foreground transition-colors",
              location.pathname === "/" && "text-foreground font-medium"
            )}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={cn(
              "text-foreground/80 hover:text-foreground transition-colors",
              location.pathname === "/products" && "text-foreground font-medium"
            )}
          >
            Products
          </Link>
          <Link 
            to="/cart" 
            className="relative hover-lift"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-primary text-white text-xs rounded-full">
                {cartItemsCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/account" className="hover-lift">
                <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm">Sign In</Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <Link 
            to="/cart" 
            className="relative hover-lift"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-primary text-white text-xs rounded-full">
                {cartItemsCount}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg rounded-b-lg md:hidden animate-slide-in-top">
          <nav className="flex flex-col py-4 px-6 space-y-4">
            <Link 
              to="/" 
              className={cn(
                "text-foreground/80 py-2 hover:text-foreground transition-colors",
                location.pathname === "/" && "text-foreground font-medium"
              )}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={cn(
                "text-foreground/80 py-2 hover:text-foreground transition-colors",
                location.pathname === "/products" && "text-foreground font-medium"
              )}
            >
              Products
            </Link>
            {user ? (
              <>
                <Link 
                  to="/account" 
                  className={cn(
                    "text-foreground/80 py-2 hover:text-foreground transition-colors",
                    location.pathname === "/account" && "text-foreground font-medium"
                  )}
                >
                  My Account
                </Link>
                <Button 
                  variant="ghost" 
                  className="justify-start p-0 h-auto font-normal hover:bg-transparent" 
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth" className="py-2">
                <Button className="w-full" variant="default">Sign In</Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
