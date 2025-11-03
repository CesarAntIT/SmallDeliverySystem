
using Microsoft.EntityFrameworkCore;
using MiniDeliveryBackend.Context;
using MiniDeliveryBackend.Business.Services;

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
            builder.Services.AddScoped<ProductService>();

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

            var app = builder.Build();

            // esto solo se ejecuta en modo desarrollo
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // activa cors para permitir conexión del frontend
            app.UseCors("permitirTodo");

            // redirige a https por seguridad
            app.UseHttpsRedirection();

            // habilita las rutas de los controladores
            app.MapControllers();

            app.Run();
        }
    }
}

