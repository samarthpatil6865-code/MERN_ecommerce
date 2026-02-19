import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Truck, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container-custom py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </Layout>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    
    addToCart(product, quantity);
    toast({
      title: 'Added to cart',
      description: `${quantity}x ${product.name} has been added to your cart.`,
    });
  };

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <span>/</span>
          <Link 
            to={`/products?category=${product.category}`} 
            className="hover:text-foreground capitalize"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-sm">
                -{discount}% OFF
              </Badge>
            )}
            {product.featured && (
              <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                Featured
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviews.toLocaleString()} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <Separator />

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!product.inStock}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.inStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  variant={isInCart(product.id) ? 'secondary' : 'default'}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {!product.inStock
                    ? 'Out of Stock'
                    : isInCart(product.id)
                    ? 'Add More'
                    : 'Add to Cart'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    handleAddToCart();
                    navigate('/cart');
                  }}
                  disabled={!product.inStock}
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted">
                <Truck className="h-5 w-5 text-primary mb-2" />
                <span className="text-xs font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted">
                <Shield className="h-5 w-5 text-primary mb-2" />
                <span className="text-xs font-medium">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted">
                <RefreshCw className="h-5 w-5 text-primary mb-2" />
                <span className="text-xs font-medium">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
