import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, ShoppingCart, Heart, Star, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  features: string[];
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductModal = ({ product, onClose, onAddToCart }: ProductModalProps) => {
  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-[var(--shadow-luxury)] border-0">
        <CardContent className="p-0">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full shadow-md"
          >
            <X size={20} />
          </Button>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[400px] md:h-[600px] object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-kiyho-gold text-kiyho-black">
                {product.category}
              </Badge>
            </div>

            {/* Product Details */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                {/* Product Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold text-kiyho-black">{product.name}</h1>
                    <Button variant="ghost" size="icon" className="text-kiyho-orange">
                      <Heart size={24} />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="fill-kiyho-gold text-kiyho-gold"
                        />
                      ))}
                      <span className="text-sm text-kiyho-black/60 ml-2">(4.8) 124 reviews</span>
                    </div>
                  </div>
                  
                  <p className="text-4xl font-bold text-kiyho-orange mb-6">
                    ${product.price.toLocaleString()}
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-kiyho-black mb-3">Description</h3>
                  <p className="text-kiyho-black/70 leading-relaxed">{product.description}</p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-kiyho-black mb-3">Features</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check size={16} className="text-kiyho-orange" />
                        <span className="text-kiyho-black/70">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-kiyho-beige/30 rounded-lg">
                  <div>
                    <h4 className="font-medium text-kiyho-black mb-1">Free Shipping</h4>
                    <p className="text-sm text-kiyho-black/60">On orders over $200</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-kiyho-black mb-1">Returns</h4>
                    <p className="text-sm text-kiyho-black/60">30-day return policy</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-kiyho-black mb-1">Warranty</h4>
                    <p className="text-sm text-kiyho-black/60">1-year manufacturer warranty</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-kiyho-black mb-1">Authenticity</h4>
                    <p className="text-sm text-kiyho-black/60">100% authentic guarantee</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="luxury"
                  size="lg"
                  onClick={handleAddToCart}
                  className="w-full"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Add to Cart - ${product.price.toLocaleString()}
                </Button>
                
                <div className="flex space-x-3">
                  <Button variant="elegant" size="lg" className="flex-1">
                    Buy Now
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1 border-kiyho-orange text-kiyho-orange hover:bg-kiyho-orange hover:text-white">
                    Add to Wishlist
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductModal;