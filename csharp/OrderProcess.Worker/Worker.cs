using Grpc.Net.Client;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OrderProcess.Server.Services;
using System;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace OrderProcess.Worker
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> logger;

        public Worker(ILogger<Worker> logger)
        {
            this.logger = logger;
            this.logger.LogInformation($"Starting up C# worker service at {DateTimeOffset.Now}");
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    GrpcChannel channel = GrpcChannel.ForAddress("https://localhost:5001");
                    OrdersManager.OrdersManagerClient client = new OrdersManager.OrdersManagerClient(channel);

                    NewOrderReply result = await client.GetNewOrderAsync(new NewOrderRequest());
                    if (result.OrderId != 0)
                    {
                        logger.LogInformation($"Processing order id {result.OrderId}");
                        await client.UpdateOrderAsync(new UpdateOrderRequest
                        {
                            OrderId = result.OrderId,
                            Status = "Processed"
                        });
                    }
                    else
                    {
                        logger.LogInformation($"No pending orders at {DateTimeOffset.Now}");
                    }

                    await channel.ShutdownAsync();
                }
                catch (Exception ex)
                {
                    logger.LogError($"{ex.Message}\n{ex.StackTrace}");
                }

                await Task.Delay(3000, stoppingToken);
            }
        }
    }
}
