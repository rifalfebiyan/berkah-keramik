<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAdminStore, formatCurrency, type CartItem, type Order, type Product } from '@/composables/useAdminStore'

const { products, addOrder, deductStock, init } = useAdminStore()

// ── Shared State ─────────────────────────────────────────────────────────────
const cartItems = ref<CartItem[]>([])
const customerName = ref('')
const customerPhone = ref('')
const customerAddress = ref('')
const shippingCost = ref(0)
const productSearch = ref('')
const selectedCategory = ref('Semua')
const isProcessing = ref(false)
const printOrder = ref<Order | null>(null)
const showDraftsModal = ref(false)
const savedDrafts = ref<{ id: string, name: string, date: string, items: CartItem[], customer: string }[]>([])

// ── Initialization ─────────────────────────────────────────────────────────
onMounted(async () => {
  await init()
  loadDraftsFromStorage()
})

// ── Computed ─────────────────────────────────────────────────────────────────
const categories = computed(() => {
  const cats = new Set(products.value.map(p => p.category?.name).filter(Boolean))
  return ['Semua', ...Array.from(cats)] as string[]
})

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.value.toLowerCase()) || 
                          (p.category?.name.toLowerCase().includes(productSearch.value.toLowerCase()))
    const matchesCategory = selectedCategory.value === 'Semua' || p.category?.name === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const cartSubtotal = computed(() => cartItems.value.reduce((s, i) => s + i.total, 0))
const grandTotal = computed(() => cartSubtotal.value + (shippingCost.value || 0))

// ── Actions ──────────────────────────────────────────────────────────────────
function addToCart(product: Product) {
  if (product.stock <= 0) return
  
  const existing = cartItems.value.find(i => i.productId === product.id)
  if (existing) {
    if (existing.quantity < product.stock) {
      existing.quantity++
      existing.total = existing.quantity * existing.pricePerUnit
    }
  } else {
    cartItems.value.push({
      productId: product.id,
      productName: product.name,
      pricePerUnit: product.price,
      quantity: 1,
      total: product.price,
      imageUrl: product.imageUrl // Assuming we want to track this or just use store
    } as any)
  }
}

function updateQuantity(productId: number, delta: number) {
  const item = cartItems.value.find(i => i.productId === productId)
  const product = products.value.find(p => p.id === productId)
  if (!item || !product) return

  const newQty = item.quantity + delta
  if (newQty <= 0) {
    removeFromCart(productId)
  } else if (newQty <= product.stock) {
    item.quantity = newQty
    item.total = item.quantity * item.pricePerUnit
  }
}

function removeFromCart(productId: number) {
  cartItems.value = cartItems.value.filter(i => i.productId !== productId)
}

// ── Draft Feature ─────────────────────────────────────────────────────────────
function loadDraftsFromStorage() {
  const stored = localStorage.getItem('cashier_drafts')
  if (stored) savedDrafts.value = JSON.parse(stored)
}

function saveDraft() {
  if (cartItems.value.length === 0) return
  
  const newDraft = {
    id: Date.now().toString(),
    name: customerName.value || 'Tanpa Nama',
    date: new Date().toLocaleString(),
    items: [...cartItems.value],
    customer: customerName.value,
    phone: customerPhone.value,
    address: customerAddress.value
  }
  
  savedDrafts.value.unshift(newDraft as any)
  localStorage.setItem('cashier_drafts', JSON.stringify(savedDrafts.value))
  
  // Optional: reset after saving draft
  // resetForm()
  alert('Draft berhasil disimpan!')
}

function loadDraft(draft: any) {
  cartItems.value = [...draft.items]
  customerName.value = draft.customer || ''
  customerPhone.value = draft.phone || ''
  customerAddress.value = draft.address || ''
  showDraftsModal.value = false
}

function deleteDraft(id: string) {
  savedDrafts.value = savedDrafts.value.filter(d => d.id !== id)
  localStorage.setItem('cashier_drafts', JSON.stringify(savedDrafts.value))
}

