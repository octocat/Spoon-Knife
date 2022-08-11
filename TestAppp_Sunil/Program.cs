using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace TestAppp_Sunil
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                AllPairShortestPath a = new AllPairShortestPath();

                // Print the solution

                List<InitialData> initialDatas = GetInitialDataFromFile("InputData.txt");
                foreach (var initialData in initialDatas)
                {

                    Console.WriteLine("--------------------------------------------------");
                    Console.WriteLine();
                    // var initialData = initialDatas[0];
                    int[,] intialDataMatrix = GetMatrix(initialData);
                    //PrintInitialDataMatrix(intialDataMatrix);
                    var v = intialDataMatrix.GetLength(0);
                    var dist = a.floydWarshall(intialDataMatrix, v);
                    var srcSync = dist[0, v - 1];
                    Console.WriteLine("{0},{1},{2}, {3}", initialData.NumberOfAC, initialData.CashInHand, initialData.Days, -srcSync);
                }


            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            finally
            {
                Console.ReadLine();
            }




        }

        private static void PrintInitialDataMatrix(int[,] intialDataMatrix)
        {
            for (int i = 0; i < intialDataMatrix.GetLength(0); i++)
            {
                for (int j = 0; j < intialDataMatrix.GetLength(1); j++)
                {
                    Console.Write(intialDataMatrix[i, j] + ",");
                }
                Console.WriteLine();
            }
        }

        private static int[,] GetMatrix(InitialData initialData)
        {
            var length = initialData.AcDataArray.Length;
			// Create Matrix with Source and Sink 
            int[,] matrix = new int[length, length];
            var acDataArr = initialData.AcDataArray;

			//  Fill the matrix with Cij Calculation 
            for (int rowIndex = 0; rowIndex < length; rowIndex++)
            {
                for (int colIndex = 0; colIndex < length; colIndex++)
                {
                    if (rowIndex >= colIndex)
                    {
                        matrix[rowIndex, colIndex] = 10000;
                    }
                    else
                    {

                        var rowAcData = acDataArr[rowIndex];

                        var colAcdata = acDataArr[colIndex];

                        if (rowIndex == 0)
                        {
                            if (colIndex == length - 1)
                                matrix[rowIndex, colIndex] = -initialData.CashInHand;
                            else
                                matrix[rowIndex, colIndex] = -(initialData.CashInHand - colAcdata.PurchasePrice); //C - c.PP
                        }
                        else
                        {

                            // in case colIndex == length -1 , C - r.PP +  ( c.DP - r.DP - 1 , 0) say  profitDays 
                            var profitDays = colAcdata.DateOfPurchase - rowAcData.DateOfPurchase - 1;
                            if (profitDays < 0)
                                profitDays = 0;
                            if (colIndex == length - 1)
                            {
                                matrix[rowIndex, colIndex] = -(initialData.CashInHand - rowAcData.PurchasePrice + (rowAcData.ProfitPerDay * profitDays) + rowAcData.ResalePrice);
                            }
                            else
                            {
                                //C - r.PP + r.RSP + ( c.DP - r.DP - 1 , 0)-c.PP 
                                matrix[rowIndex, colIndex] = -(initialData.CashInHand - rowAcData.PurchasePrice + rowAcData.ResalePrice + (rowAcData.ProfitPerDay * profitDays) - colAcdata.PurchasePrice); // formula to callculate
                            }
                        }
                    }
                }
            }

            return matrix;
        }

        private static List<InitialData> GetInitialDataFromFile(string filePath)
        {
            List<InitialData> initialDatas = new List<InitialData>();
            var lines = File.ReadAllLines(filePath);
            InitialData tempData = null;
            int acDataIndex = 1; // since source and sync are already filled
            foreach (var line in lines)
            {

                var lineDataArr = line.Split(" ", StringSplitOptions.RemoveEmptyEntries);
                if (lineDataArr.Length == 3)
                {
                    tempData = new InitialData(Convert.ToInt32(lineDataArr[0].Trim()), Convert.ToInt32(lineDataArr[1].Trim()), Convert.ToInt32(lineDataArr[2].Trim()));
                    initialDatas.Add(tempData);
                    acDataIndex = 1;
                }
                else
                {
                    tempData.AcDataArray[acDataIndex] = new AircraftData()
                    {
                        DateOfPurchase = Convert.ToInt32(lineDataArr[0].Trim()),
                        PurchasePrice = Convert.ToInt32(lineDataArr[1].Trim()),
                        ResalePrice = Convert.ToInt32(lineDataArr[2].Trim()),
                        ProfitPerDay = Convert.ToInt32(lineDataArr[3].Trim())
                    };
                    acDataIndex++;
                }
            }
			// Arrange Aircraft on ascending order of availablity 
            foreach (var item in initialDatas)
            {
                item.AcDataArray = item.AcDataArray.OrderBy(x => x.DateOfPurchase).ToArray();
            }
            return initialDatas;
        }
    }
}
