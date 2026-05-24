import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            Lead Distribution System
          </h1>
          <p className="mb-8 text-xl text-slate-400">
            Efficiently manage and distribute service requests across providers
            with real-time tracking and quota management.
          </p>

          {/* Feature Cards */}
          <div className="mb-12 grid gap-6 sm:grid-cols-3">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <div className="p-6 text-center">
                <div className="mb-3 text-3xl">📝</div>
                <h3 className="font-semibold text-white">Lead Request Form</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Submit service requests with detailed information
                </p>
              </div>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <div className="p-6 text-center">
                <div className="mb-3 text-3xl">📊</div>
                <h3 className="font-semibold text-white">Provider Dashboard</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Real-time tracking of leads and provider quotas
                </p>
              </div>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <div className="p-6 text-center">
                <div className="mb-3 text-3xl">🧪</div>
                <h3 className="font-semibold text-white">Developer Tools</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Test and debug with mock data and controls
                </p>
              </div>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4 sm:flex sm:justify-center sm:gap-4 sm:space-y-0">
            <Link href="/request-service" className="block sm:inline-block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 px-8 py-3">
                <span>Submit a Service Request</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard" className="block sm:inline-block">
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-200 hover:bg-slate-700 px-8 py-3"
              >
                <span>View Provider Dashboard</span>
              </Button>
            </Link>
          </div>

          {/* Secondary CTA */}
          <p className="mt-8 text-slate-400">
            Are you a developer?{' '}
            <Link
              href="/test-tools"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Access Developer Tools
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 px-4 py-8">
        <div className="mx-auto max-w-3xl text-center text-sm text-slate-500">
          <p>
            Lead Distribution System © 2024. Built with Next.js and React.
          </p>
        </div>
      </footer>
    </div>
  );
}
