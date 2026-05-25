package com.devflow.intern.service;

import com.devflow.intern.model.RequestModel;
import com.devflow.intern.repository.RequestRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.CompletableFuture;

@Service
public class AllocationAsyncService {

    private final RequestRepository requestRepository;
    private final AllocationService allocationService;

    public AllocationAsyncService(RequestRepository requestRepository,
                                  AllocationService allocationService) {
        this.requestRepository = requestRepository;
        this.allocationService = allocationService;
    }

    @Async("taskExecutor")
    @Transactional
    public CompletableFuture<Void> generateLead(int index) {

        RequestModel request = new RequestModel();
        request.setName("Test User " + index);
        request.setPhone("9999" + System.currentTimeMillis() + index);
        request.setCity("EKM");

        String[] services = {"Service 1", "Service 2", "Service 3"};
        request.setService(services[index % 3]);
        request.setDescription("Concurrency test");

        RequestModel saved = requestRepository.save(request);

        allocationService.allocateLead(saved);

        return CompletableFuture.completedFuture(null);
    }
}