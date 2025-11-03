using Microsoft.EntityFrameworkCore;
using MiniDeliveryBackend.Business.Entities;
using MiniDeliveryBackend.Context;
using MiniDeliveryBackend.Interfaces;
using MiniDeliveryBackend.Services;

namespace MiniDeliveryBackend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Configurar base de datos
            builder.Services.AddDbContext<MiniDeliveryContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddControllers();
            builder.Services.AddScoped<IProductService, ProductService>();

            // Habilitar CORS (para permitir conexion desde el frontend)
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            // Configuracion de OpenAPI (Swagger)
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configuracion del pipeline HTTP
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwaggerUi(options =>
                {
                    options.DocumentPath = "openapi/v1.json";
                });
            }

            app.UseCors("AllowAll");
            app.UseHttpsRedirection();
            app.UseAuthorization();

            app.MapControllers();

            // Crear producto de prueba si la base de datos esta vacia
            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<MiniDeliveryContext>();
                if (!context.Products.Any())
                {
                    context.Products.Add(new Product
                    {
                        Name = "Producto de Prueba",
                        Description = "Articulo de ejemplo para pruebas locales",
                        Price = 99.99m,
                        Stock = 10,
                        IsActive = true
                    });
                    context.SaveChanges();
                }
            }

            app.Run();
        }
    }
}
