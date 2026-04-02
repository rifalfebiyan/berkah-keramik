import { ref } from 'vue'

const isAlertOpen = ref(false)
const alertMessage = ref('Sesi Anda telah berakhir. Silakan login kembali untuk melanjutkan.')

export const useSessionError = () => {
  const triggerAlert = (message?: string | null) => {
    if (message) alertMessage.value = message
    isAlertOpen.value = true
  }

  const closeAlert = () => {
    isAlertOpen.value = false
  }

  return {
    isAlertOpen,
    alertMessage,
    triggerAlert,
    closeAlert
  }
}
