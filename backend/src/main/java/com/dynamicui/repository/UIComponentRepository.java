package com.dynamicui.repository;

import com.dynamicui.model.UIComponent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UIComponentRepository extends MongoRepository<UIComponent, String> {
    List<UIComponent> findByDatasetId(String datasetId);
    List<UIComponent> findByType(String type);
    
    @Query("{ 'dataset.$id' : ?0 }")
    List<UIComponent> findByDatasetReference(String datasetId);
}
