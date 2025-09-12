import React from 'react';
import '../styles/ProductoForm.css'; // Archivo CSS que crearemos

export const ProductoFormView = ({producto, setProducto, handleSubmit}) => {
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="product-form">
        <h2 className="form-title">Agregar Producto</h2>
        
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Nombre"
            value={producto.nombre} 
            onChange={(e) => setProducto({...producto, nombre: e.target.value})}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <input 
            type="text" 
            placeholder="Referencia"
            value={producto.referencia} 
            onChange={(e) => setProducto({...producto, referencia: e.target.value})}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <input 
            type="text" 
            placeholder="Categoría"
            value={producto.categoria} 
            onChange={(e) => setProducto({...producto, categoria: e.target.value})}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <input 
            type="text" 
            placeholder="Descripción"
            value={producto.descripcion} 
            onChange={(e) => setProducto({...producto, descripcion: e.target.value})}
            className="form-input"
            required
          />
        </div>

        

        <button type="submit" className="submit-btn">Guardar Producto</button>
      </form>
    </div>
  )
}