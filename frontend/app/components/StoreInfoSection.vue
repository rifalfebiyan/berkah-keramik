<script setup lang="ts">
import { MapPin, Truck, Info, CheckCircle2, AlertCircle } from 'lucide-vue-next'

const deliveryAreas = [
  { area: 'Jakarta (Seluruh Wilayah)', free: true },
  { area: 'Tangerang & Tangerang Selatan', free: true },
  { area: 'Bekasi City', free: true },
  { area: 'Depok', free: true },
  { area: 'Bogor City', free: false },
  { area: 'Luar JABODETABEK', free: false },
]
</script>

<template>
  <section class="store-info-section">
    <div class="container">
      <div class="info-grid">
        <!-- Map Column -->
        <div class="map-column">
          <div class="section-badge">
            <MapPin :size="16" />
            <span>Lokasi Toko Kami</span>
          </div>
          <h2>Kunjungi Showroom Utama Kami</h2>
          <p>Dapatkan pengalaman langsung melihat koleksi keramik dan hardware terbaik kami di showroom fisik.</p>
          
          <div class="map-wrapper">
             <div class="map-placeholder">
                <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800" alt="Map Location" />
                <div class="map-overlay">
                   <div class="pin">
                      <div class="pulse"></div>
                      <MapPin :size="32" color="#ee2d24" fill="#ee2d24" />
                   </div>
                   <div class="map-card">
                      <strong>Berkah Keramik Serpong</strong>
                      <span>Jl. Raya Serpong Km.2, Tangerang</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <!-- Delivery Column -->
        <div class="delivery-column">
          <div class="section-badge alt">
            <Truck :size="16" />
            <span>Area Pengiriman</span>
          </div>
          <h2>Informasi Pengiriman & Biaya</h2>
          <p>Kami melayani pengiriman ke berbagai area dengan kurir profesional untuk memastikan barang sampai dalam kondisi prima.</p>

          <div class="delivery-list">
            <div v-for="item in deliveryAreas" :key="item.area" class="delivery-item">
              <div class="area-name">
                <CheckCircle2 v-if="item.free" :size="18" class="icon-free" />
                <AlertCircle v-else :size="18" class="icon-paid" />
                <span>{{ item.area }}</span>
              </div>
              <span :class="['delivery-badge', { free: item.free }]">
                {{ item.free ? 'FREE ONGKIR' : 'BIAYA TAMBAHAN' }}
              </span>
            </div>
          </div>

          <div class="shipping-policy">
            <div class="policy-icon">
              <Info :size="24" />
            </div>
            <div class="policy-text">
               <h4>Tentang Biaya Tambahan</h4>
               <p>Untuk area di luar jangkauan <strong>FREE ONGKIR</strong>, akan dikenakan biaya tambahan berdasarkan jarak dan volume pesanan. Tim kami akan menghubungi Anda untuk konfirmasi tarif terbaik.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.store-info-section {
  padding: 5rem 0;
  background-color: #f8fafc;
}

.info-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
}

.section-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(13, 27, 62, 0.05);
  color: var(--primary-blue);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 700;
  width: fit-content;
  margin-bottom: 1.5rem;
}

.section-badge.alt {
  background: rgba(255, 204, 0, 0.1);
  color: var(--primary-blue);
}

h2 {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary-blue);
  margin-bottom: 1rem;
  line-height: 1.2;
}

p {
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Map Styling */
.map-wrapper {
  background: white;
  padding: 0.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.map-placeholder {
  position: relative;
  height: 350px;
  border-radius: 1rem;
  overflow: hidden;
}

.map-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.5) contrast(1.1);
}

.map-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pin {
  position: relative;
  z-index: 2;
}

.pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: rgba(13, 27, 62, 0.4);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
}

.map-card {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: white;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.map-card strong { font-size: 0.875rem; color: var(--primary-blue); }
.map-card span { font-size: 0.75rem; color: #64748b; }

/* Delivery Styling */
.delivery-list {
  background: white;
  border-radius: 1.25rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.delivery-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed #e2e8f0;
}

.delivery-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.area-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #334155;
}

.icon-free { color: #00a699; }
.icon-paid { color: #f59e0b; }

.delivery-badge {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #64748b;
}

.delivery-badge.free {
  background: rgba(0, 166, 153, 0.1);
  color: #00a699;
}

.shipping-policy {
  margin-top: 2rem;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  gap: 1rem;
}

.policy-icon { color: #d48806; flex-shrink: 0; }
.policy-text h4 { font-size: 0.9rem; margin-bottom: 0.25rem; color: #855800; }
.policy-text p { font-size: 0.8rem; margin-bottom: 0; color: #855800; }

@media (max-width: 1024px) {
  .info-grid { grid-template-columns: 1fr; gap: 3rem; }
}
</style>
