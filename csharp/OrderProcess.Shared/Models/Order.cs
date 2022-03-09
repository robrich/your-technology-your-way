namespace OrderProcess.Shared.Models;

public class Order
{
    public int OrderId { get; set; }
    public string Description { get; set; } = "";
    public int Quantity { get; set; }
    public double Total { get; set; }
    public string Status { get; set; } = "";
}
