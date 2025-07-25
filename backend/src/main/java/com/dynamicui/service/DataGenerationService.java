package com.dynamicui.service;

import com.dynamicui.model.Dataset;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DataGenerationService {

    private final Random random = new Random();
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public List<Map<String, Object>> generateDataForDataset(Dataset dataset, int rowCount) {
        List<Map<String, Object>> data = new ArrayList<>();
        Map<String, String> columns = dataset.getColumns();

        for (int i = 1; i <= rowCount; i++) {
            Map<String, Object> row = new HashMap<>();
            
            for (Map.Entry<String, String> column : columns.entrySet()) {
                String columnName = column.getKey();
                String columnType = column.getValue();
                
                row.put(columnName, generateValueForType(columnType, i, columnName, dataset.getName()));
            }
            
            data.add(row);
        }

        return data;
    }

    private Object generateValueForType(String type, int rowIndex, String columnName, String datasetName) {
        switch (type.toLowerCase()) {
            case "number":
                if (columnName.toLowerCase().contains("id")) {
                    return rowIndex;
                } else if (columnName.toLowerCase().contains("price")) {
                    return Math.round((random.nextDouble() * 1000 + 10) * 100.0) / 100.0;
                } else if (columnName.toLowerCase().contains("age")) {
                    return random.nextInt(70) + 18;
                } else if (columnName.toLowerCase().contains("quantity") || columnName.toLowerCase().contains("stock")) {
                    return random.nextInt(100) + 1;
                } else {
                    return random.nextInt(1000) + 1;
                }

            case "string":
                if (columnName.toLowerCase().contains("name")) {
                    return generateName(rowIndex);
                } else if (columnName.toLowerCase().contains("email")) {
                    return generateEmail(rowIndex);
                } else if (columnName.toLowerCase().contains("category")) {
                    return generateCategory();
                } else if (columnName.toLowerCase().contains("status")) {
                    return generateStatus();
                } else if (columnName.toLowerCase().contains("title")) {
                    return generateTitle(rowIndex);
                } else {
                    return "Sample " + columnName + " " + rowIndex;
                }

            case "boolean":
                return random.nextBoolean();

            case "date":
                LocalDateTime baseDate = LocalDateTime.now().minusDays(random.nextInt(365));
                return baseDate.format(dateFormatter);

            default:
                return "Unknown type: " + type;
        }
    }

    private String generateName(int index) {
        String[] firstNames = {"John", "Jane", "Mike", "Sarah", "David", "Emma", "Chris", "Lisa", "Tom", "Anna"};
        String[] lastNames = {"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Moore"};
        
        return firstNames[index % firstNames.length] + " " + lastNames[(index * 3) % lastNames.length];
    }

    private String generateEmail(int index) {
        String name = generateName(index).toLowerCase().replace(" ", ".");
        String[] domains = {"email.com", "test.org", "sample.net", "demo.io"};
        return name + "@" + domains[index % domains.length];
    }

    private String generateCategory() {
        String[] categories = {"Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Toys", "Food", "Beauty"};
        return categories[random.nextInt(categories.length)];
    }

    private String generateStatus() {
        String[] statuses = {"Active", "Inactive", "Pending", "Completed", "Draft", "Published"};
        return statuses[random.nextInt(statuses.length)];
    }

    private String generateTitle(int index) {
        String[] titles = {
            "Product Title", "Sample Item", "Demo Product", "Test Article", 
            "Example Entry", "Sample Record", "Demo Item", "Test Product"
        };
        return titles[index % titles.length] + " #" + index;
    }
}
