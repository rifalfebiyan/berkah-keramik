<script setup lang="ts">
import { ref } from "vue";

const orders = ref([
  {
    id: "#1",
    customer: "Budi Santoso",
    date: "26 Feb 2026",
    items: 3,
    total: "Rp 6.250.000",
    status: "Selesai",
    statusClass: "status-success",
  },
  {
    id: "#2",
    customer: "Siti Rahayu",
    date: "26 Feb 2026",
    items: 1,
    total: "Rp 2.975.000",
    status: "Diproses",
    statusClass: "status-info",
  },
  {
    id: "#3",
    customer: "Ahmad Fauzi",
    date: "25 Feb 2026",
    items: 2,
    total: "Rp 2.375.000",
    status: "Menunggu",
    statusClass: "status-warning",
  },
  {
    id: "#4",
    customer: "Dewi Lestari",
    date: "25 Feb 2026",
    items: 5,
    total: "Rp 8.100.000",
    status: "Selesai",
    statusClass: "status-success",
  },
  {
    id: "#5",
    customer: "Irfan Hakim",
    date: "24 Feb 2026",
    items: 2,
    total: "Rp 1.450.000",
    status: "Dibatalkan",
    statusClass: "status-danger",
  },
]);
</script>

<template>
  <div class="order-management">
    <div class="top-bar">
      <h2 class="section-title">Manajemen Pesanan</h2>
      <div class="actions">
        <button class="export-btn">📄 Export PDF</button>
      </div>
    </div>

    <div class="table-container">
      <div class="filter-row">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Cari ID atau nama pelanggan..." />
        </div>
      </div>

      <table class="order-table">
        <thead>
          <tr>
            <th>ID Pesanan</th>
            <th>Pelanggan</th>
            <th>Tanggal</th>
            <th>Jumlah Item</th>
            <th>Total Bayar</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td class="order-id">{{ order.id }}</td>
            <td class="customer-name">{{ order.customer }}</td>
            <td>{{ order.date }}</td>
            <td>{{ order.items }} Item</td>
            <td class="total-amount">{{ order.total }}</td>
            <td>
              <span :class="['status-badge', order.statusClass]">{{
                order.status
              }}</span>
            </td>
            <td>
              <button class="view-btn">Lihat Detail</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.order-management {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.export-btn {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  color: #334155;
}

.table-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.filter-row {
  margin-bottom: 24px;
}

.search-box {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-box input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  outline: none;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
}

.order-table th {
  text-align: left;
  padding: 16px;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid #f1f5f9;
}

.order-table td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #334155;
}

.order-id {
  font-weight: 700;
  color: #2563eb;
}

.customer-name {
  font-weight: 600;
}

.total-amount {
  font-weight: 700;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.status-success {
  background: #dcfce7;
  color: #166534;
}
.status-info {
  background: #dbeafe;
  color: #1e40af;
}
.status-warning {
  background: #fef9c3;
  color: #854d0e;
}
.status-danger {
  background: #fee2e2;
  color: #991b1b;
}

.view-btn {
  background: none;
  border: 1px solid #3b82f6;
  color: #3b82f6;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn:hover {
  background: #3b82f6;
  color: white;
}
</style>
