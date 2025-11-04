// API Configuration
const API_BASE_URL = 'http://localhost:5277/api';

// Generic API client
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data,
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Products API Service
class ProductsService extends ApiClient {
  constructor() {
    super(API_BASE_URL);
  }

  // Get paginated products with search
  async getProducts(params = {}) {
    return this.get('/products', params);
  }

  // Get product by ID
  async getProduct(id) {
    return this.get(`/products/${id}`);
  }

  // Create new product
  async createProduct(productData) {
    return this.post('/products', productData);
  }

  // Update product
  async updateProduct(id, productData) {
    return this.put(`/products/${id}`, productData);
  }

  // Delete product
  async deleteProduct(id) {
    return this.delete(`/products/${id}`);
  }

  // Get categories
  async getCategories() {
    return this.get('/products/categories');
  }

  // Update stock
  async updateStock(id, newStock) {
    return this.patch(`/products/${id}/stock`, newStock);
  }

  // Get low stock products
  async getLowStockProducts(threshold = 5) {
    return this.get('/products/low-stock', { threshold });
  }
}

// Create and export service instance
export const productsService = new ProductsService();
export default productsService;