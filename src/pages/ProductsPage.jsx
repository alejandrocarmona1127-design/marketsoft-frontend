import { useState, useEffect, useCallback } from 'react'
import productService from '../services/product.service'
import '../styles/products.css'

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
  const [isViewOpenModal, setIsViewOpenModal] = useState(false)
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
  },  [])

  const loadProducts = useCallback(async () => {
      try{
          const response = await productService.getAllProducts()
          setProducts(response.data)
      }catch(error){
          console.error('error fetching product', error)
      }
  },  [])

  const openCreateModal = () =>{
     
      setFormData({
          name: '',
          description: '',
          price: '',
          stock: '',
          providerId: ''
      })
      setIsCreateOpenModal(true)
      setIsViewOpenModal(false)
      setIsEditOpenModal(false)
  }

  const openEdithModal = (product) =>{
    setSelectedProduct(product)

    
    setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        providerId: product.providerId
    })

    setIsCreateOpenModal(false)
    setIsViewOpenModal(false)
    setIsEditOpenModal(true)
  }

  const closeCreateModal = () =>{
    setIsCreateOpenModal(false)
  }

  const closeEditModal = () =>{
    setIsEditOpenModal(false)
  }

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
    if(!confirmDelete){
      return
    }
    await productService.deleteProduct(id)
    await loadProducts()
  }

  return (
    <section className="products-page">
      <header className="products-header">
        <div>
          <p className="products-eyebrow">Inventory</p>
          <h2>Products</h2>
        </div>
        <button className="products-button products-button-primary" type="button" onClick={openCreateModal}>
          Create Product
        </button>
      </header>

      <div className="products-table-wrap">
      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            {/* Agregamos las columnas a la tabla */}
            <th>Stock</th>
            <th>Provider ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              {/* Mostramos los datos en la tabla */}
              <td>{product.stock}</td>
              <td>{product.providerId}</td>
              <td>
                <div className="products-actions">
                <button className="products-button products-button-edit" type="button" onClick={() => openEdithModal(product)}>
                  Edit
                </button>
                <button className="products-button products-button-delete" type="button" onClick={() => handleDeleteProduct(product.id)}>
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
        <div className="products-modal" role="dialog" aria-modal="true" aria-labelledby="create-product-title">
          <div className="products-modal-heading">
            <p className="products-eyebrow">New item</p>
            <h3 id="create-product-title">Create Product</h3>
          </div>
          <form className="products-form" onSubmit={handleSubmitCreate}>
            <label className="products-field">
              Name
              <input className="products-input" name="name" value={formData.name} onChange={handleCreateProduct} required />
            </label>
            <label className="products-field">
              Description
              <input className="products-input" name="description" value={formData.description} onChange={handleCreateProduct} required />
            </label>
            <label className="products-field">
              Price
              <input className="products-input" name="price" type="number" value={formData.price} onChange={handleCreateProduct} required />
            </label>
            {/* Nuevos Inputs para Stock y Provider */}
            <label className="products-field">
              Stock
              <input className="products-input" name="stock" type="number" value={formData.stock} onChange={handleCreateProduct} required />
            </label>
            <label className="products-field">
              Provider ID
              <input className="products-input" name="providerId" type="number" value={formData.providerId} onChange={handleCreateProduct} required />
            </label>
            <div className="products-modal-actions">
              <button className="products-button products-button-secondary" type="button" onClick={closeCreateModal}>Cancel</button>
              <button className="products-button products-button-primary" type="submit">Create Product</button>
            </div>
          </form>
        </div>
        </div>
      )}

      {isEditOpenModal && (
        <div className="products-modal-backdrop">
        <div className="products-modal" role="dialog" aria-modal="true" aria-labelledby="edit-product-title">
          <div className="products-modal-heading">
            <p className="products-eyebrow">Product details</p>
            <h3 id="edit-product-title">Edit Product</h3>
          </div>
          <form className="products-form" onSubmit={handleSubmitUpdate}>
            <label className="products-field">
              Name
              <input className="products-input" name="name" value={formData.name} onChange={handleUpdate} required />
            </label>
            <label className="products-field">
              Description
              <input className="products-input" name="description" value={formData.description} onChange={handleUpdate} required />
            </label>
            <label className="products-field">
              Price
              <input className="products-input" name="price" type="number" value={formData.price} onChange={handleUpdate} required />
            </label>
            {/* Nuevos Inputs para Stock y Provider */}
            <label className="products-field">
              Stock
              <input className="products-input" name="stock" type="number" value={formData.stock} onChange={handleUpdate} required />
            </label>
            <label className="products-field">
              Provider ID
              <input className="products-input" name="providerId" type="number" value={formData.providerId} onChange={handleUpdate} required />
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

export default ProductsPage;