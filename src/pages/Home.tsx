
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Product } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/ui/ProductGrid';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Load featured products
        const { data: featured, error: featuredError } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'featured')
          .limit(4);
          
        if (featuredError) throw featuredError;
        
        // Load new arrivals
        const { data: newProducts, error: newError } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'new')
          .limit(4);
          
        if (newError) throw newError;
        
        setFeaturedProducts(featured as Product[]);
        setNewArrivals(newProducts as Product[]);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  return (
    <Layout fullWidth>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1470&auto=format&fit=crop)' }}
        />
        
        <div className="relative z-20 text-center px-6 max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Simple. Elegant. Functional.
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto">
            Discover our carefully curated selection of high-quality products.
          </p>
          <Link to="/products">
            <Button size="lg" className="rounded-full">
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">Featured Products</h2>
            <Link to="/products?category=featured" className="text-primary hover:underline flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <ProductGrid products={featuredProducts} loading={loading} />
        </div>
      </section>
      
      {/* Product Categories */}
      <section className="section-padding bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">Shop by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/products?category=electronics" className="relative rounded-lg overflow-hidden aspect-square group card-hover">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1470&auto=format&fit=crop"
                alt="Electronics"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-xl font-medium text-white">Electronics</h3>
                <p className="text-white/80 mt-1">Smart devices for modern living</p>
              </div>
            </Link>
            
            <Link to="/products?category=clothing" className="relative rounded-lg overflow-hidden aspect-square group card-hover">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1471&auto=format&fit=crop"
                alt="Clothing"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-xl font-medium text-white">Clothing</h3>
                <p className="text-white/80 mt-1">Timeless pieces that last</p>
              </div>
            </Link>
            
            <Link to="/products?category=home" className="relative rounded-lg overflow-hidden aspect-square group card-hover">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1632&auto=format&fit=crop"
                alt="Home"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-xl font-medium text-white">Home</h3>
                <p className="text-white/80 mt-1">Essentials for your space</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">New Arrivals</h2>
            <Link to="/products?category=new" className="text-primary hover:underline flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <ProductGrid products={newArrivals} loading={loading} />
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">Stay Updated</h2>
          <p className="mb-6 text-primary-foreground/90">
            Subscribe to our newsletter to receive updates on new products and special offers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
            />
            <Button variant="secondary" className="whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      {...props} 
      className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${props.className}`}
    />
  );
}
