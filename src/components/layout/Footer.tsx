
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary py-12 px-4 sm:px-6 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">SimpleStore</h2>
          <p className="text-sm text-muted-foreground">
            High-quality products with a seamless shopping experience.
          </p>
        </div>
        
        <div>
          <h3 className="font-medium mb-4">Shop</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/products?category=featured" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Featured
              </Link>
            </li>
            <li>
              <Link to="/products?category=new" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium mb-4">Account</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/account" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                My Account
              </Link>
            </li>
            <li>
              <Link to="/account/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Order History
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Shopping Cart
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium mb-4">Information</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          &copy; {currentYear} SimpleStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
