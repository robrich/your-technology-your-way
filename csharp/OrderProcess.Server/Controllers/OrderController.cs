namespace OrderProcess.Server.Controllers;

/*
[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository)
    {
        this.orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
    }

    [HttpGet("")]
    [ProducesResponseType(typeof(List<Order>), 200)]
    public ActionResult<List<Order>> GetOrders()
    {
        List<Order> orders = orderRepository.GetOrders();
        return orders;
    }

    [HttpPost("")]
    [ProducesResponseType(201)]
    public IActionResult SaveNewOrder([FromBody]Order order)
    {
        orderRepository.AddOrder(order);
        return StatusCode(201);
    }

}
*/
