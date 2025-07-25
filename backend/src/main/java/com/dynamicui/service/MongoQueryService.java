package com.dynamicui.service;

import com.dynamicui.model.MongoQuery;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MongoQueryService {

    @Autowired(required = false)
    private MongoClient mongoClient;

    private static final String DEFAULT_DATABASE = "dynamicui";

    public List<Map<String, Object>> executeQuery(MongoQuery query) {
        if (mongoClient == null) {
            // Return sample data if MongoDB is not configured
            return getSampleData(query.getCollection());
        }

        try {
            MongoDatabase database = mongoClient.getDatabase(DEFAULT_DATABASE);
            MongoCollection<Document> collection = database.getCollection(query.getCollection());

            // Check if collection exists and has documents
            long documentCount = collection.countDocuments();
            if (documentCount == 0) {
                // Return sample data if collection is empty
                return getSampleData(query.getCollection());
            }

            var findIterable = collection.find();

            // Apply filter
            if (query.getFilter() != null && !query.getFilter().isEmpty()) {
                Document filterDoc = new Document(query.getFilter());
                findIterable = findIterable.filter(filterDoc);
            }

            // Apply projection
            if (query.getProjection() != null && !query.getProjection().isEmpty()) {
                Document projectionDoc = new Document(query.getProjection());
                findIterable = findIterable.projection(projectionDoc);
            }

            // Apply sort
            if (query.getSort() != null && !query.getSort().isEmpty()) {
                Document sortDoc = new Document(query.getSort());
                findIterable = findIterable.sort(sortDoc);
            }

            // Apply skip
            if (query.getSkip() != null && query.getSkip() > 0) {
                findIterable = findIterable.skip(query.getSkip());
            }

            // Apply limit
            if (query.getLimit() != null && query.getLimit() > 0) {
                findIterable = findIterable.limit(query.getLimit());
            }

            List<Map<String, Object>> results = new ArrayList<>();
            for (Document doc : findIterable) {
                results.add(doc);
            }

            return results;
        } catch (Exception e) {
            throw new RuntimeException("Error executing MongoDB query: " + e.getMessage(), e);
        }
    }

    private List<Map<String, Object>> getSampleData(String collection) {
        // Return sample data based on collection name for demo purposes
        List<Map<String, Object>> sampleData = new ArrayList<>();
        
        switch (collection.toLowerCase()) {
            case "users":
                sampleData.add(Map.of(
                    "_id", "1",
                    "name", "John Doe",
                    "email", "john@example.com",
                    "age", 30,
                    "department", "Engineering"
                ));
                sampleData.add(Map.of(
                    "_id", "2",
                    "name", "Jane Smith",
                    "email", "jane@example.com",
                    "age", 28,
                    "department", "Design"
                ));
                sampleData.add(Map.of(
                    "_id", "3",
                    "name", "Bob Johnson",
                    "email", "bob@example.com",
                    "age", 35,
                    "department", "Marketing"
                ));
                break;
            case "orders":
                sampleData.add(Map.of(
                    "_id", "order1",
                    "customerId", "1",
                    "product", "Laptop",
                    "quantity", 2,
                    "price", 1200.00,
                    "status", "completed"
                ));
                sampleData.add(Map.of(
                    "_id", "order2",
                    "customerId", "2",
                    "product", "Mouse",
                    "quantity", 1,
                    "price", 25.99,
                    "status", "pending"
                ));
                break;
            case "products":
                sampleData.add(Map.of(
                    "_id", "prod1",
                    "name", "MacBook Pro",
                    "category", "Electronics",
                    "price", 2499.99,
                    "inStock", true,
                    "rating", 4.8
                ));
                sampleData.add(Map.of(
                    "_id", "prod2",
                    "name", "iPhone 15",
                    "category", "Electronics",
                    "price", 999.99,
                    "inStock", false,
                    "rating", 4.7
                ));
                break;
            default:
                sampleData.add(Map.of(
                    "_id", "sample1",
                    "collection", collection,
                    "message", "Sample data for " + collection,
                    "timestamp", System.currentTimeMillis()
                ));
        }
        
        return sampleData;
    }

    public List<String> getAvailableCollections() {
        if (mongoClient == null) {
            return List.of("users", "orders", "products", "inventory", "analytics");
        }

        try {
            MongoDatabase database = mongoClient.getDatabase(DEFAULT_DATABASE);
            List<String> collections = new ArrayList<>();
            for (String name : database.listCollectionNames()) {
                collections.add(name);
            }
            
            // If no collections exist, return sample collections
            if (collections.isEmpty()) {
                return List.of("users", "orders", "products", "inventory", "analytics");
            }
            
            return collections;
        } catch (Exception e) {
            return List.of("users", "orders", "products"); // Fallback
        }
    }
}
