import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.StringTokenizer;


public class DPProblem1BruteForceRecursiveSolution {
	
	static int M,N,P;
	
	static int [] [] mat;
	
	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub
		
		System.out.println("Amount Available and number of garments");
		
		BufferedReader br=new BufferedReader(new InputStreamReader(System.in));
		
		StringTokenizer st=new StringTokenizer(br.readLine());
		
		int AMOUNT=Integer.parseInt(st.nextToken());
		
		M=AMOUNT;
		
		int C=Integer.parseInt(st.nextToken());
		
		System.out.println("Number of models per garment");
		
		int K=Integer.parseInt(br.readLine());
		
		int [] [] garment=new int[C][K];
		
		for(int i=0;i<C;i++){
			
			st=new StringTokenizer(br.readLine());
			
			for(int j=0;j<K;j++){
				garment[i][j]=Integer.parseInt(st.nextToken());
			}
			
		}
		
		mat=garment;
		
		N=C;
		
		P=K;
		
		System.out.println(doIt(AMOUNT,0));
	}
	
	public static int doIt(int moneyLeft, int garment){
		
		if(moneyLeft<0) return Integer.MAX_VALUE;
		
		if(garment==N){ 
			System.out.println(moneyLeft);
			return moneyLeft;
		}
		
		int min=Integer.MAX_VALUE;
		
		for(int i=0;i<P;i++){
			min=Math.min(min, doIt(moneyLeft - mat[garment][i], garment+1));
		}
		
		return min;
	}
	
}
