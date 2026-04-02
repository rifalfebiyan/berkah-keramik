import { toast } from 'vue-sonner'

export const useAuth = () => {
  const token = useCookie('token')
  const userRole = useCookie('userRole')
  const userName = useCookie('userName')
  const userId = useCookie('userId')

  const logout = async (message?: string | null) => {
    const route = useRoute()
    const { triggerAlert } = useSessionError()
    
    // Clear all auth cookies
    token.value = null
    userRole.value = null
    userName.value = null
    userId.value = null

    // Clear localStorage for consistency (browser only)
    if (import.meta.client) {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
    }

    // Trigger Session Alert Dialog
    const displayMessage = message === undefined ? 'Sesi login kedaluwarsa. Silakan login kembali.' : message;
    if (displayMessage && !['/login', '/register'].includes(route.path)) {
      triggerAlert(displayMessage)
      return // Wait for user to click "OK" in the dialog
    }

    // If no message (silent logout), redirect directly
    return navigateTo('/login')
  }

  // Helper to decode JWT payload (browser only)
  const decodeJwt = (jwt: string) => {
    if (!jwt || !import.meta.client) return null
    try {
      const parts = jwt.split('.')
      if (parts.length !== 3) return null
      
      const base64Url = parts[1]
      if (!base64Url) return null
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (e) {
      return null
    }
  }

  const getExpiryTime = (jwt: string) => {
    const payload = decodeJwt(jwt)
    return payload ? payload.exp * 1000 : null // exp is in seconds
  }

  return {
    logout,
    decodeJwt,
    getExpiryTime,
    token
  }
}