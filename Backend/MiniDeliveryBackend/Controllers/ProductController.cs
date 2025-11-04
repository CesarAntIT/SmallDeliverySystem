using Microsoft.AspNetCore.Mvc;
using MiniDeliveryBackend.Business.Entities;
using MiniDeliveryBackend.Interfaces;
using System;
using System.Threading.Tasks;

namespace MiniDeliveryBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        // Obtener un producto por ID
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var product = await _productService.GetByIdAsync(id);
            if (product == null)
                return NotFound("Producto no encontrado.");

            return Ok(product);
        }

        // Actualizar un producto existente
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Product product)
        {
            if (id != product.Id)
                return BadRequest("El ID del producto no coincide.");

            if (string.IsNullOrWhiteSpace(product.Name) || product.Price <= 0 || product.Stock < 0)
                return BadRequest("Campos obligatorios incompletos o inválidos.");

            await _productService.UpdateAsync(product);
            return Ok("Producto actualizado correctamente.");
        }

        // Obtener todos los productos — útil para rellenar el formulario
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }
    }
}
