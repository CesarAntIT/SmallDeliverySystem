using MiniDeliveryBackend.Business.Entities;
using MiniDeliveryBackend.Context;
using Microsoft.EntityFrameworkCore;

namespace MiniDeliveryBackend.Business.Services
{
    public class ProductService
    {
        private readonly MiniDeliveryContext _db;
        public ProductService(MiniDeliveryContext db) => _db = db;

        public Task<List<Product>> GetAllAsync(CancellationToken ct = default)
            => _db.Products.AsNoTracking().OrderBy(p => p.Name).ToListAsync(ct);

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
