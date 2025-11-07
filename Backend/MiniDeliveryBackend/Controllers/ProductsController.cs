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

    }
}