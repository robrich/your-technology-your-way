using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace OrderProcess.Worker
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseWindowsService() // as a Windows service, no-op on other platforms
                .UseSystemd() // as a Linux service, no-op on other platforms
                .ConfigureServices(services =>
                {
                    services.AddHostedService<Worker>();
                });

    }
}
