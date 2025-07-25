package com.dynamicui.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.DBRef;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "ui_components")
@JsonIgnoreProperties(ignoreUnknown = true)
public class UIComponent {
    @Id
    private String id;

    @NotBlank
    @Field("type")
    private String type; // table, form, chart, text, button, etc.

    @Field("name")
    private String name;

    @Field("properties")
    private Map<String, Object> properties;

    @DBRef
    @Field("dataset")
    private Dataset dataset;

    @Field("dataset_id")
    private String datasetId; // For cases where we just need the ID

    @Field("x_position")
    private Integer xPosition;

    @Field("y_position")
    private Integer yPosition;

    @Field("width")
    private Integer width;

    @Field("height")
    private Integer height;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public UIComponent() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public UIComponent(String type, String name, Map<String, Object> properties) {
        this();
        this.type = type;
        this.name = name;
        this.properties = properties;
    }

    // Methods for timestamp management
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Map<String, Object> getProperties() { return properties; }
    public void setProperties(Map<String, Object> properties) { this.properties = properties; }

    public Dataset getDataset() { return dataset; }
    public void setDataset(Dataset dataset) { this.dataset = dataset; }

    public String getDatasetId() { return datasetId; }
    public void setDatasetId(String datasetId) { this.datasetId = datasetId; }

    public Integer getXPosition() { return xPosition; }
    public void setXPosition(Integer xPosition) { this.xPosition = xPosition; }

    public Integer getYPosition() { return yPosition; }
    public void setYPosition(Integer yPosition) { this.yPosition = yPosition; }

    public Integer getWidth() { return width; }
    public void setWidth(Integer width) { this.width = width; }

    public Integer getHeight() { return height; }
    public void setHeight(Integer height) { this.height = height; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
