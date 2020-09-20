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
  index(from, until) {
    return apiClient.get(`/events?from=${from}&until=${until}`)
  },
  store(event) {
    return apiClient.post('/events', event)
  },
  delete(id) {
    return apiClient.delete(`/events/${id}`)
  },
  patch(id, update) {
    return apiClient.patch(`/events/${id}`, update)
  },
}
