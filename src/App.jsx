import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import ProvidersPage from './pages/ProvidersPage.jsx';
import SalesPage from './pages/SalesPage.jsx';


function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/providers" element={<ProvidersPage />} />
          <Route path="/sales" element={<SalesPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;