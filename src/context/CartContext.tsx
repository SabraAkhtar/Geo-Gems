import React, { createContext, useContext, useState, useCallback } from 'react';
import { Gemstone } from '../types';
import { getStoneId, getPriceDisplay } from '../utils/gemstoneHelpers';
import { BUSINESS_WHATSAPP_NUMBER } from '../utils/gemstoneHelpers';

export interface CartItem {
  gemstone: Gemstone;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (gemstone: Gemstone) => void;
  removeFromCart: (gemstoneId: string) => void;
  updateQuantity: (gemstoneId: string, quantity: number) => void;
  clearCart: () => void;
  buildWhatsAppMessage: (formData: CartFormData) => string;
}

export interface CartFormData {
  name: string;
  phone: string;
  country: string;
  message: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback((gemstone: Gemstone) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.gemstone.id === gemstone.id);
      if (existing) {
        return prev.map((item) =>
          item.gemstone.id === gemstone.id
            ? { ...item, quantity: Math.min(item.quantity + 1, 10) }
            : item
        );
      }
      return [...prev, { gemstone, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((gemstoneId: string) => {
    setCartItems((prev) => prev.filter((item) => item.gemstone.id !== gemstoneId));
  }, []);

  const updateQuantity = useCallback((gemstoneId: string, quantity: number) => {
    if (quantity < 1) {
      setCartItems((prev) => prev.filter((item) => item.gemstone.id !== gemstoneId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.gemstone.id === gemstoneId
          ? { ...item, quantity: Math.min(quantity, 10) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const buildWhatsAppMessage = useCallback(
    (formData: CartFormData): string => {
      const itemLines = cartItems
        .map((item, idx) => {
          const stoneId = getStoneId(item.gemstone);
          const price = getPriceDisplay(item.gemstone);
          return [
            `${idx + 1}. ${item.gemstone.name}`,
            `   ID: ${stoneId}`,
            `   Weight: ${item.gemstone.weight} ${item.gemstone.weightUnit || 'ct'}`,
            `   Price: ${price.label}`,
            `   Quantity: ${item.quantity}`,
          ].join('\n');
        })
        .join('\n\n');

      const lines = [
        'Hello Geo Gems Crystals,',
        '',
        'I would like to inquire about the following stones:',
        '',
        itemLines,
        '',
        '─────────────────────',
        `Name: ${formData.name}`,
        `Phone / WhatsApp: ${formData.phone}`,
        `Country: ${formData.country}`,
        formData.message ? `Message: ${formData.message}` : '',
        '',
        'Please confirm availability and share payment details.',
      ]
        .filter((l) => l !== undefined)
        .join('\n');

      return lines;
    },
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        buildWhatsAppMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
