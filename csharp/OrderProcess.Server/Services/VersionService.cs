namespace OrderProcess.Server.Services;

public class VersionService
{

    public VersionData Get() =>
        new VersionData
        {
            Language = "C#",
            Runtime = "ASP.NET Core",
            Version = Environment.Version.ToString()
        };

}
