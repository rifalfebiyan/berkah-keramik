<script setup>
import { ref } from "vue";
const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl
import { UserPlus, Mail, Lock, Eye, EyeOff, CheckCircle, Truck, Award, Phone, Clock, ArrowLeft, User } from 'lucide-vue-next';

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const loading = ref(false);

const agreeToTerms = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const register = async () => {
  errorMessage.value = "";

  if (!agreeToTerms.value) {
    errorMessage.value = 'Mohon setujui Syarat & Ketentuan dan Kebijakan Privasi';
    return;
  }

  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = "Semua kolom wajib diisi";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Password tidak cocok";
    return;
  }

  try {
    loading.value = true;

    // Simulate Register Request
    const res = await $fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
      },
    });

    console.log(res);

    // Save token, name, and role
    const userRole = res?.role || "user";
    localStorage.setItem("token", res?.access_token || "register-token-placeholder");
    localStorage.setItem("userName", res?.name || name.value);
    localStorage.setItem("userRole", userRole);

    // Redirect to home after successful registration (default to index for new customers)
    await navigateTo("/");
  } catch (error) {
    errorMessage.value = error?.data?.message || "Registrasi gagal. Silakan coba lagi.";
  } finally {
    loading.value = false;
  }
};

const handleSSORegister = (provider) => {
  if (!agreeToTerms.value) {
    errorMessage.value = 'Mohon setujui Syarat & Ketentuan dan Kebijakan Privasi';
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  setTimeout(() => {
    alert(`Daftar dengan ${provider} akan segera tersedia!`);
    loading.value = false;
  }, 500);
};

const onBackToHome = () => {
  navigateTo('/');
}

const goToLogin = () => {
  navigateTo('/login');
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

      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Left Column - Register Form -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div class="mb-8">
            <h2 class="text-2xl text-gray-900 mb-2">Buat Akun Baru</h2>
            <p class="text-gray-600">Daftar sekarang untuk menikmati berbagai kemudahan</p>
          </div>

          <!-- Register Form -->
          <form @submit.prevent="register" class="space-y-5">
            <div>
              <label class="block text-sm mb-2 text-gray-700">
                Nama Lengkap <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
                <input
                  type="text"
                  v-model="name"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Nama Lengkap"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm mb-2 text-gray-700">
                Alamat Email <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
                <input
                  type="email"
                  v-model="email"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Alamat Email"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-700 mb-2">
                  Password <span class="text-red-500">*</span>
                </label>
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

              <div>
                <label class="block text-sm text-gray-700 mb-2">
                  Konfirmasi <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    v-model="confirmPassword"
                    class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Konfirmasi"
                    required
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeOff v-if="showConfirmPassword" :size="20" />
                    <Eye v-else :size="20" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Terms Checkbox -->
            <div class="flex items-start gap-2 pt-2">
              <input 
                type="checkbox" 
                id="terms"
                v-model="agreeToTerms"
                class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              />
              <label for="terms" class="text-sm text-gray-600 cursor-pointer">
                Dengan mendaftar, saya setuju dengan
                <a href="#" class="text-blue-600 hover:underline">Syarat & Ketentuan</a>
                dan
                <a href="#" class="text-blue-600 hover:underline">Kebijakan Privasi</a>
              </label>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              <template v-if="loading">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Memproses...</span>
              </template>
              <template v-else>
                <UserPlus :size="20" />
                <span>Daftar Akun</span>
              </template>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-500">atau daftar dengan</span>
            </div>
          </div>

          <!-- SSO Buttons -->
          <div class="space-y-3">
            <button
              @click="handleSSORegister('Google')"
              :disabled="loading"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="text-gray-700">Google</span>
            </button>
          </div>
        </div>

        <!-- Right Column - Login Details / Promotion -->
        <div class="space-y-6">
          <!-- Login Promotion Card -->
          <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-8 text-white">
            <h2 class="text-2xl mb-2">Sudah punya akun?</h2>
            <p class="text-indigo-100 mb-6">Masuk lebih cepat untuk melacak pesanan dan menikmati promo tersimpan</p>
            
            <button @click="goToLogin" class="w-full px-6 py-3 bg-white text-indigo-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-lg hover:shadow-xl">
              Kembali ke Halaman Login
            </button>
          </div>

          <!-- Benefits Card (Reused from existing structure) -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h3 class="text-lg text-gray-900 mb-6 flex items-center gap-2">
              <Award class="text-blue-600" :size="24" />
              Keuntungan Mendaftar
            </h3>
            
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle class="text-green-600" :size="16" />
                </div>
                <div>
                  <p class="text-sm text-gray-900">Belanja Lebih Cepat</p>
                  <p class="text-xs text-gray-500">Simpan info pengiriman & pembayaran Anda</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle class="text-green-600" :size="16" />
                </div>
                <div>
                  <p class="text-sm text-gray-900">Promo Khusus Member</p>
                  <p class="text-xs text-gray-500">Diskon spesial & notifikasi produk baru</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle class="text-green-600" :size="16" />
                </div>
                <div>
                  <p class="text-sm text-gray-900">Lacak Status Pesanan</p>
                  <p class="text-xs text-gray-500">Pantau pengiriman Anda secar real-time</p>
                </div>
              </div>
            </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
