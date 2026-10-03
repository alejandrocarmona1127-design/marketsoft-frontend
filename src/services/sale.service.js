import api from './api'

const getAllSales = () => api.get('/sales')
const getSaleById = (id) => api.get(`/sales/${id}`)
const createSale = (saleData) => api.post('/sales', saleData)
const updateSale = (id, saleData) => api.put(`/sales/${id}`, saleData)
const deleteSale = (id) => api.delete(`/sales/${id}`)

const saleService = {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
}

export default saleService;