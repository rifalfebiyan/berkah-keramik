<template>
  <Transition name="fade">
    <div v-if="isAlertOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-[1.5rem] w-full max-w-[400px] overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-200">
        <!-- Content -->
        <div class="p-8 text-center">
          <!-- Icon -->
          <div class="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 class="text-2xl font-extrabold text-gray-900 mb-2">Sesi Berakhir</h2>
          <p class="text-gray-500 text-sm leading-relaxed mb-8 px-4 font-medium">
            {{ alertMessage }}
          </p>

          <button 
            @click="handleLogin" 
            class="w-full py-4 bg-[#1e3a8a] hover:bg-[#152a66] text-white font-black text-sm rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-900/10 uppercase tracking-widest"
          >
            Masuk Kembali
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
/**
 * SessionAlert - Global Dialog Alert for Session Expiry
 * Follows a clean, professional e-commerce design.
 */
const { isAlertOpen, alertMessage, closeAlert } = useSessionError()
const { logout } = useAuth()

const handleLogin = async () => {
  // Silent logout to just perform cleanup and navigate
  await logout(null)
  closeAlert()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
