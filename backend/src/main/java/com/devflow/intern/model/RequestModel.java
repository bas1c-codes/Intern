package com.devflow.intern.model;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "requests",uniqueConstraints = @UniqueConstraint(columnNames = {"phone", "service"}))
public class RequestModel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private  String name;
    @Column(nullable = false)
    private String phone;
    @Column(nullable = false)
    private String city;
    @Column(nullable = false)
    private String service;
    @Column(nullable = false)
    private String description;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
