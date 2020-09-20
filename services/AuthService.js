import axios from 'axios'

const apiClient = axios.create({
  baseURL: `http://localhost:4000/`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  login(email, password) {
    return apiClient.post('/login', { email, password })
  },
  register(email, password) {
    return apiClient.post('/register', { email, password })
  },
  logout() {
    return apiClient.post('/logout')
  },
  isLoggedIn() {
    return apiClient.post('isLoggedIn')
  },
}
