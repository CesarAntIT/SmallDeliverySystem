using Microsoft.EntityFrameworkCore;
using MiniDeliveryBackend.Entities;

namespace MiniDeliveryBackend.Context
{
    public class MiniDeliveryContext:DbContext
    {

        //Constructor y Configuración
        public MiniDeliveryContext() { }

        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

            //[Para utilizar en base de datos local]
            //  string ConnectionString = "";
            //  optionsBuilder.UseSqlServer(ConnectionString);


            //[Para utilizar base de datos sin instalar]
                optionsBuilder.UseInMemoryDatabase("MiniDeliDB");
        }


        //Entity Sets
        public DbSet<BlankEntity> BlankEntities { get; set; }

    }
}
