import '../styles/ProductoExist.css';

export const ProductoExistsView = ({form, setForm, error, handleSubmit, user}) => {
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="product-form">
        <h2 className="form-title">Asignar producto existente</h2>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="referencia">Referencia del producto:</label>
          <input
            id="referencia"
            type="text"
            value={form.referencia}
            onChange={(e) => setForm({ ...form, referencia: e.target.value })}
            className="form-input"
            required
            placeholder="Ingresa la referencia del producto"
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock inicial:</label>
          <input
            id="stock"
            type="number"
            value={form.stock || ''}
            onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
            className="form-input"
            required
            min="0"
            placeholder="Cantidad inicial en stock"
          />
        </div>

        {user?.rol === "admin" && (
          <div className="form-group">
            <label htmlFor="sede_id">Seleccionar sede:</label>
            <select
              id="sede_id"
              value={form.sede_id || ""}
              onChange={(e) => setForm({ ...form, sede_id: parseInt(e.target.value) })}
              className="form-input"
              required
            >
              <option value="">-- Selecciona una sede --</option>
              <option value="1">Bello</option>
              <option value="2">Envigado</option>
              <option value="3">Sabaneta</option>
            </select>
          </div>
        )}

        <button type="submit" className="submit-btn">Asignar Producto</button>
      </form>
    </div>
  )
}

