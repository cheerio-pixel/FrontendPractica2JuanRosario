
using Microsoft.AspNetCore.Mvc;

namespace frontend.Controllers
{
    [Controller]
    public class LoginController : ControllerBase
    {
        [Route("/Login")]
        public ActionResult Login()
        {
            return File("/login.html", "text/html");
        }
    }
}