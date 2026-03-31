export const useAuth = () => {

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch('http://localhost:3000/login', {
        method: 'POST',
        body: {
          email,
          password
        }
      })

      console.log("Login sukses", response)

    } catch (error) {
      console.log("Login gagal", error)
    }
  }

  return {
    login
  }
}