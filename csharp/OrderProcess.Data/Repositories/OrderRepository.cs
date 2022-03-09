namespace OrderProcess.Data.Repositories;

public class OrderRepository
{
    // TODO: replace with a more durable data store, e.g. don't store your database in %TEMP% folder
    private readonly string path = $"../orders.db";

    public bool CheckDb()
    {
        try
        {
            using LiteDatabase connection = new LiteDatabase(path) ?? throw new ArgumentNullException(nameof(connection));
            ILiteCollection<Order> orders = connection.GetCollection<Order>() ?? throw new ArgumentNullException(nameof(orders));
            return true;
        }
        catch
        {
            return false;
        }
    }

    public void AddOrder(Order order)
    {
        if (order == null) throw new ArgumentNullException(nameof(order));

        using LiteDatabase connection = new LiteDatabase(path) ?? throw new ArgumentNullException(nameof(connection));
        ILiteCollection<Order> orders = connection.GetCollection<Order>() ?? throw new ArgumentNullException(nameof(orders));

        orders.Insert(order);
    }

    public List<Order> GetOrders()
    {
        using LiteDatabase connection = new LiteDatabase(path) ?? throw new ArgumentNullException(nameof(connection));
        ILiteCollection<Order> orders = connection.GetCollection<Order>() ?? throw new ArgumentNullException(nameof(orders));

        IEnumerable<Order>? result = orders.FindAll();
        return result.ToList();
    }

    public Order? GetPendingOrder()
    {
        using LiteDatabase connection = new LiteDatabase(path) ?? throw new ArgumentNullException(nameof(connection));
        ILiteCollection<Order> orders = connection.GetCollection<Order>() ?? throw new ArgumentNullException(nameof(orders));

        Order? result = orders.FindOne(x => x.Status == "Pending");
        return result;
    }

    public void UpdateOrder(int orderId, string status)
    {
        using LiteDatabase connection = new LiteDatabase(path) ?? throw new ArgumentNullException(nameof(connection));
        ILiteCollection<Order> orders = connection.GetCollection<Order>() ?? throw new ArgumentNullException(nameof(orders));

        Order? order = orders.FindById(orderId);
        if (order == null)
        {
            return; // TODO: throw?
        }

        order.Status = status;

        orders.Update(order);
    }

}
