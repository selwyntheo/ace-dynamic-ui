package com.dynamicui.controller;

import com.dynamicui.model.UIComponent;
import com.dynamicui.repository.UIComponentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/components")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class UIComponentController {

    @Autowired
    private UIComponentRepository componentRepository;

    @GetMapping
    public List<UIComponent> getAllComponents() {
        return componentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UIComponent> getComponentById(@PathVariable String id) {
        Optional<UIComponent> component = componentRepository.findById(id);
        return component.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/dataset/{datasetId}")
    public List<UIComponent> getComponentsByDataset(@PathVariable String datasetId) {
        return componentRepository.findByDatasetId(datasetId);
    }

    @GetMapping("/type/{type}")
    public List<UIComponent> getComponentsByType(@PathVariable String type) {
        return componentRepository.findByType(type);
    }

    @PostMapping
    public UIComponent createComponent(@RequestBody UIComponent component) {
        component.onCreate(); // Set timestamps
        return componentRepository.save(component);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UIComponent> updateComponent(@PathVariable String id, @RequestBody UIComponent componentDetails) {
        Optional<UIComponent> optionalComponent = componentRepository.findById(id);
        
        if (optionalComponent.isPresent()) {
            UIComponent component = optionalComponent.get();
            component.setType(componentDetails.getType());
            component.setName(componentDetails.getName());
            component.setProperties(componentDetails.getProperties());
            component.setDataset(componentDetails.getDataset());
            component.setDatasetId(componentDetails.getDatasetId());
            component.setXPosition(componentDetails.getXPosition());
            component.setYPosition(componentDetails.getYPosition());
            component.setWidth(componentDetails.getWidth());
            component.setHeight(componentDetails.getHeight());
            component.onUpdate(); // Update timestamp
            return ResponseEntity.ok(componentRepository.save(component));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComponent(@PathVariable String id) {
        return componentRepository.findById(id)
                .map(component -> {
                    componentRepository.delete(component);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
