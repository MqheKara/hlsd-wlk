import { createContext, useContext, useEffect, useState } from 'react'

// Cart is keyed by `${shopCode}:${subShopCode || 'main'}`
const CartContext = createContext(null)

const STORAGE_KEY = 'shop_carts_v1'

export function CartProvider({ children }) {
  const [carts, setCarts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carts))
  }, [carts])

  const cartKey = (shopCode, subShopCode) =>
    `${shopCode.toUpperCase()}:${subShopCode || 'main'}`

  const getCart = (shopCode, subShopCode) =>
    carts[cartKey(shopCode, subShopCode)] || []

  const addItem = (shopCode, subShopCode, item) => {
    const key = cartKey(shopCode, subShopCode)
    setCarts((prev) => {
      const cart = prev[key] || []
      const existing = cart.find((c) => c.id === item.id)
      let next
      if (existing) {
        next = cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        )
      } else {
        next = [...cart, { ...item, quantity: 1 }]
      }
      return { ...prev, [key]: next }
    })
  }

  const updateQuantity = (shopCode, subShopCode, itemId, qty) => {
    const key = cartKey(shopCode, subShopCode)
    setCarts((prev) => {
      const cart = prev[key] || []
      let next
      if (qty <= 0) next = cart.filter((c) => c.id !== itemId)
      else next = cart.map((c) => (c.id === itemId ? { ...c, quantity: qty } : c))
      return { ...prev, [key]: next }
    })
  }

  const removeItem = (shopCode, subShopCode, itemId) =>
    updateQuantity(shopCode, subShopCode, itemId, 0)

  const clearCart = (shopCode, subShopCode) => {
    const key = cartKey(shopCode, subShopCode)
    setCarts((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const cartTotal = (shopCode, subShopCode) =>
    getCart(shopCode, subShopCode).reduce(
      (sum, c) => sum + c.price * c.quantity,
      0,
    )

  const cartCount = (shopCode, subShopCode) =>
    getCart(shopCode, subShopCode).reduce((sum, c) => sum + c.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        getCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
