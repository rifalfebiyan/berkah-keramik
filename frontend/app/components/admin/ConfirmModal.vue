<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  type?: 'danger' | 'warning' | 'info'
}>()

const emit = defineEmits(['confirm', 'cancel'])

const closeOnBackdrop = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    emit('cancel')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="show" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        @click="closeOnBackdrop"
      >
        <Transition name="pop">
          <div 
            v-if="show"
            class="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-gray-100"
            @click.stop
          >
            <div class="p-8 text-center">
              <!-- Icon Header -->
              <div 
                class="w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center text-3xl"
                :class="{
                  'bg-red-50 text-red-500': type === 'danger',
                  'bg-orange-50 text-orange-500': type === 'warning' || !type,
                  'bg-blue-50 text-blue-500': type === 'info'
                }"
              >
                <template v-if="type === 'danger'">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </template>
                <template v-else-if="type === 'info'">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </template>
                <template v-else>
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </template>
              </div>

              <h2 class="text-xl font-extrabold text-gray-900 mb-2">{{ title }}</h2>
              <p class="text-gray-500 text-sm leading-relaxed mb-8">
                {{ message }}
              </p>

              <div class="flex flex-col gap-3">
                <button 
                  @click="$emit('confirm')"
                  :disabled="isLoading"
                  class="w-full py-3.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                  :class="{
                    'bg-red-500 text-white shadow-red-200 hover:bg-red-600': type === 'danger',
                    'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700': type === 'info' || !type
                  }"
                >
                  <div v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                  {{ isLoading ? 'Memproses...' : (confirmText || 'Konfirmasi') }}
                </button>
                
                <button 
                  @click="$emit('cancel')"
                  :disabled="isLoading"
                  class="w-full py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors active:scale-95"
                >
                  {{ cancelText || 'Batal' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.pop-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-leave-active {
  transition: all 0.25s ease-in;
}
.pop-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
.pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
