var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient {
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress),
    DefaultRequestVersion = new Version(2, 0),
    DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher
});

await builder.Build().RunAsync();
