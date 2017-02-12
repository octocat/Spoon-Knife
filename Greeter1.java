class Greeter {
    public Greeter(String name) {
        this.name = name;
    }
    public String sayHello() {
        return String.format("%s %s ","Hello ",name);
    }
    private String name;
}