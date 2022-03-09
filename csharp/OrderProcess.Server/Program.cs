var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// App services
builder.Services.AddSingleton<OrderRepository>();
builder.Services.AddSingleton<VersionService>();
builder.Services.AddSingleton<WeatherForecastService>();
// WebAPI
//builder.Services.AddControllersWithViews();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// gRPC
builder.Services.AddGrpc();
// health checks
builder.Services.AddHealthChecks()
    .AddCheck<DBHealthCheck>("DB", HealthStatus.Degraded);

var app = builder.Build();

// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseWebAssemblyDebugging();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseBlazorFrameworkFiles();
app.UseStaticFiles();

app.UseRouting();

app.MapGrpcService<OrdersService>();

// the minimal apis:

var weatherForecastService = app.Services.GetRequiredService<WeatherForecastService>();
app.MapGet("/api/weatherforecast", weatherForecastService.Get).WithName("GetWeatherForecast");

var versionService = app.Services.GetRequiredService<VersionService>();
if (versionService == null) throw new ArgumentNullException(nameof(versionService));
app.MapGet("/api/version", versionService.Get);

app.MapGet("/api/order", (OrderRepository orderRepository) => orderRepository.GetOrders());
app.MapPost("/api/order", (OrderRepository orderRepository, [FromBody] Order order) =>
{
    orderRepository.AddOrder(order);
    return Results.Created("/api/order", order);
});

app.MapHealthChecks("/health", new HealthCheckOptions()
{
    Predicate = _ => true,
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.Map("/error", (HttpContext context) =>
{
    var requestId = Activity.Current?.Id ?? context.TraceIdentifier;
    return Results.Json(new { message = "500: error processing request", status = 500, requestId }, statusCode: 500);
});

//app.MapControllers();

// load the SPA for everything else
app.MapFallbackToFile("index.html");

app.Run();
