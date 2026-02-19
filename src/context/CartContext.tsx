import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'spot-ecommerce-cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.product.id === product.id
      );

      if (existingItem) {
        return currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...currentItems, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(currentItems =>
      currentItems.filter(item => item.product.id !== productId)
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (productId: string) => items.some(item => item.product.id === productId),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
