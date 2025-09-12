import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { PeticionTrasladoView } from "../components/PeticionTrasladoView";
import { useAuth } from "../../../contexts/AuthContext";
import axiosInstance from "../../../api/axiosInstance";
//import {NotificacionContainer} from "./NotificacionContainer.jsx";

/**
 * Componente contenedor para la gestión de peticiones de traslado
 * Maneja toda la lógica de negocio y estado de la funcionalidad
 */
export const PeticionTrasladoContainer = () => {
  // Contexto de autenticación para obtener datos del usuario
  const { user } = useAuth();

  // Referencias para los elementos del DOM
  const inputRef = useRef(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Estados del componente
  const [filtroSede, setFiltroSede] = useState("");
  const [filtroSedeDestino, setFiltroSedeDestino] = useState("");
  const [productos, setProductos] = useState([]);
  const sedes = useMemo(() => [
    { id: 1, nombre: "Sede Bello", clave: "bello" },
    { id: 2, nombre: "Sede Envigado", clave: "envigado" },
    { id: 3, nombre: "Sede Sabaneta", clave: "sabaneta" }
  ], []);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    producto_id: "",
    nombre_producto: "",
    sede_origen_id: user?.rol === 'admin' ? "" : user?.sede_id,
    sede_destino_id: "",
    cantidad: "",
    observaciones: ""
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Mapeo de claves de sede a IDs
  const sedeIdMap = sedes.reduce((map, sede) => {
    map[sede.clave] = sede.id;
    return map;
  }, {});

  /**
   * Función para buscar productos en el servidor
   * Memoizada para evitar recreación en cada render
   * @param {string} searchTerm - Término de búsqueda
   * @param {number} sedeId - ID de la sede
   * @returns {Promise} Promesa con los resultados
   */
  const fetchProducts = useCallback(async (searchTerm, sedeId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/peticiones/products?search=${searchTerm}&sede_id=${sedeId}`
      );
      setProductos(response.data);

      // Filtrado inicial con los nuevos datos
      const filtered = response.data
        .filter(p => p.producto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5);
      setFilteredProducts(filtered);

      return response.data;
    } catch (error) {
      setError("Error al cargar productos: " + (error.response?.data?.message || error.message));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Efecto para buscar productos cuando cambian los filtros
   * Usa debounce para evitar múltiples peticiones rápidas
   */
  useEffect(() => {
    if (!formData.nombre_producto || !formData.sede_origen_id) {
      setFilteredProducts([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      fetchProducts(formData.nombre_producto, formData.sede_origen_id);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [formData.nombre_producto, formData.sede_origen_id, fetchProducts]);

  // Efecto para cerrar sugerencias cuando se selecciona un producto
  useEffect(() => {
    if (formData.producto_id && showSuggestions) {
      setShowSuggestions(false);
    }
  }, [formData.producto_id, showSuggestions]);

  /**
   * Maneja cambios en los inputs del formulario
   * @param {Object} e - Evento del input
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    // Actualizar los estados de filtro cuando cambian los select
    if (name === 'sede_origen_id') {
      setFiltroSede(value);
    } else if (name === 'sede_destino_id') {
      setFiltroSedeDestino(value);
    }

    //escapar de caracteres especiales
    if (name === 'nombre_producto') {
      const searchTerm = value.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      setFilteredProducts(productos.filter(p => p.producto?.nombre?.toLowerCase().includes(searchTerm)).slice(0, 5));
      setShowSuggestions(true);
    }

    setFormData(prev =>
    ({
      ...prev,
      [name]: name.startsWith('sede_') ? sedeIdMap[value] || value : value,
      producto_id: name === 'nombre_producto' ? "" : prev.producto_id
    }));
  }, [productos]);


  /**
   * Maneja la selección de un producto de la lista
   * @param {Object} producto - Producto seleccionado
   */
  const handleSelectProduct = useCallback((producto) => {
    if (producto?.producto) {
      setFormData(prev => ({
        ...prev,
        nombre_producto: producto.producto.nombre,
        producto_id: producto.producto.id
      }));

      // Usar un pequeño timeout para asegurar el foco después del render
      requestAnimationFrame(() => {
        inputRef.current?.focus({ preventScroll: true });
      });
    }
  }, []);

  /**
   * Maneja el foco en el input de búsqueda
   */
  const handleFocus = useCallback(() => {
    setIsInputFocused(true);
    if (formData.nombre_producto && productos.length > 0) {
      setShowSuggestions(true);
    }
  }, [formData.nombre_producto, productos.length]);

  /**
   * Maneja el evento blur del input de búsqueda
   */
  const handleBlur = useCallback((e) => {
  // Verificar si el nuevo elemento enfocado está fuera del contenedor
  const currentFocus = e.relatedTarget;
  const container = inputRef.current;
  
  if (!container?.contains(currentFocus)) {
    setShowSuggestions(false);
  }
}, []);

  /**
   * Maneja el envío del formulario
   * @param {Object} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.producto_id) {
      setError("Debes seleccionar un producto válido");
      setLoading(false);
      return;
    }

    if (!formData.sede_destino_id) {
      setError("Debes seleccionar una sede destino");
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post("/peticiones/crear-peticion", {
        producto_id: formData.producto_id,
        sede_origen_id: formData.sede_origen_id,
        sede_destino_id: formData.sede_destino_id,
        cantidad: formData.cantidad,
        observaciones: formData.observaciones
      });

      alert("Petición enviada con éxito.");
      setFormData({
        producto_id: "",
        nombre_producto: "",
        sede_origen_id: user?.rol === 'admin' ? "" : user?.sede_id,
        sede_destino_id: "",
        cantidad: "",
        observaciones: ""
      });
      setFiltroSede("");
      setFiltroSedeDestino("");
      setFilteredProducts([]);
    } catch (error) {
      setError("Error al enviar la petición: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <PeticionTrasladoView
      formData={formData}
      productos={filteredProducts}
      sedes={sedes}
      onChange={handleChange}
      onSelectProducto={handleSelectProduct}
      handleSubmit={handleSubmit}
      error={error}
      loading={loading}
      isAdmin={user?.rol === 'admin'}
      filtroSede={filtroSede}
      setFiltroSede={setFiltroSede}
      filtroSedeDestino={filtroSedeDestino}
      setFiltroSedeDestino={setFiltroSedeDestino}
      showSuggestions={showSuggestions}
      setShowSuggestions={setShowSuggestions}
      handleBlur={handleBlur}
      inputRef={inputRef}
      handleFocus={handleFocus} />
      </>
  );
};