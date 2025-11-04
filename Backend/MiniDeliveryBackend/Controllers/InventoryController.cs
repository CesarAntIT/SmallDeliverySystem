using Microsoft.AspNetCore.Mvc;
using MiniDeliveryBackend.Business.Entities;
using MiniDeliveryBackend.Business.Interfaces;

namespace MiniDeliveryBackend.Business.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : Controller
    {

        private readonly Iinventory service;
        public InventoryController(Iinventory service)
        {
            this.service = service;
        }

        [HttpPost("Register")]
        public IActionResult add([FromBody] Product item)
        {
            service.Register(item);
            return Ok(new {message= "articulo agregado"});
        }
    }
}
