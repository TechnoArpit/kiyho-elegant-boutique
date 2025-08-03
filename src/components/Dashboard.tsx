import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Search, Menu, X, User, LogOut, Heart, Star } from 'lucide-react';
import ProductModal from './ProductModal';
import CartCheckout from './CartCheckout';

// Import product images
import miniKellyImg from '@/assets/mini-kelly.jpg';
import neverfullImg from '@/assets/neverfull.jpg';
import ggMarmontImg from '@/assets/gg-marmont.jpg';
import galleriaImg from '@/assets/galleria.jpg';
import satchelImg from '@/assets/satchel.jpg';
import executiveToteImg from '@/assets/executive-tote.jpg';
import weekendBagImg from '@/assets/weekend-bag.jpg';
import canvasBackpackImg from '@/assets/canvas-backpack.jpg';
import veganCrossbodyImg from '@/assets/vegan-crossbody.jpg';
import minimalistClutchImg from '@/assets/minimalist-clutch.jpg';

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  features: string[];
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Mini Kelly',
    price: 2500,
    image: miniKellyImg,
    category: 'Luxury',
    description: 'Inspired by the iconic Kelly bag, this miniature version offers timeless elegance in a compact size. Crafted from premium leather with impeccable attention to detail.',
    features: ['Premium Italian Leather', 'Gold-plated Hardware', 'Structured Design', 'Detachable Strap']
  },
  {
    id: '2',
    name: 'Louis Vuitton Neverfull MM',
    price: 2000,
    image: neverfullImg,
    category: 'Luxury',
    description: 'A spacious and practical tote bag that embodies luxury and functionality. Perfect for the modern woman who needs style and substance.',
    features: ['Monogram Canvas', 'Leather Trim', 'Interior Zip Pocket', 'Timeless Design']
  },
  {
    id: '3',
    name: 'Gucci GG Marmont',
    price: 2350,
    image: ggMarmontImg,
    category: 'Luxury',
    description: 'A sophisticated shoulder bag featuring the iconic GG logo and quilted design. Combines vintage charm with contemporary appeal.',
    features: ['Quilted Leather', 'Chain Strap', 'GG Hardware', 'Multiple Compartments']
  },
  {
    id: '4',
    name: 'Prada Galleria Saffiano',
    price: 2800,
    image: galleriaImg,
    category: 'Luxury',
    description: 'The epitome of understated luxury. This structured bag features Prada\'s signature Saffiano leather and clean, architectural lines.',
    features: ['Saffiano Leather', 'Structured Shape', 'Double Handles', 'Interior Organization']
  },
  {
    id: '5',
    name: 'Leather Satchel',
    price: 650,
    image: satchelImg,
    category: 'Business',
    description: 'Professional and polished, this leather satchel is perfect for the workplace. Combines style with functionality for the modern professional.',
    features: ['Full-Grain Leather', 'Laptop Compartment', 'Professional Design', 'Comfortable Handles']
  },
  {
    id: '6',
    name: 'Executive Tote',
    price: 730,
    image: executiveToteImg,
    category: 'Business',
    description: 'A sophisticated tote designed for the executive woman. Spacious interior and elegant exterior make it perfect for business meetings and travel.',
    features: ['Executive Design', 'Multiple Pockets', 'Professional Finish', 'Durable Construction']
  },
  {
    id: '7',
    name: 'Weekend Bag',
    price: 350,
    image: weekendBagImg,
    category: 'Casual',
    description: 'Perfect for weekend getaways and casual outings. This versatile bag combines comfort with style for everyday adventures.',
    features: ['Soft Leather', 'Casual Design', 'Weekend Size', 'Comfortable Straps']
  },
  {
    id: '8',
    name: 'Everyday Canvas Backpack',
    price: 220,
    image: canvasBackpackImg,
    category: 'Casual',
    description: 'A practical and stylish backpack for everyday use. Made from durable canvas with leather accents for a sophisticated touch.',
    features: ['Canvas Material', 'Leather Accents', 'Multiple Compartments', 'Comfortable Straps']
  },
  {
    id: '9',
    name: 'Vegan Crossbody',
    price: 199,
    image: veganCrossbodyImg,
    category: 'Budget',
    description: 'Ethical and stylish, this vegan leather crossbody bag offers guilt-free luxury at an accessible price point.',
    features: ['Vegan Leather', 'Crossbody Design', 'Eco-Friendly', 'Affordable Luxury']
  },
  {
    id: '10',
    name: 'Minimalist Clutch',
    price: 149,
    image: minimalistClutchImg,
    category: 'Budget',
    description: 'A sleek and minimalist clutch perfect for evening events. Clean lines and premium materials at an accessible price.',
    features: ['Minimalist Design', 'Evening Wear', 'Compact Size', 'Premium Feel']
  }
];

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const categories = ['All', 'Luxury', 'Business', 'Casual', 'Budget'];

  useEffect(() => {
    const savedCart = localStorage.getItem('kiyho_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kiyho_cart', JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('kiyho_session');
    localStorage.removeItem('kiyho_cart');
    onLogout();
    toast({
      title: "Logged out successfully",
      description: "Thank you for visiting Kiyho!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-kiyho-beige/20 to-background font-poppins">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-kiyho-beige sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-kiyho-black">
                Ki<span className="text-kiyho-orange">yho</span>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Button variant="ghost" onClick={() => setSelectedCategory('All')}>
                Home
              </Button>
              <Button variant="ghost" onClick={() => setShowCart(false)}>
                Shop
              </Button>
              <div className="flex items-center space-x-2 text-kiyho-black">
                <User size={16} />
                <span className="text-sm">Hello, {user.fullName}</span>
              </div>
              <Button variant="ghost" onClick={handleLogout} className="text-kiyho-black">
                <LogOut size={16} className="mr-1" />
                Logout
              </Button>
              <Button
                variant="elegant"
                onClick={() => setShowCart(true)}
                className="relative"
              >
                <ShoppingCart size={16} className="mr-1" />
                Cart
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-kiyho-orange text-white text-xs min-w-[20px] h-5">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-kiyho-beige">
              <div className="flex flex-col space-y-2">
                <div className="px-2 py-2 text-kiyho-black">
                  <div className="flex items-center space-x-2">
                    <User size={16} />
                    <span className="text-sm">Hello, {user.fullName}</span>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => { setSelectedCategory('All'); setMobileMenuOpen(false); }}>
                  Home
                </Button>
                <Button variant="ghost" onClick={() => { setShowCart(false); setMobileMenuOpen(false); }}>
                  Shop
                </Button>
                <Button 
                  variant="elegant" 
                  onClick={() => { setShowCart(true); setMobileMenuOpen(false); }}
                  className="relative justify-start"
                >
                  <ShoppingCart size={16} className="mr-2" />
                  Cart ({getTotalItems()})
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="justify-start text-kiyho-black">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {showCart ? (
          <CartCheckout
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            onBackToShopping={() => setShowCart(false)}
            getTotalPrice={getTotalPrice}
          />
        ) : (
          <>
            {/* Welcome Header */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-kiyho-black mb-4">
                Welcome back, {user.fullName}!
              </h2>
              <p className="text-xl text-kiyho-black/70 mb-6">
                Discover our exquisite collection of premium handbags
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-kiyho-black/50" size={20} />
              <Input
                type="text"
                placeholder="Search handbags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-kiyho-beige focus:border-kiyho-orange"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "luxury" : "elegant"}
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all duration-300"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <Card 
                  key={product.id} 
                  className="group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-luxury)] border-0 bg-white/95 backdrop-blur-sm overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button variant="luxury" size="icon" className="rounded-full">
                          <Heart size={16} />
                        </Button>
                      </div>
                      <Badge className="absolute top-4 left-4 bg-kiyho-gold text-kiyho-black">
                        {product.category}
                      </Badge>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-kiyho-black group-hover:text-kiyho-orange transition-colors duration-300">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="fill-kiyho-gold text-kiyho-gold" />
                          <span className="text-sm text-kiyho-black/60">4.8</span>
                        </div>
                      </div>
                      
                      <p className="text-2xl font-bold text-kiyho-orange mb-4">
                        ${product.price.toLocaleString()}
                      </p>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProduct(product)}
                          className="flex-1 border-kiyho-orange text-kiyho-orange hover:bg-kiyho-orange hover:text-white"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="luxury"
                          size="sm"
                          onClick={() => addToCart(product)}
                          className="flex-1"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-kiyho-black/60">No products found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
};

export default Dashboard;