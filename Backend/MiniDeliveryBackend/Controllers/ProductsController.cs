using Microsoft.AspNetCore.Mvc;

using MiniDeliveryBackend.Business.Entities;
using MiniDeliveryBackend.Services;
using System.Security.Claims;



namespace MiniDeliveryBackend.Business.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _svc;
        public ProductsController(ProductService svc) => _svc = svc;

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetAll(CancellationToken ct)
            => await _svc.GetAllAsync();

    }
}
