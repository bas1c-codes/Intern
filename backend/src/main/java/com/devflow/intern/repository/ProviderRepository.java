package com.devflow.intern.repository;

import com.devflow.intern.model.ProviderModel;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProviderRepository extends JpaRepository<ProviderModel, UUID> {

    ProviderModel findByProviderCode(int providerCode);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM ProviderModel p WHERE p.providerCode = :code")
    ProviderModel findLockedByProviderCode(@Param("code") int code);
}