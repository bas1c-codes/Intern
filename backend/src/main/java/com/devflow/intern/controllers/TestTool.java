package com.devflow.intern.controllers;

import com.devflow.intern.model.RequestModel;
import com.devflow.intern.repository.RequestRepository;
import com.devflow.intern.service.AllocationAsyncService;
import com.devflow.intern.service.AllocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/test-tools")
@CrossOrigin("*")
public class TestTool {

    private final AllocationAsyncService asyncService;

    public TestTool(AllocationAsyncService asyncService) {
        this.asyncService = asyncService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generate() {

        List<CompletableFuture<Void>> futures = new ArrayList<>();

        for (int i = 0; i < 10; i++) {
            int index = i;
            futures.add(asyncService.generateLead(index));
        }

        CompletableFuture.allOf(
                futures.toArray(new CompletableFuture[0])
        ).join();

        return ResponseEntity.ok(
                Map.of("message", "10 leads generated")
        );
    }
}
