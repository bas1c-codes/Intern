package com.devflow.intern.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class AllocationState {
    @Id
    private String service;   // "Service 1"

    private int lastIndex;
    public AllocationState() {}

    public AllocationState(String service) {
        this.service = service;
        this.lastIndex = -1;
    }
    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public int getLastIndex() {
        return lastIndex;
    }

    public void setLastIndex(int lastIndex) {
        this.lastIndex = lastIndex;
    }
}
