import '../styles/Productos.css';


export const ProductosTotalesView = ({ productos }) => {
    if (!Array.isArray(productos)) return <div>Error en los datos</div>;

    return (
      <div className="table-wrapper">
        <table className="productos-table">
          <thead className="table-header">
            <tr>
              <th className="table-head-cell">Nombre</th>
              <th className="table-head-cell">Referencia</th>
              <th className="table-head-cell">Categoría</th>
              <th className="table-head-cell">Descripción</th>
              <th className="table-head-cell">Stock Total</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {productos && productos.length > 0 ? (
              productos.map((prod) => (
                <tr key={prod.producto_id} className="table-row">
                  <td className="table-cell">{prod.nombre || 'N/A'}</td>
                  <td className="table-cell">{prod.referencia || 'N/A'}</td>
                  <td className="table-cell">{prod.categoria || 'N/A'}</td>
                  <td className="table-cell descripcion-cell">{prod.descripcion || 'N/A'}</td>
                  <td className="table-cell stock-cell">{prod.stock_total || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No hay productos disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };