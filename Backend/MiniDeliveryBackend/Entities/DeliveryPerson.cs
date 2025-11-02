using System.ComponentModel.DataAnnotations;

namespace MiniDeliveryBackend.Business.Entities
{
    public class DeliveryPerson : BaseEntity
    {
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public bool IsAvailable { get; set; } = true;

        [MaxLength(50)]
        public string? Vehicle { get; set; }

        // Navigation properties

        public ICollection<Order>? OrdersAssigned { get; set; }
    }
}
