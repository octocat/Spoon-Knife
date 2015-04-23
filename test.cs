using System;
using System.Windows.Forms;

class Script
{
	[STAThread]
	static public void Main(string[] args)
	{
		MessageBox.Show("Just a test!");

		for (int i = 0; i < args.Length; i++)
		{
			Console.WriteLine(args[i]);
		}
	}
}

