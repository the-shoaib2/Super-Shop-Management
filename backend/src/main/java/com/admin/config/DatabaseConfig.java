package com.admin.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.lang.NonNull;
import org.springframework.beans.factory.annotation.Value;
import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;

@Configuration
@EnableMongoRepositories(basePackages = "com.admin.repository")
public class DatabaseConfig extends AbstractMongoClientConfiguration {

    @Value("${DATABASE_URI}")
    private String DATABASE_URI;

    @Override
    @NonNull
    protected String getDatabaseName() {
        return "SUPERSHOP";
    }

    @Override
    @NonNull
    protected com.mongodb.MongoClientSettings mongoClientSettings() {
        return MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(DATABASE_URI))
                .build();
    }
} 