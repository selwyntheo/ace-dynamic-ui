package com.dynamicui.config;

import com.dynamicui.model.Dataset;
import com.dynamicui.model.UIComponent;
import com.dynamicui.repository.DatasetRepository;
import com.dynamicui.repository.UIComponentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DatasetRepository datasetRepository;

    @Autowired
    private UIComponentRepository componentRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create sample datasets
        Map<String, String> userColumns = new HashMap<>();
        userColumns.put("id", "number");
        userColumns.put("name", "string");
        userColumns.put("email", "string");
        userColumns.put("createdAt", "date");

        Dataset userDataset = new Dataset("Users", "User management dataset", userColumns);
        userDataset = datasetRepository.save(userDataset);

        Map<String, String> productColumns = new HashMap<>();
        productColumns.put("id", "number");
        productColumns.put("name", "string");
        productColumns.put("price", "number");
        productColumns.put("category", "string");
        productColumns.put("inStock", "boolean");

        Dataset productDataset = new Dataset("Products", "Product catalog dataset", productColumns);
        productDataset = datasetRepository.save(productDataset);

        // Create sample UI components
        Map<String, Object> tableProps = new HashMap<>();
        tableProps.put("showPagination", "true");
        tableProps.put("showSearch", "true");
        tableProps.put("pageSize", "10");

        UIComponent userTable = new UIComponent("table", "User Table", tableProps);
        userTable.setDataset(userDataset);
        userTable.setXPosition(0);
        userTable.setYPosition(0);
        userTable.setWidth(800);
        userTable.setHeight(400);
        userTable.onCreate();
        componentRepository.save(userTable);

        Map<String, Object> buttonProps = new HashMap<>();
        buttonProps.put("style", "primary");
        buttonProps.put("size", "medium");

        UIComponent addUserButton = new UIComponent("button", "Add User", buttonProps);
        addUserButton.setXPosition(0);
        addUserButton.setYPosition(420);
        addUserButton.setWidth(120);
        addUserButton.setHeight(40);
        addUserButton.onCreate();
        componentRepository.save(addUserButton);
    }
}
