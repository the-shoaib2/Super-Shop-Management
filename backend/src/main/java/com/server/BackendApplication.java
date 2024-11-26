package com.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {
    "com.server.controller",
    "com.server.service",
    "com.server.service.base",
    "com.server.service.store.settings",
    "com.server.config",
    "com.server.admin",
    "com.server.exception",
    "com.server.model.store.products"
})
@EnableMongoRepositories(basePackages = "com.server.repository")
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
