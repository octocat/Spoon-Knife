using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace TestAppp_Sunil
{
    public class AircraftData
    {
        public int DateOfPurchase { get; set; }

        public int PurchasePrice { get; set; }
  
        public int ResalePrice { get; set; }

        public int ProfitPerDay { get; set; }


    }

    public class InitialData
    {
        public InitialData(int numberOfAC, int cashInHand, int days)
        {
            NumberOfAC = numberOfAC;
            CashInHand = cashInHand;
            Days = days;
            AcDataArray = new AircraftData[numberOfAC +2];
            AcDataArray[0] = new AircraftData(); 
            var temp = new AircraftData();
            temp.DateOfPurchase = days+2;
            AcDataArray[AcDataArray.Length - 1] = temp;
          
        }

        public int NumberOfAC { get; set; }

        public int CashInHand { get; set; }

        public int Days { get; set; }

        public AircraftData[] AcDataArray { get; set; }
    }
}
