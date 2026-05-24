package com.devflow.intern.repository;

import com.devflow.intern.model.LeadModel;
import com.devflow.intern.model.ProviderModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LeadRepository
        extends JpaRepository<LeadModel, UUID> {

    List<LeadModel> findByProvider(ProviderModel provider);

    long countByProvider(ProviderModel provider);
}