import React, { useState } from 'react';
import { Card, Button, Alert } from '../ui/ui-components';
import { useProducts, useProductOperations } from '../../hooks/useProducts';
import ProductSearch from './ProductSearch';
import ProductList from './ProductList';
import ProductForm from './ProductForm';

const ProductManagement = ({ userRole = 'admin' }) => {
  const {
    products,
    loading,
    error,
    totalCount,
    totalPages,
    currentPage,
    searchParams,
    search,
    changePage,
    refresh,
  } = useProducts();

  const { deleteProduct } = useProductOperations();

  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSearch = (newParams) => {
    search(newParams);
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (product) => {
    setDeleteConfirm(product);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteProduct(deleteConfirm.id);
      setSuccessMessage(`Producto "${deleteConfirm.name}" eliminado exitosamente`);
      setDeleteConfirm(null);
      refresh();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleAddToCart = (product) => {
    // TODO: Implement cart functionality
    console.log('Adding to cart:', product);
    setSuccessMessage(`"${product.name}" añadido a la venta`);
  };

  const handleViewDetails = (product) => {
    // TODO: Implement product details view
    console.log('View details:', product);
  };

  const handleFormSuccess = () => {
    const action = selectedProduct ? 'actualizado' : 'creado';
    setSuccessMessage(`Producto ${action} exitosamente`);
    refresh();
  };

  const clearSuccessMessage = () => {
    setSuccessMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {userRole === 'admin' ? 'Gestión de Inventario' : 'Catálogo de Productos'}
          </h1>
          <p className="text-gray-600 mt-2">
            {userRole === 'admin' 
              ? 'Administra los productos de tu inventario' 
              : 'Busca y selecciona productos para la venta'
            }
          </p>
        </div>

        {userRole === 'admin' && (
          <Button onClick={handleCreateProduct} variant="primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Producto
          </Button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert 
          type="success" 
          message={successMessage} 
          onClose={clearSuccessMessage}
        />
      )}

      {/* Search and Filters */}
      <ProductSearch 
        onSearch={handleSearch}
        searchParams={searchParams}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
              <p className="text-sm text-gray-600">Total Productos</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.isActive).length}
              </p>
              <p className="text-sm text-gray-600">Productos Activos</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.stock <= 5).length}
              </p>
              <p className="text-sm text-gray-600">Stock Bajo</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(products.map(p => p.category).filter(Boolean)).size}
              </p>
              <p className="text-sm text-gray-600">Categorías</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Product List */}
      <ProductList
        products={products}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={changePage}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onAddToCart={handleAddToCart}
        onViewDetails={handleViewDetails}
        userRole={userRole}
      />

      {/* Product Form Modal */}
      <ProductForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        product={selectedProduct}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Eliminar Producto</h3>
                  <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                ¿Estás seguro de que deseas eliminar el producto <strong>"{deleteConfirm.name}"</strong>?
              </p>

              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setDeleteConfirm(null)}
                  variant="secondary"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={confirmDelete}
                  variant="danger"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;