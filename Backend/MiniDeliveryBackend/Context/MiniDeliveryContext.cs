using Microsoft.EntityFrameworkCore;
using MiniDeliveryBackend.Business.Entities;
using MiniDeliveryBackend.Entities;

namespace MiniDeliveryBackend.Context
{
    public class MiniDeliveryContext : DbContext
    {

        //Constructor y Configuración
        public MiniDeliveryContext(DbContextOptions<MiniDeliveryContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<DeliveryPerson> DeliveryPeople { get; set; }
        public DbSet<Address> Addresses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // OrderItem: clave compuesta (OrderId + ProductId)
            modelBuilder.Entity<OrderItem>()
                .HasKey(oi => new { oi.OrderId, oi.ProductId });

            // Relaciones
            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Product>()
                .HasMany(p => p.OrderItems)
                .WithOne(oi => oi.Product)
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Addresses)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Repartidor -> User 1:1

            modelBuilder.Entity<User>()
                .HasOne(u => u.DeliveryPerson)
                .WithOne(dp => dp.User)
                .HasForeignKey<DeliveryPerson>(dp => dp.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Índices útiles
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique(false);

            modelBuilder.Entity<Product>()
                .HasIndex(p => p.Name);

            // Configurar columnas de decimal para compatibilidad SQL

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
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

            //[Para utilizar en base de datos local]
            //  string ConnectionString = "";
            //  optionsBuilder.UseSqlServer(ConnectionString);


            //[Para utilizar base de datos sin instalar]
                //optionsBuilder.UseInMemoryDatabase("MiniDeliDB");
        }


        //Entity Sets
        //public DbSet<BlankEntity> BlankEntities { get; set; }

    }
}
