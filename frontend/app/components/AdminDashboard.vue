<script setup lang="ts">
import { ref } from 'vue'

const stats = [
  { label: 'Total Pendapatan', value: 'Rp 14.350.000', change: '+12.5% dari bulan lalu', icon: '💰', color: '#ecfdf5', iconColor: '#10b981' },
  { label: 'Total Pesanan', value: '5', change: '+8 pesanan baru', icon: '🛒', color: '#eff6ff', iconColor: '#3b82f6' },
  { label: 'Total Produk', value: '5', change: '5 kategori', icon: '📦', color: '#f5f3ff', iconColor: '#8b5cf6' },
  { label: 'Total Stok', value: '715 m²', change: 'Tersedia', icon: '🏗️', color: '#fff7ed', iconColor: '#f59e0b' }
]

const recentOrders = [
  { id: '#1', customer: 'Budi Santoso', product: 'Keramik Granit Premium', total: 'Rp 6.250.000', status: 'Selesai', statusClass: 'status-success' },
  { id: '#2', customer: 'Siti Rahayu', product: 'Keramik Kamar Mandi', total: 'Rp 2.975.000', status: 'Diproses', statusClass: 'status-info' },
  { id: '#3', customer: 'Ahmad Fauzi', product: 'Backsplash Dapur', total: 'Rp 2.375.000', status: 'Menunggu', statusClass: 'status-warning' },
  { id: '#4', customer: 'Dewi Lestari', product: 'Keramik Outdoor', total: 'Rp 8.100.000', status: 'Selesai', statusClass: 'status-success' }
]
</script>

<template>
  <div class="dashboard-view">
    <h3 class="section-title">Ringkasan</h3>
    
    <!-- Stats Grid -->
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-left">
          <span class="stat-label">{{ stat.label }}</span>
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-change" :style="{ color: stat.iconColor }">{{ stat.change }}</span>
        </div>
        <div class="stat-icon" :style="{ backgroundColor: stat.color }">
          <span :style="{ color: stat.iconColor }">{{ stat.icon }}</span>
        </div>
      </div>
    </div>

    <!-- Recent Orders Table -->
    <div class="table-container">
      <h3 class="section-title">Pesanan Terbaru</h3>
      <table class="recent-orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Pelanggan</th>
            <th>Produk</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in recentOrders" :key="order.id">
            <td>{{ order.id }}</td>
            <td class="semi-bold">{{ order.customer }}</td>
            <td class="text-muted">{{ order.product }}</td>
            <td class="semi-bold">{{ order.total }}</td>
            <td>
              <span :class="['status-badge', order.statusClass]">{{ order.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-left {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-change {
  font-size: 12px;
  font-weight: 600;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

/* Table Styling */
.table-container {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.recent-orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 24px;
}

.recent-orders-table th {
  text-align: left;
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
}

.recent-orders-table td {
  padding: 20px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #334155;
}

.recent-orders-table tr:last-child td {
  border-bottom: none;
}

.semi-bold {
  font-weight: 600;
}

.text-muted {
  color: #64748b;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-success {
  background-color: #dcfce7;
  color: #166534;
}

.status-info {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-warning {
  background-color: #fef9c3;
  color: #854d0e;
}
</style>
