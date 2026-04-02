<script setup>
import { ShoppingBag, Calendar, Package, ChevronRight, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-vue-next';

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const token = useCookie('token');

const orders = ref([]);
const isLoading = ref(true);

const fetchOrders = async () => {
  if (!token.value) {
    navigateTo('/login');
    return;
  }

  try {
    isLoading.value = true;
    const res = await $fetch(`${apiUrl}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });
    orders.value = res;
  } catch (err) {
    console.error('Failed to fetch orders:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchOrders();
});

const getStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-600 border-gray-200';
  switch (status.toLowerCase()) {
    case 'pending': return 'bg-orange-100 text-orange-600 border-orange-200';
    case 'shipped': return 'bg-blue-100 text-blue-600 border-blue-200';
    case 'completed': return 'bg-green-100 text-green-600 border-green-200';
    case 'cancelled': return 'bg-red-100 text-red-600 border-red-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const getStatusIcon = (status) => {
  if (!status) return Clock;
  switch (status.toLowerCase()) {
    case 'pending': return Clock;
    case 'shipped': return Truck;
    case 'completed': return CheckCircle;
    case 'cancelled': return AlertCircle;
    default: return Package;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight">Pesanan Saya</h1>
          <p class="text-gray-500 font-medium mt-1">Pantau status pengiriman dan riwayat belanja Anda</p>
        </div>
        <NuxtLink to="/" class="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
          <ShoppingBag class="text-white" :size="24" />
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-white p-6 rounded-3xl border border-gray-100 animate-pulse">
          <div class="h-4 bg-gray-100 rounded w-1/4 mb-4"></div>
          <div class="h-10 bg-gray-50 rounded mb-4"></div>
          <div class="h-4 bg-gray-100 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package class="text-gray-300" :size="40" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Belum ada pesanan</h3>
        <p class="text-gray-500 mb-8 max-w-xs mx-auto">Anda belum melakukan transaksi apapun. Mari mulai belanja koleksi keramik terbaik kami!</p>
        <NuxtLink to="/" class="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition transform hover:-translate-y-1 shadow-xl shadow-blue-100">
          Mulai Belanja
          <ChevronRight :size="18" />
        </NuxtLink>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6">
        <div v-for="order in orders" :key="order.id" class="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <!-- Order Card Header -->
          <div class="p-6 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                <Calendar class="text-gray-400" :size="20" />
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nomor Pesanan #{{ order.id }}</p>
                <p class="text-sm font-bold text-gray-900">{{ formatDate(order.createdAt) }}</p>
              </div>
            </div>
            <div v-if="order.status" :class="['px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2', getStatusColor(order.status)]">
              <component :is="getStatusIcon(order.status)" :size="14" />
              {{ order.status.toUpperCase() }}
            </div>
          </div>

          <!-- Order Items -->
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="item in order.items" :key="item.id" class="flex items-center gap-4">
                <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                   <Package class="text-gray-300" :size="24" />
                </div>
                <div class="flex-1">
                  <p class="font-bold text-gray-900 text-sm mb-0.5">{{ item.productName }}</p>
                  <p class="text-xs text-gray-400">{{ item.quantity }} x {{ formatPrice(item.pricePerUnit) }}</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-900 text-sm">{{ formatPrice(item.total) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Footer -->
          <div class="px-6 py-4 bg-gray-50/50 flex items-center justify-between">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Belanja</p>
            <p class="text-lg font-black text-blue-600">{{ formatPrice(order.total) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
</style>
