<script setup>
import { ref } from "vue";
const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl
import { LogIn, Mail, Lock, Eye, EyeOff, CheckCircle, Truck, Shield, Award, Phone, Clock, ArrowLeft } from 'lucide-vue-next';

// Existing Logic
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);
const { logout } = useAuth(); // Import logout to use its cleanup logic if needed, or simple reset

const login = async () => {
  errorMessage.value = "";

  if (!agreeToTerms.value) {
    errorMessage.value = 'Mohon setujui Syarat & Ketentuan dan Kebijakan Privasi';
    return;
  }

  if (!email.value || !password.value) {
    errorMessage.value = "Email dan password wajib diisi";
    return;
  }

  try {
    loading.value = true;
    const { $api } = useNuxtApp()

    const res = await $api('/auth/login', {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    console.log(res);

    // Clear existing cookies to avoid duplicates on different paths (important!)
    const oldToken = useCookie('token')
    const oldRole = useCookie('userRole')
    const oldName = useCookie('userName')
    const oldId = useCookie('userId')
    oldToken.value = null
    oldRole.value = null
    oldName.value = null
    oldId.value = null

    // Save token, name, and role into Cookies with explicit root path
    const tokenCookie = useCookie('token', { maxAge: 60 * 60 * 24 * 7, path: '/' }) // 1 week
    const roleCookie = useCookie('userRole', { maxAge: 60 * 60 * 24 * 7, path: '/' })
    const nameCookie = useCookie('userName', { maxAge: 60 * 60 * 24 * 7, path: '/' })
    const idCookie = useCookie('userId', { maxAge: 60 * 60 * 24 * 7, path: '/' })

    tokenCookie.value = res?.access_token || "login-token-placeholder"
    roleCookie.value = res?.role || "user"
    nameCookie.value = res?.name || "Akun Saya"
    idCookie.value = String(res?.id || "")

    // Still keep localStorage for legacy/compatibility
    localStorage.setItem("token", res?.access_token || "login-token-placeholder");
    localStorage.setItem("userName", res?.name || "Akun Saya");
    localStorage.setItem("userRole", res?.role || "user");
    localStorage.setItem("userId", res?.id || "");

    // Initialize cart for this user
    const cartStore = useCartStore();
    cartStore.initializeCart(res?.name || "Akun Saya");

    // Redirect based on role
    const role = res?.role?.toLowerCase();
    if (role === 'admin') {
      await navigateTo("/admin");
    } else if (role === 'superadmin') {
      await navigateTo("/SuperAdmin");
    } else {
      await navigateTo("/");
    }
  } catch (error) {
    // If $api handles the toast, we just clear loading or show local message
    errorMessage.value =
      error?.data?.message || "Login gagal. Periksa email dan password.";
  } finally {
    loading.value = false;
  }
};

// New UI State
const showPassword = ref(false);
const agreeToTerms = ref(false);

const handleSSOLogin = (provider) => {
  if (!agreeToTerms.value) {
    errorMessage.value = 'Mohon setujui Syarat & Ketentuan dan Kebijakan Privasi';
    return;
  }
  
  if (provider === 'Google') {
    loading.value = true;
    // Redirect to backend Google auth endpoint
    window.location.href = `${apiUrl}/auth/google`;
  } else {
    alert(`${provider} login belum tersedia.`);
  }
};

const onBackToHome = () => {
  navigateTo('/');
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">BK</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Berkah Keramik</h1>
              <p class="text-xs text-gray-500">Solusi Keramik Terlengkap</p>
            </div>
          </div>
          <button
            @click="onBackToHome"
            class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft :size="16" />
            Kembali
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Error Alert -->
      <div v-if="errorMessage" class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white text-xs">✕</span>
          </div>
          <p class="text-sm text-red-800">{{ errorMessage }}</p>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-8 items-center">
        <!-- Left Column - Login Form -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      
            <h2 class="text-2xl text-gray-900 mb-2">Sudah Punya Akun?</h2>
            <p class="text-gray-600">Silahkan login disini</p>
     

          <!-- Email Login Form -->
          <form @submit.prevent="login" class="space-y-5">
            <div>
              <label class="block text-sm mb-2 text-gray-700">
                Alamat Email (Login ID) <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
                <input
                  type="email"
                  v-model="email"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Alamat Email (Login ID)"
                  required
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm text-gray-700">
                  Password <span class="text-red-500">*</span>
                </label>
                <a href="#" class="text-sm text-blue-600 hover:text-blue-700">Lupa Password?</a>
              </div>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <EyeOff v-if="showPassword" :size="20" />
                  <Eye v-else :size="20" />
                </button>
              </div>
            </div>

            <!-- Terms Checkbox -->
            <div class="flex items-start gap-2">
              <input 
                type="checkbox" 
                id="terms"
                v-model="agreeToTerms"
                class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              />
              <label for="terms" class="text-sm text-gray-600 cursor-pointer">
                Dengan login, saya setuju dengan
                <a href="#" class="text-blue-600 hover:underline">Syarat & Ketentuan</a>
                dan
                <a href="#" class="text-blue-600 hover:underline">Kebijakan Privasi</a>
              </label>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              <template v-if="loading">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Memproses...</span>
              </template>
              <template v-else>
                <LogIn :size="20" />
                <span>Login</span>
              </template>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-500">atau</span>
            </div>
          </div>

          <!-- SSO Buttons -->
          <div class="space-y-3">
            <button
              @click="handleSSOLogin('Google')"
              :disabled="loading"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="text-gray-700">Login dengan Google</span>
            </button>
          </div>
        </div>

        <!-- Right Column - Register Promotion -->
        <div class="space-y-6">
          <!-- Register Card -->
          <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
            <h2 class="text-2xl mb-2">Pelanggan Baru?</h2>
            <p class="text-blue-100 mb-6">Daftar dan nikmati berbagai keuntungan eksklusif!</p>
            
            <NuxtLink
  to="/register" class="w-full px-6 py-3 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-300 transition shadow-lg hover:shadow-xl">
              Daftar Akun Disini
          </NuxtLink>
          </div>

        

          <!-- Promo Banner -->
          <div class="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 text-white">
            <div class="flex items-start gap-3">
              <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <Truck class="text-white" :size="32" />
              </div>
              <div>
                <p class="font-bold mb-1">PROMO: GRATIS ONGKIR*</p>
                <p class="text-sm text-orange-100 mb-2">
                  ke Jabodetabek, seluruh wilayah *Pulau Jawa & Sumatera*.
                </p>
                <a href="#" class="text-sm underline text-yellow-200 hover:text-yellow-100">
                  Lihat Syarat & Ketentuan di sini
                </a>
              </div>
            </div>
          </div>

          <!-- Customer Service -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h4 class="text-gray-900 mb-4 flex items-center gap-2">
              <Phone class="text-blue-600" :size="20" />
              Butuh bantuan? Hubungi CS kami
            </h4>
            
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-sm text-gray-700">
                <Phone :size="16" class="text-gray-400" />
                <span>021-3110-6996 | (0855-7467-6409)</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-700">
                <Mail :size="16" class="text-gray-400" />
                <span>cs@monotaro.id | Order via WA</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-700">
                <Clock :size="16" class="text-gray-400" />
                <span>Jam Operasional CS: Senin - Jumat | 08.00 - 18.00 WIB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
