package com.dynamicui.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "pages")
public class Page {
    @Id
    private String id;

    @Field("name")
    private String name;

    @Field("description")
    private String description;

    @Field("components")
    private List<UIComponent> components;

    @Field("layout")
    private LayoutOptions layout;

    @Field("is_published")
    private Boolean isPublished = false;

    @Field("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Field("updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructors
    public Page() {}

    public Page(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<UIComponent> getComponents() { return components; }
    public void setComponents(List<UIComponent> components) { this.components = components; }

    public LayoutOptions getLayout() { return layout; }
    public void setLayout(LayoutOptions layout) { this.layout = layout; }

    public Boolean getIsPublished() { return isPublished; }
    public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public static class UIComponent {
        private String id;
        private String type;
        private String name;
        private Map<String, String> properties;
        private Integer xPosition;
        private Integer yPosition;
        private Integer width;
        private Integer height;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        // Constructors
        public UIComponent() {}

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public Map<String, String> getProperties() { return properties; }
        public void setProperties(Map<String, String> properties) { this.properties = properties; }

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

    public static class LayoutOptions {
        private String type;
        private Integer sidebarWidth;
        private Integer columnCount;
        private Integer spacing;
        private Boolean showHeader;
        private Boolean showFooter;

        // Constructors
        public LayoutOptions() {}

        // Getters and Setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public Integer getSidebarWidth() { return sidebarWidth; }
        public void setSidebarWidth(Integer sidebarWidth) { this.sidebarWidth = sidebarWidth; }

        public Integer getColumnCount() { return columnCount; }
        public void setColumnCount(Integer columnCount) { this.columnCount = columnCount; }

        public Integer getSpacing() { return spacing; }
        public void setSpacing(Integer spacing) { this.spacing = spacing; }

        public Boolean getShowHeader() { return showHeader; }
        public void setShowHeader(Boolean showHeader) { this.showHeader = showHeader; }

        public Boolean getShowFooter() { return showFooter; }
        public void setShowFooter(Boolean showFooter) { this.showFooter = showFooter; }
    }
}
