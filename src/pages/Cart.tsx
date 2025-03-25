
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash, Plus, Minus, X, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, isLoading } = useCart();
  const { user } = useAuth();
  
  // Format currency in Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Handle quantity change
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="py-12 text-center">
          <div className="animate-pulse flex flex-col items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
            <div className="h-6 bg-secondary rounded w-48 mb-4"></div>
            <div className="h-4 bg-secondary rounded w-64"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="py-12 text-center">
          <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center p-4 bg-white border border-border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex-shrink-0 w-24 h-24 bg-secondary/30 rounded overflow-hidden">
                <img 
                  src={item.product.image_url} 
                  alt={item.product.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="ml-4 flex-grow">
                <Link to={`/products/${item.product_id}`} className="font-medium hover:text-primary transition-colors">
                  {item.product.title}
                </Link>
                <div className="text-sm text-muted-foreground mb-2">
                  {formatCurrency(item.product.price)} each
                </div>
                
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-10 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col items-end ml-4">
                <span className="font-semibold mb-2">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end">
            <Button 
              variant="ghost" 
              className="text-muted-foreground" 
              onClick={clearCart}
            >
              <X className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card className="shadow-md border-border/50 sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link to={user ? "/checkout" : "/auth"} className="w-full">
                <Button className="w-full">
                  {user ? (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Sign in to Checkout"
                  )}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
