import React, { useState } from 'react';
import ProductManagement from './components/products/ProductManagement';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState('admin'); // 'admin' o 'cashier'

  const toggleRole = () => {
    setUserRole(userRole === 'admin' ? 'cashier' : 'admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">MiniDelivery System</h1>
              <span className="ml-4 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                v1.0
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Rol actual: <strong>{userRole === 'admin' ? 'Administrador' : 'Cajero'}</strong>
              </div>
              <button
                onClick={toggleRole}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Cambiar a {userRole === 'admin' ? 'Cajero' : 'Admin'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <ProductManagement userRole={userRole} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 MiniDelivery System. Sistema de gestión de inventario y ventas.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
