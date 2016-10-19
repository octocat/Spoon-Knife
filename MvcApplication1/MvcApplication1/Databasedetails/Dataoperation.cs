using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace MvcApplication1.Databasedetails
{
    public class Dataoperation
    {
        

        public static DataSet getAllUserData(SqlConnection con)
        {
            DataSet ds = new DataSet();
            var insertCommand = "Select * from Twitter.dbo.TwitterUserDetail Order By LatestTimeStamp desc";
            try
            {
                con.Open();
                SqlDataAdapter da = new SqlDataAdapter(insertCommand, con);
                da.Fill(ds, "TwitterUserDetail");
                return ds;
            } // end try
            catch (Exception e)  // catches the exception message 
            {
                return ds;
            } // end catch
            finally
            {
                con.Close(); //Closes the connection to database
            } // end finally

        } // end getAllUserData

        public static void insertUserData(string username, string ucomment, SqlConnection conn)
        {
            string insertCommand = "INSERT INTO Twitter.dbo.TwitterUserDetail (Username, UserComment, LatestTimeStamp) VALUES (@Username, @UserComment, @LatestTimeStamp) ";
            DateTime datenow = DateTime.Now;

            // create connection and command

            using (SqlCommand cmd = new SqlCommand(insertCommand, conn))
            {
                // define parameters and their values
          
                cmd.Parameters.Add("@Username", SqlDbType.NVarChar, 50).Value = username;
                cmd.Parameters.Add("@UserComment", SqlDbType.NVarChar,150).Value = ucomment;
                cmd.Parameters.Add("@LatestTimeStamp", SqlDbType.DateTime2).Value = datenow;

                // open connection, execute INSERT, close connection
                conn.Open();
                cmd.ExecuteNonQuery();
                conn.Close();
            }

        } // end insertUserData

    } // end Dataoperation
}