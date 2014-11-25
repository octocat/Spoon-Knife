
public class Comments extends Post {

    private String commentUser;

    public Comments(String title, String message, String url, String img, String commentUser) {
        super(title, message, url, img);
        this.commentUser = commentUser;
    }

    public void setCommentUser(String commentUser) {
        this.commentUser = commentUser;
    }

    public String getCommentUser() {
        return commentUser;
    }
}
