IHost host = Host.CreateDefaultBuilder(args)
    .UseWindowsService() // as a Windows service, no-op on other platforms
    .UseSystemd() // as a Linux service, no-op on other platforms
    .ConfigureServices(services =>
    {
        services.AddHostedService<Worker>();
    })
    .Build();

await host.RunAsync();
