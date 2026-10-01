import api from './api'

const getAllProducts = () => api.get('/products')
const getProductById = (id) => api.get(`/products/${id}`)
const createProduct = (productData) => api.post('/products', productData)
const updateProduct = (id, productData) => api.put(`/products/${id}`, productData)
const deleteProduct = (id) => api.delete(`/products/${id}`)

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}

export default productService