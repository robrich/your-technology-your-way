using OrderProcess.Shared.Models;
using LiteDB;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace OrderProcess.Data.Repositories
{
    public class OrderRepository
    {
        // TODO: replace with a more durable data store, e.g. don't store your database in %TEMP% folder
        private readonly string path = $"../BlazorOrders.db";

        public void AddOrder(Order order)
        {
            using (var connection = new LiteDatabase(path))
            {
                var orders = connection.GetCollection<Order>();
                orders.Insert(order);
            }
        }

        public List<Order> GetOrders()
        {
            using (var connection = new LiteDatabase(path))
            {
                var orders = connection.GetCollection<Order>();
                var result = orders.FindAll();
                return result.ToList();
            }
        }

        public Order GetPendingOrder()
        {
            using (var connection = new LiteDatabase(path))
            {
                var orders = connection.GetCollection<Order>();
                var result = orders.FindOne(x => x.Status == "Pending");
                return result;
            }
        }

        public void UpdateOrder(int orderId, string status)
        {
            using (var connection = new LiteDatabase(path))
            {
                var orders = connection.GetCollection<Order>();
                var order = orders.FindById(orderId);
                order.Status = status;

                orders.Update(order);
            }
        }

    }
}
