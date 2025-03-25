
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
