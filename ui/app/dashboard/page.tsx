'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { apiService, DashboardItem } from '@/lib/api';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(
    new Set()
  );

  const fetchDashboard = async () => {
    try {
      const response = await apiService.getDashboard();
      // Handle both array response and nested data
      const data = Array.isArray(response.data) 
        ? response.data 
        : Array.isArray(response.data?.data) 
          ? response.data.data 
          : [];
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 3 seconds
  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleProvider = (providerId: string) => {
    const newExpanded = new Set(expandedProviders);
    if (newExpanded.has(providerId)) {
      newExpanded.delete(providerId);
    } else {
      newExpanded.add(providerId);
    }
    setExpandedProviders(newExpanded);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboard();
  };

  const getQuotaPercentage = (remaining: number, quota: number) => {
    if (quota === 0) return 0;
    return ((quota - remaining) / quota) * 100;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <Spinner className="mx-auto mb-4 h-8 w-8 text-blue-500" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Provider Dashboard</h1>
            <p className="text-sm text-slate-400">
              Real-time provider and lead status
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-slate-800 border border-slate-700 p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-slate-300">
                {lastUpdated ? (
                  <>
                    Last updated:{' '}
                    <span className="font-mono text-slate-200">
                      {lastUpdated.toLocaleTimeString()}
                    </span>
                  </>
                ) : (
                  'Loading...'
                )}
              </span>
            </div>
            <Button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              {isRefreshing ? (
                <>
                  <Spinner className="mr-2 h-3 w-3" />
                  Refreshing
                </>
              ) : (
                'Refresh Now'
              )}
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        {dashboardData.length === 0 ? (
          <Card className="border-slate-700 bg-slate-800">
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <p className="text-slate-400">No providers found</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dashboardData.map((item) => (
              <Card
                key={item.provider.id}
                className="border-slate-700 bg-slate-800 shadow-lg"
              >
                <Collapsible
                  open={expandedProviders.has(item.provider.id)}
                  onOpenChange={() =>
                    toggleProvider(item.provider.id)
                  }
                >
                  <CollapsibleTrigger asChild>
                    <button className="w-full p-6 text-left hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h2 className="text-lg font-semibold text-white">
                            {item.provider.name}
                          </h2>
                          <p className="text-xs text-slate-400">
                            Provider Code: {item.provider.providerCode}
                          </p>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-slate-400 transition-transform ${
                            expandedProviders.has(item.provider.id)
                              ? 'rotate-180'
                              : ''
                          }`}
                        />
                      </div>

                      {/* Stats */}
                      <div className="mt-4 space-y-3">
                        {/* Quota Status */}
                        <div>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="text-slate-300">Quota Status</span>
                            <span className="font-mono text-slate-200">
                              {item.remainingQuota} / {item.provider.quota}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all"
                              style={{
                                width: `${getQuotaPercentage(
                                  item.remainingQuota,
                                  item.provider.quota
                                )}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Lead Count */}
                        <div className="rounded-lg bg-slate-700/50 p-3">
                          <p className="text-xs text-slate-400">Total Leads</p>
                          <p className="text-xl font-bold text-white">
                            {item.leadCount}
                          </p>
                        </div>
                      </div>
                    </button>
                  </CollapsibleTrigger>

                  {/* Assigned Leads List */}
                  <CollapsibleContent className="border-t border-slate-700 p-6">
                    {item.assignedLeads.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-4">
                        No leads assigned yet
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {item.assignedLeads.map((assignedLead) => (
                          <div
                            key={assignedLead.id}
                            className="rounded-lg bg-slate-700/30 p-3 text-sm"
                          >
                            <div className="mb-2 flex items-start justify-between">
                              <p className="font-medium text-white">
                                {assignedLead.lead.name}
                              </p>
                              <span className="inline-block rounded bg-blue-600/20 px-2 py-1 text-xs font-medium text-blue-200">
                                {assignedLead.lead.service}
                              </span>
                            </div>
                            <div className="space-y-1 text-slate-400">
                              <p>📞 {assignedLead.lead.phone}</p>
                              <p>📍 {assignedLead.lead.city}</p>
                              <p className="text-xs">
                                {assignedLead.lead.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-8 text-center">
          <p className="text-slate-400">
            Want to submit a lead?{' '}
            <a
              href="/request-service"
              className="text-blue-400 hover:text-blue-300"
            >
              Go to the form
            </a>
            {' '} or visit the{' '}
            <a href="/test-tools" className="text-blue-400 hover:text-blue-300">
              test tools
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
