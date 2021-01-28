using Grpc.Core;
using OrderProcess.Data.Repositories;
using OrderProcess.Shared.Models;
using System.Threading.Tasks;

namespace OrderProcess.Server.Services
{
    public class OrdersService : OrdersManager.OrdersManagerBase
    {
        private readonly OrderRepository repository;

        public OrdersService(OrderRepository orderRepository)
        {
            repository = orderRepository ?? throw new System.ArgumentNullException(nameof(orderRepository));
        }

        public override Task<NewOrderReply> GetNewOrder(NewOrderRequest request, ServerCallContext context)
        {

            Order order = repository.GetPendingOrder();
            int orderId = order == null ? 0 : order.OrderId;

            return Task.FromResult(new NewOrderReply
            {
                OrderId = orderId
            });
        }

        public override Task<UpdateOrderReply> UpdateOrder(UpdateOrderRequest request, ServerCallContext context)
        {
            repository.UpdateOrder(request.OrderId, request.Status);
            return Task.FromResult(new UpdateOrderReply());
        }

    }
}
