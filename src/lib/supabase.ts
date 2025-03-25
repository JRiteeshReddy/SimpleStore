
import { createClient } from '@supabase/supabase-js';

// Supabase project details
const supabaseUrl = 'https://tlamoeniqvncexayrttl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsYW1vZW5pcXZuY2V4YXlydHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODkwOTMsImV4cCI6MjA1ODQ2NTA5M30.DvZOPqws_bEpZ_Ps-i9O6vjlEKeyk--t4vbaKXXcwKM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our Supabase tables
export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock?: number;
  created_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  created_at: string;
  items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
};

// Initialize demo products
export const initializeDemoProducts = async () => {
  // Check for fashion products
  const { data: fashionProducts, error: checkError } = await supabase
    .from('products')
    .select('id')
    .eq('category', 'fashion')
    .limit(1);
    
  if (checkError) {
    console.error('Error checking for fashion products:', checkError);
    return;
  }
  
  // If no fashion products exist, add them
  if (!fashionProducts || fashionProducts.length === 0) {
    const fashionItems = [
      {
        title: 'Designer Silk Scarf',
        description: 'Elegant silk scarf with artistic print, perfect for any occasion',
        price: 1899,
        image_url: 'https://images.unsplash.com/photo-1584285405429-136507366308?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'fashion'
      },
      {
        title: 'Leather Crossbody Bag',
        description: 'Stylish genuine leather bag with adjustable strap and multiple compartments',
        price: 2999,
        image_url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'fashion'
      },
      {
        title: 'Classic Aviator Sunglasses',
        description: 'Timeless aviator design with polarized lenses and UV protection',
        price: 1299,
        image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'fashion'
      },
      {
        title: 'Gold Hoop Earrings',
        description: 'Minimalist 18k gold plated hoop earrings for everyday elegance',
        price: 999,
        image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'fashion'
      }
    ];
    
    // Insert fashion products
    const { error: insertError } = await supabase
      .from('products')
      .insert(fashionItems);
      
    if (insertError) {
      console.error('Error adding fashion products:', insertError);
    } else {
      console.log('Successfully added fashion products');
    }
  }
};
