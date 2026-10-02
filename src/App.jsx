import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import ProvidersPage from './pages/ProvidersPage.jsx';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/providers" element={<ProvidersPage />} />
          <Route path="/sales" element={<div><h2>Gestión de Ventas</h2><p>En construcción...</p></div>} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;