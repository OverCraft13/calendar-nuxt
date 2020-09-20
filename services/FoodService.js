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
  index(from, limit, foodGroup, name) {
    let queryString = `/foods?from=${from}&limit=${limit}`
    if (foodGroup) {
      queryString += `&foodGroup=${foodGroup}`
    }
    if (name) {
      queryString += `&name=${name}`
    }
    return apiClient.get(queryString)
  },
  show(id) {
    return apiClient.get(`/foods/${id}`)
  },
}
