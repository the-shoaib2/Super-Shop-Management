package com.server.config;
import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import java.util.concurrent.TimeUnit;
import org.springframework.lang.NonNull;

@Configuration
@EnableMongoRepositories(basePackages = "com.admin.repository")
public class DatabaseConfig extends AbstractMongoClientConfiguration {

    @Value("${DATABASE_URI}")
    private String mongodbUri;

    @Value("${DATABASE_NAME}")
    private String databaseName;

    @Override
    @NonNull
    protected String getDatabaseName() {
        if (databaseName == null) {
            throw new IllegalStateException("Database name must not be null");
        }
        return databaseName;
    }
    
    @Override
    @NonNull
    protected MongoClientSettings mongoClientSettings() {
        if (mongodbUri == null) {
            throw new IllegalStateException("MongoDB URI must not be null");
        }
        ConnectionString connectionString = new ConnectionString(mongodbUri);
        
        return MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .applyToConnectionPoolSettings(builder -> 
                    builder.maxConnectionIdleTime(30, TimeUnit.SECONDS)
                           .maxSize(50)
                           .minSize(5)
                           .maxWaitTime(2000, TimeUnit.MILLISECONDS)
                )
                .applyToSocketSettings(builder ->
                    builder.connectTimeout(2000, TimeUnit.MILLISECONDS)
                           .readTimeout(2000, TimeUnit.MILLISECONDS)
                )
                .applyToServerSettings(builder ->
                    builder.heartbeatFrequency(10000, TimeUnit.MILLISECONDS)
                           .minHeartbeatFrequency(500, TimeUnit.MILLISECONDS)
                )
                .build();
    }
} 