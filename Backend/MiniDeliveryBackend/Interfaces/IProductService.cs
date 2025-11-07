using MiniDeliveryBackend.Business.Entities;
using MiniDeliveryBackend.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MiniDeliveryBackend.Interfaces
{
    public interface IProductService
    {
        Task<Product> GetByIdAsync(Guid id);
        Task<List<Product>> GetAllAsync();
        Task UpdateAsync(Product product);
        Task<bool> DeactivateAsync(Guid id, Guid? userId, CancellationToken ct);
    }
}
