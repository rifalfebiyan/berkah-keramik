<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <section class="hero-section">
    <div class="container">
      <div class="hero-wrapper">
        <div class="hero-banner">
          <div class="hero-content">
            <span class="mega-sale">Banyak Diskon & Berhadiah</span>
            <h1>Solusi Kebutuhan <span>Rumah Anda</span></h1>
            <p>Dapatkan koleksi keramik berkualitas premium dan material bangunan terlengkap dengan harga terbaik.</p>
            <div class="cta-actions">
              <button class="btn-primary">Lihat Promo <ArrowRight :size="18" /></button>
              <button class="btn-outline">Katalog 2026</button>
            </div>
          </div>
          <!-- Decorative element -->
          <div class="hero-decorative">
             <div class="circle-blur"></div>
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

.hero-section {
  padding: 2rem 0;
  background-color: #fff;
}

.hero-wrapper {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.05);
}

.hero-banner {
  background: linear-gradient(135deg, var(--primary-blue) 0%, #1e293b 100%);
  height: 480px;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 4rem;
}

.hero-banner::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200');
  background-size: cover;
  background-position: center;
  clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
  opacity: 0.9;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 500px;
}

.mega-sale {
  background: var(--primary-yellow);
  color: var(--primary-blue);
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.875rem;
  display: inline-block;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

h1 {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

h1 span {
  display: block;
  color: var(--primary-yellow);
}

p {
  font-size: 1.125rem;
  color: #e2e8f0;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  background: var(--primary-red);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #000;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(238, 45, 36, 0.3);
}

.btn-outline {
  border: 2px solid white;
  background: transparent;
  color: white;
  padding: 0.85rem 2rem;
  border-radius: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-outline:hover {
  background: white;
  color: var(--primary-blue);
}

@media (max-width: 768px) {
  .hero-banner {
    padding: 0 2rem;
    height: 400px;
    text-align: center;
    justify-content: center;
  }
  
  .hero-banner::after {
    display: none;
  }
  
  h1 {
    font-size: 2.5rem;
  }
  
  .cta-actions {
    justify-content: center;
  }
}
</style>
