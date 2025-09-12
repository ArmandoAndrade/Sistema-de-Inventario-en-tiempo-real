import "../styles/PeticionTraslado.css";

/**
 * Componente de vista para la petición de traslado
 * Solo maneja presentación, sin lógica de negocio.
 * @param {Object} props - Propiedades del componente
 */
export const PeticionTrasladoView = ({
  formData, // Estado del formulario con los datos ingresados por el usuario
  productos, // Lista de productos disponibles
  sedes, // Lista de sedes disponibles
  onChange, // Función para manejar cambios en los inputs
  onSelectProducto, // Función para seleccionar un producto de las sugerencias
  handleSubmit, // Función para enviar el formulario
  error, // Mensaje de error en caso de fallo
  loading, // Estado de carga del formulario
  isAdmin, // Indica si el usuario es administrador
  filtroSede, // Sede de origen seleccionada
  setFiltroSede, // Setter para actualizar la sede de origen
  filtroSedeDestino, // Sede destino seleccionada
  setFiltroSedeDestino, // Setter para actualizar la sede destino
  showSuggestions, // Indica si se muestran las sugerencias de productos
  setShowSuggestions, // Setter para controlar la visibilidad de las sugerencias
  handleBlur, // Manejador del evento `onBlur` del campo de búsqueda
  inputRef, // Referencia al input de búsqueda
  handleFocus // Manejador del evento `onFocus` del campo de búsqueda
}) => {
  return (
    <div className="peticion-traslado-container">
      <h2>Petición de Traslado</h2>

      {/* Muestra un mensaje de error si hay alguna falla */}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="traslado-form">
        {/* Campo de búsqueda del producto */}
        <label htmlFor="producto-input">Producto:</label>
        <div className="product-search-container" >
          <input
            id="producto-input"
            ref={inputRef}
            type="text"
            name="nombre_producto"
            value={formData.nombre_producto}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Buscar producto por nombre"
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls="productos-list"
            readOnly={loading}
          />
          
          {/* Muestra la lista de sugerencias de productos si hay coincidencias */}
          {showSuggestions && productos.length > 0 && (
            <ul 
              id="productos-list" 
              className="suggestions-list" 
              role="listbox"
              aria-labelledby="producto-input"
              onMouseDown={(e) => e.preventDefault()} // Previene la pérdida de foco en el input al hacer clic
            >
              {productos.map(p => (
                <li
                  key={`suggestion-${p.producto.id}`}
                  role="option"
                  aria-selected={formData.producto_id === p.producto.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelectProducto(p);
                    setShowSuggestions(false);
                  }}
                >
                  {p.producto.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Si el usuario es administrador, puede seleccionar la sede de origen */}
        {isAdmin && (
          <>
            <label htmlFor="sede-origen">Sede origen:</label>
            <select
              id="sede-origen"
              name="sede_origen_id"
              value={filtroSede}
              onChange={onChange}
              disabled={loading}
            >
              <option value="">Seleccione</option>
              {sedes.map(sede => (
                <option key={sede.clave} value={sede.clave}>
                  {sede.nombre}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Selección de sede destino */}
        <label htmlFor="sede-destino">Sede destino:</label>
        <select
          id="sede-destino"
          name="sede_destino_id"
          value={filtroSedeDestino}
          onChange={onChange}
          disabled={loading}
        >
          <option value="">Seleccione</option>
          {sedes.filter(s => s.clave !== filtroSede).map(sede => (
            <option key={sede.clave} value={sede.clave}>
              {sede.nombre}
            </option>
          ))}
        </select>

        {/* Campo de cantidad de productos a trasladar */}
        <label htmlFor="cantidad">Cantidad:</label>
        <input
          id="cantidad"
          type="number"
          name="cantidad"
          value={formData.cantidad}
          onChange={onChange}
          min={1}
          disabled={loading}
        />

        {/* Campo de observaciones adicionales */}
        <label htmlFor="observaciones">Observaciones:</label>
        <textarea
          id="observaciones"
          name="observaciones"
          value={formData.observaciones}
          onChange={onChange}
          disabled={loading}
        />

        {/* Botón de envío con estado de carga */}
        <button 
          type="submit" 
          disabled={loading}
          aria-busy={loading} // Indica accesibilidad cuando el botón está ocupado
        >
          {loading ? "Enviando..." : "Solicitar traslado"}
        </button>
      </form>
    </div>
  );
};
