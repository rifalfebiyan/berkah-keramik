<template>
  <div class="bg-gray-50/50 min-h-screen py-24">
    <div class="container">
      <div class="max-w-4xl mx-auto">
        <!-- Luxury Banner -->
        <div class="rounded-[4rem] overflow-hidden bg-gray-900 h-[28rem] relative shadow-[0_50px_100px_rgba(0,0,0,0.15)] mb-16 group">
          <div class="absolute inset-0 bg-cover bg-center transition duration-[4000ms] group-hover:scale-110 opacity-40 grayscale" style="background-image: url('https://images.unsplash.com/photo-1541746972996-4e0b0f43e03a?auto=format&fit=crop&q=80&w=1200');"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900/80 to-transparent flex items-center p-12 md:p-20">
            <div class="max-w-md text-white space-y-6 relative">
              <div class="inline-block px-4 py-1.5 bg-yellow-400 text-blue-900 text-[10px] uppercase font-black tracking-widest rounded-full shadow-lg">Premium Loyalty</div>
              <h1 class="text-6xl font-black tracking-tighter leading-none">Berkah Member Plus+</h1>
              <p class="text-blue-100 text-lg font-medium leading-relaxed">Nikmati akses eksklusif, diskon tak terbatas, dan perlakuan khusus di seluruh cabang kami.</p>
              <button class="bg-white text-blue-900 px-10 py-4 rounded-3xl font-black shadow-2xl shadow-blue-400/20 hover:bg-yellow-400 hover:-translate-y-1 transition transform active:scale-95 text-xl">Daftar Sekarang</button>
            </div>
          </div>
        </div>

        <!-- Benefits Grid -->
        <div class="grid md:grid-cols-3 gap-10">
          <div v-for="(benefit, i) in benefits" :key="i" class="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 hover:-translate-y-2 group">
            <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mb-8 border border-gray-100 group-hover:bg-blue-600 transition duration-500 group-hover:rotate-12">
               {{ benefit.icon }}
            </div>
            <h3 class="font-black text-2xl mb-4 text-gray-900 tracking-tight">{{ benefit.title }}</h3>
            <p class="text-gray-500 font-medium text-sm leading-relaxed">{{ benefit.desc }}</p>
          </div>
        </div>

        <!-- Tiers Section -->
        <div class="mt-24 px-12 py-20 bg-gray-900 rounded-[4rem] text-center shadow-[0_60px_120px_rgba(30,58,138,0.25)] relative overflow-hidden">
           <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
           <div class="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-blue-600/5 to-transparent"></div>
           
           <h2 class="text-4xl font-black text-white mb-4 relative z-10 tracking-tight">Kastanya Keanggotaan</h2>
           <p class="text-gray-400 font-medium mb-16 relative z-10">Semakin sering belanja, semakin banyak privilese yang menanti.</p>
           
           <div class="flex flex-wrap justify-center gap-12 relative z-10">
             <div v-for="(tier, i) in tiers" :key="i" class="flex flex-col items-center gap-6 group/tier">
               <div :class="`w-24 h-24 ${tier.bg} rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 ${tier.border} group-hover/tier:scale-110 transition duration-500 relative` ">
                  {{ tier.icon }}
                  <div class="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-0 group-hover/tier:opacity-100 transition duration-1000"></div>
               </div>
               <div class="text-center">
                  <div class="text-2xl font-black text-white mb-1 tracking-tight">{{ tier.name }}</div>
                  <div class="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">{{ tier.req }}</div>
               </div>
             </div>
           </div>
        </div>

        <div class="mt-16 text-center">
           <button @click="navigateTo('/')" class="text-gray-400 font-bold hover:text-blue-600 transition flex items-center justify-center gap-2 mx-auto">
             <span>← Kembali Menjelajah Produk</span>
           </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const benefits = [
  { icon: '💸', title: 'Diskon Eksklusif', desc: 'Dapatkan potongan harga khusus hingga 15% untuk koleksi granit pilihan setiap awal bulan.' },
  { icon: '✨', title: 'Poin Hadiah', desc: 'Setiap transaksi akan dikonversi menjadi poin loyalitas yang dapat ditukar dengan voucher belanja tanpa kedaluwarsa.' },
  { icon: '📦', title: 'Prioritas Logistik', desc: 'Nikmati layanan pengiriman prioritas dengan slot waktu yang bisa Anda tentukan sendiri tanpa biaya tambahan.' },
];

const tiers = [
  { name: 'Silver', req: 'Pendaftaran Awal', icon: '🥈', bg: 'bg-slate-200', border: 'border-slate-400' },
  { name: 'Gold', req: 'Belanja Rp10JT+', icon: '🥇', bg: 'bg-yellow-200', border: 'border-yellow-400' },
  { name: 'Platinum', req: 'Belanja Rp50JT+', icon: '💎', bg: 'bg-blue-100', border: 'border-blue-400' },
];
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
</style>
