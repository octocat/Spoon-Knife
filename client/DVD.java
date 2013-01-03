package client;

public final class DVD{
    private final String title;

    public DVD(final String title) {
       this("untitled");	
    }
    public DVD(final String title) {
        super();
        this.title = title;
    }
   
    public String getTitle() {
         return title;  
    }
    public void setTitle(String title) {
        if (! this.title.equals("untitled")) {
            throw new IllegalStateException("Can't change the title of a titled DVD");
        }
        this.title = title;
    }
}
