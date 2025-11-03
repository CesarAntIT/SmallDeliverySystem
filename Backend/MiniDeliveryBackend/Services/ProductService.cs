using Microsoft.EntityFrameworkCore;
using MiniDeliveryBackend.Business.DTOs;
using MiniDeliveryBackend.Business.Entities;
using MiniDeliveryBackend.Context;

namespace MiniDeliveryBackend.Business.Services
{
    public interface IProductService
    {
        Task<PagedResult<ProductListDto>> GetProductsAsync(ProductSearchDto searchDto);
        Task<ProductDetailsDto?> GetProductByIdAsync(Guid id);
        Task<ProductDetailsDto> CreateProductAsync(ProductCreateDto productDto);
        Task<ProductDetailsDto?> UpdateProductAsync(Guid id, ProductUpdateDto productDto);
        Task<bool> DeleteProductAsync(Guid id);
        Task<List<string>> GetCategoriesAsync();
        Task<bool> UpdateStockAsync(Guid id, int newStock);
        Task<List<ProductListDto>> GetLowStockProductsAsync(int threshold = 5);
    }

    public class ProductService : IProductService
    {
        private readonly MiniDeliveryContext _context;

        public ProductService(MiniDeliveryContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<ProductListDto>> GetProductsAsync(ProductSearchDto searchDto)
        {
            var query = _context.Products.AsQueryable();

            // Filtrar por activos si se especifica
            if (searchDto.ActiveOnly)
            {
                query = query.Where(p => p.IsActive);
            }

            // Búsqueda por nombre o descripción
            if (!string.IsNullOrWhiteSpace(searchDto.SearchTerm))
            {
                var searchTerm = searchDto.SearchTerm.ToLower();
                query = query.Where(p => 
                    p.Name.ToLower().Contains(searchTerm) || 
                    (p.Description != null && p.Description.ToLower().Contains(searchTerm)) ||
                    (p.Category != null && p.Category.ToLower().Contains(searchTerm)));
            }

            // Filtrar por categoría
            if (!string.IsNullOrWhiteSpace(searchDto.Category))
            {
                query = query.Where(p => p.Category == searchDto.Category);
            }

            var totalCount = await query.CountAsync();

            var products = await query
                .OrderBy(p => p.Name)
                .Skip((searchDto.Page - 1) * searchDto.PageSize)
                .Take(searchDto.PageSize)
                .Select(p => new ProductListDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    Category = p.Category,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt,
                    LastUpdatedAt = p.LastUpdatedAt
                })
                .ToListAsync();

            return new PagedResult<ProductListDto>(products, totalCount, searchDto.Page, searchDto.PageSize);
        }

        public async Task<ProductDetailsDto?> GetProductByIdAsync(Guid id)
        {
            var product = await _context.Products
                .Where(p => p.Id == id)
                .Select(p => new ProductDetailsDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    Category = p.Category,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt,
                    LastUpdatedAt = p.LastUpdatedAt,
                    TotalOrderItems = p.OrderItems != null ? p.OrderItems.Count : 0
                })
                .FirstOrDefaultAsync();

            return product;
        }

        public async Task<ProductDetailsDto> CreateProductAsync(ProductCreateDto productDto)
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                Stock = productDto.Stock,
                Category = productDto.Category,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                LastUpdatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return new ProductDetailsDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                Category = product.Category,
                IsActive = product.IsActive,
                CreatedAt = product.CreatedAt,
                LastUpdatedAt = product.LastUpdatedAt,
                TotalOrderItems = 0
            };
        }

        public async Task<ProductDetailsDto?> UpdateProductAsync(Guid id, ProductUpdateDto productDto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return null;

            product.Name = productDto.Name;
            product.Description = productDto.Description;
            product.Price = productDto.Price;
            product.Stock = productDto.Stock;
            product.Category = productDto.Category;
            product.IsActive = productDto.IsActive;
            product.LastUpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new ProductDetailsDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                Category = product.Category,
                IsActive = product.IsActive,
                CreatedAt = product.CreatedAt,
                LastUpdatedAt = product.LastUpdatedAt,
                TotalOrderItems = product.OrderItems?.Count ?? 0
            };
        }

        public async Task<bool> DeleteProductAsync(Guid id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            // Verificar si el producto tiene órdenes asociadas
            var hasOrders = await _context.OrderItems.AnyAsync(oi => oi.ProductId == id);
            if (hasOrders)
            {
                // Soft delete - marcar como inactivo
                product.IsActive = false;
                product.LastUpdatedAt = DateTime.UtcNow;
            }
            else
            {
                // Hard delete si no hay órdenes
                _context.Products.Remove(product);
            }
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<string>> GetCategoriesAsync()
        {
            return await _context.Products
                .Where(p => p.IsActive && !string.IsNullOrWhiteSpace(p.Category))
                .Select(p => p.Category!)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();
        }

        public async Task<bool> UpdateStockAsync(Guid id, int newStock)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            product.Stock = newStock;
            product.LastUpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<ProductListDto>> GetLowStockProductsAsync(int threshold = 5)
        {
            return await _context.Products
                .Where(p => p.IsActive && p.Stock <= threshold)
                .OrderBy(p => p.Stock)
                .Select(p => new ProductListDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    Category = p.Category,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt,
                    LastUpdatedAt = p.LastUpdatedAt
                })
                .ToListAsync();
        }
    }
}