import { ref, computed } from 'vue'

export interface CartItem {
  id: string | number
  name: string
  price: number
  quantity: number
  image: string
}

// Singleton state
const _cartItems = ref<CartItem[]>([])
let _isInitialized = false

export function useCartStore() {
  // Load from localStorage only once on client side
  if (!_isInitialized && typeof window !== 'undefined') {
    const saved = localStorage.getItem('user_cart')
    if (saved) {
      try {
        _cartItems.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse cart data', e)
      }
    }
    _isInitialized = true
  }

  // Save to localStorage whenever cart changes
  const saveCart = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_cart', JSON.stringify(_cartItems.value))
    }
  }

  const cartCount = computed(() => {
    return _cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const cartTotal = computed(() => {
    return _cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  function addToCart(product: Omit<CartItem, 'quantity'>, qty: number = 1) {
    const existing = _cartItems.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity += qty
    } else {
      _cartItems.value.push({ ...product, quantity: qty })
    }
    saveCart()
  }

  function removeFromCart(id: string | number) {
    _cartItems.value = _cartItems.value.filter(i => i.id !== id)
    saveCart()
  }

  function updateQuantity(id: string | number, qty: number) {
    const item = _cartItems.value.find(i => i.id === id)
    if (item) {
      if (qty <= 0) {
        removeFromCart(id)
      } else {
        item.quantity = qty
        saveCart()
      }
    }
  }

  function clearCart() {
    _cartItems.value = []
    saveCart()
  }

  return {
    items: _cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
}
