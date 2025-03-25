
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, Product } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductGrid from '@/components/ui/ProductGrid';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      
      try {
        if (!id) return;
        
        // Load product details
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setProduct(data as Product);
        
        // Load related products in the same category
        if (data) {
          const { data: related, error: relatedError } = await supabase
            .from('products')
            .select('*')
            .eq('category', data.category)
            .neq('id', id)
            .limit(4);
            
          if (relatedError) throw relatedError;
          
          setRelatedProducts(related as Product[]);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);
  
  // Format price
  const formattedPrice = product 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(product.price)
    : '';
    
  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  // Handle quantity change
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-secondary rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-square bg-secondary rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-secondary rounded w-3/4"></div>
              <div className="h-6 bg-secondary rounded w-1/4"></div>
              <div className="h-4 bg-secondary rounded w-full"></div>
              <div className="h-4 bg-secondary rounded w-full"></div>
              <div className="h-4 bg-secondary rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!product) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
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
      <div className="mb-4">
        <Link to="/products" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 animate-fade-in">
        {/* Product Image */}
        <div className="aspect-square bg-secondary/30 rounded-lg overflow-hidden">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          
          <div className="text-2xl font-semibold">{formattedPrice}</div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Category</h3>
            <div className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
              {product.category}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium">Quantity</h3>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <span className="w-8 text-center">{quantity}</span>
              
              <Button
                variant="outline"
                size="icon"
                onClick={increaseQuantity}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 animate-fade-in">
          <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </Layout>
  );
}
