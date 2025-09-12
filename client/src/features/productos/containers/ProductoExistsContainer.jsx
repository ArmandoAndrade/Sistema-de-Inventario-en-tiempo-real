import { useState, useEffect } from "react";
import axiosInstance from '../../../api/axiosInstance.js';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { ProductoExistsView } from "../components/ProductoExistsView.jsx";

export const ProductoExistContainer = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    referencia: "",
    stock: 0,
    sede_id: user?.sede_id || null
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if(!user){
      navigate("/login")
    }
  }, [user, navigate])
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axiosInstance.post("/products/exist", form);
      navigate("/productos");
    } catch (error) {
      console.error("Error al asignar producto a sede:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Ocurrió un error al asignar el producto");
    }
  };

  return (
      <ProductoExistsView  form={form} setForm={setForm} error={error} handleSubmit={handleSubmit} user={user}/>
  );
};