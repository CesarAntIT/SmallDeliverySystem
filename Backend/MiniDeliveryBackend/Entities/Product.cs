using System.ComponentModel.DataAnnotations;

namespace MiniDeliveryBackend.Business.Entities
{
    public class Product : BaseEntity
    {
        [Required, MaxLength(200)]
        public string Name { get; set; } = null!;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public int Stock { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation properties

        public ICollection<OrderItem>? OrderItems { get; set; }
    }
}
