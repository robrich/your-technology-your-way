using Microsoft.AspNetCore.Mvc;
using OrderProcess.Shared.Models;
using System;

namespace OrderProcess.Server.Controllers
{
    [Route("api/[controller]")]
    public class VersionController : Controller
    {

        public VersionController()
        {
        }

        [HttpGet("")]
        [ProducesResponseType(typeof(VersionInfo), 200)]
        public ActionResult<VersionInfo> GetOrders()
        {
            return new VersionInfo
            {
                Language = "C#",
                Runtime = "ASP.NET Core",
                Version = Environment.Version.ToString()
            };
        }

    }
}
