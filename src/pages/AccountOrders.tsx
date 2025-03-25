
import React, { useState, useEffect } from 'react';
import { supabase, Order, OrderItem } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';

export default function AccountOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<(Order & { items: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get all orders for this user
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            items:order_items(
              *,
              product:products(*)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setOrders(data as (Order & { items: OrderItem[] })[]);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Toggle order details
  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-lg bg-secondary/50 h-24"></div>
        ))}
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <Package className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">
            When you place orders, they will appear here
          </p>
          <Button asChild>
            <a href="/products">Shop Now</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Order History</h2>
      
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Order #{order.id.substring(0, 8)}
                </p>
                <p className="text-sm">
                  {formatDate(order.created_at)}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {getStatusBadge(order.status)}
                <span className="font-semibold">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-4">
            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
              </p>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center text-primary"
                onClick={() => toggleOrderDetails(order.id)}
              >
                {expandedOrder === order.id ? (
                  <>
                    Hide Details
                    <ChevronUp className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    View Details
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
            
            {expandedOrder === order.id && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="space-y-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-secondary/30 rounded overflow-hidden mr-3">
                          <img 
                            src={item.product?.image_url} 
                            alt={item.product?.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div>
                          <div className="font-medium">
                            {item.product?.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Qty: {item.quantity} &times; {formatCurrency(item.price)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-semibold">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
