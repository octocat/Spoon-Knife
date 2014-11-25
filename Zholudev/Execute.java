
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Execute{

    public void startProgram() {


        Exceptions exceptions = new Exceptions();
        List<Post> ourPost = new ArrayList();
        boolean Exit = true;
        while (Exit) {
            Scanner reader = new Scanner(System.in);
            System.out.println("\n" + "\n" + "1 to add a post" + "\n" + "2 to show post by ID" + "\n" + "3 to remove post by ID" + "\n" + "9 to exit");
                int a = reader.nextInt();
                switch (a) {

                    case 1:
                        Scanner reader1 = new Scanner(System.in);
                        System.out.println("Enter your title");
                        String title = reader.next();
                        System.out.println("Enter your message");
                        String message = reader.next();
                        System.out.println("Please add a url address");
                        String url = reader.next();
                        System.out.println("Please add an img address");
                        String img = reader.next();
                        Post post = new Post(title, message, url, img);
                        ourPost.add(post);
                        break;
                    case 2:
                       try {
                            System.out.println("Please enter post id");
                            Scanner reader2 = new Scanner(System.in);
                            int id = reader.nextInt();
                            Post infoPost = (Post) ourPost.get(id);
                            System.out.println("Title: " + infoPost.getTitle());
                            System.out.println("Message: " + infoPost.getMessage());
                            System.out.println("Url: " + infoPost.getUrl());
                            System.out.println("Img: " + infoPost.getImg());
                        } catch (IndexOutOfBoundsException rtv) {
                            System.out.println("There is no such post by ID");
                        } finally {
                           break;
                       }
                    case 3:
                        try {
                            System.out.println("Enter the post ID to remove");
                            int ids = reader.nextInt();
                            ourPost.remove(ids);
                        } catch (IndexOutOfBoundsException rtv) {
                            System.out.println("There is no such post by ID");
                        } finally {
                            break;
                        }
                    case 9:
                        Exit = false;
                        System.out.println("Thanks");
                        break;
                }


            }

        }
    }



