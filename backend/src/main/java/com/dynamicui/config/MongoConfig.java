package com.dynamicui.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MongoConfig {

    @Value("${spring.data.mongodb.uri:mongodb://localhost:27017}")
    private String mongoUri;

    @Bean
    @ConditionalOnProperty(name = "mongodb.enabled", havingValue = "true", matchIfMissing = false)
    public MongoClient mongoClient() {
        try {
            return MongoClients.create(mongoUri);
        } catch (Exception e) {
            // If MongoDB connection fails, return null - service will use sample data
            System.out.println("MongoDB connection failed, using sample data: " + e.getMessage());
            return null;
        }
    }
}
