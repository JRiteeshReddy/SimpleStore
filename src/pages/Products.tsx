
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase, Product } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/ui/ProductGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, X } from 'lucide-react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  
  // Load products and categories
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Get category from URL params
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');
        const sortParam = searchParams.get('sort') || 'newest';
        
        if (categoryParam) setCategory(categoryParam);
        if (searchParam) setSearch(searchParam);
        setSortBy(sortParam);
        
        // Load all products
        let query = supabase.from('products').select('*');
        
        // Apply category filter
        if (categoryParam && categoryParam !== 'all') {
          query = query.eq('category', categoryParam);
        }
        
        // Apply search filter
        if (searchParam) {
          query = query.ilike('title', `%${searchParam}%`);
        }
        
        // Apply sorting
        if (sortParam === 'price-low') {
          query = query.order('price', { ascending: true });
        } else if (sortParam === 'price-high') {
          query = query.order('price', { ascending: false });
        } else {
          // Default to newest
          query = query.order('created_at', { ascending: false });
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setProducts(data as Product[]);
        
        // Get unique categories
        const { data: categoryData, error: categoryError } = await supabase
          .from('products')
          .select('category')
          .not('category', 'is', null);
          
        if (categoryError) throw categoryError;
        
        const uniqueCategories = Array.from(
          new Set(categoryData.map(item => item.category))
        ).filter(Boolean) as string[];
        
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [searchParams]);
  
  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (search) params.set('search', search);
    if (category && category !== 'all') params.set('category', category);
    params.set('sort', sortBy);
    
    setSearchParams(params);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setSortBy('newest');
    setPriceRange([0, 10000]);
    setSearchParams({});
  };
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Search</h3>
              <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={handleSearchChange}
                    className="pl-8"
                  />
                </div>
                <Button type="submit" size="sm">Go</Button>
              </form>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Category</h3>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="px-2">
                <Slider
                  defaultValue={[0, 10000]}
                  max={10000}
                  step={100}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Sort By</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4 space-x-2">
              <Button onClick={applyFilters}>Apply Filters</Button>
              <Button variant="outline" onClick={resetFilters} className="flex items-center">
                <X className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
          
          {/* Product Grid */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {products.length} products
              </p>
            </div>
            
            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
