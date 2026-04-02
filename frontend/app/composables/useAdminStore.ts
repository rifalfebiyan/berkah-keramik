import { ref, computed } from 'vue'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Product {
  id: number
  name: string
  price: number
  oldPrice?: number
  discount?: string
  stock: number
  sold: number
  rating: number
  size?: string
  color?: string
  imageUrl: string | null
  brand?: { name: string }
  category?: { name: string }
  subcategory?: { name: string }
}

export interface OrderItem {
  productName: string
  pricePerUnit: number
  quantity: number
  total: number
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'

export interface Order {
  id: number
  customer: string
  phone?: string
  address?: string
  total: number
  status: OrderStatus
  date: string
  items?: OrderItem[]
}

export interface CartItem {
  productId: number
  productName: string
  pricePerUnit: number
  quantity: number
  total: number
}

// ─── Shared state (singleton refs) ───────────────────────────────────────────
const _products = ref<Product[]>([])
const _orders = ref<Order[]>([])
const _isInitialized = ref(false)

export function useAdminStore() {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl
  const token = useCookie('token')

  // ── Computed stats ───────────────────────────────────────────────────────────
  const totalRevenue = computed(() => _orders.value.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0))
  const pendingCount = computed(() => _orders.value.filter(o => o.status === 'pending').length)
  const lowStockCount = computed(() => _products.value.filter(p => p.stock < 20).length)

  // ── Initialization ─────────────────────────────────────────────────────────
  async function init() {
    if (_isInitialized.value) return
    await Promise.all([fetchProducts(), fetchOrders()])
    _isInitialized.value = true
  }

  // ── Product actions ──────────────────────────────────────────────────────────
  async function fetchProducts() {
    try {
      const { $api } = useNuxtApp()
      const data = await $api<Product[]>('/products')
      _products.value = data
    } catch (err) {
      console.error('Failed to fetch products:', err)
    }
  }

  async function deductStock(productId: number, qty: number) {
    const product = _products.value.find(p => p.id === productId)
    if (product) {
      product.stock -= qty
      product.sold = (product.sold || 0) + qty
    }
  }

  // ── Order actions ────────────────────────────────────────────────────────────
  async function fetchOrders() {
    try {
      const { $api } = useNuxtApp()
      const data = await $api<Order[]>('/orders')
      _orders.value = data
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    }
  }

  async function addOrder(orderData: Omit<Order, 'id'>) {
    try {
      const { $api } = useNuxtApp()
      const newOrder = await $api<Order>('/orders', {
        method: 'POST',
        body: orderData
      })
      _orders.value.unshift(newOrder)
      return newOrder.id
    } catch (err) {
      console.error('Failed to create order:', err)
      throw err
    }
  }

  async function updateOrderStatus(id: number, status: OrderStatus) {
    try {
      const { $api } = useNuxtApp()
      await $api(`/orders/${id}`, {
        method: 'PATCH',
        body: { status }
      })
      const idx = _orders.value.findIndex(o => o.id === id)
      if (idx !== -1) _orders.value[idx]!.status = status
    } catch (err) {
      console.error('Failed to update order status:', err)
    }
  }

  return {
    products: _products,
    orders: _orders,
    totalRevenue,
    pendingCount,
    lowStockCount,
    init,
    fetchProducts,
    fetchOrders,
    deductStock,
    addOrder,
    updateOrderStatus,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)

export type StatusConfig = {
  label: string
  color: string
  icon: string
}

export const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending:    { label: 'Menunggu',    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',  icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  processing: { label: 'Diproses',   color: 'bg-blue-100 text-blue-700 border-blue-200',        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  shipped:    { label: 'Dikirim',    color: 'bg-purple-100 text-purple-700 border-purple-200',  icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10H1m4 0h10m0 0h2m-2 0V9a3 3 0 00-3-3H9' },
  completed:  { label: 'Selesai',    color: 'bg-green-100 text-green-700 border-green-200',     icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  cancelled:  { label: 'Dibatalkan', color: 'bg-red-100 text-red-700 border-red-200',           icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
}

