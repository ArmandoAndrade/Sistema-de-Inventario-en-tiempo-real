import { useState } from "react";
import axiosInstance from "../../../api/axiosInstance.js";
import { ProductoFormView } from "../components/ProductoFormView.jsx";
import { useNavigate } from "react-router-dom";
export const ProductoFormContainer = () => {

  const [producto, setProducto] = useState({
    nombre: "",
    referencia: "",
    categoria: "",
    descripcion: "",
    stock: 0,
  });

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post('/products', producto);
      navigate("/productos");
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  }
  return (
    <ProductoFormView producto={producto} setProducto={setProducto} handleSubmit={handleSubmit} />
  )
}

