package com.dynamicui.repository;

import com.dynamicui.model.Dataset;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DatasetRepository extends MongoRepository<Dataset, String> {
    List<Dataset> findByNameContainingIgnoreCase(String name);
    
    @Query("{ 'name' : { $regex: ?0, $options: 'i' } }")
    List<Dataset> findByNameRegex(String name);
}
