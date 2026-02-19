import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X } from 'lucide-react';
import { categories } from '@/data/mockData';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Name too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description too long'),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Price must be a positive number'),
  originalPrice: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  rating: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 5, 'Rating must be between 0 and 5'),
  reviews: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Reviews must be a positive number'),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  image: z.string().min(1, 'Product image is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ProductFormData>;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || '');
  const [imageError, setImageError] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || '',
      originalPrice: initialData?.originalPrice || '',
      category: initialData?.category || '',
      rating: initialData?.rating || '0',
      reviews: initialData?.reviews || '0',
      inStock: initialData?.inStock ?? true,
      featured: initialData?.featured ?? false,
      image: initialData?.image || '',
    },
  });

  const watchedValues = watch();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImagePreview(url);
    setValue('image', url);
    setImageError('');
  };

  const handleImageError = () => {
    setImageError('Failed to load image. Please check the URL.');
  };

  const handleImageLoad = () => {
    setImageError('');
  };

  const onFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter product name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Enter product description"
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={watchedValues.category}
                  onValueChange={(value) => setValue('category', value)}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        <div className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Sale Price *</Label>
                <Input
                  id="price"
                  {...register('price')}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                <Input
                  id="originalPrice"
                  {...register('originalPrice')}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Image & Settings */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="image">Image URL *</Label>
                <div className="relative">
                  <Input
                    id="image"
                    {...register('image')}
                    placeholder="https://example.com/image.jpg"
                    onChange={handleImageChange}
                    className={errors.image || imageError ? 'border-red-500' : ''}
                  />
                </div>
                {errors.image && (
                  <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
                )}
                {imageError && (
                  <p className="text-sm text-red-500 mt-1">{imageError}</p>
                )}
              </div>

              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview('');
                      setValue('image', '');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {!imagePreview && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600">
                    Enter an image URL above to preview
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="inStock">In Stock</Label>
                  <p className="text-sm text-gray-600">Product is available for purchase</p>
                </div>
                <Switch
                  id="inStock"
                  checked={watchedValues.inStock}
                  onCheckedChange={(checked) => setValue('inStock', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="featured">Featured Product</Label>
                  <p className="text-sm text-gray-600">Show on homepage</p>
                </div>
                <Switch
                  id="featured"
                  checked={watchedValues.featured}
                  onCheckedChange={(checked) => setValue('featured', checked)}
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input
                  id="rating"
                  {...register('rating')}
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="4.5"
                  className={errors.rating ? 'border-red-500' : ''}
                />
                {errors.rating && (
                  <p className="text-sm text-red-500 mt-1">{errors.rating.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="reviews">Number of Reviews</Label>
                <Input
                  id="reviews"
                  {...register('reviews')}
                  type="number"
                  min="0"
                  placeholder="0"
                  className={errors.reviews ? 'border-red-500' : ''}
                />
                {errors.reviews && (
                  <p className="text-sm text-red-500 mt-1">{errors.reviews.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Product Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 p-4 border rounded-lg">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={watchedValues.name || 'Product'}
                className="w-24 h-24 object-cover rounded"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{watchedValues.name || 'Product Name'}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {watchedValues.description || 'Product description will appear here...'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold text-primary">
                  ${watchedValues.price || '0.00'}
                </span>
                {watchedValues.originalPrice && Number(watchedValues.originalPrice) > Number(watchedValues.price) && (
                  <span className="text-sm text-gray-500 line-through">
                    ${watchedValues.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={watchedValues.inStock ? 'default' : 'destructive'}>
                  {watchedValues.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
                {watchedValues.featured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
                {watchedValues.category && (
                  <Badge variant="outline" className="capitalize">
                    {categories.find(c => c.slug === watchedValues.category)?.name || watchedValues.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit(onFormSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
