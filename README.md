# 📌 Lead Distribution System

A full-stack lead management system that automatically assigns incoming customer service requests to providers using a combination of mandatory rules and fair round-robin scheduling, while ensuring concurrency safety and real-time updates.

---
**URL - https://internship-lead-system.vercel.app/**
## 🧠 System Overview

When a customer submits a service request:

- Lead is created in the database  
- Mandatory provider rules are applied based on service type  
- Remaining provider slots are filled using a **persistent round-robin scheduler**  
- Final assignments are saved atomically  
- Providers see updates in real time on their dashboard  

Each lead is assigned to exactly **3 providers**.

---

## ⚙️ Allocation (Scheduler) Logic

### 1. Mandatory Assignment (Rule-Based)

Each service has fixed provider rules:

- Service 1 → Provider 1  
- Service 2 → Provider 5  
- Service 3 → Provider 1 + Provider 4  

These are always assigned first (if quota allows).

---

### 2. Fair Round-Robin Allocation

Remaining slots are filled using a **persistent round-robin system**.

#### Mechanism:

- Each service has a provider pool  
- A **cursor (last assigned index)** is stored in the database  
- Next provider is picked sequentially  
- Cursor is updated after each assignment  
- Providers exceeding quota are skipped  

#### Behavior:

- Fair distribution over time  
- No random selection  
- Survives server restart (DB-persisted state)  

---

## ⚔️ Concurrency Handling

The system is designed to handle **simultaneous lead creation requests safely**.

### Approach:

- Entire lead creation + assignment runs inside a **database transaction**  
- Provider quota is checked and updated atomically  
- Provider selection is protected using locking (optimistic/pessimistic depending on DB)  
- Prevents race conditions during concurrent requests  

### Result:

- No duplicate assignments  
- No quota overflow  
- Consistent allocation under load  

---

## 🚀 Bulk Lead Generation (Concurrency Test)

A testing endpoint/tool is implemented to simulate high load:

### Feature:
Generate **10 leads simultaneously**

### Implementation:

- Uses Java `CompletableFuture.runAsync()` to fire multiple lead creation requests in parallel  
- Each request runs independently but shares the same DB-backed allocation logic  

### Purpose:

- Test concurrency safety  
- Validate transaction isolation  
- Stress-test scheduler fairness under load  

### Result:

- System remains stable under parallel execution  
- No duplicate provider assignments  
- Quota limits are respected even under burst traffic  

---

## 🔁 Webhook Idempotency

Webhook endpoints are protected against duplicate execution.

### Strategy:

- Each webhook request has a unique identifier  
- ID is stored after first successful execution  
- Repeated webhook calls are ignored  

### Result:

- Safe retries  
- No duplicate side effects  
- Prevents accidental quota resets  

---

## 🔄 Real-Time Updates

Provider dashboard updates automatically when new leads are assigned.

### Implementation:

- polling-based updates 


---

## 🧩 Key Design Highlights

- **Persistent round-robin scheduler (DB-backed cursor)**  
- **Strict mandatory + fair allocation separation**  
- **Atomic DB transactions for consistency**  
- **Async bulk testing using CompletableFuture**  
- **Webhook idempotency protection**  
- **Real-time provider updates**  

---

## 📦 Summary

This system demonstrates:

- **Fair and deterministic lead distribution**  
- **Strong concurrency control under simultaneous requests**  
- **Reliable webhook handling (idempotent design)**  
- **Real-time provider dashboard synchronization**  
- **Scalable backend scheduling logic**
