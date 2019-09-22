using Microsoft.AspNetCore.Mvc;
using OrderProcess.Data.Repositories;
using OrderProcess.Shared.Models;
using System;
using System.Collections.Generic;

namespace OrderProcess.Server.Controllers
{
    [Route("api/[controller]")]
    public class OrderController : Controller
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
}
