import { useState, useEffect, useCallback } from 'react'
import productService from '../services/product.service'

function ProductsPage() {
  const [products, setProducts] = useState([])

  const [formData, setFormData] = useState({
      name: '',
      description: '',
      price: '',
      stock: '',
      providerId: ''
  })

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isCreateOpenModal, setIsCreateOpenModal] = useState(false)
  const [isEditOpenModal, setIsEditOpenModal] = useState(false)

  useEffect(()=> {
    const fetchProducts = async() => {
      try{
          const response = await productService.getAllProducts()
          setProducts(response.data) 
      }catch(error){
          console.error('Error fetching products', error)
      }
    }
    fetchProducts()
  }, [])

  const loadProducts = useCallback(async () => {
      try{
          const response = await productService.getAllProducts()
          setProducts(response.data)
      }catch(error){
          console.error('error fetching product', error)
      }
  }, [])

  const openCreateModal = () =>{
      setFormData({
          name: '',
          description: '',
          price: '',
          stock: '',
          providerId: ''
      })
      setIsCreateOpenModal(true)
      setIsEditOpenModal(false)
  }

  const openEditModal = (product) =>{
    setSelectedProduct(product)
    setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        providerId: product.providerId
    })
    setIsCreateOpenModal(false)
    setIsEditOpenModal(true)
  }

  const closeCreateModal = () => setIsCreateOpenModal(false)
  const closeEditModal = () => setIsEditOpenModal(false)

  const handleCreateProduct = (event) =>{
    const { name, value} = event.target
    setFormData((prevData) => ({
        ...prevData, 
        [name]: value
    }))
  }

  const handleUpdate = (event) =>{
    const { name, value} = event.target
    setFormData((prevData) =>({
        ...prevData,
        [name]:value
    }))
  }

  const handleSubmitCreate = async (event) =>{
      event.preventDefault()
      await productService.createProduct({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          providerId: formData.providerId
      })
      closeCreateModal()
      await loadProducts()
  }

  const handleSubmitUpdate = async (event) =>{
    event.preventDefault()
    await productService.updateProduct(
        selectedProduct.id, 
        {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            stock: formData.stock,
            providerId: formData.providerId
        }
    )
    closeEditModal()
    await loadProducts()
  }

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    )
    if(!confirmDelete) return
    
    await productService.deleteProduct(id)
    await loadProducts()
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="text-muted text-uppercase small fw-bold">Inventory</span>
          <h2 className="mb-0">Products</h2>
        </div>
        <button className="btn btn-primary shadow-sm" type="button" onClick={openCreateModal}>
          + Create Product
        </button>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-striped table-hover mb-0 align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Provider ID</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((product) => (
              <tr key={product.id}>
                <td className="fw-semibold">{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price}</td>
                <td>
                  <span className={`badge ${product.stock > 10 ? 'bg-success' : 'bg-danger'}`}>
                    {product.stock}
                  </span>
                </td>
                <td>{product.providerId}</td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => openEditModal(product)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDeleteProduct(product.id)}>
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
                <h5 className="modal-title">Create Product</h5>
                <button type="button" className="btn-close" onClick={closeCreateModal}></button>
              </div>
              <div className="modal-body">
                <form id="createForm" onSubmit={handleSubmitCreate}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name</label>
                    <input className="form-control" name="name" value={formData.name} onChange={handleCreateProduct} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Description</label>
                    <input className="form-control" name="description" value={formData.description} onChange={handleCreateProduct} required />
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label fw-bold">Price</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input className="form-control" name="price" type="number" step="0.01" value={formData.price} onChange={handleCreateProduct} required />
                      </div>
                    </div>
                    <div className="col">
                      <label className="form-label fw-bold">Stock</label>
                      <input className="form-control" name="stock" type="number" value={formData.stock} onChange={handleCreateProduct} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Provider ID</label>
                    <input className="form-control" name="providerId" type="number" value={formData.providerId} onChange={handleCreateProduct} required />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeCreateModal}>Cancel</button>
                <button type="submit" form="createForm" className="btn btn-primary">Create Product</button>
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
                <h5 className="modal-title">Edit Product</h5>
                <button type="button" className="btn-close" onClick={closeEditModal}></button>
              </div>
              <div className="modal-body">
                <form id="editForm" onSubmit={handleSubmitUpdate}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name</label>
                    <input className="form-control" name="name" value={formData.name} onChange={handleUpdate} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Description</label>
                    <input className="form-control" name="description" value={formData.description} onChange={handleUpdate} required />
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label fw-bold">Price</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input className="form-control" name="price" type="number" step="0.01" value={formData.price} onChange={handleUpdate} required />
                      </div>
                    </div>
                    <div className="col">
                      <label className="form-label fw-bold">Stock</label>
                      <input className="form-control" name="stock" type="number" value={formData.stock} onChange={handleUpdate} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Provider ID</label>
                    <input className="form-control" name="providerId" type="number" value={formData.providerId} onChange={handleUpdate} required />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
                <button type="submit" form="editForm" className="btn btn-primary">Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;