// ── Order Processing ─────────────────────────────────────────────────────────
async function handleCreateOrder() {
  if (!customerName.value || cartItems.value.length === 0) return
  isProcessing.value = true

  try {
    const orderData = {
      customer: customerName.value,
      phone:    customerPhone.value,
      address:  customerAddress.value,
      total:    grandTotal.value, 
      status:   'pending' as const,
      date:     new Date().toISOString().split('T')[0] ?? '',
      shipping: shippingCost.value,
      items:    cartItems.value.map(i => ({ 
        productName: i.productName,
        pricePerUnit: i.pricePerUnit,
        quantity: i.quantity,
        total: i.total
      })),
    }

    const orderId = await addOrder(orderData)

    printOrder.value = { id: orderId, ...orderData } as Order
    
    // deduct stock locally
    cartItems.value.forEach(item => deductStock(item.productId, item.quantity))
    
    resetForm()
  } catch (err) {
    alert('Gagal membuat pesanan.')
  } finally {
    isProcessing.value = false
  }
}

function resetForm() {
  cartItems.value = []
  customerName.value = ''
  customerPhone.value = ''
  customerAddress.value = ''
  shippingCost.value = 0
  productSearch.value = ''
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getProductStock(id: number) {
  return products.value.find(p => p.id === id)?.stock || 0
}

function getProductImage(id: number) {
  return products.value.find(p => p.id === id)?.imageUrl || '/placeholder-product.png'
}
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-100px)] gap-4 overflow-hidden -mt-4">
    
    <!-- Top Action & Filter Row -->
    <div class="flex items-center justify-between gap-4 flex-wrap flex-shrink-0 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="selectedCategory = cat"
          :class="[
            'px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border uppercase tracking-wider',
            selectedCategory === cat 
              ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
              : 'bg-gray-50 text-gray-500 border-transparent hover:bg-white hover:border-blue-300 hover:text-blue-600'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <div class="flex items-center gap-3">
        <div class="relative w-64 group">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="productSearch"
            type="text" 
            placeholder="Cari nama atau kategori..." 
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-0 text-sm shadow-inner transition-all"
          />
        </div>
        
        <button 
          @click="showDraftsModal = true"
          class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition-all shadow-sm"
        >
          <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse" v-if="savedDrafts.length > 0"></div>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Draft ({{ savedDrafts.length }})
        </button>
      </div>
    </div>

    <div class="flex-1 flex gap-6 min-h-0">
      
      <!-- Left: Product Grid -->
      <div class="flex-[3] overflow-y-auto pr-2 no-scrollbar">
        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
          <div 
            v-for="p in filteredProducts" 
            :key="p.id"
            @click="addToCart(p)"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer overflow-hidden p-3 relative"
          >
            <!-- Out of Stock Overlay -->
            <div v-if="p.stock <= 0" class="absolute inset-0 bg-white/60 z-10 flex items-center justify-center p-4">
              <span class="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Stok Habis</span>
            </div>

            <div class="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
              <img :src="p.imageUrl || '/placeholder-product.png'" :alt="p.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                  {{ p.category?.name || 'Umum' }}
                </span>
                <span v-if="p.stock > 0" class="text-[10px] text-gray-400 font-medium">SKU: PN-{{ String(p.id).padStart(3, '0') }}</span>
              </div>
              <h4 class="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{{ p.name }}</h4>
              
              <div class="flex items-end justify-between pt-1">
                <div>
                  <p class="text-blue-600 font-bold text-sm">{{ formatCurrency(p.price) }}</p>
                  <p class="text-[10px] text-gray-400 italic">Harga per m²</p>
                </div>
                <div class="text-right">
                  <p :class="['text-[11px] font-bold', p.stock > 10 ? 'text-green-500' : 'text-orange-500']">
                    Stok: {{ p.stock }}
                  </p>
                  <p class="text-[10px] text-gray-400">m²</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Summary Sidebar -->
      <div class="flex-1 min-w-[340px] bg-white rounded-2xl border border-gray-100 shadow-xl flex flex-col overflow-hidden">
        
        <!-- Sidebar Header -->
        <div class="p-5 border-b border-gray-50 flex-shrink-0">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-900 text-lg">Ringkasan Pesanan</h3>
            <span class="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full">{{ cartItems.length }} Item</span>
          </div>
          
          <!-- Customer Fields -->
          <div class="space-y-3">
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input 
                v-model="customerName"
                type="text" 
                placeholder="Nama Pelanggan..." 
                class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-0 text-sm transition-all"
              />
            </div>
            
            <div class="grid grid-cols-2 gap-2">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <input v-model="customerPhone" type="tel" placeholder="No. HP" class="w-full pl-9 pr-3 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-0 text-xs transition-all" />
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <input v-model="customerAddress" type="text" placeholder="Alamat" class="w-full pl-9 pr-3 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-0 text-xs transition-all" />
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Items List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          <div v-if="cartItems.length === 0" class="h-full flex flex-col items-center justify-center opacity-40">
            <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p class="text-sm font-medium">Keranjang masih kosong</p>
          </div>

          <div 
            v-for="item in cartItems" 
            :key="item.productId"
            class="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300"
          >
            <img :src="getProductImage(item.productId)" class="w-14 h-14 rounded-xl object-cover shadow-sm flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <h5 class="text-sm font-semibold text-gray-900 truncate">{{ item.productName }}</h5>
              <p class="text-xs text-gray-500">{{ item.quantity }} m² x {{ formatCurrency(item.pricePerUnit) }}</p>
              <div class="flex items-center gap-2 mt-1">
                <button 
                  @click="updateQuantity(item.productId, -1)"
                  class="w-6 h-6 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >-</button>
                <span class="text-xs font-bold w-6 text-center">{{ item.quantity }}</span>
                <button 
                  @click="updateQuantity(item.productId, 1)"
                  class="w-6 h-6 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >+</button>
              </div>
            </div>
            <div class="text-right flex flex-col items-end gap-1">
              <span class="text-sm font-bold text-blue-600 leading-tight">{{ formatCurrency(item.total) }}</span>
              <button @click="removeFromCart(item.productId)" class="text-gray-300 hover:text-red-500 transition-colors p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Summary Footer -->
        <div class="p-5 bg-gray-50 border-t border-gray-100 flex-shrink-0 space-y-4">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between items-center text-gray-500">
              <span>Subtotal</span>
              <span class="font-semibold text-gray-900">{{ formatCurrency(cartSubtotal) }}</span>
            </div>
            <div class="flex justify-between items-center text-gray-500">
              <span>Biaya Ongkir</span>
              <div class="flex items-center gap-1 border-b border-gray-300">
                <span class="text-[10px] text-gray-400">Rp</span>
                <input v-model.number="shippingCost" type="number" class="w-20 bg-transparent border-none p-0 text-right focus:ring-0 text-sm font-semibold text-gray-900 no-spinners" placeholder="0" />
              </div>
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-gray-200 pt-3 mt-1">
              <span class="font-bold text-gray-900 text-lg uppercase tracking-wider">Total</span>
              <span class="font-black text-blue-600 text-xl">{{ formatCurrency(grandTotal) }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button 
              @click="saveDraft"
              :disabled="cartItems.length === 0"
              class="px-4 py-3 border-2 border-blue-600/20 rounded-xl text-blue-600 font-bold text-sm hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Simpan Draft
            </button>
            <button 
              @click="handleCreateOrder"
              :disabled="!customerName || cartItems.length === 0 || isProcessing"
              class="px-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:shadow-none translate-y-0 active:translate-y-1"
            >
              <template v-if="isProcessing">Processing...</template>
              <template v-else>Bayar Sekarang</template>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Drafts Modal -->
    <Teleport to="body">
      <div v-if="showDraftsModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
          <div class="p-5 border-b flex items-center justify-between">
            <h3 class="font-bold text-gray-900">Daftar Draft Transaksi</h3>
            <button @click="showDraftsModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-4 max-h-[400px] overflow-y-auto space-y-3">
            <div v-if="savedDrafts.length === 0" class="text-center py-8 text-gray-400 italic">Belum ada draft tersimpan.</div>
            <div 
              v-for="draft in savedDrafts" 
              :key="draft.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all"
            >
              <div>
                <p class="font-bold text-gray-900">{{ draft.name }}</p>
                <p class="text-xs text-gray-500">{{ draft.date }} • {{ draft.items.length }} Item</p>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  @click="loadDraft(draft)"
                  class="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >Lanjutkan</button>
                <button 
                  @click="deleteDraft(draft.id)"
                  class="p-1.5 text-gray-400 hover:text-red-500 transition-all"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Print Modal (Existing Logic kept for function) -->
    <Teleport to="body">
      <div v-if="printOrder" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 print:p-0 print:bg-white">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden print:shadow-none print:w-full">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center relative print:from-white print:to-white print:text-black print:border-b-2">
            <h2 class="text-xl font-bold tracking-tight">BERKAH KERAMIK</h2>
            <p class="text-[10px] opacity-75 mt-0.5 print:opacity-100 uppercase font-bold tracking-widest leading-loose">Struk Pembelian</p>
            <button @click="printOrder = null" class="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition print:hidden">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6 bg-white space-y-4 font-mono text-[13px]">
             <div class="flex justify-between border-b border-dashed pb-3 text-gray-500 print:text-black">
              <div class="space-y-0.5">
                <p>No: <span class="font-bold text-gray-900 print:text-black">INV-{{ String(printOrder.id).padStart(5, '0') }}</span></p>
                <p>Tgl: {{ printOrder.date }}</p>
              </div>
              <div class="text-right space-y-0.5 max-w-[120px]">
                <p class="truncate">Plgn: {{ printOrder.customer }}</p>
                <p v-if="printOrder.phone" class="truncate">{{ printOrder.phone }}</p>
              </div>
            </div>
            <div class="space-y-3 py-2">
              <div v-for="(item, i) in printOrder.items" :key="i">
                <div class="flex justify-between items-baseline gap-2">
                  <span class="text-gray-900 font-bold uppercase print:text-black truncate">{{ item.productName }}</span>
                  <span class="text-gray-900 print:text-black whitespace-nowrap">{{ formatCurrency(item.total) }}</span>
                </div>
                <div class="text-[11px] text-gray-400 print:text-black flex justify-between">
                  <span>{{ item.quantity }} m² x {{ formatCurrency(item.pricePerUnit) }}</span>
                </div>
              </div>
            </div>
            <div class="border-t border-dashed pt-4 space-y-1.5 border-gray-200">
              <div class="flex justify-between text-gray-500 print:text-black">
                <span>Subtotal</span>
                <span>{{ formatCurrency(printOrder.total - (printOrder as any).shipping) }}</span>
              </div>
              <div v-if="(printOrder as any).shipping" class="flex justify-between text-gray-500 print:text-black">
                <span>Ongkir</span>
                <span>{{ formatCurrency((printOrder as any).shipping) }}</span>
              </div>
              <div class="flex justify-between font-bold text-lg text-blue-600 border-t-2 border-double pt-3 mt-2 print:text-black">
                <span class="text-gray-900 print:text-black uppercase tracking-wider">Total Akhir</span>
                <span>{{ formatCurrency(printOrder.total) }}</span>
              </div>
            </div>
            <div class="text-center pt-6 space-y-1">
              <p class="text-gray-400 text-[10px] uppercase font-bold print:text-black">Terima Kasih</p>
            </div>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 print:hidden">
            <button @click="printOrder = null" class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-white text-gray-600 font-semibold transition-all shadow-sm">Tutup</button>
            <button onclick="window.print()" class="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold">CETAK</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>
.no-spinners::-webkit-inner-spin-button, .no-spinners::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
</style>

