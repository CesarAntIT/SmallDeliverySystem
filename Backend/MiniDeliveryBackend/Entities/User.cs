using MiniDeliveryBackend.Business.Entities.Enums;
using System.ComponentModel.DataAnnotations;

namespace MiniDeliveryBackend.Business.Entities
{
    public class User : BaseEntity
    {
        [Required, MaxLength(150)]
        public string FullName { get; set; } = null!;

        [EmailAddress, MaxLength(100)]
        public string? Email { get; set; } = null!;

        public string? PhoneNumber { get; set; } = null!;

        [Required, MaxLength(50)]
        public string Username { get; set; } = null!;

        [Required, MaxLength(200)]
        public string PasswordHash { get; set; } = null!;

        public UserRole Role { get; set; } = UserRole.Customer;

        public bool IsActive { get; set; } = true;

        // Navigation properties

        public ICollection<Address>? Addresses { get; set; }

        public DeliveryPerson? DeliveryPerson { get; set; }
    }
}
