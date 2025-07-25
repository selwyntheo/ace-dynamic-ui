package com.dynamicui.backend.service;

import com.dynamicui.backend.model.Page;
import com.dynamicui.backend.repository.PageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PageService {
    
    @Autowired
    private PageRepository pageRepository;
    
    public List<Page> getAllPages() {
        return pageRepository.findByOrderByUpdatedAtDesc();
    }
    
    public List<Page> getPublishedPages() {
        return pageRepository.findByIsPublished(true);
    }
    
    public Optional<Page> getPageById(String id) {
        return pageRepository.findById(id);
    }
    
    public Optional<Page> getPublishedPageById(String id) {
        return pageRepository.findByIdAndIsPublished(id, true);
    }
    
    public List<Page> searchPagesByName(String name) {
        return pageRepository.findByNameContainingIgnoreCase(name);
    }
    
    public Page savePage(Page page) {
        if (page.getId() == null) {
            // New page
            page.setCreatedAt(LocalDateTime.now());
        }
        page.preUpdate(); // Updates updatedAt
        return pageRepository.save(page);
    }
    
    public Page createPage(String name, String description) {
        Page page = new Page(name, description);
        return savePage(page);
    }
    
    public Optional<Page> updatePage(String id, Page updatedPage) {
        return pageRepository.findById(id)
            .map(existingPage -> {
                existingPage.setName(updatedPage.getName());
                existingPage.setDescription(updatedPage.getDescription());
                existingPage.setComponents(updatedPage.getComponents());
                existingPage.setLayout(updatedPage.getLayout());
                existingPage.setIsPublished(updatedPage.getIsPublished());
                return savePage(existingPage);
            });
    }
    
    public Optional<Page> publishPage(String id) {
        return pageRepository.findById(id)
            .map(page -> {
                page.setIsPublished(true);
                return savePage(page);
            });
    }
    
    public Optional<Page> unpublishPage(String id) {
        return pageRepository.findById(id)
            .map(page -> {
                page.setIsPublished(false);
                return savePage(page);
            });
    }
    
    public boolean deletePage(String id) {
        return pageRepository.findById(id)
            .map(page -> {
                pageRepository.delete(page);
                return true;
            })
            .orElse(false);
    }
    
    public List<Page> getPagesByComponentType(String componentType) {
        return pageRepository.findByComponentType(componentType);
    }
    
    public Page duplicatePage(String id, String newName) {
        return pageRepository.findById(id)
            .map(originalPage -> {
                Page duplicatedPage = new Page();
                duplicatedPage.setName(newName);
                duplicatedPage.setDescription("Copy of " + originalPage.getDescription());
                duplicatedPage.setComponents(originalPage.getComponents());
                duplicatedPage.setLayout(originalPage.getLayout());
                duplicatedPage.setIsPublished(false);
                return savePage(duplicatedPage);
            })
            .orElse(null);
    }
}
