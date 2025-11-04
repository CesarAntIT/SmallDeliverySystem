import React, { useState } from 'react';
import { Card, Button, LoadingSpinner, Alert, Pagination } from '../ui/ui-components';

const ProductList = ({ 
  products, 
  loading, 
  error, 
  currentPage, 
  totalPages, 
  totalCount,
  onPageChange, 
  onEdit, 
  onDelete, 
  onAddToCart, 
  onViewDetails,
  userRole = 'admin', // 'admin', 'cashier'
  className = '' 
}) => {
  const [selectedProducts, setSelectedProducts] = useState(new Set());

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectProduct = (productId) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)));
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <div className="p-8">
          <LoadingSpinner size="large" />
          <p className="text-center text-gray-600 mt-4">Cargando productos...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <div className="p-6">
          <Alert type="error" message={error} />
        </div>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card className={className}>
        <div className="p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V3.5A1.5 1.5 0 0012.5 2h-1A1.5 1.5 0 0010 3.5V5" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
          <p className="text-gray-600">Intenta ajustar los filtros de búsqueda o agrega nuevos productos.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Header with results info */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Mostrando {products.length} de {totalCount} productos
        </div>
        
        {userRole === 'admin' && products.length > 0 && (
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedProducts.size === products.length && products.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Seleccionar todos</span>
            </label>
            
            {selectedProducts.size > 0 && (
              <span className="text-sm font-medium text-blue-600">
                {selectedProducts.size} seleccionados
              </span>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Product Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {product.name}
                  </h4>
                  {product.category && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>
                
                {userRole === 'admin' && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Product Content */}
            <div className="p-4">
              {product.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Precio:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(product.price)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Stock:</span>
                  <span className={`font-semibold ${
                    product.stock <= 5 ? 'text-red-600' : 
                    product.stock <= 20 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {product.stock} unidades
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Estado:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              {/* Stock Warning */}
              {product.stock <= 5 && (
                <Alert 
                  type="warning" 
                  message={`Stock bajo: solo quedan ${product.stock} unidades`}
                  className="mb-3"
                />
              )}

              <div className="text-xs text-gray-500 mb-4">
                Actualizado: {formatDate(product.lastUpdatedAt)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-4 pb-4">
              {userRole === 'admin' ? (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onViewDetails(product)}
                    variant="outline"
                    size="small"
                    className="flex-1"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver
                  </Button>
                  
                  <Button
                    onClick={() => onEdit(product)}
                    variant="primary"
                    size="small"
                    className="flex-1"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </Button>
                  
                  <Button
                    onClick={() => onDelete(product)}
                    variant="danger"
                    size="small"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={() => onViewDetails(product)}
                    variant="outline"
                    size="small"
                    className="w-full"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver Detalles
                  </Button>
                  
                  <Button
                    onClick={() => onAddToCart(product)}
                    variant="success"
                    size="small"
                    className="w-full"
                    disabled={!product.isActive || product.stock === 0}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                    </svg>
                    {product.stock === 0 ? 'Sin Stock' : 'Añadir a Venta'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="mt-6"
        />
      )}
    </div>
  );
};

export default ProductList;