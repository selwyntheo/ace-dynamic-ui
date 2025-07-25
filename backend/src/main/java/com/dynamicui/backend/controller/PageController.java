package com.dynamicui.backend.controller;

import com.dynamicui.backend.model.Page;
import com.dynamicui.backend.service.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pages")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PageController {
    
    @Autowired
    private PageService pageService;
    
    @GetMapping
    public ResponseEntity<List<Page>> getAllPages(
            @RequestParam(required = false) Boolean published,
            @RequestParam(required = false) String search) {
        
        List<Page> pages;
        
        if (search != null && !search.isEmpty()) {
            pages = pageService.searchPagesByName(search);
        } else if (published != null && published) {
            pages = pageService.getPublishedPages();
        } else {
            pages = pageService.getAllPages();
        }
        
        return ResponseEntity.ok(pages);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Page> getPageById(
            @PathVariable String id,
            @RequestParam(required = false) Boolean published) {
        
        if (published != null && published) {
            return pageService.getPublishedPageById(id)
                .map(page -> ResponseEntity.ok(page))
                .orElse(ResponseEntity.notFound().build());
        } else {
            return pageService.getPageById(id)
                .map(page -> ResponseEntity.ok(page))
                .orElse(ResponseEntity.notFound().build());
        }
    }
    
    @PostMapping
    public ResponseEntity<Page> createPage(@Valid @RequestBody Page page) {
        try {
            Page savedPage = pageService.savePage(page);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Page> updatePage(
            @PathVariable String id,
            @Valid @RequestBody Page updatedPage) {
        
        return pageService.updatePage(id, updatedPage)
            .map(page -> ResponseEntity.ok(page))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/{id}/publish")
    public ResponseEntity<Page> publishPage(@PathVariable String id) {
        return pageService.publishPage(id)
            .map(page -> ResponseEntity.ok(page))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/{id}/unpublish")
    public ResponseEntity<Page> unpublishPage(@PathVariable String id) {
        return pageService.unpublishPage(id)
            .map(page -> ResponseEntity.ok(page))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePage(@PathVariable String id) {
        if (pageService.deletePage(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/duplicate")
    public ResponseEntity<Page> duplicatePage(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        
        String newName = request.get("name");
        if (newName == null || newName.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Page duplicatedPage = pageService.duplicatePage(id, newName);
        if (duplicatedPage != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(duplicatedPage);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/by-component/{componentType}")
    public ResponseEntity<List<Page>> getPagesByComponentType(@PathVariable String componentType) {
        List<Page> pages = pageService.getPagesByComponentType(componentType);
        return ResponseEntity.ok(pages);
    }
}
