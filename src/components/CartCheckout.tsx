import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Minus, Trash2, CreditCard, Smartphone } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  features: string[];
  quantity: number;
}

interface CartCheckoutProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onBackToShopping: () => void;
  getTotalPrice: () => number;
}

const CartCheckout = ({ 
  cart, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  onBackToShopping, 
  getTotalPrice 
}: CartCheckoutProps) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const { toast } = useToast();

  const shipping = getTotalPrice() > 200 ? 0 : 25;
  const tax = getTotalPrice() * 0.08; // 8% tax
  const finalTotal = getTotalPrice() + shipping + tax;

  const handleQuantityChange = (productId: string, delta: number) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
      const newQuantity = Math.max(0, item.quantity + delta);
      onUpdateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method to continue.",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOrderComplete(true);
      localStorage.removeItem('kiyho_cart');
      
      toast({
        title: "Payment Successful!",
        description: `Your order of $${finalTotal.toFixed(2)} has been processed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-white rounded-2xl p-8 shadow-[var(--shadow-luxury)]">
          <div className="w-20 h-20 bg-gradient-to-r from-kiyho-orange to-kiyho-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-kiyho-black mb-4">Payment Successful!</h2>
          <p className="text-kiyho-black/70 mb-8">
            Thank you for your purchase! Your order has been confirmed and will be shipped within 2-3 business days.
          </p>
          <Button variant="luxury" size="lg" onClick={onBackToShopping}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBackToShopping} className="text-kiyho-black">
          <ArrowLeft size={20} className="mr-2" />
          Back to Shopping
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-kiyho-black mb-6">Shopping Cart</h2>
          
          {cart.length === 0 ? (
            <Card className="shadow-[var(--shadow-card)] border-0 bg-white/95">
              <CardContent className="p-8 text-center">
                <p className="text-xl text-kiyho-black/60 mb-4">Your cart is empty</p>
                <Button variant="luxury" onClick={onBackToShopping}>
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            cart.map((item) => (
              <Card key={item.id} className="shadow-[var(--shadow-card)] border-0 bg-white/95">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-kiyho-black">{item.name}</h3>
                          <p className="text-sm text-kiyho-black/60">{item.category}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="h-8 w-8"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center text-kiyho-black">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="h-8 w-8"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-semibold text-kiyho-orange">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-sm text-kiyho-black/60">
                            ${item.price.toLocaleString()} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Checkout Summary */}
        <div className="space-y-6">
          <Card className="shadow-[var(--shadow-card)] border-0 bg-white/95">
            <CardHeader>
              <CardTitle className="text-kiyho-black">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-kiyho-black/70">Subtotal</span>
                <span className="text-kiyho-black">${getTotalPrice().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-kiyho-black/70">Shipping</span>
                <span className="text-kiyho-black">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-kiyho-black/70">Tax</span>
                <span className="text-kiyho-black">${tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-kiyho-beige pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-kiyho-black">Total</span>
                  <span className="text-lg font-semibold text-kiyho-orange">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {shipping > 0 && (
                <p className="text-sm text-kiyho-black/60 bg-kiyho-beige/30 p-3 rounded-lg">
                  Add ${(200 - getTotalPrice()).toFixed(2)} more for free shipping!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          {cart.length > 0 && (
            <Card className="shadow-[var(--shadow-card)] border-0 bg-white/95">
              <CardHeader>
                <CardTitle className="text-kiyho-black">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border border-kiyho-beige rounded-lg hover:bg-kiyho-beige/20 transition-colors">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex items-center space-x-2 flex-1 cursor-pointer">
                      <CreditCard size={20} className="text-kiyho-orange" />
                      <span>Credit Card</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border border-kiyho-beige rounded-lg hover:bg-kiyho-beige/20 transition-colors">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center space-x-2 flex-1 cursor-pointer">
                      <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">P</span>
                      </div>
                      <span>PayPal</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border border-kiyho-beige rounded-lg hover:bg-kiyho-beige/20 transition-colors">
                    <RadioGroupItem value="esewa" id="esewa" />
                    <Label htmlFor="esewa" className="flex items-center space-x-2 flex-1 cursor-pointer">
                      <Smartphone size={20} className="text-green-600" />
                      <span>eSewa (Nepal)</span>
                    </Label>
                  </div>
                </RadioGroup>

                <Button
                  variant="luxury"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isProcessing || cart.length === 0}
                  className="w-full mt-6"
                >
                  {isProcessing ? 'Processing...' : `Confirm Payment - $${finalTotal.toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartCheckout;