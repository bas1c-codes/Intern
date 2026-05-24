package com.devflow.intern.controllers;

import com.devflow.intern.model.RequestModel;
import com.devflow.intern.repository.RequestRepository;
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
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/test-tools")
public class TestTool {

    private final RequestRepository requestRepository;
    private final AllocationService allocationService;

    public TestTool(
            RequestRepository requestRepository,
            AllocationService allocationService
    ) {
        this.requestRepository = requestRepository;
        this.allocationService = allocationService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generate() {

        List<CompletableFuture<Void>> futures =
                new ArrayList<>();

        for (int i = 0; i < 10; i++) {

            int index = i;

            CompletableFuture<Void> future =
                    CompletableFuture.runAsync(() -> {

                        RequestModel request =
                                new RequestModel();

                        request.setName(
                                "Test User " + index
                        );

                        request.setPhone(
                                (int)(Math.random() * 1000000)
                        );

                        request.setCity("EKM");

                        String[] services = {
                                "Service 1",
                                "Service 2",
                                "Service 3"
                        };

                        request.setService(
                                services[index % 3]
                        );

                        request.setDescription(
                                "Concurrency test"
                        );

                        RequestModel saved =
                                requestRepository.save(request);

                        allocationService.allocateLead(saved);
                    });

            futures.add(future);
        }

        CompletableFuture.allOf(
                futures.toArray(new CompletableFuture[0])
        ).join();

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "10 leads generated"
                )
        );
    }
}
