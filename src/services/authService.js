const mockUserData = [
  { username: "admin", password: "123456" },
  { username: "user", password: "password" },
]

export const loginService = async (username, password) => {
  // Simula una llamada a una API
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUserData.find(
        (u) => u.username === username && u.password === password
      )
      resolve(!!user) // Devuelve true si las credenciales coinciden
    }, 1000)
  })
}