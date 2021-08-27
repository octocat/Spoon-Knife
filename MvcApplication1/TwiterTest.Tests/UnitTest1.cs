using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using System.Data;
using System.Data.SqlClient;
using Moq;
using MvcApplication1.Models;
using System.Collections.Generic;

namespace TwiterTest.Tests
{
    [TestClass]
    public class UnitTest1
    {
        private TestContext testContextInstance;
        public TestContext TestContext
        {
            get { return testContextInstance; }
            set { testContextInstance = value; }
        }



        [TestMethod]
        public void TestMethod1()
        {
            string resultuser = MvcApplication1.Models.TwitterUserDetails.CheckUserName("p");
            string resultcomment = MvcApplication1.Models.TwitterUserDetails.CheckUserComment("p");
            Assert.IsFalse(((resultcomment.Equals("")) || (resultuser.Equals(""))), "The username and comment should not be empty");
        }

        [TestMethod]
        public void TestMethod2()
        {
          /*  var listdate = new List<TwitterUser>();
            TwitterUser user = new TwitterUser();
            user.UserId = 1;
            user.UserName = "Priya";
            user.UserComment = "How are you";
            user.datetoday = DateTime.Now;
            listdate.Add(user);
            TwitterUser user1 = new TwitterUser();
            user1.UserId = 2;
            user1.UserName = "Raj";
            user1.UserComment = "How are you";
            user1.datetoday = DateTime.Now;
            listdate.Add(user1);
            TwitterUser user2 = new TwitterUser();
            user2.UserId = 3;
            user2.UserName = "Alex";
            user2.UserComment = "I am fine";
            user2.datetoday = DateTime.Now;
            listdate.Add(user2);*/

            var listdate = TwitterUserDetails.Details1();
            var datelist = listdate.Select(ud => new { ud.datetoday }).ToList();
            var expectedList = datelist.OrderByDescending(x => x.datetoday);
            Assert.IsTrue(expectedList.SequenceEqual(datelist));
              
            //Mock<MvcApplication1.Models.TwitterUserDetails> mockrep = new Mock<MvcApplication1.Models.TwitterUserDetails>();
            //mockrep.Setup(x => x.Details1()).Returns(listdate);
            //MvcApplication1.Models.TwitterUserDetails.getUserDetails(mockrep.Object);
                      


        }

       
     
    }
}
