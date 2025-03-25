
import { createClient } from '@supabase/supabase-js';

// These will be replaced with your actual Supabase project details
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

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
