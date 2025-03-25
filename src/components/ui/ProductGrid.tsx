
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/lib/supabase';
import { cn } from '@/lib/utils';

type ProductGridProps = {
  products: Product[];
  loading?: boolean;
  className?: string;
};

export default function ProductGrid({ products, loading = false, className }: ProductGridProps) {
  if (loading) {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6", className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-secondary animate-pulse rounded-lg">
            <div className="aspect-square w-full" />
            <div className="p-4 space-y-2">
              <div className="h-5 bg-secondary-foreground/10 rounded w-2/3" />
              <div className="h-4 bg-secondary-foreground/10 rounded w-full" />
              <div className="h-4 bg-secondary-foreground/10 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6", className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
