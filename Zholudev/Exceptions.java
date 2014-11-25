
public class Exceptions extends Exception{

    public static void testException()  {
        try {
             throw new IndexOutOfBoundsException();
        } catch (IndexOutOfBoundsException rtv) {
            System.out.println("There is no such post by ID");
        }

    }

}
