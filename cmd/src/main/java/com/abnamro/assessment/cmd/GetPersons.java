package com.abnamro.assessment.cmd;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.logging.Logger;

/**
 * It is a simple client to get list of Persons from a service
 * TODO: Error/Exception handling/messaging can be improved if necessary
 *
 * Usage:
 *      mvn exec:java -Dexec.mainClass="com.abnamro.assessment.cmd.GetPersons"
 *      or
 *      mvn exec:java -Dexec.mainClass="com.abnamro.assessment.cmd.GetPersons" -Dexec.args="http://localhost:8080/persons"
 */
public class GetPersons {

    private static final Logger LOGGER = Logger.getLogger(GetPersons.class.getName());
    private static final String defaultURL = "http://localhost:8080/persons";

    public static void main( String[] args ) throws Exception{
        LOGGER.info( "--- Get Persons ---");

        String srvUrl = args.length > 0 ? args[0] : defaultURL;
        LOGGER.info(String.format("Used URL: [%s]", srvUrl));

        URL url = new URL(srvUrl);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("GET");
        con.setRequestProperty("Content-Type", "application/json");
        con.setConnectTimeout(2000);
        con.setReadTimeout(2000);

        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        String response;
        StringBuffer content = new StringBuffer();
        while ((response = in.readLine()) != null) {
            content.append(response);
        }
        LOGGER.info(content.toString());
        in.close();
        con.disconnect();

        LOGGER.info("--- Done ---");
    }
}
