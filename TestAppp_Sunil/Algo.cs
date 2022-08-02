using System;
using System.Collections.Generic;
using System.Text;

namespace TestAppp_Sunil
{// A C# program for Floyd Warshall All
 // Pairs Shortest Path algorithm.

    public class AllPairShortestPath
    {
        readonly static int INF = 10000;

        public int[,] floydWarshall(int[,] graph , int V)
        {
            int[,] dist = new int[V, V];
            int i, j, k;

            // Initialize the solution matrix
            // same as input graph matrix
            // Or we can say the initial
            // values of shortest distances
            // are based on shortest paths
            // considering no intermediate
            // vertex
            for (i = 0; i < V; i++)
            {
                for (j = 0; j < V; j++)
                {
                    dist[i, j] = graph[i, j];
                }
            }

            
            for (k = 0; k < V; k++)
            {
                // Pick all vertices as source
                // one by one
                for (i = 0; i < V; i++)
                {
                    // Pick all vertices as destination
                    // for the above picked source
                    for (j = 0; j < V; j++)
                    {
                        // If vertex k is on the shortest
                        // path from i to j, then update
                        // the value of dist[i][j]
                        if (dist[i, k] + dist[k, j] < dist[i, j])
                        {
                            dist[i, j] = dist[i, k] + dist[k, j];
                        }
                    }
                }
            }

            // Print the shortest distance matrix
           // printSolution(dist, V);
            return dist;
        }

        //void printSolution(int[,] dist , int V)
        //{
        //    Console.WriteLine("Following matrix shows the shortest " +
        //                    "distances between every pair of vertices");
        //    for (int i = 0; i < V; ++i)
        //    {
        //        for (int j = 0; j < V; ++j)
        //        {
        //            if (dist[i, j] == INF)
        //            {
        //                Console.Write("INF ");
        //            }
        //            else
        //            {
        //                Console.Write(dist[i, j] + " ");
        //            }
        //        }

        //        Console.WriteLine();
        //    }
        //}

        
    }

   
}
