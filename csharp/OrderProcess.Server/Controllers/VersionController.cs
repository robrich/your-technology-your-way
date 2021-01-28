using Microsoft.AspNetCore.Mvc;
using OrderProcess.Shared.Models;
using System;

namespace OrderProcess.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VersionController : ControllerBase
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
