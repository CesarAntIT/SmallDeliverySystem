using System.ComponentModel.DataAnnotations;

namespace MiniDeliveryBackend.Business.Entities
{
    public class Address : BaseEntity
    {
        [Required]
        public Guid UserId { get; set; }
        public User? User { get; set; }

        [Required, MaxLength(50)]
        public string Street { get; set; } = null!;

        [MaxLength(50)]
        public string? City { get; set; }

        [MaxLength(50)]
        public string? Region { get; set; }
    }
}
