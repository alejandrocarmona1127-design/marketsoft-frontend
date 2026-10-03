import api from './api'

const getAllUsers = () => api.get('/users')
const getUserById = (id) => api.get(`/users/${id}`)
const createUser = (userData) => api.post('/users', userData)
const updateUser = (id, userData) => api.put(`/users/${id}`, userData)
const deleteUser = (id) => api.delete(`/users/${id}`)

const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}

export default userService;