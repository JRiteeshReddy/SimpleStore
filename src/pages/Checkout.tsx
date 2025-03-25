
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  );
}

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('US');
  
  // Payment state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Loading state
  const [loading, setLoading] = useState(false);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format card number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value
      .replace(/(.{4})/g, '$1 ')
      .trim()
      .substring(0, 19);
    setCardNumber(formattedValue);
  };
  
  // Format expiry date
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      setExpiry(value);
    } else {
      setExpiry(`${value.substring(0, 2)}/${value.substring(2, 4)}`);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !address || !city || !state || !zip) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!cardNumber || !cardName || !expiry || !cvv) {
      toast({
        title: "Missing payment information",
        description: "Please fill in all payment details",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your order",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'processing',
          total: cartTotal,
          shipping_address: `${address}, ${city}, ${state} ${zip}, ${country}`,
        })
        .select();
        
      if (orderError) throw orderError;
      
      if (!order || order.length === 0) {
        throw new Error('Failed to create order');
      }
      
      const orderId = order[0].id;
      
      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;
      
      // Clear cart after successful order
      await clearCart();
      
      // Show success toast and redirect
      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
      });
      
      navigate('/account/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Shipping Information</h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      placeholder="10001"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Payment Information</h2>
              
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="password"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                    maxLength={3}
                    required
                  />
                </div>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : `Pay ${formatCurrency(cartTotal)}`}
            </Button>
          </form>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-secondary/30 rounded overflow-hidden mr-3">
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{item.product.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-medium">
                      {formatCurrency(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(cartTotal * 0.1)}</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal * 1.1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Note:</strong> This is a demo store. No real payments will be processed.
            </p>
            <p>
              You can use any email and the following test credit card information:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Card Number: 4242 4242 4242 4242</li>
              <li>Expiry: Any future date</li>
              <li>CVV: Any 3 digits</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
