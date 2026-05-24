package com.devflow.intern.controllers;

import com.devflow.intern.model.LeadModel;
import com.devflow.intern.model.ProviderModel;
import com.devflow.intern.repository.AllocationStateRepository;
import com.devflow.intern.repository.LeadRepository;
import com.devflow.intern.repository.ProviderRepository;
import com.devflow.intern.repository.RequestRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/dashboard")

public class Dashboard {
    private final RequestRepository requestRepository;
    private final ProviderRepository providerRepository;
    private final LeadRepository leadRepository;
    private final AllocationStateRepository allocationStateRepository;
    public Dashboard(AllocationStateRepository allocationStateRepository, LeadRepository leadRepository, RequestRepository requestRepository, ProviderRepository providerRepository){
        this.providerRepository = providerRepository;
        this.allocationStateRepository = allocationStateRepository;
        this.requestRepository = requestRepository;
        this.leadRepository = leadRepository;
    }
    @PostMapping
    public List<Map<String,Object>> dashBoard(){
            List<Map<String,Object>> response = new ArrayList<>(); // List for returning the responses;
            List<ProviderModel> p = providerRepository.findAll(); // findal provider models therum as a list of provider object full provider tehrum
            for(ProviderModel provider: p){ // loop for finding the stuffs about each provider
                List<LeadModel> leads = leadRepository.findByProvider(provider);  // leads stuffs about the provider list therum
                Map<String,Object> data = new HashMap<>(); //new hasmap fro adding data
                data.put("provider",provider);
                data.put("remainingQuota", Math.max(0, 10 - provider.getQuota()));
                data.put("leadCount",leads.size());
                data.put("assignedLeads",leads);
                response.add(data);
            }
            return response;
    }
}
