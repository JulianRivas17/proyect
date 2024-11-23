import React, { createContext, useContext, useState } from "react";

interface CartItem {
  id: number;
  nombre: string;
  cantidad: number;
  precioTotal: number;
  imagen: string;
  descripcion: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
  calculateTotalItems: () => number;
  updateQuantity: (id: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                cantidad: cartItem.cantidad + item.cantidad,
                precioTotal: cartItem.precioTotal + item.precioTotal,
              }
            : cartItem
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((cartItem) => cartItem.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.precioTotal, 0);
  };

  const calculateTotalItems = () => {
    return cart.reduce((total, item) => total + item.cantidad, 0);
  };

  // Nuevo método para actualizar la cantidad de un producto
  const updateQuantity = (id: number, quantity: number) => {
    setCart((prev) =>
      prev.map((cartItem) =>
        cartItem.id === id
          ? {
              ...cartItem,
              cantidad: quantity,
              precioTotal: quantity * (cartItem.precioTotal / cartItem.cantidad),
            }
          : cartItem
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        calculateTotal,
        calculateTotalItems,
        updateQuantity, // Exporta el nuevo método
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
