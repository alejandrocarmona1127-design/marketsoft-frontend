import api from './api'

const getAllProviders = () => api.get('/providers')
const getProviderById = (id) => api.get(`/providers/${id}`)
const createProvider = (providerData) => api.post('/providers', providerData)
const updateProvider = (id, providerData) => api.put(`/providers/${id}`, providerData)
const deleteProvider = (id) => api.delete(`/providers/${id}`)

const providerService = {
  getAllProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider,
}

export default providerService