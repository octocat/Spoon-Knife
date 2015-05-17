using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Xml;

namespace EnderWordCount
{
	class Program
	{
		static int MostrarN = 10;
		static string BlackList = "de do dos da das os as um uns uma umas dum duma dum dumas em no nos na nas num nuns numa numas por pelo pelos pela pela com ao aos ante até após contra desde entre para por perante sem sob sobre daqui nele nela pela nesse nessa naquele naquela neste nesta que qual não";
		static string Url = "http://www.minutoseguros.com.br/blog/feed/";

		static void Main(string[] args)
		{
			Regex regex;
			string conteudoGeral = "";

			// DOC: pegar XML do servidor
			XmlDocument docXml = new XmlDocument();
			System.Console.WriteLine("\nCarregando \"" + Url + "\"");
			docXml.Load(Url);

			System.Console.WriteLine("Processando...");

			// DOC: a fim de poder processar as tags <content:encoded>
			XmlNamespaceManager namespaceManager = new XmlNamespaceManager(docXml.NameTable);
			namespaceManager.AddNamespace("content", docXml.DocumentElement.GetNamespaceOfPrefix("content"));

			XmlNodeList itens = docXml.DocumentElement.SelectNodes("/rss/channel/item");

			// DOC: ajusta BlackList para o processo de procura
			BlackList = " " + BlackList + " ";

			foreach (XmlNode item in itens)
			{
				string title = item.SelectSingleNode("title").InnerText;
				string conteudo = item.SelectSingleNode("content:encoded", namespaceManager).InnerText.ToLower();

				// DOC: Elimina <div>...</div> , "The post ..." , etc.
				regex = new Regex("<div.*?>(.|\n)*?</div>|<p>the post .*?>(.|\n)*|</p>");
				conteudo = regex.Replace(conteudo, "");

				// DOC: eliminar tags HTML e caracteres especiais
				regex = new Regex("<([^>]+)>|&#....;|[\\[\\]\\+\\.\\!,:\'\"“”\\?()\\{\\}<>-]|\n|\r");
				conteudo = regex.Replace(conteudo, " ");
				conteudoGeral += conteudo;

				// DOC: Aqui conteudo de um post, pronto para ser processado

				System.Console.WriteLine("\n\"" + title + "\"");

				contaPalavras(conteudo);
			}

			System.Console.WriteLine("\n*** Contagem geral ***");
			contaPalavras(conteudoGeral);

			Console.ReadLine();
		}

		static void contaPalavras(string conteudo)
		{
			List<ListaPalavras> lista = new List<ListaPalavras>();
			int j;

			// DOC: transforma a string com o conteudo em array
			string[] contaArray = conteudo.Split(' ');

			for (int i = 0; i < contaArray.Length; i++)
			{
				// DOC: considera apenas palavras com 2 ou mais letras 
				if (contaArray[i].Length < 2) continue;

				// DOC: ignorar números 
				if (contaArray[i][0] >= '0' && contaArray[i][0] < '9') continue;

				// DOC: compara com palavras da BlackList 
				if (BlackList.Contains(" " + contaArray[i] + " ")) continue;

				// DOC: ok, palavra quente, processar
				for (j = 0; j < lista.Count; j++)
				{
					if (lista[j].Palavra == contaArray[i])
					{
						// DOC: palavra já computada anteriormente, incrementar contador
						lista[j].Cnt++;
						break;
					}
				}
				if (j >= lista.Count)
				{
					// DOC: palavra ainda não computada, acrescentar à lista
					lista.Add(new ListaPalavras(contaArray[i], 1));
				}
			}

			// DOC: ordenar
			lista.Sort(delegate(ListaPalavras x, ListaPalavras y)
			{
				return y.Cnt.CompareTo(x.Cnt);
			});

			// DOC: mostrar
			for (j = 0; j < MostrarN && j < lista.Count; j++)
			{
				System.Console.WriteLine("  " + lista[j].Cnt + "\t" + lista[j].Palavra);
			}
		}

		public class ListaPalavras
		{
			public string Palavra { get; set; }
			public int Cnt { get; set; }

			public ListaPalavras(string palavra, int cnt)
			{
				Palavra = palavra;
				Cnt = cnt;
			}
		}

	}
}

