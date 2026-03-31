<script setup lang="ts">
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-vue-next'
</script>

<template>
  <footer class="main-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo">
            <span class="brand-red">DEPO</span>
            <span class="brand-blue">BANGUNAN</span>
          </div>
          <p>Supermarket Bahan Bangunan dengan pilihan terlengkap dan harga bersaing.</p>
          <div class="social-links">
            <a href="#"><Facebook :size="20"/></a>
            <a href="#"><Twitter :size="20"/></a>
            <a href="#"><Instagram :size="20"/></a>
            <a href="#"><Youtube :size="20"/></a>
          </div>
        </div>
        
        <div class="footer-links">
          <h4>LAYANAN PELANGGAN</h4>
          <ul>
            <li><NuxtLink to="/help">Bantuan</NuxtLink></li>
            <li><NuxtLink to="/help">Kebijakan Pengembalian</NuxtLink></li>
            <li><NuxtLink to="/help">Metode Pengiriman</NuxtLink></li>
            <li><NuxtLink to="/help">FAQ</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-links">
          <h4>TENTANG KAMI</h4>
          <ul>
            <li><NuxtLink to="/about">Profil Perusahaan</NuxtLink></li>
            <li><NuxtLink to="/help">Hubungi Kami</NuxtLink></li>
            <li><NuxtLink to="/locations">Lokasi Toko</NuxtLink></li>
            <li><NuxtLink to="/about">Karir</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 Depo Bangunan. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.main-footer {
  background-color: var(--primary-blue);
  color: white;
  padding: 4rem 0 2rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
}

.brand-red {
  color: var(--primary-red);
  font-size: 1.5rem;
  font-weight: 800;
}

.brand-blue {
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  margin-left: 4px;
}

.footer-brand p {
  margin: 1.5rem 0;
  color: #cbd5e1;
  font-size: 0.875rem;
  max-width: 300px;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  color: white;
  background: rgba(255,255,255,0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.social-links a:hover {
  background: var(--primary-red);
}

h4 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: 0.75rem;
}

ul li a {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

ul li a:hover {
  color: var(--primary-red);
}

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 2rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}
</style>
