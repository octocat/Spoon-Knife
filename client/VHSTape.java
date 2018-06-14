package client;

public class VHSTape{
    private String title;
    private String Description;

    public DVD() {
        super();
    }
   
    public String getTitle() {
         return title;  
    }

    public void putTitle(String title) {
        this.title = title;
    }

    //this is an addition I made after an initial clone of the repo
    public String getDescription() {
	return Description;
    }

    public void putDescription(String Description) {
	this.Description = Description;
    }
}
