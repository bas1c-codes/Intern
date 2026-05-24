package com.devflow.intern.model;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "Leads")
public class LeadModel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne
    @JoinColumn(name = "lead_id", nullable = false)
    private RequestModel lead;

    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private ProviderModel provider;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public RequestModel getLead() {
        return lead;
    }

    public void setLead(RequestModel lead) {
        this.lead = lead;
    }

    public ProviderModel getProvider() {
        return provider;
    }

    public void setProvider(ProviderModel provider) {
        this.provider = provider;
    }
}
