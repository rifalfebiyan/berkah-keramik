<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

const emit = defineEmits(['exit'])

const activePage = ref<'dashboard' | 'kategori' | 'products' | 'orders' | 'cashier'>('dashboard')

// Navigation items based on Figma
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'kategori', label: 'Kategori', icon: '🏷️' },
  { id: 'products', label: 'Produk', icon: '📦' },
  { id: 'orders', label: 'Pesanan', icon: '🛒' },
  { id: 'cashier', label: 'Kasir', icon: '💵' }
]


// Async component loading for better performance
const AdminDashboard = defineAsyncComponent(() => import('./AdminDashboard.vue'))
const AdminProductManagement = defineAsyncComponent(() => import('./AdminProductManagement.vue'))
const AdminOrderManagement = defineAsyncComponent(() => import('./AdminOrderManagement.vue'))
const AdminCashier = defineAsyncComponent(() => import('./AdminCashier.vue'))
const AdminSidebar = defineAsyncComponent(() => import('./admin/AdminSidebar.vue'))

</script>

<template>
  <div class="admin-container">
    <!-- Sidebar Component -->
    <AdminSidebar v-model="activePage" />

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <header class="admin-header">
        <div class="header-left">
          <h2 class="page-title">{{ navItems.find(i => i.id === activePage)?.label }}</h2>
        </div>
        <div class="header-right">
          <div class="user-info">
            <div class="user-text">
              <span class="role">Administrator</span>
              <span class="email">admin@berkahkeramik.com</span>
            </div>
            <div class="avatar">A</div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <section class="page-body">
        <AdminDashboard v-if="activePage === 'dashboard'" />
        <AdminCategoryManagement v-else-if="activePage === 'kategori'" />
        <AdminProductManagement v-else-if="activePage === 'products'" />
        <AdminOrderManagement v-else-if="activePage === 'orders'" />
        <AdminCashier v-else-if="activePage === 'cashier'" />
      </section>
    </main>
  </div>
</template>

<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
}


/* Main Content Styling */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 256px; /* Adjust for fixed sidebar width (w-64) */
  min-height: 100vh;
}

.admin-header {
  height: 80px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-text {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.role {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.email {
  font-size: 12px;
  color: #94a3b8;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
}

.page-body {
  padding: 40px;
}

@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }
}
</style>
