using Microsoft.EntityFrameworkCore;
using MiniDeliveryBackend.Business.Entities;
using MiniDeliveryBackend.Context;
using MiniDeliveryBackend.Entities;
using MiniDeliveryBackend.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MiniDeliveryBackend.Services
{
    public class ProductService : IProductService
    {
        private readonly MiniDeliveryContext _context;

        public ProductService(MiniDeliveryContext context)
        {
            _context = context;
        }

        public async Task<Product> GetByIdAsync(Guid id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task<List<Product>> GetAllAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

              public async Task<bool> DeactivateAsync(Guid id, Guid? userId, CancellationToken ct = default)
        {
            var product = await _db.Products
                                   .IgnoreQueryFilters()
                                   .FirstOrDefaultAsync(p => p.Id == id, ct);

            if (product == null) return false;
            if (!product.IsActive) return true;

            product.IsActive = false;
            product.DeletedAt = DateTime.UtcNow;
            product.DeletedByUserId = userId;

            _db.ProductAudits.Add(new ProductAudit
            {
                ProductId = product.Id,
                Action = "DESACTIVATE", 
                PerformedByUserId = userId,
                Notes = "Eliminado (isActive=false)"
            });

            await _db.SaveChangesAsync(ct);
            return true;
        }
    }
}
