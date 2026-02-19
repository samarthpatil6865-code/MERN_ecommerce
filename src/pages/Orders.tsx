import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { mockOrders } from '@/data/mockData';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const Orders: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login?redirect=/orders');
    return null;
  }

  // Filter orders for current user (in real app, this would come from API)
  const userOrders = mockOrders.filter((order) => order.userId === user?.id || user?.role === 'admin');

  if (userOrders.length === 0) {
    return (
      <Layout>
        <div className="container-custom py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
            <p className="text-muted-foreground mb-6">
              Start shopping to see your orders here.
            </p>
            <Button asChild>
              <Link to="/products">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <div className="space-y-4">
          {userOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">Order {order.id}</h3>
                      <Badge className={statusColors[order.status]}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-2">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium truncate max-w-[150px]">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Ship to: {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
