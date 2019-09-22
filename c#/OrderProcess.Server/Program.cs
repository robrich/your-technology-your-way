using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Hosting;
using System.Net;

namespace OrderProcess.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Build().Run();
        }

        public static IHostBuilder BuildWebHost(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder
                        .ConfigureKestrel(options =>
                        {
                            options.Listen(IPAddress.Any, 5000, listenOptions =>
                            {
                                listenOptions.Protocols = HttpProtocols.Http1;
                            });
                            options.Listen(IPAddress.Any, 5001, listenOptions =>
                            {
                                listenOptions.Protocols = HttpProtocols.Http1;
                                listenOptions.UseHttps();
                            });
                            options.Listen(IPAddress.Any, 50051, listenOptions =>
                            {
                                listenOptions.Protocols = HttpProtocols.Http2;
                            });
                        })
                        .UseStartup<Startup>();
                });

    }
}
