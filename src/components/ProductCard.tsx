import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock) return;
    
    addToCart(product);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
              -{discount}%
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
          {product.featured && product.inStock && (
            <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.category}
            </p>
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews.toLocaleString()})
              </span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <Button
              size="sm"
              className="w-full mt-2"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              variant={isInCart(product.id) ? 'secondary' : 'default'}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
