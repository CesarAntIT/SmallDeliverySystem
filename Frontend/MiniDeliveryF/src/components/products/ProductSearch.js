import React, { useState, useEffect } from 'react';
import { Input, Select, Button } from '../ui/ui-components';
import { useCategories } from '../../hooks/useProducts';

const ProductSearch = ({ onSearch, searchParams, className = '' }) => {
  const { categories } = useCategories();
  const [localParams, setLocalParams] = useState({
    searchTerm: searchParams?.searchTerm || '',
    category: searchParams?.category || '',
    activeOnly: searchParams?.activeOnly ?? true,
  });

  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    ...categories.map(cat => ({ value: cat, label: cat }))
  ];

  const handleInputChange = (field, value) => {
    setLocalParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    onSearch(localParams);
  };

  const handleClear = () => {
    const clearedParams = {
      searchTerm: '',
      category: '',
      activeOnly: true,
    };
    setLocalParams(clearedParams);
    onSearch(clearedParams);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Buscar Productos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Search Term */}
        <Input
          label="Buscar por nombre o descripción"
          value={localParams.searchTerm}
          onChange={(e) => handleInputChange('searchTerm', e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe para buscar..."
          className="w-full"
        />

        {/* Category Filter */}
        <Select
          label="Categoría"
          value={localParams.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          options={categoryOptions}
          className="w-full"
        />

        {/* Active Only Filter */}
        <div className="flex flex-col justify-end">
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={localParams.activeOnly}
              onChange={(e) => handleInputChange('activeOnly', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Solo productos activos</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button onClick={handleSearch} variant="primary">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Buscar
        </Button>
        
        <Button onClick={handleClear} variant="secondary">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6m0 12L6 6" />
          </svg>
          Limpiar
        </Button>
      </div>
    </div>
  );
};

export default ProductSearch;