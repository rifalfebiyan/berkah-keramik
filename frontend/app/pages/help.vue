<template>
  <div class="bg-gray-50/50 min-h-screen py-24">
    <div class="container">
      <div class="max-w-4xl mx-auto">
        <header class="text-center mb-16 space-y-4">
          <h1 class="text-5xl font-black text-gray-900 tracking-tighter">Pusat Bantuan</h1>
          <p class="text-blue-600 font-bold tracking-widest text-sm uppercase">Solusi Cepat Untuk Pertanyaan Anda</p>
        </header>

        <section class="grid grid-cols-1 gap-4">
          <div v-for="(item, index) in faqs" :key="index" class="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative group">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-50/30 rounded-full blur-2xl group-hover:scale-110 transition duration-700"></div>
            
            <div class="flex items-start gap-6 relative">
              <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner group-hover:bg-blue-600 group-hover:text-white transition duration-500 flex-shrink-0">
                ?
              </div>
              <div>
                <h3 class="text-xl font-black text-gray-900 mb-4 tracking-tight">{{ item.question }}</h3>
                <p class="text-gray-500 leading-relaxed font-medium">{{ item.answer }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="mt-24">
          <div class="bg-gray-900 text-white p-12 md:p-20 rounded-[3.5rem] shadow-[0_40px_80px_rgba(30,58,138,0.2)] text-center relative overflow-hidden group">
            <!-- Decorative light beams -->
            <div class="absolute -top-40 -left-40 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
            <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 2s;"></div>
            
            <div class="relative max-w-lg mx-auto">
              <h2 class="text-4xl font-black mb-6 tracking-tight">Masih Butuh Bantuan?</h2>
              <p class="mb-12 text-gray-400 font-medium leading-relaxed">Tim dukungan teknis kami siap menjawab pertanyaan Anda sepanjang hari melalui saluran komunikasi kami.</p>
              
              <div class="flex flex-col sm:flex-row justify-center gap-6">
                <button class="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black shadow-xl shadow-emerald-500/20 transition transform active:scale-95 group/wa">
                  <span class="flex items-center justify-center gap-2">
                    <span class="text-xl group-hover/wa:rotate-12 transition">💬</span>
                    <span>Chat WhatsApp</span>
                  </span>
                </button>
                <button class="bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-black border border-white/10 transition transform active:scale-95">
                  <span class="flex items-center justify-center gap-2">
                    <span>📧</span>
                    <span>Kirim Email</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer class="text-center mt-20">
           <button @click="navigateTo('/')" class="text-gray-400 font-bold hover:text-blue-600 transition flex items-center justify-center gap-2 mx-auto">
             <span>← Kembali ke Beranda</span>
           </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
const faqs = [
  { question: 'Bagaimana cara melacak pesanan saya?', answer: 'Anda dapat melacak pesanan melalui menu "Pesanan Saya" di profil akun Anda. Status pengiriman akan diperbarui secara real-time oleh tim kurir kami.' },
  { question: 'Apakah ada biaya pengiriman?', answer: 'Kami menyediakan gratis ongkir untuk area Jabodetabek dengan minimal pembelian tertentu. Untuk luar area tersebut, biaya pengiriman akan dihitung berdasarkan tarif kargo yang berlaku.' },
  { question: 'Apa kebijakan pengembalian barang?', answer: 'Barang dapat dikembalikan dalam waktu 7 hari jika terdapat cacat pabrik atau pecah saat pengiriman. Pastikan Anda memiliki video unboxing untuk pengajuan klaim.' },
  { question: 'Bagaimana cara melakukan pembayaran?', answer: 'Kami mendukung berbagai metode pembayaran mulai dari Transfer Bank, Kartu Kredit, hingga E-Wallet melalui gerbang pembayaran aman kami.' },
];
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
</style>
