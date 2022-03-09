namespace OrderProcess.Server.Services;

/// <summary>
/// gRPC service implementation
/// </summary>
public class OrdersService : OrdersManager.OrdersManagerBase
{
    private readonly OrderRepository repository;

    public OrdersService(OrderRepository orderRepository)
    {
        repository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
    }

    public override async Task<NewOrderReply> GetNewOrder(NewOrderRequest request, ServerCallContext context)
    {
        await Task.CompletedTask;

        Order? order = repository.GetPendingOrder();
        int orderId = order == null ? 0 : order.OrderId;

        return new NewOrderReply
        {
            OrderId = orderId
        };
    }

    public override async Task<UpdateOrderReply> UpdateOrder(UpdateOrderRequest request, ServerCallContext context)
    {
        await Task.CompletedTask;

        repository.UpdateOrder(request.OrderId, request.Status);
        return new UpdateOrderReply();
    }

}
