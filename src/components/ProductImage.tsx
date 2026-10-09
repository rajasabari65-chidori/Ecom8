import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { ProductCategory } from '../types';

interface ProductImageProps {
  src: string;
  alt: string;
  category?: ProductCategory;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  zoomOnHover?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  category,
  className = '',
  aspectRatio = 'square',
  zoomOnHover = true,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Category-specific fallback imagery if URL fails
  const getCategoryFallbackImage = (cat?: ProductCategory): string => {
    switch (cat) {
      case 'Electronics':
      case 'Smart Home Devices':
        return 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80';
      case 'Smartphones':
        return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
      case 'Laptops and Computers':
      case 'Gaming Accessories':
        return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80';
      case 'Audio and Headphones':
        return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
      case 'Footwear':
        return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';
      case 'Fashion':
      case 'Bags and Travel':
        return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80';
      case 'Home and Kitchen':
      case 'Home Appliances':
        return 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80';
      default:
        return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
    }
  };

  const imageRatioClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : '';

  const fallbackUrl = getCategoryFallbackImage(category);
  const effectiveSrc = error ? fallbackUrl : src;

  return (
    <div
      className={`relative overflow-hidden bg-slate-900/60 rounded-xl select-none ${imageRatioClass} ${className}`}
    >
      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
          <Package className="w-8 h-8 text-slate-700/60 animate-bounce" />
        </div>
      )}

      {/* Primary Image with smooth fade-in */}
      <img
        src={effectiveSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={() => {
          if (!error) {
            setError(true);
            setLoading(false);
          }
        }}
        className={`w-full h-full object-cover transition-all duration-500 ease-out ${
          loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } ${zoomOnHover ? 'group-hover:scale-105' : ''}`}
      />

      {/* Subtle bottom vignette for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
