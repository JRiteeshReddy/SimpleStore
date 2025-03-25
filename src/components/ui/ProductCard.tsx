
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

type ProductCardProps = {
  product: Product;
  className?: string;
};

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  // Format price in Indian Rupees
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);
  
  return (
    <div 
      className={cn(
        "group relative bg-white rounded-lg overflow-hidden card-hover shadow-sm border border-border",
        className
      )}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-secondary/40">
          <img 
            src={product.image_url} 
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        
        <div className="p-4 space-y-2">
          <h3 className="font-medium text-lg leading-tight line-clamp-1">
            {product.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <span className="font-semibold text-lg">{formattedPrice}</span>
            
            <Button 
              variant="default" 
              size="sm" 
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-4 right-4"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
