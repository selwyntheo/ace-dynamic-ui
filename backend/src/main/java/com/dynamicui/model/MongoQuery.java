package com.dynamicui.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;

import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MongoQuery {
    @NotBlank
    private String collection;
    
    private Map<String, Object> filter;
    private Map<String, Object> projection;
    private Map<String, Object> sort;
    private Integer limit;
    private Integer skip;
    
    public MongoQuery() {}
    
    public MongoQuery(String collection, Map<String, Object> filter) {
        this.collection = collection;
        this.filter = filter;
    }
    
    // Getters and Setters
    public String getCollection() {
        return collection;
    }
    
    public void setCollection(String collection) {
        this.collection = collection;
    }
    
    public Map<String, Object> getFilter() {
        return filter;
    }
    
    public void setFilter(Map<String, Object> filter) {
        this.filter = filter;
    }
    
    public Map<String, Object> getProjection() {
        return projection;
    }
    
    public void setProjection(Map<String, Object> projection) {
        this.projection = projection;
    }
    
    public Map<String, Object> getSort() {
        return sort;
    }
    
    public void setSort(Map<String, Object> sort) {
        this.sort = sort;
    }
    
    public Integer getLimit() {
        return limit;
    }
    
    public void setLimit(Integer limit) {
        this.limit = limit;
    }
    
    public Integer getSkip() {
        return skip;
    }
    
    public void setSkip(Integer skip) {
        this.skip = skip;
    }
}
