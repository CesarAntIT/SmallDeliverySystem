using MiniDeliveryBackend.Business.Entities;
using MiniDeliveryBackend.Business.Interfaces;
using MiniDeliveryBackend.Context;

namespace MiniDeliveryBackend.Services
{


    public class InventoryService : Iinventory
    {
        private readonly MiniDeliveryContext context;
        public InventoryService(MiniDeliveryContext context)
        {
            this.context = context;
        }
        public void Register(Product item)
        {
            try
            {
                context.Products.Add(item);
                context.SaveChanges();
            }
            catch (Exception ex) 
            {
                Console.WriteLine($"Error al procesar: {ex.Message}");
            }
            
        }
    }
}
