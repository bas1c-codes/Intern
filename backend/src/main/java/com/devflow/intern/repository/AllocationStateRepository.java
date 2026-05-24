package com.devflow.intern.repository;

import com.devflow.intern.model.AllocationState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AllocationStateRepository extends JpaRepository<AllocationState, String> {

}
