
public class Post {

    private String title;
    private String message;
    private String url;
    private String img;

    Post(String title,
         String message,
         String url,
         String img)
    {
        this.title = title;
        this.message = message;
        this.url = url;
        this.img = img;
    }

    public String getTitle(){
        return title;
    }
    public String getMessage(){
        return message;
    }
    public String getUrl(){
        return url;
    }
    public String getImg(){
        return img;
    }


    }

