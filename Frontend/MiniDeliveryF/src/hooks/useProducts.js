import { useState, useEffect } from 'react';
import { productsService } from '../services/api';

// Hook para manejar la lista de productos con paginación y búsqueda
export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    category: '',
    page: 1,
    pageSize: 10,
    activeOnly: true,
    ...initialParams,
  });

  const fetchProducts = async (params = searchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsService.getProducts(params);
      
      if (response.success) {
        setProducts(response.data.items);
        setTotalCount(response.data.totalCount);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.pageNumber);
      } else {
        setError(response.message || 'Error al cargar productos');
      }
    } catch (err) {
      setError('Error de conexión al cargar productos');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const search = (newParams) => {
    const updatedParams = { ...searchParams, ...newParams, page: 1 };
    setSearchParams(updatedParams);
    return fetchProducts(updatedParams);
  };

  const changePage = (page) => {
    const updatedParams = { ...searchParams, page };
    setSearchParams(updatedParams);
    return fetchProducts(updatedParams);
  };

  const refresh = () => {
    return fetchProducts(searchParams);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
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
    fetchProducts,
  };
};

// Hook para manejar un producto individual
export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsService.getProduct(id);
      
      if (response.success) {
        setProduct(response.data);
      } else {
        setError(response.message || 'Error al cargar producto');
      }
    } catch (err) {
      setError('Error de conexión al cargar producto');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};

// Hook para manejar operaciones CRUD de productos
export const useProductOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsService.createProduct(productData);
      
      if (response.success) {
        return response.data;
      } else {
        const errorMessage = response.errors?.join(', ') || response.message || 'Error al crear producto';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.message || 'Error de conexión al crear producto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsService.updateProduct(id, productData);
      
      if (response.success) {
        return response.data;
      } else {
        const errorMessage = response.errors?.join(', ') || response.message || 'Error al actualizar producto';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.message || 'Error de conexión al actualizar producto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsService.deleteProduct(id);
      
      if (response.success) {
        return true;
      } else {
        const errorMessage = response.message || 'Error al eliminar producto';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.message || 'Error de conexión al eliminar producto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id, newStock) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsService.updateStock(id, newStock);
      
      if (response.success) {
        return true;
      } else {
        const errorMessage = response.message || 'Error al actualizar stock';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.message || 'Error de conexión al actualizar stock';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    clearError: () => setError(null),
  };
};

// Hook para obtener categorías
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsService.getCategories();
      
      if (response.success) {
        setCategories(response.data);
      } else {
        setError(response.message || 'Error al cargar categorías');
      }
    } catch (err) {
      setError('Error de conexión al cargar categorías');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
  };
};