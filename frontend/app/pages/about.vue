<template>
  <div class="bg-gray-50/50 min-h-screen py-24">
    <div class="container">
      <div class="max-w-4xl mx-auto space-y-16">
        
        <header class="text-center space-y-4">
          <h1 class="text-5xl font-black text-gray-900 tracking-tighter">Tentang Berkah Keramik</h1>
          <p class="text-blue-600 font-bold uppercase tracking-widest text-sm">Membangun Hunian Idaman Sejak 2012</p>
        </header>

        <section class="bg-white rounded-[3rem] p-12 shadow-xl shadow-blue-500/5 border border-gray-100 relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-50/50 rounded-full blur-2xl group-hover:scale-110 transition duration-700"></div>
          
          <div class="prose prose-blue lg:prose-xl text-gray-600 leading-relaxed max-w-none">
            <p class="text-xl text-gray-800 font-medium mb-10 leading-relaxed">
              <strong>Berkah Keramik</strong> hadir sebagai mitra terpercaya bagi Anda yang mendambakan hunian dengan sentuhan estetika tinggi dan kualitas bangunan yang tak lekang oleh waktu.
            </p>
            
            <div class="grid md:grid-cols-2 gap-10 my-16">
              <div class="p-8 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                <div class="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-blue-200">
                  🎯
                </div>
                <h3 class="text-2xl font-black text-gray-900 mb-4">Misi Utama</h3>
                <p class="text-sm font-medium leading-relaxed">Menyediakan produk keramik, granit, dan saniter kelas dunia dengan harga yang bersaing, didukung oleh tim ahli yang siap memberikan konsultasi terbaik.</p>
              </div>
              <div class="p-8 bg-amber-50/50 rounded-3xl border border-amber-100/50">
                <div class="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-amber-200">
                  ✨
                </div>
                <h3 class="text-2xl font-black text-gray-900 mb-4">Visi Masa Depan</h3>
                <p class="text-sm font-medium leading-relaxed">Menjadi destinasi utama kebutuhan material bangunan yang paling inovatif dan menginspirasi bagi seluruh masyarakat Indonesia.</p>
              </div>
            </div>

            <h2 class="text-3xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6">Kenapa Memilih Kami?</h2>
            <div class="grid grid-cols-1 gap-6">
              <div v-for="(point, i) in whyUs" :key="i" class="flex gap-6 p-6 hover:bg-gray-50 rounded-2xl transition duration-300">
                <div class="text-3xl">{{ point.icon }}</div>
                <div>
                   <h4 class="font-black text-gray-900 mb-1 text-lg">{{ point.title }}</h4>
                   <p class="text-sm font-medium">{{ point.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="text-center pt-10">
          <button @click="navigateTo('/')" class="bg-blue-600 text-white px-12 py-5 rounded-3xl font-black shadow-2xl shadow-blue-300 hover:bg-blue-700 hover:-translate-y-1 transition transform active:scale-95 text-lg">
            Mulai Belanja Sekarang
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
const whyUs = [
  { icon: '💎', title: 'Kualitas Premium Terjamin', desc: 'Kami hanya menjual produk pilihan yang telah melalui proses seleksi ketat untuk memastikan ketahanan dan keindahan jangka panjang.' },
  { icon: '📦', title: 'Stok Selalu Tersedia', desc: 'Dengan gudang penyimpanan yang luas, kami menjamin ketersediaan barang untuk proyek skala kecil maupun besar tanpa perlu menunggu lama.' },
  { icon: '🚚', title: 'Pengiriman Aman & Cepat', desc: 'Tim logistik internal kami dilatih khusus untuk menangani material pecah belah agar sampai di lokasi Anda tanpa cacat sedikitpun.' },
];
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
</style>
