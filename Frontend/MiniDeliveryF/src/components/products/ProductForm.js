import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, Alert } from '../ui/ui-components';
import { useCategories, useProductOperations } from '../../hooks/useProducts';

const ProductForm = ({ 
  isOpen, 
  onClose, 
  product = null, 
  onSuccess,
  title 
}) => {
  const { categories } = useCategories();
  const { loading, error, createProduct, updateProduct, clearError } = useProductOperations();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState({});

  // Initialize form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        category: product.category || '',
        isActive: product.isActive ?? true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        isActive: true,
      });
    }
    setFormErrors({});
    clearError();
  }, [product, isOpen, clearError]);

  const categoryOptions = [
    { value: '', label: 'Selecciona una categoría' },
    ...categories.map(cat => ({ value: cat, label: cat })),
    { value: 'new', label: '+ Nueva categoría' }
  ];

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    }

    if (!formData.price) {
      errors.price = 'El precio es requerido';
    } else if (parseFloat(formData.price) <= 0) {
      errors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.stock) {
      errors.stock = 'El stock es requerido';
    } else if (parseInt(formData.stock) < 0) {
      errors.stock = 'El stock no puede ser negativo';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category === 'new' ? null : (formData.category || null),
        ...(product && { isActive: formData.isActive })
      };

      if (product) {
        await updateProduct(product.id, submitData);
      } else {
        await createProduct(submitData);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      // Error is handled by the hook
      console.error('Form submission error:', err);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      isActive: true,
    });
    setFormErrors({});
    clearError();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title || (product ? 'Editar Producto' : 'Nuevo Producto')}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Alert */}
        {error && (
          <Alert type="error" message={error} onClose={clearError} />
        )}

        {/* Name */}
        <Input
          label="Nombre del producto *"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={formErrors.name}
          placeholder="Ej: Pizza Margherita"
          required
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            placeholder="Descripción del producto (opcional)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <Input
            label="Precio *"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            error={formErrors.price}
            placeholder="0.00"
            required
          />

          {/* Stock */}
          <Input
            label="Stock *"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => handleInputChange('stock', e.target.value)}
            error={formErrors.stock}
            placeholder="0"
            required
          />
        </div>

        {/* Category */}
        <Select
          label="Categoría"
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          options={categoryOptions}
        />

        {/* Category input for new category */}
        {formData.category === 'new' && (
          <Input
            label="Nueva categoría"
            value={formData.newCategory || ''}
            onChange={(e) => handleInputChange('newCategory', e.target.value)}
            placeholder="Nombre de la nueva categoría"
          />
        )}

        {/* Active Status (only for edit) */}
        {product && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Producto activo
            </label>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            onClick={handleClose}
            variant="secondary"
            disabled={loading}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {product ? 'Actualizando...' : 'Creando...'}
              </div>
            ) : (
              product ? 'Actualizar Producto' : 'Crear Producto'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;