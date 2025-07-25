package com.dynamicui.backend.repository;

import com.dynamicui.backend.model.Page;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageRepository extends MongoRepository<Page, String> {
    
    List<Page> findByNameContainingIgnoreCase(String name);
    
    List<Page> findByIsPublished(Boolean isPublished);
    
    @Query("{ 'name' : { $regex: ?0, $options: 'i' } }")
    List<Page> findByNameRegex(String namePattern);
    
    Optional<Page> findByIdAndIsPublished(String id, Boolean isPublished);
    
    List<Page> findByOrderByUpdatedAtDesc();
    
    List<Page> findByOrderByCreatedAtDesc();
    
    @Query("{ 'components.type' : ?0 }")
    List<Page> findByComponentType(String componentType);
}
