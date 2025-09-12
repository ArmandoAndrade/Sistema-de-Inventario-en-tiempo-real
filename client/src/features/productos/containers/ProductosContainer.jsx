import { use, useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance.js";
import { ProductosSedeView } from "../components/ProductosSedeView.jsx";
import { ProductosTotalesView } from "../components/ProductosTotalesView.jsx";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext.jsx";

export const ProductosContainer = () => {
  const {user} = useAuth();
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('bello');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState('');

  useEffect(() => {
    getProducts();
  }, [filtro]);

  const getProducts = async () => {
    setLoading(true);
    try {
      let url = filtro === 'todos' ? '/products/total' : '/products';

      if (filtro !== 'todos') {
        const sedeId = {
          bello: 1,
          sabaneta: 3,
          envigado: 2
        }[filtro];

        url += `?sede_id=${sedeId}`;
      }

      const res = await axiosInstance.get(url);
      setProductos(res.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      setError("Error al cargar los productos.");
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (producto) => {
    setSelectedProduct(producto);
    setNewStock(producto.stock);
    setModalOpen(true);
  };
  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setNewStock('');
    setModalOpen(false);
  };

  const updateProduct = async () => {
    if (!selectedProduct || isNaN(newStock)) {
      setError('El stock debe ser un número válido');
      return;
    }
    try {
      //obtener el id de la sede usando el filtro actual
      const sedeId = {
        bello: 1,
        sabaneta: 3,
        envigado: 2
      }[filtro];

      await axiosInstance.patch(`/products/${selectedProduct.producto_id}`, { 
        stock: parseInt(newStock),
        sede_id: parseInt(sedeId), 
        user_rol: user.rol});
      await getProducts();//recargar
    } catch (error) {
      console.error('Error al actualizar productos:', error);
      setError("Error al actualizar los productos.");
    }
    handleCloseDialog ();
  }
  return (
    <div className="productos-container">
      <h1 className="productos-title">Inventario de Productos</h1>
      <select
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="filter-select"
      >
        <option value="todos">Ver todos los productos (suma total)</option>
        <option value="bello">Ver productos de Bello</option>
        <option value="sabaneta">Ver productos de Sabaneta</option>
        <option value="envigado">Ver productos de Envigado</option>
      </select>

      {/* Mostrar mensaje de error si existe */}
      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : filtro === 'todos' ? (
        <ProductosTotalesView productos={productos} />
      ) : (
        <ProductosSedeView 
        productos={productos} 
        sede={filtro} 
        updateProduct={handleOpenDialog} 
        user={user}
        />
      )}

      <Dialog open={modalOpen} onClose={handleCloseDialog}>
        <DialogTitle>Editar Stock</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nuevo Stock"
            type="number"
            fullWidth
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancelar</Button>
          <Button onClick={updateProduct} variant="contained" color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}