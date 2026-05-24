package com.devflow.intern.controllers;

import com.devflow.intern.model.RequestModel;
import com.devflow.intern.repository.RequestRepository;
import com.devflow.intern.service.AllocationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/request-service")
public class RequestServiceController {
    private final RequestRepository requestRepository;
    private final AllocationService allocationService;
    public RequestServiceController(RequestRepository requestRepository,AllocationService allocationService) {
        this.requestRepository = requestRepository;
        this.allocationService = allocationService;
    }
    @PostMapping
    public ResponseEntity<?> processRequest(@RequestBody RequestModel body){
            boolean exists = requestRepository.existsByPhoneAndService(
                    body.getPhone(), body.getService()
            );
        if (exists) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Duplicate lead for same service");
        }
        RequestModel model = requestRepository.save(body);
        allocationService.allocateLead(model);
        return ResponseEntity
                .status(HttpStatus.OK).body(model);
    }
}
