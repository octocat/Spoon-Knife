using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Testing
{
    class Program
    {
        static void Main(string[] args)
        {

            int h = 0, m = 0, s = 0;

            string str = "PT10H49M32S";

            str = str.Replace("PT", "");


            h = GetInt(ref str, 'H');

            m = GetInt(ref str, 'M');

            s = GetInt(ref str, 'S');

        }


        private static int GetInt(ref string s, char c)
        {
            string b = string.Empty;
            string sc = string.Empty;

            sc += c;

            if  (!s.Contains((c)))
                return 0;
 
            for (int i = 0; i < s.Length; i++)
            {
                if (Char.IsDigit(s[i]))
                {
                    b += s[i];
                }
                else
                    break;
            }
            s = s.Substring(b.Length+1);
            //s = s.Replace(sc, "");

            if (b.Length > 0)
            {
                return Int16.Parse(b);
            }
            else
                return 0;
        }
    }
}
