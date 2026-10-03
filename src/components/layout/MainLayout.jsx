import { Link } from 'react-router-dom';

const MainLayout = ({ children }) => {
  return (
    <div className="d-flex">
     
      <nav className="sidebar flex-shrink-0" style={{ width: '250px' }}>
        <div className="p-4 border-bottom border-secondary">
          <h4 className="text-white m-0">🛒 MarketSoft</h4>
        </div>
        <ul className="list-unstyled mt-3">
          <li>
            <Link to="/" className="sidebar-link">🏠 Home</Link>
          </li>
          <li>
            <Link to="/products" className="sidebar-link">📦 Products</Link>
          </li>
          <li>
            <Link to="/users" className="sidebar-link">👥 Users</Link>
          </li>
          <li>
            <Link to="/providers" className="sidebar-link">🚚 Providers</Link>
          </li>
          <li>
            <Link to="/sales" className="sidebar-link">💰 Sales</Link>
          </li>
        </ul>
      </nav>

      
      <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: '100vh' }}>
        
        <header className="bg-white shadow-sm p-3 d-flex align-items-center">
          <h5 className="m-0 text-secondary">administrative interface</h5>
        </header>

       
        <main className="p-4 flex-grow-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;