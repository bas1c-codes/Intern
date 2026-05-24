package com.devflow.intern.service;

import com.devflow.intern.exceptions.NoLeads;
import com.devflow.intern.model.AllocationState;
import com.devflow.intern.model.LeadModel;
import com.devflow.intern.model.ProviderModel;
import com.devflow.intern.model.RequestModel;
import com.devflow.intern.repository.AllocationStateRepository;
import com.devflow.intern.repository.LeadRepository;
import com.devflow.intern.repository.ProviderRepository;
import com.devflow.intern.repository.RequestRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.*;
@Service
public class AllocationService {
    private final RequestRepository requestRepository;
    private final ProviderRepository providerRepository;
    private final LeadRepository leadRepository;
    private final AllocationStateRepository allocationStateRepository;
    public AllocationService(AllocationStateRepository allocationStateRepository, LeadRepository leadRepository, RequestRepository requestRepository, ProviderRepository providerRepository){
        this.providerRepository = providerRepository;
        this.allocationStateRepository = allocationStateRepository;
        this.requestRepository = requestRepository;
        this.leadRepository = leadRepository;
    }
    @Transactional
    public void allocateLead(RequestModel request){
        String service = request.getService();
        List<Integer> mandatory = new ArrayList<>();
        if (service.equals("Service 1")) {
            mandatory.add(1);
        }
        else if (service.equals("Service 2")) {
            mandatory.add(5);
        }
        else if (service.equals("Service 3")) {
            mandatory.add(1);
            mandatory.add(4);
        }
        List<Integer> pool = getPool(service);
        AllocationState state = allocationStateRepository
                .findById(service)
                .orElseGet(() -> {
                    AllocationState s = new AllocationState();
                    s.setService(service);
                    s.setLastIndex(-1);
                    return s;
                });
        if (pool.isEmpty()) {
            throw new NoLeads("No providers available for service");
        }
        int lastIndex = state.getLastIndex();
        Set<Integer> selected = new LinkedHashSet<>();
        selected.addAll(mandatory);
        int attempts =0;
        while (selected.size()<3 && attempts < pool.size()*2){
            lastIndex = (lastIndex+1)% pool.size();
            Integer providerCode = pool.get(lastIndex);

            ProviderModel m = providerRepository.findByProviderCode(providerCode);
            if (m == null) {
                attempts++;
                continue;
            }
            long count = m.getQuota();
            if (m.getQuota() >= 10) {
                attempts++;
                continue;
            }
            selected.add(providerCode);
            attempts++;
            System.out.println("Last Index: " + lastIndex);
        }
        if(selected.size() < 3){
            throw new NoLeads("No leads with any quota");

        }
        state.setLastIndex(lastIndex);
        allocationStateRepository.save(state);
        for (Integer code : selected) {

            ProviderModel provider =
                    providerRepository.findByProviderCode(code);

            LeadModel lead = new LeadModel();
            lead.setLead(request);
            lead.setProvider(provider);

            leadRepository.save(lead);
            provider.setQuota(provider.getQuota() + 1);
            providerRepository.save(provider);
        }


    }
    private List<Integer> getPool(String service) {

        if (service.equals("Service 1")) {
            return Arrays.asList(2, 3, 4);
        }

        else if (service.equals("Service 2")) {
            return Arrays.asList(6, 7, 8);
        }

        else if (service.equals("Service 3")) {
            return Arrays.asList(2, 3, 5, 6, 7, 8);
        }

        return new ArrayList<>();
    }
}
