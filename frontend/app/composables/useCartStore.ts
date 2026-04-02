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
const _currentUserEmail = ref<string | null>(null)

export function useCartStore() {
  const getStorageKey = () => {
    return _currentUserEmail.value ? `user_cart_${_currentUserEmail.value}` : 'guest_cart'
  }

  // Load from localStorage for specific user
  const initializeCart = (email: string | null) => {
    if (typeof window === 'undefined') return
    
    _currentUserEmail.value = email
    const key = getStorageKey()
    const saved = localStorage.getItem(key)
    
    if (saved) {
      try {
        _cartItems.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse cart data', e)
        _cartItems.value = []
      }
    } else {
      _cartItems.value = []
    }
  }

  // Save to localStorage whenever cart changes
  const saveCart = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(getStorageKey(), JSON.stringify(_cartItems.value))
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
    // If logging out, we also clear the storage for the current key
    if (typeof window !== 'undefined') {
       // Optionally remove the item entirely from localStorage instead of just setting []
       // localStorage.removeItem(getStorageKey())
    }
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
    clearCart,
    initializeCart
  }
}
