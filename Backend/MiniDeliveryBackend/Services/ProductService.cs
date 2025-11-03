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
    }
}
