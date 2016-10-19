using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MvcApplication1.Models;

namespace MvcApplication1.Controllers
{
    public class HomeController : Controller
    {
        //Get Request to the Page
        public ActionResult Index()
        {
            return View(TwitterUserDetails.getUserDetails());
        }
        
        
        [HttpPost]
        public ActionResult CreateUserAccount(string username, string ucomment)
        {
            // Inserts the form data.
            TwitterUserDetails.insertUserDetails(username, ucomment);
            return RedirectToAction("Index");
        }

    }
}
