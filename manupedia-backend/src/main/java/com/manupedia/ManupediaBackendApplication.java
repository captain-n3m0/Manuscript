package com.manupedia;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ManupediaBackendApplication {

    public static void main(String[] args) {
        System.out.println("Starting Manupedia Backend Application...");
        SpringApplication.run(ManupediaBackendApplication.class, args);
        System.out.println("Manupedia Backend Application started successfully!");
    }
}
