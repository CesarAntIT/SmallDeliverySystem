namespace MiniDeliveryBackend.Business.Entities
{
    public class ProductAudit
    {
        public int Id { get; set; }
        public Guid ProductId { get; set; }
        public string Action { get; set; } = "DESACTIVATE";
        public Guid? PerformedByUserId { get; set; }
        public User? PerformedByUser { get; set; }
        public DateTime PerformedAt { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }
    }
}
