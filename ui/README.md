# Lead Distribution System Frontend

A modern Next.js (App Router) frontend for managing and distributing service leads across multiple providers with real-time tracking and quota management.

## 🎯 Features

- **Lead Request Form** (`/request-service`) - Public form for submitting service requests
  - Name, phone, city, service type, and description fields
  - Real-time validation and error handling
  - Toast notifications for feedback
  - Prevents duplicate submissions with loading state

- **Provider Dashboard** (`/dashboard`) - Real-time monitoring interface
  - Auto-refreshes every 3 seconds (configurable polling)
  - Shows provider quota status with progress bars
  - Expandable lead details per provider
  - Last updated timestamp with refresh indicator
  - Handles empty states gracefully

- **Developer Tools** (`/test-tools`) - Testing and debugging panel
  - Generate 10 test leads
  - Reset provider quotas with UUID generation
  - Refresh dashboard data manually
  - Activity logs showing all actions with timestamps
  - Quick navigation links

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (compatible with pnpm, npm, or yarn)
- Backend API running (see **Configuration** section)

### Installation

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the project root with the following variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Important:** 
- The backend URL **must** be set before the app will work properly
- This is a public variable (accessible in the browser), so it's prefixed with `NEXT_PUBLIC_`
- Update this URL to match your backend's actual location (e.g., production API URL)

### Backend API Integration

The frontend communicates with the following backend endpoints:

#### 1. Create Lead
```
POST /request-service
Body: {
  "name": string,
  "phone": number,
  "city": string,
  "service": "Service 1" | "Service 2" | "Service 3",
  "description": string
}
Response: Created request object OR error string
```

#### 2. Get Dashboard Data
```
POST /dashboard
Response: Array of DashboardItem objects with provider info and leads
```

#### 3. Generate Test Leads
```
POST /test-tools/generate
Response: Success confirmation (generates 10 leads)
```

#### 4. Reset Quota
```
POST /webhook/reset-quota?eventId=string
Response: Success confirmation (idempotent)
```

## 📁 Project Structure

```
app/
├── layout.tsx              # Root layout with metadata
├── page.tsx                # Home page with navigation
├── globals.css             # Global styles
├── request-service/
│   └── page.tsx           # Lead submission form
├── dashboard/
│   └── page.tsx           # Provider dashboard with real-time updates
└── test-tools/
    └── page.tsx           # Developer testing tools

lib/
└── api.ts                 # Central API layer with axios instance

components/
└── ui/                    # shadcn/ui components (pre-installed)
```

## 🎨 Design & UI

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui (new-york style)
- **Dark Theme**: Slate-900 gradient background with accent colors
- **Icons**: lucide-react
- **Notifications**: Sonner toast library

### Color Palette
- Primary: Blue (`bg-blue-600`)
- Secondary: Slate (`bg-slate-800`, `bg-slate-700`)
- Accent: Green (`bg-green-600`), Orange (`bg-orange-600`)
- Status: Green success, Red error

## 🔄 Real-Time Features

The dashboard implements **polling** for real-time updates:
- Auto-refresh every 3 seconds
- Manual refresh button available
- Displays last updated timestamp
- Loading states during refresh
- Error handling with toast notifications

Future enhancements could include SSE or WebSocket support for more efficient real-time updates.

## 🛡️ API Error Handling

- Duplicate lead submissions: "Duplicate lead for same service"
- Network errors: Graceful fallback with toast notifications
- Loading states: Disabled buttons prevent accidental resubmissions
- Type safety: Full TypeScript integration with API types

## 📦 Dependencies

Key dependencies:
- `next` (16.2.6) - React framework
- `react` (^19) - UI library
- `axios` (^1.16) - HTTP client
- `tailwindcss` (^4.2) - Utility CSS framework
- `shadcn/ui` - Component library
- `sonner` - Toast notifications
- `lucide-react` - Icons
- `zod` - Schema validation

## 🧪 Testing with Test Tools

1. Visit `/test-tools` (or click "Access Developer Tools" from home)
2. Click **"Generate 10 Leads"** to create test data
3. Click **"Refresh Dashboard"** to fetch and display provider data
4. Click **"Reset Quota"** to test quota reset with random Event ID
5. Monitor activity logs for success/error status

## 🔒 Security Considerations

- Environment variables are properly separated (public vs private)
- CORS headers handled by backend
- Input validation on form submission
- API responses validated before rendering
- No hardcoded credentials or URLs

## 📝 Form Validation

The lead request form validates:
- All fields are required
- Phone must be a valid number
- Service type must be from the allowed list
- Description must not be empty

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub and connect to Vercel
# Add NEXT_PUBLIC_API_URL environment variable in Vercel dashboard
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 🐛 Troubleshooting

### "API URL is not set" warning
- Add `NEXT_PUBLIC_API_URL` to your `.env.local` file
- Restart the development server

### Dashboard shows "No providers found"
- Ensure backend is running
- Check network tab in browser DevTools
- Verify `NEXT_PUBLIC_API_URL` points to correct backend

### Form submissions failing
- Check backend is running and accessible
- Verify CORS is enabled on backend
- Check browser console for error details
- Ensure all required fields are filled

### Duplicate lead error
- This is expected behavior - backend prevents duplicate leads for same service
- Try with a different service type or phone number

## 📚 Development

### Build for production
```bash
pnpm build
pnpm start
```

### Type checking
```bash
pnpm type-check  # if configured
```

## 📄 License

Built with v0.app - AI-powered UI generation for Next.js

## 🤝 Support

For issues with the frontend:
1. Check the troubleshooting section above
2. Verify backend is running and responding
3. Check environment variable configuration
4. Review browser console for error messages
