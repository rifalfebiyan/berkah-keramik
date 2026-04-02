export default defineNuxtPlugin((nuxtApp) => {
  const { logout, getExpiryTime, token } = useAuth()
  let expiryTimer: any = null

  const startExpiryTimer = (jwt: string) => {
    if (expiryTimer) clearTimeout(expiryTimer)
    
    // Decode JWT exp claim
    const expiryTime = getExpiryTime(jwt)
    if (!expiryTime) {
      // If we have a token but can't decode it (nonsense string), it's invalid
      logout('Sesi tidak valid. Silakan login kembali.')
      return
    }

    const remainingTime = expiryTime - Date.now()

    if (remainingTime <= 0) {
      // Token already expired
      logout('Sesi Anda telah berakhir. Silakan login kembali.')
    } else {
      // Set timer to auto logout when token expires
      expiryTimer = setTimeout(() => {
        logout('Sesi Anda telah berakhir. Silakan login kembali.')
      }, remainingTime)
    }
  }

  // Only run this on the client side
  if (import.meta.client) {
    // 1. Watch for internal changes
    watch(token, (newToken) => {
      if (!newToken) {
        const route = useRoute()
        if (!['/login', '/register'].includes(route.path)) {
          logout(null)
        }
      } else {
        startExpiryTimer(newToken)
      }
    }, { immediate: true })

    // 2. Background Monitor (Check every 2s for manual devtools edits)
    setInterval(() => {
      const activeToken = useCookie('token').value
      if (activeToken) {
        const expiry = getExpiryTime(activeToken)
        // If token is present but invalid (not a real JWT), logout!
        if (!expiry) {
          logout('Sesi tidak valid. Silakan login kembali.')
        }
      }
    }, 2000)
  }

  return {
    provide: {
      auth: {
        token,
        logout
      }
    }
  }
})