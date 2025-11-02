namespace MiniDeliveryBackend.Business.Entities
{
    public class OrderItem
    {
        public Guid OrderId { get; set; }
        public Order? Order { get; set; }


        public Guid ProductId { get; set; }
        public Product? Product { get; set; }

        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        // Calculated property for subtotal
        public decimal Subtotal => Quantity * UnitPrice;
    }
}
