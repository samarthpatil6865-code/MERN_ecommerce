import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/mockData';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $50',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure checkout',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated support team',
  },
];

const Index: React.FC = () => {
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container-custom py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Discover Quality
              <span className="text-primary block">Products You'll Love</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Shop the latest trends with unbeatable prices. From electronics to fashion,
              find everything you need in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/products?featured=true">View Featured</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-muted/30">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-custom py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
          <Button variant="ghost" asChild>
            <Link to="/products">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} to={`/products?category=${category.slug}`}>
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <span className="text-4xl mb-3 block">{category.icon}</span>
                  <p className="font-medium group-hover:text-primary transition-colors">
                    {category.name}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-custom py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
          <Button variant="ghost" asChild>
            <Link to="/products?featured=true">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-custom py-16 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of happy customers and discover amazing deals on quality products.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/products">Explore All Products</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
