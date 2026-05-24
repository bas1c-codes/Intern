package com.devflow.intern.repository;

import com.devflow.intern.model.RequestModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RequestRepository extends JpaRepository<RequestModel,UUID> {
    boolean existsByPhoneAndService(int phone,String service);
    Optional<RequestModel> findByPhoneAndService(int phone, String service);
}
