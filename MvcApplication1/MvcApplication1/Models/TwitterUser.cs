using MvcApplication1.Databasedetails;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace MvcApplication1.Models
{
    public class TwitterUser
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string UserComment { get; set; }
        public DateTime datetoday { get; set; }

    } // end twitter class


    public class TwitterUserDetails {

       // Pulls user information from database
        public static List<TwitterUser> getUserDetails()
        {
            DataSet ds;
            var list = new List<TwitterUser>();

            using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["Twitter"].ConnectionString))
            {
                ds = Dataoperation.getAllUserData(conn);
            }

            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                TwitterUser user = new TwitterUser();
                user.UserId = (int)dr["UserId"];
                user.UserName = dr["Username"].ToString();
                user.UserComment =dr["UserComment"].ToString();
                user.datetoday = (DateTime)dr["LatestTimeStamp"];
                list.Add(user);
            }

            return list;
        }

        //Insert user information in database
       public static void insertUserDetails(string username, string ucomment){

           using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["Twitter"].ConnectionString)) {

               Dataoperation.insertUserData(username, ucomment, conn);

           }
       
       } // end insertUserDetails

        //Below methods are used for Unit Testing purpose

       public static string CheckUserName(string username)
       {
           return username;
       }

    
       public static string CheckUserComment(string ucomment)
       {
           return ucomment;
       }


       public  static List<TwitterUser> Details1()
       {
           var listdate = new List<TwitterUser>();
           TwitterUser user = new TwitterUser();
           user.UserId = 1;
           user.UserName = "Priya";
           user.UserComment = "How are you";
           user.datetoday = new DateTime(2016, 3, 17);
           listdate.Add(user);
           TwitterUser user1 = new TwitterUser();
           user1.UserId = 2;
           user1.UserName = "Raj";
           user1.UserComment = "How are you";
           user1.datetoday = new DateTime(2016, 2, 18);
           listdate.Add(user1);
           TwitterUser user2 = new TwitterUser();
           user2.UserId = 3;
           user2.UserName = "Alex";
           user2.UserComment = "I am fine";
           user2.datetoday = new DateTime(2016, 1, 12);
           listdate.Add(user2);


           return listdate;
       }




    }
}