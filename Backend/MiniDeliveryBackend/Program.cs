using Microsoft.EntityFrameworkCore;

using MiniDeliveryBackend.Business.Entities;
using MiniDeliveryBackend.Business.Interfaces;
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

            // se agregan los controladores
            builder.Services.AddControllers();

            // se agrega swagger para ver la api en el navegador
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // se conecta la base de datos sql server
            builder.Services.AddDbContext<MiniDeliveryContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // se registra el servicio de productos
            builder.Services.AddScoped<IProductService,ProductService>();

            // se permite que el frontend se conecte sin problema
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("permitirTodo", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            // Configuracion de OpenAPI (Swagger)
            builder.Services.AddOpenApi();

            //configurar interfaz con servivio
            builder.Services.AddScoped<Iinventory, InventoryService>();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("PermitirTodo",
                    policy => policy.AllowAnyOrigin()
                                    .AllowAnyHeader()
                                    .AllowAnyMethod());
            });


            var app = builder.Build();
            app.UseCors("PermitirTodo");

            // Configuracion del pipeline HTTP
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
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

