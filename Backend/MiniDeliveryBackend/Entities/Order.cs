using MiniDeliveryBackend.Business.Entities.Enums;
using System.ComponentModel.DataAnnotations;

namespace MiniDeliveryBackend.Business.Entities
{
    public class Order : BaseEntity
    {
        [Required]
        public Guid CustomerId { get; set; }
        public User? Customer { get; set; }

        public Guid? AdressId { get; set; }
        public Address? Address { get; set; }


        public Guid? DeliveryPersonId { get; set; }
        public DeliveryPerson? DeliveryPerson { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        // Calculated total amount

        [Required]
        public decimal Subtotal { get; set; }
        public decimal? ShippingFee { get; set; }

        public decimal TotalAmount { get; set; }

        // Observations or special instructions
        [MaxLength(1000)]
        public string? Observations { get; set; }

        // Timestamp properties
        public DateTime? ConfirmeddAt { get; set; }
        public DateTime? DispatchedAt { get; set; }
        public DateTime? DeliveredAt { get; set; }

        // Navigation properties

        public ICollection<OrderItem>? OrderItems { get; set; }
    }
}
