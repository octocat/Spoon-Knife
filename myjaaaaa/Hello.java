public class Hello{
	static	int a=9;
	{
		a=6;
	}
    public static void dodo(){
		int i;
		System.out.println(a);
	}
	
	
	public static void main(String[] args){
		System.out.println(new Hello().a);


	}
}