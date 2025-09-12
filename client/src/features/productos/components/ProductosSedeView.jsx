import '../styles/Productos.css';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';



export const ProductosSedeView = ({ productos, sede, updateProduct, user }) => {
  if (!Array.isArray(productos)) return <div>Error en los datos</div>;

  const sedeId = {
    bello: 1,
    sabaneta: 3,
    envigado: 2
  };

  
  return (
    <div className="table-wrapper">
      <table className="productos-table">
        <thead className="table-header">
          <tr>
            <th className="table-head-cell">Nombre</th>
            <th className="table-head-cell">Referencia</th>
            <th className="table-head-cell">Categoría</th>
            <th className="table-head-cell">Descripción</th>
            <th className="table-head-cell">Stock</th>
            <th className="table-head-cell">Acciones</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {productos
            .filter((prod) => prod.producto)
            .map((prod) => {
              const canEdit = user?.rol === 'admin' || user?.sede_id === sedeId[sede];
              return ((
                <tr key={prod.id || prod.producto_id} className="table-row">
                  <td className="table-cell">{prod.producto.nombre}</td>
                  <td className="table-cell">{prod.producto.referencia}</td>
                  <td className="table-cell">{prod.producto.categoria}</td>
                  <td className="table-cell descripcion-cell">{prod.producto.descripcion}</td>
                  <td className="table-cell stock-cell">{prod.stock}</td>
                  <td className="table-cell acciones-cell">
                    
                    {canEdit ? (
                    <IconButton 
                      aria-label="edit"
                      onClick={() => updateProduct({
                        producto_id: prod.producto_id,
                        stock: prod.stock,
                        
                      })}
                      size="small"
                      sx={{ '&:hover': { color: 'primary.main' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <IconButton 
                      size="small" 
                      disabled
                      sx={{ opacity: 0.5 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                    
                  </td>
                </tr>
              ))
            })}
        </tbody>
      </table>
      <div className="sede-info">
        Mostrando productos de: {sede.charAt(0).toUpperCase() + sede.slice(1)}
      </div>
    </div>
  );
};