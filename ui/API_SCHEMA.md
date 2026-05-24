# API Schema Documentation

This document outlines the contract between the frontend and backend for the Lead Distribution System.

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

The base URL for all API requests. All endpoints are relative to this URL.

## Endpoints

### 1. Create Lead Request

**Endpoint:** `POST /request-service`

**Purpose:** Submit a new service lead request

**Request Body:**
```typescript
{
  name: string;           // Customer name (required)
  phone: number;          // Phone number (required)
  city: string;           // City location (required)
  service: string;        // Service type: "Service 1" | "Service 2" | "Service 3"
  description: string;    // Service description (required)
}
```

**Example Request:**
```bash
curl -X POST http://localhost:5000/request-service \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": 5551234567,
    "city": "New York",
    "service": "Service 1",
    "description": "Need plumbing service for bathroom"
  }'
```

**Success Response (200):**
```typescript
{
  id: string;
  name: string;
  phone: number;
  city: string;
  service: string;
  description: string;
  createdAt: string; // ISO timestamp
  // ... other fields
}
```

**Error Response (400):**
```typescript
"Duplicate lead for same service"  // String error message
```

**Frontend Behavior:**
- Shows success toast notification
- Clears form fields
- Displays confirmation message for 2 seconds
- Shows error toast if duplicate or network error

---

### 2. Get Dashboard Data

**Endpoint:** `POST /dashboard`

**Purpose:** Fetch all provider data with assigned leads and quota information

**Request Body:** None (or empty object)

**Example Request:**
```bash
curl -X POST http://localhost:5000/dashboard \
  -H "Content-Type: application/json"
```

**Success Response (200):**
```typescript
[
  {
    provider: {
      id: string;
      providerCode: number;
      name: string;
      quota: number;
    };
    remainingQuota: number;
    leadCount: number;
    assignedLeads: [
      {
        id: string;
        lead: {
          name: string;
          phone: number;
          city: string;
          service: string;
          description: string;
        };
        provider: {
          id: string;
          providerCode: number;
          name: string;
          quota: number;
        };
      }
    ];
  }
]
```

**Frontend Behavior:**
- Called automatically every 3 seconds
- Displays providers in a grid layout
- Shows quota progress bar for each provider
- Lists assigned leads in expandable sections
- Handles empty arrays gracefully with "No providers found" message

---

### 3. Generate Test Leads

**Endpoint:** `POST /test-tools/generate`

**Purpose:** Generate 10 random leads for testing and demonstration

**Request Body:** None (or empty object)

**Example Request:**
```bash
curl -X POST http://localhost:5000/test-tools/generate \
  -H "Content-Type: application/json"
```

**Success Response (200):**
```typescript
{
  success: boolean;
  message: string;
  leadsGenerated: number;
}
```

**Frontend Behavior:**
- Logs action with timestamp
- Shows success toast notification
- Records action in activity log
- Marks with green status indicator

---

### 4. Reset Quota (Webhook)

**Endpoint:** `POST /webhook/reset-quota?eventId=string`

**Purpose:** Reset provider quotas using an idempotent event ID

**Query Parameters:**
- `eventId` (required): UUID v4 string for idempotency

**Example Request:**
```bash
curl -X POST "http://localhost:5000/webhook/reset-quota?eventId=550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json"
```

**Success Response (200):**
```typescript
{
  success: boolean;
  message: string;
  providersReset: number;
}
```

**Frontend Behavior:**
- Generates random UUID v4 for idempotency
- Logs action with UUID
- Shows success toast notification
- Records action with generated event ID in activity log
- Multiple calls with same event ID should succeed without duplicating reset

---

## Error Handling

All endpoints should include proper error responses:

### Common HTTP Status Codes

- **200 OK** - Request successful
- **400 Bad Request** - Invalid input or duplicate lead
- **500 Internal Server Error** - Server error

### Expected Error Messages (Frontend)

- `"Duplicate lead for same service"` - Lead with same service already exists
- `"Failed to fetch dashboard data"` - Network/server error on dashboard
- `"Failed to generate leads"` - Error in test lead generation
- `"Failed to reset quota"` - Error in quota reset

## Type Definitions

```typescript
// From lib/api.ts

export interface LeadRequest {
  name: string;
  phone: number;
  city: string;
  service: 'Service 1' | 'Service 2' | 'Service 3';
  description: string;
}

export interface Provider {
  id: string;
  providerCode: number;
  name: string;
  quota: number;
}

export interface AssignedLead {
  id: string;
  lead: LeadRequest;
  provider: Provider;
}

export interface DashboardItem {
  provider: Provider;
  remainingQuota: number;
  leadCount: number;
  assignedLeads: AssignedLead[];
}
```

## Frontend API Service

The frontend uses axios with a centralized API layer (`lib/api.ts`):

```typescript
import { apiService } from '@/lib/api';

// Create a lead
await apiService.createLead({
  name: 'John Doe',
  phone: 5551234567,
  city: 'New York',
  service: 'Service 1',
  description: 'Description here'
});

// Get dashboard data
const response = await apiService.getDashboard();
const data = response.data; // DashboardItem[]

// Generate test leads
await apiService.generateTestLeads();

// Reset quota
await apiService.resetQuota(eventId);
```

## CORS Requirements

Backend should enable CORS for the frontend origin:

```typescript
// Example Node.js/Express
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: false
}));
```

## Polling Strategy

The dashboard uses polling instead of WebSockets:

- **Poll Interval:** 3 seconds
- **Timeout:** Uses axios default (30s)
- **Retry:** Automatic via axios interceptors
- **Backoff:** None (constant interval)

Future enhancements could implement:
- Exponential backoff on errors
- Server-Sent Events (SSE)
- WebSocket connections for lower latency

## Testing

### Happy Path Test
1. POST `/request-service` with valid data → Should return lead object
2. POST `/dashboard` → Should return array with provider data
3. POST `/test-tools/generate` → Should return success
4. POST `/webhook/reset-quota?eventId=UUID` → Should return success

### Error Cases
1. POST `/request-service` with duplicate service → Should return "Duplicate lead for same service"
2. POST `/request-service` with invalid data → Should return 400 error
3. POST `/dashboard` when no backend → Should timeout/return error
4. POST `/webhook/reset-quota` without eventId → Should return 400 error

## Version History

- **v1.0** - Initial implementation with polling dashboard
- Future: WebSocket/SSE support, batched operations, pagination
