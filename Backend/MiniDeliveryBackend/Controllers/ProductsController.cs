using Microsoft.AspNetCore.Mvc;
using MiniDeliveryBackend.Business.DTOs;
using MiniDeliveryBackend.Business.Services;

namespace MiniDeliveryBackend.Business.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(IProductService productService, ILogger<ProductsController> logger)
        {
            _productService = productService;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene una lista paginada de productos con filtros de búsqueda
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResult<ProductListDto>>>> GetProducts([FromQuery] ProductSearchDto searchDto)
        {
            try
            {
                var result = await _productService.GetProductsAsync(searchDto);
                return Ok(ApiResponse<PagedResult<ProductListDto>>.SuccessResult(result, "Productos obtenidos exitosamente"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener productos");
                return StatusCode(500, ApiResponse<PagedResult<ProductListDto>>.ErrorResult("Error interno del servidor"));
            }
        }

        /// <summary>
        /// Obtiene un producto específico por su ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProductDetailsDto>>> GetProduct(Guid id)
        {
            try
            {
                var product = await _productService.GetProductByIdAsync(id);
                if (product == null) 
                {
                    return NotFound(ApiResponse<ProductDetailsDto>.ErrorResult("Producto no encontrado"));
                }
                
                return Ok(ApiResponse<ProductDetailsDto>.SuccessResult(product, "Producto obtenido exitosamente"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener producto con ID: {ProductId}", id);
                return StatusCode(500, ApiResponse<ProductDetailsDto>.ErrorResult("Error interno del servidor"));
            }
        }

        /// <summary>
        /// Crea un nuevo producto
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<ProductDetailsDto>>> CreateProduct([FromBody] ProductCreateDto productDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList();
                    return BadRequest(ApiResponse<ProductDetailsDto>.ErrorResult("Datos inválidos", errors));
                }
                
                var product = await _productService.CreateProductAsync(productDto);
                return CreatedAtAction(
                    nameof(GetProduct), 
                    new { id = product.Id }, 
                    ApiResponse<ProductDetailsDto>.SuccessResult(product, "Producto creado exitosamente")
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear producto");
                return StatusCode(500, ApiResponse<ProductDetailsDto>.ErrorResult("Error interno del servidor"));
            }
        }

        /// <summary>
        /// Actualiza un producto existente
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<ProductDetailsDto>>> UpdateProduct(Guid id, [FromBody] ProductUpdateDto productDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList();
                    return BadRequest(ApiResponse<ProductDetailsDto>.ErrorResult("Datos inválidos", errors));
                }
                
                var product = await _productService.UpdateProductAsync(id, productDto);
                if (product == null)
                {
                    return NotFound(ApiResponse<ProductDetailsDto>.ErrorResult("Producto no encontrado"));
                }
                
                return Ok(ApiResponse<ProductDetailsDto>.SuccessResult(product, "Producto actualizado exitosamente"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar producto con ID: {ProductId}", id);
                return StatusCode(500, ApiResponse<ProductDetailsDto>.ErrorResult("Error interno del servidor"));
            }
        }

        /// <summary>
        /// Elimina un producto (soft delete si tiene órdenes, hard delete si no)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteProduct(Guid id)
        {
            try
            {
                var result = await _productService.DeleteProductAsync(id);
                if (!result)
                {
                    return NotFound(ApiResponse<bool>.ErrorResult("Producto no encontrado"));
                }
                
                return Ok(ApiResponse<bool>.SuccessResult(true, "Producto eliminado exitosamente"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar producto con ID: {ProductId}", id);
                return StatusCode(500, ApiResponse<bool>.ErrorResult("Error interno del servidor"));
            }
        }

        /// <summary>
        /// Obtiene todas las categorías disponibles
        /// </summary>
        [HttpGet("categories")]
        public async Task<ActionResult<ApiResponse<List<string>>>> GetCategories()
        {
            try
            {
                var categories = await _productService.GetCategoriesAsync();
                return Ok(ApiResponse<List<string>>.SuccessResult(categories, "Categorías obtenidas exitosamente"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener categorías");
                return StatusCode(500, ApiResponse<List<string>>.ErrorResult("Error interno del servidor"));
            }
        }

        /// <summary>
        /// Actualiza el stock de un producto
        /// </summary>
        [HttpPatch("{id}/stock")]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateStock(Guid id, [FromBody] int newStock)
        {
            try
            {
                if (newStock < 0)
                {
                    return BadRequest(ApiResponse<bool>.ErrorResult("El stock no puede ser negativo"));
                }

                var result = await _productService.UpdateStockAsync(id, newStock);
                if (!result)
                {
                    return NotFound(ApiResponse<bool>.ErrorResult("Producto no encontrado"));
                }
                
                return Ok(ApiResponse<bool>.SuccessResult(true, "Stock actualizado exitosamente"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar stock del producto con ID: {ProductId}", id);
                return StatusCode(500, ApiResponse<bool>.ErrorResult("Error interno del servidor"));
            }
        }

        /// <summary>
        /// Obtiene productos con stock bajo (por defecto ≤ 5)
        /// </summary>
        [HttpGet("low-stock")]
        public async Task<ActionResult<ApiResponse<List<ProductListDto>>>> GetLowStockProducts([FromQuery] int threshold = 5)
        {
            try
            {
                var products = await _productService.GetLowStockProductsAsync(threshold);
                return Ok(ApiResponse<List<ProductListDto>>.SuccessResult(products, "Productos con stock bajo obtenidos exitosamente"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener productos con stock bajo");
                return StatusCode(500, ApiResponse<List<ProductListDto>>.ErrorResult("Error interno del servidor"));
            }
        }
    }
}