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


        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            Guid? userId = GetUserIdAsGuid(User); // helper de abajo
            var ok = await _svc.DeactivateAsync(id, userId, ct);
            return ok ? NoContent() : NotFound();
        }

        // helper simple para leer el id de usuario como guid (si usas identity/jwt)
        private static Guid? GetUserIdAsGuid(ClaimsPrincipal user)
        {
            var raw = user?.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(raw, out var g) ? g : (Guid?)null;
        }
    }
}
