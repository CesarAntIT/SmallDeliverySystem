using Microsoft.EntityFrameworkCore;
using MiniDeliveryBackend.Business.Entities;

namespace MiniDeliveryBackend.Context
{
    public class MiniDeliveryContext : DbContext
    {

        //Constructor y Configuración
       public MiniDeliveryContext(DbContextOptions<MiniDeliveryContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductAudit> ProductAudits { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<DeliveryPerson> DeliveryPeople { get; set; }
        public DbSet<Address> Addresses { get; set; }

       
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Intencionalmente vacío. La conexión se define en Program.cs (AddDbContext + UseSqlServer).
        }

       
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

   
            // OrderItem: clave compuesta (OrderId + ProductId)
            modelBuilder.Entity<OrderItem>()
                .HasKey(oi => new { oi.OrderId, oi.ProductId });

            // Order 1..* OrderItems
            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Product 1..* OrderItems
            modelBuilder.Entity<Product>()
                .HasMany(p => p.OrderItems)
                .WithOne(oi => oi.Product)
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // User 1..* Addresses
            modelBuilder.Entity<User>()
                .HasMany(u => u.Addresses)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // DeliveryPerson 1:1 User
            modelBuilder.Entity<User>()
                .HasOne(u => u.DeliveryPerson)
                .WithOne(dp => dp.User)
                .HasForeignKey<DeliveryPerson>(dp => dp.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // -------- Índices --------
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique(false);

            modelBuilder.Entity<Product>()
                .HasIndex(p => p.Name);

            // -------- Precisión decimales --------
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Order>()
                .Property(o => o.Subtotal)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Order>()
                .Property(o => o.ShippingFee)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.UnitPrice)
                .HasPrecision(18, 2);

            // -------- Soft delete por isActive + Auditoría --------
            // Filtro global: solo productos activos por defecto
            modelBuilder.Entity<Product>()
                .HasQueryFilter(p => p.IsActive);

            // FK opcionales de auditoría (ajusta si tus tipos difieren)
            modelBuilder.Entity<Product>()
                .HasOne(p => p.DeletedByUser)
                .WithMany()
                .HasForeignKey(p => p.DeletedByUserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ProductAudit>()
                .HasOne(a => a.PerformedByUser)
                .WithMany()
                .HasForeignKey(a => a.PerformedByUserId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
