<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { User, Phone, MapPin, Save, ChevronLeft, CheckCircle2, AlertCircle, Loader2, ShoppingBag, Heart } from 'lucide-vue-next';

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const router = useRouter();

const user = ref({
  id: null,
  email: '',
  name: '',
  phone: '',
  address: ''
});

const isPending = ref(true);
const isSaving = ref(false);
const showSuccess = ref(false);
const showError = ref('');

const fetchProfile = async () => {
  const token = useCookie('token');
  if (!token.value) {
    router.push('/login');
    return;
  }

  try {
    const data = await $fetch<any>(`${apiUrl}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });
    user.value = data;
  } catch (err: any) {
    console.error('[Profile Load Error]:', err);
    showError.value = 'Gagal memuat profil. Silakan coba lagi.';
    if (err.status === 401) router.push('/login');
  } finally {
    isPending.value = false;
  }
};

const updateProfile = async () => {
  isSaving.value = true;
  showError.value = '';
  showSuccess.value = false;

  const token = useCookie('token');
  try {
    const updatedUser = await $fetch<any>(`${apiUrl}/users/profile`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        name: user.value.name,
        phone: user.value.phone,
        address: user.value.address
      }
    });
    
    user.value = updatedUser;
    const userNameCookie = useCookie('userName');
    userNameCookie.value = updatedUser.name;
    
    showSuccess.value = true;
    setTimeout(() => showSuccess.value = false, 3000);
  } catch (err: any) {
    showError.value = 'Gagal memperbarui profil. ' + (err.data?.message || '');
  } finally {
    isSaving.value = false;
  }
};

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
  router.push('/login');
};

onMounted(() => {
  fetchProfile();
});
</script>

<template>
  <div class="bg-gray-50/50 min-h-screen py-12">
    <div class="container container-profile">
      <div class="max-w-5xl mx-auto flex gap-10 flex-col lg:flex-row">
        
        <!-- Modern Sidebar - Same as Order History -->
        <aside class="w-full lg:w-72 space-y-2">
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">
                {{ (user.name || 'U').charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="text-sm text-gray-500 font-medium">Akun Saya</p>
                <p class="font-bold text-gray-900 truncate max-w-[140px]">{{ user.name || 'User' }}</p>
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

        <!-- Main Content - Same Card Style as Order History -->
        <main class="flex-1">
          <div class="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-500/5 min-h-[500px]">
            
            <div class="flex items-center justify-between mb-10">
              <div>
                <h1 class="text-2xl font-black text-gray-900 tracking-tight">Informasi Profil</h1>
                <p class="text-gray-400 font-semibold text-sm mt-1">Lengkapi data diri Anda untuk kemudahan transaksi</p>
              </div>
            </div>

            <!-- Messages -->
            <div v-if="showSuccess" class="bg-green-50 border border-green-100 text-green-600 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 font-bold text-sm">
              <CheckCircle2 :size="18" />
              <span>Profil berhasil diperbarui secara aman!</span>
            </div>
            <div v-if="showError" class="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 font-bold text-sm">
              <AlertCircle :size="18" />
              <span>{{ showError }}</span>
            </div>

            <!-- Form -->
            <form @submit.prevent="updateProfile" class="space-y-8 relative">
              <div v-if="isPending" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <Loader2 class="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p class="text-sm font-bold text-gray-500">Menyinkronkan data...</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Name -->
                <div class="space-y-2">
                  <label class="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Nama Lengkap</label>
                  <div class="relative group">
                    <User class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition" :size="18" />
                    <input 
                      v-model="user.name" 
                      type="text" 
                      class="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 transition font-bold text-gray-900"
                    />
                  </div>
                </div>

                <!-- Email -->
                <div class="space-y-2">
                  <label class="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Alamat Email</label>
                  <div class="relative">
                    <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold">@</span>
                    <input 
                      :value="user.email" 
                      type="email" 
                      disabled
                      class="w-full pl-12 pr-6 py-4 bg-gray-100 border border-gray-100 rounded-2xl outline-none text-gray-400 font-bold cursor-not-allowed"
                    />
                  </div>
                </div>

                <!-- Phone -->
                <div class="space-y-2">
                  <label class="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Nomor Telepon</label>
                  <div class="relative group">
                    <Phone class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition" :size="18" />
                    <input 
                      v-model="user.phone" 
                      type="tel" 
                      placeholder="Contoh: 081234567890"
                      class="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 transition font-bold text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <!-- Address -->
              <div class="space-y-2">
                <label class="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Alamat Pengiriman Default</label>
                <div class="relative group">
                  <MapPin class="absolute left-5 top-6 text-gray-300 group-focus-within:text-blue-500 transition" :size="18" />
                  <textarea 
                    v-model="user.address" 
                    rows="4" 
                    placeholder="Masukkan alamat lengkap pengiriman untuk mempercepat checkout"
                    class="w-full pl-12 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 transition font-bold text-gray-900 resize-none"
                  ></textarea>
                </div>
              </div>

              <!-- Action -->
              <div class="pt-4">
                <button 
                  type="submit" 
                  :disabled="isSaving"
                  class="w-full md:w-auto px-12 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition transform active:scale-95 flex items-center justify-center gap-3 disabled:bg-blue-300 disabled:transform-none"
                >
                  <Save v-if="!isSaving" :size="20" />
                  <Loader2 v-else :size="20" class="animate-spin" />
                  <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
                </button>
              </div>
            </form>
          </div>
        </main>

      </div>
    </div>
  </div>
</template>

<style scoped>
.container-profile {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

input::placeholder, textarea::placeholder {
  color: #cbd5e1;
  font-weight: 500;
}
</style>
