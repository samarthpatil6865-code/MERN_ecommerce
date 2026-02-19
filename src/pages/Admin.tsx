import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { products, mockOrders, mockUsers, categories } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import ProductForm from '@/components/admin/ProductForm';
import { Product } from '@/types';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const Admin: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productsList, setProductsList] = useState<Product[]>(products);

  // Redirect if not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  const filteredProducts = productsList.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = mockOrders.filter(
    (o) =>
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.status.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const stats = [
    {
      title: 'Total Products',
      value: productsList.length,
      icon: Package,
      change: '+12%',
    },
    {
      title: 'Total Orders',
      value: mockOrders.length,
      icon: ShoppingCart,
      change: '+8%',
    },
    {
      title: 'Total Users',
      value: mockUsers.length,
      icon: Users,
      change: '+23%',
    },
    {
      title: 'Revenue',
      value: `$${mockOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}`,
      icon: LayoutDashboard,
      change: '+15%',
    },
  ];

  const handleDeleteProduct = (id: string) => {
    setProductsList(productsList.filter(p => p.id !== id));
    toast({
      title: 'Product deleted',
      description: 'The product has been deleted successfully.',
    });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    toast({
      title: 'Order updated',
      description: `Order ${orderId} status changed to ${newStatus}. (Mock action)`,
    });
  };

  const handleAddProduct = (data: any) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      image: data.image,
      category: data.category,
      rating: Number(data.rating),
      reviews: Number(data.reviews),
      inStock: data.inStock,
      featured: data.featured,
    };

    setProductsList([...productsList, newProduct]);
    setIsAddProductDialogOpen(false);
    toast({
      title: 'Product added',
      description: `${newProduct.name} has been added successfully.`,
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditProductDialogOpen(true);
  };

  const handleUpdateProduct = (data: any) => {
    if (!editingProduct) return;

    const updatedProduct: Product = {
      ...editingProduct,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      image: data.image,
      category: data.category,
      rating: Number(data.rating),
      reviews: Number(data.reviews),
      inStock: data.inStock,
      featured: data.featured,
    };

    setProductsList(productsList.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setIsEditProductDialogOpen(false);
    setEditingProduct(null);
    toast({
      title: 'Product updated',
      description: `${updatedProduct.name} has been updated successfully.`,
    });
  };

  const handleCancelAddProduct = () => {
    setIsAddProductDialogOpen(false);
  };

  const handleCancelEditProduct = () => {
    setIsEditProductDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <Layout>
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your store</p>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className="p-3 rounded-full bg-primary/10">
                        <stat.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-xs text-success mt-2">{stat.change} from last month</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.slice(0, 5).map((order) => {
                      const customer = mockUsers.find((u) => u.id === order.userId);
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{customer?.name || 'Unknown'}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[order.status]}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>Products ({filteredProducts.length})</CardTitle>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="pl-10 w-[250px]"
                      />
                    </div>
                    <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add New Product</DialogTitle>
                          <DialogDescription>
                            Fill in the details to add a new product to your store.
                          </DialogDescription>
                        </DialogHeader>
                        <ProductForm
                          onSubmit={handleAddProduct}
                          onCancel={handleCancelAddProduct}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {product.name}
                        </TableCell>
                        <TableCell className="capitalize">{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={product.inStock ? 'default' : 'destructive'}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>Orders ({filteredOrders.length})</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="pl-10 w-[250px]"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => {
                      const customer = mockUsers.find((u) => u.id === order.userId);
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{customer?.name || 'Unknown'}</TableCell>
                          <TableCell>
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                          </TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Select
                              defaultValue={order.status}
                              onValueChange={(value) =>
                                handleUpdateOrderStatus(order.id, value)
                              }
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users ({mockUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.id}</TableCell>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Product Dialog */}
        <Dialog open={isEditProductDialogOpen} onOpenChange={setIsEditProductDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the product information.
              </DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <ProductForm
                onSubmit={handleUpdateProduct}
                onCancel={handleCancelEditProduct}
                initialData={{
                  name: editingProduct.name,
                  description: editingProduct.description,
                  price: editingProduct.price.toString(),
                  originalPrice: editingProduct.originalPrice?.toString() || '',
                  category: editingProduct.category,
                  rating: editingProduct.rating.toString(),
                  reviews: editingProduct.reviews.toString(),
                  inStock: editingProduct.inStock,
                  featured: editingProduct.featured || false,
                  image: editingProduct.image,
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Admin;
