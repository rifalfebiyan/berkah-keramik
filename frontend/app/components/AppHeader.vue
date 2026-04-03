<script setup lang="ts">
import { navigateTo } from "#app";
import { ref, onMounted } from "vue";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  MapPin,
  Menu,
  ChevronDown,
} from "lucide-vue-next";

const token = useCookie('token')
const nameCookie = useCookie('userName')

const isLogin = computed(() => !!token.value);
const userName = computed(() => nameCookie.value || "User");
const isDropdownOpen = ref(false);
const { logout: authLogout } = useAuth()

const cartStore = useCartStore();
const searchQuery = ref("");

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`);
  }
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = (e: MouseEvent) => {
  const container = document.querySelector('.profile-container');
  if (container && !container.contains(e.target as Node)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  // Initialize cart based on logged in user
  cartStore.initializeCart(nameCookie.value || null)

  if (typeof window !== "undefined") {
    window.addEventListener('click', closeDropdown);
  }
});

import { onUnmounted } from "vue";
onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener('click', closeDropdown);
  }
});

const goLogin = () => {
  if (isLogin.value) {
    navigateTo("/admin");
  } else {
    navigateTo("/login");
  }
};

const logout = () => {
  authLogout(null);
  // Switch to guest cart
  cartStore.initializeCart(null); 
};

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Shop by Brands", href: "#brand-section" },
  { name: "Shop by Rooms", href: "/flooring" },
  { name: "House Brand Berkah Keramik", href: "/subcategory/1" },
];
</script>

<template>
  <header class="main-header">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="container container-flex">
        <div class="top-info">
          <div class="info-item">
            <span class="flag-icon">
              <svg class="w-4 h-3 rounded-sm shadow-sm" viewBox="0 0 3 2">
                <rect width="3" height="1" fill="#ee2d24" />
                <rect width="3" height="1" y="1" fill="#ffffff" />
              </svg>
            </span>
            <span>Indonesia</span>
            <ChevronDown :size="20" />
          </div>
        </div>
        <div class="top-links">
          <NuxtLink to="/membership">Membership</NuxtLink>
          <NuxtLink to="/about">Tentang Kami</NuxtLink>
          <NuxtLink to="/help">Bantuan</NuxtLink>
          <div class="info-item cursor-pointer" @click="navigateTo('/locations')">
            <MapPin :size="16" />
            <span>Lokasi Toko</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Middle Header -->
    <div class="middle-header">
      <div class="container container-flex">
        <div class="logo">
          <img src="/LOGO.png" alt="Logo" width="70" height="70"/>
        </div>

        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari produk dengan kata kunci, model atau SKU"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            <Search :size="20" />
          </button>
        </div>

        <div class="header-actions">
          <!-- LOGIN -->
          <div class="action-item" @click="goLogin" v-if="!isLogin">
            <User :size="24" />
            <div class="action-text">
              <span class="small-label">Masuk / Daftar</span>
            </div>
          </div>

          <!-- LOGGED IN (Show Email) -->
          <div class="action-item profile-container relative" v-else @click.stop="toggleDropdown">
            <User :size="24" />
            <div class="action-text flex items-center gap-1">
              <span class="small-label">{{ userName }}</span>
              <ChevronDown :size="14" class="text-gray-400 transition-transform" :class="{ 'rotate-180': isDropdownOpen }" />
            </div>

            <!-- Dropdown Menu -->
            <div v-if="isDropdownOpen" class="absolute top-[120%] right-0 w-56 bg-white border border-gray-100 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div class="px-5 py-4 border-b border-gray-50 mb-1 bg-gray-50/30">
                <p class="text-[10px] text-blue-600 uppercase tracking-widest font-black mb-0.5">Akses Akun</p>
                <p class="text-sm font-bold text-gray-900 truncate">{{ userName }}</p>
              </div>
              
              <div class="p-1">
                <button @click="navigateTo('/profile')" class="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all flex items-center gap-3 font-semibold group">
                  <div class="p-1.5 bg-gray-50 group-hover:bg-blue-100/50 rounded-lg transition">
                    <User :size="14" />
                  </div>
                  <span>Profil Saya</span>
                </button>
                <button @click="navigateTo('/orders')" class="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all flex items-center gap-3 font-semibold group">
                  <div class="p-1.5 bg-gray-50 group-hover:bg-blue-100/50 rounded-lg transition">
                    <ShoppingBag :size="14" />
                  </div>
                  <span>Pesanan Saya</span>
                </button>
              </div>
              <div class="h-px bg-gray-50 my-1 mx-2"></div>
              <div class="p-1">
                <button 
                  @click="logout" 
                  class="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center gap-3 font-bold group"
                >
                  <div class="p-1.5 bg-red-50 group-hover:bg-red-100 rounded-lg transition">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  </div>
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>
          </div>

          <div class="action-item" @click="navigateTo('/favorites')">
            <Heart :size="24" />
            <div class="action-text">
              <span class="small-label">Favorit</span>
            </div>
          </div>

          <div class="action-item cart relative" @click="navigateTo('/cart')">
            <ShoppingBag :size="24" />
            <span v-if="(cartStore.cartCount as any) > 0" class="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-[5px] py-[1px] rounded-full">
              {{ cartStore.cartCount }}
            </span>
            <div class="action-text">
              <span class="small-label">Keranjang</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Nav -->
    <nav class="bottom-nav">
      <div class="container container-flex">
        <div class="all-categories-btn">
          <Menu :size="20" />
          <span>Semua Kategori</span>
        </div>
        <ul class="nav-menu">
          <li v-for="link in navLinks" :key="link.name">
            <a :href="link.href">{{ link.name }}</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.container-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.main-header {
  position: sticky;
  top: 0;
  width: 100%;
  background: white;
  z-index: 1000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

/* Top Bar */
.top-bar {
  background-color: #1e3a8a;
  color: white;
  padding: 6px 0;
  font-size: 0.75rem;
}

.top-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.top-links a {
  color: white;
  text-decoration: none;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Middle Header */
.middle-header {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.brand-red {
  color: red;
  font-size: 1.5rem;
  font-weight: 900;
}

.brand-blue {
  color: blue;
  font-size: 1.5rem;
  font-weight: 900;
  margin-left: 4px;
}

.sub-logo {
  font-size: 0.6rem;
  font-weight: 700;
  color: blue;
}

.search-container {
  flex: 1;
  max-width: 650px;
  margin: 0 3rem;
  position: relative;
  display: flex;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-container:focus-within {
  transform: scale(1.02);
}

.search-container input {
  width: 100%;
  padding: 0.85rem 1.5rem;
  border: 1.5px solid #edf2f7;
  border-radius: 2rem;
  background-color: #f8fafc;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}

.search-container input:focus {
  outline: none;
  border-color: var(--primary-blue);
  background-color: white;
  box-shadow: 0 10px 25px -5px rgba(30, 58, 138, 0.1), 0 8px 10px -6px rgba(30, 58, 138, 0.05);
}

.search-btn {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.2s;
}

.search-container:focus-within .search-btn {
  color: var(--primary-blue);
}

.header-actions {
  display: flex;
  gap: 1.5rem;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.small-label {
  font-size: 0.7rem;
  font-weight: 600;
  margin-top: 4px;
}

/* Bottom Nav */
.bottom-nav {
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.all-categories-btn {
  background: #ffcc00;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 1.5rem;
  flex: 1;
  margin-left: 2rem;
}

.nav-menu a {
  text-decoration: none;
  color: #333;
  font-weight: 600;
}

.nav-menu a:hover {
  color: blue;
}
</style>
