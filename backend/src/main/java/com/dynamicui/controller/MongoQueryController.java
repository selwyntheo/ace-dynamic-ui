package com.dynamicui.controller;

import com.dynamicui.model.MongoQuery;
import com.dynamicui.service.MongoQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mongo")
@CrossOrigin(origins = "*")
public class MongoQueryController {

    @Autowired
    private MongoQueryService mongoQueryService;

    @PostMapping("/query")
    public ResponseEntity<Map<String, Object>> executeQuery(@RequestBody MongoQuery query) {
        try {
            List<Map<String, Object>> results = mongoQueryService.executeQuery(query);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", results,
                "count", results.size(),
                "query", query
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage(),
                "query", query
            ));
        }
    }

    @GetMapping("/collections")
    public ResponseEntity<Map<String, Object>> getCollections() {
        try {
            List<String> collections = mongoQueryService.getAvailableCollections();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "collections", collections
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/query/validate")
    public ResponseEntity<Map<String, Object>> validateQuery(@RequestBody MongoQuery query) {
        try {
            // Basic validation
            if (query.getCollection() == null || query.getCollection().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Collection name is required"
                ));
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Query is valid",
                "query", query
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}
