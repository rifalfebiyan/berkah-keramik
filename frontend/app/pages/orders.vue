<template>
  <div class="bg-gray-50/50 min-h-screen py-12">
    <div class="container">
      <div class="max-w-5xl mx-auto flex gap-10 flex-col lg:flex-row">
        
        <!-- Modern Sidebar -->
        <aside class="w-full lg:w-72 space-y-2">
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">
                {{ userName.charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="text-sm text-gray-500 font-medium">Pesanan Saya</p>
                <p class="font-bold text-gray-900 truncate">{{ userName }}</p>
              </div>
            </div>
          </div>

          <nav class="space-y-1">
            <button @click="navigateTo('/profile')" class="w-full flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-white hover:text-blue-600 rounded-2xl transition font-semibold group">
              <User :size="20" class="group-hover:scale-110 transition" />
              <span>Profil Saya</span>
            </button>
            <button class="w-full flex items-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 transition cursor-default">
              <ShoppingBag :size="20" />
              <span>Riwayat Pesanan</span>
            </button>
            <button @click="navigateTo('/favorites')" class="w-full flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-white hover:text-red-500 rounded-2xl transition font-semibold group">
              <Heart :size="20" class="group-hover:scale-110 transition" />
              <span>Favorit Saya</span>
            </button>
            <div class="h-px bg-gray-100 my-4 mx-6"></div>
            <button @click="handleLogout" class="w-full flex items-center gap-3 px-6 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition font-semibold group">
               <span class="rotate-180 group-hover:-translate-x-1 transition">↩</span>
               <span>Keluar Akun</span>
            </button>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1">
          <div class="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-500/5 text-center min-h-[500px] flex flex-col items-center justify-center">
            
            <div class="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center text-5xl mb-8 border-4 border-white shadow-inner relative">
               📦
               <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full border flex items-center justify-center text-xl shadow-sm">
                  🔍
               </div>
            </div>

            <h1 class="text-2xl font-black text-gray-900 mb-3">Pesanan Belum Tersedia</h1>
            <p class="text-gray-500 max-w-xs mx-auto leading-relaxed font-medium mb-10">
              Sepertinya Anda belum melakukan transaksi apa pun. Temukan material bangunan idaman Anda sekarang!
            </p>
            
            <button @click="navigateTo('/')" class="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition transform active:scale-95">
              Mulai Menjelajah Produk
            </button>
          </div>
        </main>

      </div>
    </div>
  </div>
</template>

<script setup>
import { User, ShoppingBag, Heart } from 'lucide-vue-next';

const userName = useCookie('userName');
if (!userName.value) userName.value = 'User Anonymous';

const handleLogout = () => {
  const token = useCookie('token')
  const role = useCookie('userRole')
  const name = useCookie('userName')
  token.value = null
  role.value = null
  name.value = null
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  navigateTo('/login');
};
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
</style>
