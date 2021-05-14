package com.abnamro.assessment.cmd.utils;

public class Utils {
    private final static String template = "{\"name\": \"%s\",\"birthDate\": \"%s\"}";

    public static String createJsonBody(final String firstname, final String birthdate){
        return String.format(template, firstname, birthdate);
    }
}