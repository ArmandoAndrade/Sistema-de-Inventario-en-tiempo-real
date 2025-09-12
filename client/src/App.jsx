import { BrowserRouter, Route, Routes } from 'react-router-dom'
// Importo paginas
import ErrorPage from './features/productos/components/ErrorPage.jsx'
// Importa el CONTENEDOR, no el componente presentacional
import {ProductosContainer} from './features/productos/containers/ProductosContainer.jsx';
import { DashboardContainer } from './features/dashboard/containers/DashboardContainer.jsx';
import { FormLogInContainer } from './features/auth/containers/FormLogInContainer.jsx';
import { ProductoFormContainer } from './features/productos/containers/ProductoFormContainer.jsx';
import { PeticionTrasladoContainer } from './features/peticiones/containers/PeticionTrasladoContainer.jsx';
import { PeticionesTableContainer } from './features/peticiones/containers/PeticionesTableContainer.jsx';
//import { ProductoExistContainer } from './features/productos/containers/ProductoExistsContainer.jsx';
//importo ruta protegida
import ProtectedRoute from './components/shared/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'

// Importo estilos
import './App.css'

import  Navbar  from './components/shared/Navbar.jsx'
import {NotificacionContainer} from './features/peticiones/containers/NotificacionContainer.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>
          {/*ruta publica*/}
          <Route path='/' element={<FormLogInContainer />} />
          {/*rutas protegidas*/}
          <Route
            path='/home'
            element={
              <ProtectedRoute>
                <Navbar />
                <DashboardContainer />
                <NotificacionContainer />
              </ProtectedRoute>
            }
          />
          <Route
          path='/productos'
          element = {
            <ProtectedRoute>
              <Navbar/>
              <ProductosContainer />
              <NotificacionContainer />
            </ProtectedRoute>
          }
          />
          <Route
          path='/productos/nuevo'
          element = {
            <ProtectedRoute>
              <Navbar/>
              <ProductoFormContainer/>
              <NotificacionContainer />
            </ProtectedRoute>
          }
          />
          <Route
          path='/productos/peticion-traslado'
          element = {
            <ProtectedRoute>
              <Navbar/>
              <PeticionTrasladoContainer/>
              <NotificacionContainer />
            </ProtectedRoute>
          }
          />
          <Route
          path='/productos/peticiones'
          element = {
            <ProtectedRoute>
              <Navbar/>
              <PeticionesTableContainer/>
              <NotificacionContainer />
            </ProtectedRoute>
          }
          />
          {/*<Route
          path='/productos/exist'
          element = {
            <ProtectedRoute>
              <Navbar/>
              <ProductoExistContainer/>
            </ProtectedRoute>
          }
          />*/}
          {/*redireccion para rutas no autenticadas*/}

          {/* Ruta para el error 404 */}
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
