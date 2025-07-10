import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import Button from "@/components/atoms/Button";
import StarRating from "@/components/atoms/StarRating";
import Badge from "@/components/atoms/Badge";

const ProductCard = ({ product, onQuickView, onAddToCart, onToggleWishlist, isWishlisted = false }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };
  
  const handleImageLoad = () => {
    setImageLoading(false);
  };
  
  const getFallbackImage = () => {
    const categoryColors = {
      'Footwear': 'ff6b6b',
      'Clothing': '4ecdc4',
      'Accessories': 'feca57',
      'default': 'a8a8a8'
    };
    
    const color = categoryColors[product.Category] || categoryColors.default;
    const encodedName = encodeURIComponent(product.Name);
    
    return `https://via.placeholder.com/400x400/${color}/ffffff?text=${encodedName}`;
  };
  
  const getImageSrc = () => {
    if (imageError || !product.Images || product.Images.length === 0) {
      return getFallbackImage();
    }
    return product.Images[0];
  };

  const discountPercentage = product.DiscountedPrice
    ? Math.round(((product.Price - product.DiscountedPrice) / product.Price) * 100)
    : 0;

  return (
    <motion.div
      className="product-card group relative"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square mb-4">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        <img
          src={getImageSrc()}
          alt={product.Name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.IsNew && <Badge variant="success">New</Badge>}
          {discountPercentage > 0 && (
            <Badge variant="error">{discountPercentage}% OFF</Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onToggleWishlist?.(product)}
            className={`p-2 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white'}`}
          >
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onQuickView?.(product)}
            className="p-2 bg-white"
          >
            <Eye size={16} />
          </Button>
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddToCart?.(product)}
            className="w-full"
          >
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{product.Name}</h3>
        
        <div className="flex items-center gap-2">
          <StarRating rating={product.Rating} size="sm" />
          <span className="text-sm text-gray-500">({product.ReviewCount})</span>
        </div>

        <div className="flex items-center gap-2">
          {product.DiscountedPrice ? (
            <>
              <span className="text-lg font-bold text-primary">
                ${product.DiscountedPrice}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${product.Price}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              ${product.Price}
            </span>
          )}
        </div>

<div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{product.brand}</span>
          <span className="text-sm text-gray-500">{product.stock} in stock</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;