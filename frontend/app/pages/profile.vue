<template>
  <div class="bg-gray-50/50 min-h-screen py-12">
    <div class="container">
      <div class="max-w-5xl mx-auto flex gap-10 flex-col lg:flex-row">
        
        <!-- Modern Sidebar -->
        <aside class="w-full lg:w-72 space-y-2">
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">
                {{ userName.charAt(0).toUpperCase() }}
              </div>
              <div class="overflow-hidden text-ellipsis">
                <p class="text-sm text-gray-500 font-medium">Selamat Datang,</p>
                <p class="font-bold text-gray-900 truncate">{{ userName }}</p>
              </div>
            </div>
          </div>

          <nav class="space-y-1">
            <button class="w-full flex items-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 transition cursor-default">
              <User :size="20" />
              <span>Profil Saya</span>
            </button>
            <button @click="navigateTo('/orders')" class="w-full flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-white hover:text-blue-600 rounded-2xl transition font-semibold group">
              <ShoppingBag :size="20" class="group-hover:scale-110 transition" />
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

        <!-- Main Content (Form) -->
        <main class="flex-1">
          <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-500/5">
            <div class="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6">
              <div class="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Settings :size="24" />
              </div>
              <div>
                <h1 class="text-2xl font-black text-gray-900">Pengaturan Profil</h1>
                <p class="text-sm text-gray-500 mt-1 font-medium">Kelola informasi data diri dan keamanan akun Anda.</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <div class="relative group">
                  <input type="text" disabled :value="userName" class="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl text-gray-900 font-bold focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Alamat Email</label>
                <div class="relative">
                  <input type="text" disabled value="Belum ada data email" class="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl text-gray-400 font-medium italic transition-all outline-none" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nomor Handphone</label>
                <div class="relative">
                  <input type="text" disabled value="Belum diatur" class="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl text-gray-400 font-medium italic transition-all outline-none" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Member ID</label>
                <div class="relative">
                  <input type="text" disabled value="BK-MEMBER-772" class="w-full bg-blue-50/50 border border-blue-100/50 p-4 rounded-2xl text-blue-300 font-black transition-all outline-none" />
                </div>
              </div>
            </div>

            <div class="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-4 py-2 rounded-full font-bold">
                <span>⚠️ Fitur pengubahan profil segera hadir di versi stabil (v1.1)</span>
              </div>
              <button class="bg-gray-100 text-gray-400 px-8 py-3 rounded-2xl font-bold cursor-not-allowed text-sm">
                Simpan Perubahan
              </button>
            </div>
          </div>
        </main>

      </div>
    </div>
  </div>
</template>

<script setup>
import { User, ShoppingBag, Heart, Settings } from 'lucide-vue-next';

const userName = useCookie('userName');
if (!userName.value) userName.value = 'User Anonymous';

const handleLogout = () => {
  // Clearing cookies (copied from AppHeader logic for robustness)
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
