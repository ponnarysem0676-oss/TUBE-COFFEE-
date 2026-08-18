import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tube-cart") || "[]"); } catch { return []; }
  });
  useEffect(() => localStorage.setItem("tube-cart", JSON.stringify(items)), [items]);

  const addToCart = (product) => setItems(prev => {
    const found = prev.find(i => i.productId === product.id);
    if (found) return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
    return [...prev, { productId: product.id, name: product.name, price: Number(product.price), image: product.image || "", quantity: 1 }];
  });
  const removeFromCart = id => setItems(prev => prev.filter(i => i.productId !== id));
  const setQuantity = (id, quantity) => setItems(prev => quantity < 1 ? prev.filter(i => i.productId !== id) : prev.map(i => i.productId === id ? {...i, quantity} : i));
  const clearCart = () => setItems([]);
  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  return <CartContext.Provider value={{items, addToCart, removeFromCart, setQuantity, clearCart, total, count}}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
