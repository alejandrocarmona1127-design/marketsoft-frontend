import { useState, useEffect, useCallback } from 'react'
import userService from '../services/user.service'

function UsersPage() {
  const [users, setUsers] = useState([])

  const [formData, setFormData] = useState({
      name: '',
      email: '',
      role: ''
  })

  const [selectedUser, setSelectedUser] = useState(null)
  const [isCreateOpenModal, setIsCreateOpenModal] = useState(false)
  const [isEditOpenModal, setIsEditOpenModal] = useState(false)

  useEffect(()=> {
    const fetchUsers = async() => {
      try{
          const response = await userService.getAllUsers()
          setUsers(response.data) 
      }catch(error){
          console.error('Error fetching users', error)
      }
    }
    fetchUsers()
  }, [])

  const loadUsers = useCallback(async () => {
      try{
          const response = await userService.getAllUsers()
          setUsers(response.data)
      }catch(error){
          console.error('Error fetching users', error)
      }
  }, [])

  const openCreateModal = () =>{
      setFormData({
          name: '',
          email: '',
          role: ''
      })
      setIsCreateOpenModal(true)
      setIsEditOpenModal(false)
  }

  const openEditModal = (user) =>{
    setSelectedUser(user)
    setFormData({
        name: user.name,
        email: user.email,
        role: user.role
    })
    setIsCreateOpenModal(false)
    setIsEditOpenModal(true)
  }

  const closeCreateModal = () => setIsCreateOpenModal(false)
  const closeEditModal = () => setIsEditOpenModal(false)

  const handleChange = (event) =>{
    const { name, value} = event.target
    setFormData((prevData) => ({
        ...prevData, 
        [name]: value
    }))
  }

  const handleSubmitCreate = async (event) =>{
      event.preventDefault()
      await userService.createUser(formData)
      closeCreateModal()
      await loadUsers()
  }

  const handleSubmitUpdate = async (event) =>{
    event.preventDefault()
    await userService.updateUser(selectedUser.id, formData)
    closeEditModal()
    await loadUsers()
  }

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    )
    if(!confirmDelete) return

    await userService.deleteUser(id)
    await loadUsers()
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="text-muted text-uppercase small fw-bold">System</span>
          <h2 className="mb-0">Users</h2>
        </div>
        <button className="btn btn-primary shadow-sm" type="button" onClick={openCreateModal}>
          + Create User
        </button>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-striped table-hover mb-0 align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map((user) => (
              <tr key={user.id}>
                <td className="fw-semibold">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role.toLowerCase() === 'admin' ? 'bg-danger' : 'bg-info text-dark'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => openEditModal(user)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreateOpenModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create User</h5>
                <button type="button" className="btn-close" onClick={closeCreateModal}></button>
              </div>
              <div className="modal-body">
                <form id="createUserForm" onSubmit={handleSubmitCreate}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name</label>
                    <input className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <input className="form-control" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Role</label>
                    <input className="form-control" name="role" placeholder="e.g. Admin, Seller" value={formData.role} onChange={handleChange} required />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeCreateModal}>Cancel</button>
                <button type="submit" form="createUserForm" className="btn btn-primary">Create User</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditOpenModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={closeEditModal}></button>
              </div>
              <div className="modal-body">
                <form id="editUserForm" onSubmit={handleSubmitUpdate}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name</label>
                    <input className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <input className="form-control" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Role</label>
                    <input className="form-control" name="role" placeholder="e.g. Admin, Seller" value={formData.role} onChange={handleChange} required />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
                <button type="submit" form="editUserForm" className="btn btn-primary">Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;