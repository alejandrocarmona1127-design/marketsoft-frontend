import { useState, useEffect, useCallback } from 'react'
import saleService from '../services/sale.service'

function SalesPage() {
  const [sales, setSales] = useState([])

  const [formData, setFormData] = useState({
      userId: '',
      date: '',
      total: '',
      productId: '',
      quantity: '',
      price: ''
  })

  const [selectedSale, setSelectedSale] = useState(null)
  const [isCreateOpenModal, setIsCreateOpenModal] = useState(false)
  const [isEditOpenModal, setIsEditOpenModal] = useState(false)

  useEffect(()=> {
    const fetchSales = async() => {
      try{
          const response = await saleService.getAllSales()
          setSales(response.data) 
      }catch(error){
          console.error('Error fetching sales', error)
      }
    }
    fetchSales()
  }, [])

  const loadSales = useCallback(async () => {
      try{
          const response = await saleService.getAllSales()
          setSales(response.data)
      }catch(error){
          console.error('Error fetching sales', error)
      }
  }, [])

  const openCreateModal = () =>{
      setFormData({
          userId: '',
          date: '',
          total: '',
          productId: '',
          quantity: '',
          price: ''
      })
      setIsCreateOpenModal(true)
      setIsEditOpenModal(false)
  }

  const openEditModal = (sale) =>{
    setSelectedSale(sale)
    const formattedDate = sale.date ? new Date(sale.date).toISOString().split('T')[0] : ''

    setFormData({
        userId: sale.userId,
        date: formattedDate,
        total: sale.total,
        productId: '',
        quantity: '',
        price: ''
    })
    setIsCreateOpenModal(false)
    setIsEditOpenModal(true)
  }

  const closeCreateModal = () => setIsCreateOpenModal(false)
  const closeEditModal = () => setIsEditOpenModal(false)

  const handleChange = (event) =>{
    const { name, value} = event.target
    
    setFormData((prevData) => {
        const newData = { ...prevData, [name]: value }
        
        if (name === 'quantity' || name === 'price') {
            const qty = parseFloat(newData.quantity) || 0;
            const prc = parseFloat(newData.price) || 0;
            // Calculamos el total
            newData.total = (qty * prc).toFixed(2);
        }
        
        return newData;
    })
  }

  const handleSubmitCreate = async (event) =>{
      event.preventDefault()
      
      // Aseguramos que los datos viajen como números puros
      const saleData = {
          userId: parseInt(formData.userId, 10),
          date: formData.date,
          total: parseFloat(formData.total),
          products: [
              {
                  productId: parseInt(formData.productId, 10),
                  quantity: parseInt(formData.quantity, 10),
                  price: parseFloat(formData.price)
              }
          ]
      }

      try {
          await saleService.createSale(saleData)
          closeCreateModal()
          await loadSales()
      } catch (error) {
          console.error("Detalle del error 400:", error.response?.data || error.message)
          alert("Error al registrar la venta. Revisa la consola para más detalles.")
      }
  }

  const handleSubmitUpdate = async (event) =>{
    event.preventDefault()
    
    const saleData = {
        userId: parseInt(formData.userId, 10),
        date: formData.date,
        total: parseFloat(formData.total)
    }

    try {
        await saleService.updateSale(selectedSale.id, saleData)
        closeEditModal()
        await loadSales()
    } catch (error) {
        console.error("Detalle del error 400:", error.response?.data || error.message)
    }
  }

  const handleDeleteSale = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sale record?"
    )
    if(!confirmDelete) return

    await saleService.deleteSale(id)
    await loadSales()
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="text-muted text-uppercase small fw-bold">Transactions</span>
          <h2 className="mb-0">Sales</h2>
        </div>
        <button className="btn btn-primary shadow-sm" type="button" onClick={openCreateModal}>
          + Register Sale
        </button>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-striped table-hover mb-0 align-middle">
          <thead className="table-dark">
            <tr>
              <th>Sale ID</th>
              <th>User ID</th>
              <th>Date</th>
              <th>Total</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(sales || []).map((sale) => (
              <tr key={sale.id}>
                <td className="fw-semibold">{sale.id}</td>
                <td>{sale.userId}</td>
                <td>{new Date(sale.date).toLocaleDateString()}</td>
                <td className="text-success fw-bold">${sale.total}</td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => openEditModal(sale)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDeleteSale(sale.id)}>
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
                <h5 className="modal-title">Register Sale</h5>
                <button type="button" className="btn-close" onClick={closeCreateModal}></button>
              </div>
              <div className="modal-body">
                <form id="createSaleForm" onSubmit={handleSubmitCreate}>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label fw-bold">User ID (Cashier)</label>
                      <input className="form-control" name="userId" type="number" value={formData.userId} onChange={handleChange} required />
                    </div>
                    <div className="col">
                      <label className="form-label fw-bold">Date</label>
                      <input className="form-control" name="date" type="date" value={formData.date} onChange={handleChange} required />
                    </div>
                  </div>
                  
                  <hr className="my-4 text-muted" />
                  <h6 className="text-uppercase text-muted fw-bold mb-3">Product Details</h6>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Product ID</label>
                    <input className="form-control" name="productId" type="number" value={formData.productId} onChange={handleChange} required />
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label fw-bold">Quantity</label>
                      <input className="form-control" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
                    </div>
                    <div className="col">
                      <label className="form-label fw-bold">Unit Price</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input className="form-control" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>

                  <div className="mb-2 p-3 bg-light border rounded">
                    <label className="form-label fw-bold text-success mb-1">Total Amount (Calculated)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-success text-white border-success">$</span>
                      <input className="form-control border-success bg-white fw-bold" name="total" type="number" step="0.01" value={formData.total} readOnly />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeCreateModal}>Cancel</button>
                <button type="submit" form="createSaleForm" className="btn btn-primary">Register Sale</button>
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
                <h5 className="modal-title">Edit Sale</h5>
                <button type="button" className="btn-close" onClick={closeEditModal}></button>
              </div>
              <div className="modal-body">
                <form id="editSaleForm" onSubmit={handleSubmitUpdate}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">User ID</label>
                    <input className="form-control" name="userId" type="number" value={formData.userId} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Date</label>
                    <input className="form-control" name="date" type="date" value={formData.date} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Total Amount</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input className="form-control" name="total" type="number" step="0.01" value={formData.total} onChange={handleChange} required />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
                <button type="submit" form="editSaleForm" className="btn btn-primary">Update Sale</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesPage;