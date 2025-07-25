package com.dynamicui.controller;

import com.dynamicui.model.Dataset;
import com.dynamicui.repository.DatasetRepository;
import com.dynamicui.service.DataGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/datasets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class DatasetController {

    @Autowired
    private DatasetRepository datasetRepository;

    @Autowired
    private DataGenerationService dataGenerationService;

    @GetMapping
    public List<Dataset> getAllDatasets() {
        return datasetRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dataset> getDatasetById(@PathVariable String id) {
        Optional<Dataset> dataset = datasetRepository.findById(id);
        return dataset.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Dataset createDataset(@RequestBody Dataset dataset) {
        dataset.onCreate(); // Set timestamps
        return datasetRepository.save(dataset);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dataset> updateDataset(@PathVariable String id, @RequestBody Dataset datasetDetails) {
        Optional<Dataset> optionalDataset = datasetRepository.findById(id);
        
        if (optionalDataset.isPresent()) {
            Dataset dataset = optionalDataset.get();
            dataset.setName(datasetDetails.getName());
            dataset.setDescription(datasetDetails.getDescription());
            dataset.setColumns(datasetDetails.getColumns());
            dataset.onUpdate(); // Update timestamp
            return ResponseEntity.ok(datasetRepository.save(dataset));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDataset(@PathVariable String id) {
        return datasetRepository.findById(id)
                .map(dataset -> {
                    datasetRepository.delete(dataset);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Dataset> searchDatasets(@RequestParam String name) {
        return datasetRepository.findByNameContainingIgnoreCase(name);
    }

    @GetMapping("/{id}/data")
    public ResponseEntity<List<Map<String, Object>>> getDatasetData(
            @PathVariable String id,
            @RequestParam(defaultValue = "50") int limit) {
        Optional<Dataset> dataset = datasetRepository.findById(id);
        if (dataset.isPresent()) {
            List<Map<String, Object>> data = dataGenerationService.generateDataForDataset(dataset.get(), limit);
            return ResponseEntity.ok(data);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
