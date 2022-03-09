using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace OrderProcess.Server.Services;

public class DBHealthCheck : IHealthCheck
{
    private readonly OrderRepository orderRepository;

    public DBHealthCheck(OrderRepository orderRepository)
    {
        this.orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        await Task.CompletedTask;
        var dbWorks = orderRepository.CheckDb();
        if (dbWorks)
        {
            return HealthCheckResult.Healthy("DB Healthy");
        }
        else
        {
            return new HealthCheckResult(context.Registration.FailureStatus, "DB Unhealthy");
        }
    }
}
