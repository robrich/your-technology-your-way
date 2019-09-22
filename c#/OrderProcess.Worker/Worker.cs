using System;
using System.Threading;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OrdersHandler;

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
                    Channel channel = new Channel("localhost:50051", ChannelCredentials.Insecure);
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
