package com.dynamicui.config;

import com.dynamicui.model.Dataset;
import com.dynamicui.repository.DatasetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class MongoDataInitializer implements CommandLineRunner {

    @Autowired
    private DatasetRepository datasetRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if we have any datasets, if not create sample data
        if (datasetRepository.count() == 0) {
            createSampleDatasets();
        }
    }

    private void createSampleDatasets() {
        // Create Users dataset
        Map<String, String> userColumns = new HashMap<>();
        userColumns.put("id", "number");
        userColumns.put("name", "string");
        userColumns.put("email", "string");
        userColumns.put("age", "number");
        userColumns.put("status", "string");
        userColumns.put("created_date", "date");

        Dataset usersDataset = new Dataset("Users", "User management dataset", userColumns);
        usersDataset.onCreate();
        datasetRepository.save(usersDataset);

        // Create Products dataset
        Map<String, String> productColumns = new HashMap<>();
        productColumns.put("id", "number");
        productColumns.put("name", "string");
        productColumns.put("description", "string");
        productColumns.put("price", "number");
        productColumns.put("category", "string");
        productColumns.put("stock_quantity", "number");
        productColumns.put("is_active", "boolean");

        Dataset productsDataset = new Dataset("Products", "Product catalog dataset", productColumns);
        productsDataset.onCreate();
        datasetRepository.save(productsDataset);

        // Create Orders dataset
        Map<String, String> orderColumns = new HashMap<>();
        orderColumns.put("id", "number");
        orderColumns.put("customer_name", "string");
        orderColumns.put("product_name", "string");
        orderColumns.put("quantity", "number");
        orderColumns.put("total_amount", "number");
        orderColumns.put("order_date", "date");
        orderColumns.put("status", "string");

        Dataset ordersDataset = new Dataset("Orders", "Customer orders dataset", orderColumns);
        ordersDataset.onCreate();
        datasetRepository.save(ordersDataset);

        System.out.println("Sample datasets created successfully!");
    }
}
