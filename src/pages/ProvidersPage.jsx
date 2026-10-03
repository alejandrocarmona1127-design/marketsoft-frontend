import { useState, useEffect, useCallback } from 'react'
import providerService from '../services/provider.service'

function ProvidersPage() {
  const [providers, setProviders] = useState([])

  const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      city: ''
  })

  const [selectedProvider, setSelectedProvider] = useState(null)
  const [isCreateOpenModal, setIsCreateOpenModal] = useState(false)
  const [isEditOpenModal, setIsEditOpenModal] = useState(false)

  useEffect(()=> {
    const fetchProviders = async() => {
      try{
          const response = await providerService.getAllProviders()
          setProviders(response.data) 
      }catch(error){
          console.error('Error fetching providers', error)
      }
    }
    fetchProviders()
  }, [])

  const loadProviders = useCallback(async () => {
      try{
          const response = await providerService.getAllProviders()
          setProviders(response.data)
      }catch(error){
          console.error('Error fetching providers', error)
      }
  }, [])

  const openCreateModal = () =>{
      setFormData({
          name: '',
          email: '',
          phone: '',
          city: ''
      })
      setIsCreateOpenModal(true)
      setIsEditOpenModal(false)
  }

  const openEditModal = (provider) =>{
    setSelectedProvider(provider)
    setFormData({
        name: provider.name,
        email: provider.email,
        phone: provider.phone,
        city: provider.city
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
      await providerService.createProvider(formData)
      closeCreateModal()
      await loadProviders()
  }

  const handleSubmitUpdate = async (event) =>{
    event.preventDefault()
    await providerService.updateProvider(selectedProvider.id, formData)
    closeEditModal()
    await loadProviders()
  }

  const handleDeleteProvider = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this provider?"
    )
    if(!confirmDelete) return

    await providerService.deleteProvider(id)
    await loadProviders()
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="text-muted text-uppercase small fw-bold">Inventory</span>
          <h2 className="mb-0">Providers</h2>
        </div>
        <button className="btn btn-primary shadow-sm" type="button" onClick={openCreateModal}>
          + Create Provider
        </button>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-striped table-hover mb-0 align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(providers || []).map((provider) => (
              <tr key={provider.id}>
                <td className="fw-semibold">{provider.name}</td>
                <td>{provider.email}</td>
                <td>{provider.phone}</td>
                <td>
                  <span className="badge bg-secondary">{provider.city}</span>
                </td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => openEditModal(provider)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDeleteProvider(provider.id)}>
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
                <h5 className="modal-title">Create Provider</h5>
                <button type="button" className="btn-close" onClick={closeCreateModal}></button>
              </div>
              <div className="modal-body">
                <form id="createProviderForm" onSubmit={handleSubmitCreate}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name</label>
                    <input className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <input className="form-control" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label fw-bold">Phone</label>
                      <input className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="col">
                      <label className="form-label fw-bold">City</label>
                      <input className="form-control" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeCreateModal}>Cancel</button>
                <button type="submit" form="createProviderForm" className="btn btn-primary">Create Provider</button>
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
                <h5 className="modal-title">Edit Provider</h5>
                <button type="button" className="btn-close" onClick={closeEditModal}></button>
              </div>
              <div className="modal-body">
                <form id="editProviderForm" onSubmit={handleSubmitUpdate}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name</label>
                    <input className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <input className="form-control" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label fw-bold">Phone</label>
                      <input className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="col">
                      <label className="form-label fw-bold">City</label>
                      <input className="form-control" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
                <button type="submit" form="editProviderForm" className="btn btn-primary">Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProvidersPage;