
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, Product, CartItem } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

type CartContextType = {
  cartItems: CartItemWithProduct[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
  cartTotal: number;
};

type CartItemWithProduct = CartItem & { product: Product };

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ecommerce-cart';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load cart items from database if user is logged in, otherwise from localStorage
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      
      if (user) {
        try {
          const { data, error } = await supabase
            .from('cart_items')
            .select('*, product:products(*)')
            .eq('user_id', user.id);
          
          if (error) {
            console.error('Error loading cart:', error);
            toast({
              title: "Error loading cart",
              description: error.message,
              variant: "destructive",
            });
          } else if (data) {
            setCartItems(data as CartItemWithProduct[]);
          }
        } catch (error) {
          console.error('Cart loading error:', error);
        }
      } else {
        // Load from localStorage if not logged in
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          try {
            setCartItems(JSON.parse(storedCart));
          } catch (e) {
            console.error('Error parsing cart from localStorage:', e);
            localStorage.removeItem(CART_STORAGE_KEY);
          }
        }
      }
      
      setIsLoading(false);
    };

    loadCart();
  }, [user, toast]);

  // Save cart to localStorage when it changes (for non-logged in users)
  useEffect(() => {
    if (!user && cartItems.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Add item to cart
  const addToCart = async (product: Product, quantity = 1) => {
    // Check if the product is already in the cart
    const existingItemIndex = cartItems.findIndex(
      item => item.product_id === product.id
    );

    let newCartItems: CartItemWithProduct[];

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      newCartItems = [...cartItems];
      newCartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem: CartItemWithProduct = {
        id: Math.random().toString(36).substr(2, 9), // Generate temporary ID
        user_id: user?.id || 'guest',
        product_id: product.id,
        quantity: quantity,
        product: product,
        created_at: new Date().toISOString(),
      };
      newCartItems = [...cartItems, newItem];
    }

    // If user is logged in, save to database
    if (user) {
      try {
        setIsLoading(true);
        
        if (existingItemIndex >= 0) {
          // Update existing item in database
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity: newCartItems[existingItemIndex].quantity })
            .eq('user_id', user.id)
            .eq('product_id', product.id);
            
          if (error) throw error;
        } else {
          // Insert new item to database
          const { error, data } = await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: product.id,
              quantity: quantity,
            })
            .select('*, product:products(*)');
            
          if (error) throw error;
          
          // Use the returned item with proper ID from database
          if (data && data[0]) {
            newCartItems = [...cartItems, data[0] as CartItemWithProduct];
          }
        }
      } catch (error) {
        console.error('Error saving to cart:', error);
        toast({
          title: "Cart error",
          description: "Failed to update cart",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    // Update local state
    setCartItems(newCartItems);
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart`,
    });
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    // If user is logged in, remove from database
    if (user) {
      try {
        setIsLoading(true);
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error removing from cart:', error);
        toast({
          title: "Cart error",
          description: "Failed to remove item from cart",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    // Update local state
    setCartItems(cartItems.filter(item => item.product_id !== productId));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    });
  };

  // Update item quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // If user is logged in, update in database
    if (user) {
      try {
        setIsLoading(true);
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', user.id)
          .eq('product_id', productId);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error updating cart quantity:', error);
        toast({
          title: "Cart error",
          description: "Failed to update quantity",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    // Update local state
    setCartItems(
      cartItems.map(item =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = async () => {
    // If user is logged in, clear from database
    if (user) {
      try {
        setIsLoading(true);
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast({
          title: "Cart error",
          description: "Failed to clear cart",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    // Clear local state
    setCartItems([]);
    // Clear localStorage
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoading,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
