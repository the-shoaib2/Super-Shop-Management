package com.server.config;
import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableMongoRepositories(basePackages = "com.admin.repository")
public class DatabaseConfig extends AbstractMongoClientConfiguration {

    @Value("${DATABASE_URI}")
    private String mongodbUri;

    @Value("${DATABASE_NAME}")
    private String databaseName;

    @Override
    protected String getDatabaseName() {
        try{
            if (databaseName == null) {
                throw new IllegalStateException("Database name must not be null");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return databaseName;
    }
    
    @Override
    protected MongoClientSettings mongoClientSettings() {
        try {
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
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
} 