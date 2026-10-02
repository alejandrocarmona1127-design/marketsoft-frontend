import { useState, useEffect, useCallback } from 'react'
import providerService from '../services/provider.service'
import '../styles/products.css' 

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
    <section className="products-page">
      <header className="products-header">
        <div>
          <p className="products-eyebrow">Inventory</p>
          <h2>Providers</h2>
        </div>
        <button className="products-button products-button-primary" type="button" onClick={openCreateModal}>
          Create Provider
        </button>
      </header>

      <div className="products-table-wrap">
      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
             <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider) => (
            <tr key={provider.id}>
              <td>{provider.name}</td>
              <td>{provider.email}</td>
              <td>{provider.phone}</td>
              <td>{provider.city}</td>
              <td>
                <div className="products-actions">
                <button className="products-button products-button-edit" type="button" onClick={() => openEditModal(provider)}>
                  Edit
                </button>
                <button className="products-button products-button-delete" type="button" onClick={() => handleDeleteProvider(provider.id)}>
                  Delete
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {isCreateOpenModal && (
        <div className="products-modal-backdrop">
        <div className="products-modal" role="dialog" aria-modal="true">
          <div className="products-modal-heading">
            <p className="products-eyebrow">New item</p>
            <h3>Create Provider</h3>
          </div>
          <form className="products-form" onSubmit={handleSubmitCreate}>
            <label className="products-field">
              Name
              <input className="products-input" name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <label className="products-field">
              Email
              <input className="products-input" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </label>
            <label className="products-field">
              Phone
              <input className="products-input" name="phone" value={formData.phone} onChange={handleChange} required />
            </label>
            <label className="products-field">
              City
              <input className="products-input" name="city" value={formData.city} onChange={handleChange} required />
            </label>
            <div className="products-modal-actions">
              <button className="products-button products-button-secondary" type="button" onClick={closeCreateModal}>Cancel</button>
              <button className="products-button products-button-primary" type="submit">Create Provider</button>
            </div>
          </form>
        </div>
        </div>
      )}

      {isEditOpenModal && (
        <div className="products-modal-backdrop">
        <div className="products-modal" role="dialog" aria-modal="true">
          <div className="products-modal-heading">
            <p className="products-eyebrow">Provider details</p>
            <h3>Edit Provider</h3>
          </div>
          <form className="products-form" onSubmit={handleSubmitUpdate}>
            <label className="products-field">
              Name
              <input className="products-input" name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <label className="products-field">
              Email
              <input className="products-input" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </label>
            <label className="products-field">
              Phone
              <input className="products-input" name="phone" value={formData.phone} onChange={handleChange} required />
            </label>
            <label className="products-field">
              City
              <input className="products-input" name="city" value={formData.city} onChange={handleChange} required />
            </label>
            <div className="products-modal-actions">
              <button className="products-button products-button-secondary" type="button" onClick={closeEditModal}>Cancel</button>
              <button className="products-button products-button-primary" type="submit">Update</button>
            </div>
          </form>
        </div>
        </div>
      )}
    </section>
  );
}

export default ProvidersPage;