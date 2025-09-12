import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';
// Importa tu logo si tienes uno
// import logo from '../../assets/logo.svg';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          {/* <img src={logo} alt="Logo" className="navbar-logo" /> */}
          InventarioApp
        </Link>
        
        {isAuthenticated && (
          <div className="navbar-links">
            <Link 
              to="/home" 
              className={`navbar-link ${location.pathname === '/home' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/productos" 
              className={`navbar-link ${location.pathname === '/productos' ? 'active' : ''}`}
            >
              Inventario
            </Link>
            <Link 
              to="/productos/peticion-traslado" 
              className={`navbar-link ${location.pathname === '/productos/peticion-traslado' ? 'active' : ''}`}
            >
              Pedir Productos
            </Link>
            <Link 
              to="/productos/peticiones" 
              className={`navbar-link ${location.pathname === '/productos/peticiones' ? 'active' : ''}`}
            >
              Ver Peticiones
            </Link>
            {/* Solo visible para admin */}
            {user?.rol === 'admin' && (
              <Link 
                to="/productos/nuevo" 
                className={`navbar-link ${location.pathname === '/productos/nuevo' ? 'active' : ''}`}
              >
                Agregar Producto
              </Link>
            )}

            {/*<Link 
              to="/productos/exist" 
              className={`navbar-link ${location.pathname === '/exist' ? 'active' : ''}`}
            >
              Agregar Producto a sede
            </Link>*/}
            {/* Agrega más links según necesites */}
          </div>
        )}
        
        <div className="navbar-actions">
          {isAuthenticated ? (
            <button 
              onClick={logout} 
              className="navbar-button logout"
            >
              <span>Cerrar sesión</span>
            </button>
          ) : (
            <Link to="/login" className="navbar-button">
              <span>Iniciar sesión</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;