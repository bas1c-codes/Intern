'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

interface LogEntry {
  id: string;
  timestamp: Date;
  action: string;
  status: 'success' | 'error';
  message: string;
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function TestToolsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
  const [isLoadingReset, setIsLoadingReset] = useState(false);
  const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);

  const addLog = (
    action: string,
    status: 'success' | 'error',
    message: string
  ) => {
    const logEntry: LogEntry = {
      id: generateUUID(),
      timestamp: new Date(),
      action,
      status,
      message,
    };
    setLogs((prev) => [logEntry, ...prev]);
  };

  const handleGenerateLeads = async () => {
    setIsLoadingGenerate(true);
    try {
      const response = await apiService.generateTestLeads();
      toast.success('Generated 10 test leads');
      addLog('Generate Leads', 'success', 'Successfully generated 10 test leads');
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to generate leads';
      toast.error(errorMsg);
      addLog('Generate Leads', 'error', errorMsg);
    } finally {
      setIsLoadingGenerate(false);
    }
  };

  const handleResetQuota = async () => {
    setIsLoadingReset(true);
    const eventId = generateUUID();
    try {
      await apiService.resetQuota(eventId);
      toast.success('Quota reset successful');
      addLog(
        'Reset Quota',
        'success',
        `Successfully reset quota with Event ID: ${eventId}`
      );
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to reset quota';
      toast.error(errorMsg);
      addLog('Reset Quota', 'error', errorMsg);
    } finally {
      setIsLoadingReset(false);
    }
  };

  const handleRefreshDashboard = async () => {
    setIsLoadingRefresh(true);
    try {
      const response = await apiService.getDashboard();
      toast.success(`Refreshed dashboard (${response.data.length} providers)`);
      addLog(
        'Refresh Dashboard',
        'success',
        `Fetched dashboard with ${response.data.length} providers`
      );
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to refresh dashboard';
      toast.error(errorMsg);
      addLog('Refresh Dashboard', 'error', errorMsg);
    } finally {
      setIsLoadingRefresh(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-white">Developer Tools</h1>
          <p className="text-slate-400">
            Test and debug the Lead Distribution System
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Control Panel */}
          <div className="space-y-4 md:col-span-2">
            <Card className="border-slate-700 bg-slate-800">
              <div className="space-y-4 p-6">
                <h2 className="text-lg font-semibold text-white">
                  Control Panel
                </h2>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Button
                    onClick={handleGenerateLeads}
                    disabled={isLoadingGenerate}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoadingGenerate ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Generating...
                      </>
                    ) : (
                      '🎲 Generate 10 Leads'
                    )}
                  </Button>

                  <Button
                    onClick={handleResetQuota}
                    disabled={isLoadingReset}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isLoadingReset ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Resetting...
                      </>
                    ) : (
                      '🔄 Reset Quota'
                    )}
                  </Button>

                  <Button
                    onClick={handleRefreshDashboard}
                    disabled={isLoadingRefresh}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoadingRefresh ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Refreshing...
                      </>
                    ) : (
                      '📊 Refresh Dashboard'
                    )}
                  </Button>
                </div>

                <div className="text-xs text-slate-400">
                  <p>
                    💡 Use these buttons to test lead generation, quota resets,
                    and dashboard functionality.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Logs */}
          <Card className="border-slate-700 bg-slate-800 md:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white">
                Activity Logs
              </h2>
              <Button
                onClick={clearLogs}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Clear
              </Button>
            </div>

            <div className="h-96 overflow-y-auto p-6">
              {logs.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-slate-500 text-center">
                    No logs yet. Try running an action above.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`rounded-lg p-3 text-sm font-mono ${
                        log.status === 'success'
                          ? 'border-l-2 border-green-500 bg-green-900/10'
                          : 'border-l-2 border-red-500 bg-red-900/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block h-2 w-2 rounded-full ${
                                log.status === 'success'
                                  ? 'bg-green-500'
                                  : 'bg-red-500'
                              }`}
                            />
                            <span className="font-semibold text-white">
                              {log.action}
                            </span>
                            <span
                              className={`text-xs ${
                                log.status === 'success'
                                  ? 'text-green-400'
                                  : 'text-red-400'
                              }`}
                            >
                              [{log.status}]
                            </span>
                          </div>
                          <p className="mt-1 break-words text-slate-300">
                            {log.message}
                          </p>
                        </div>
                        <span className="whitespace-nowrap text-xs text-slate-400">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Quick Links */}
          <Card className="border-slate-700 bg-slate-800 md:col-span-2">
            <div className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Quick Links
              </h2>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/request-service"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 transition-colors"
                >
                  📝 Lead Form
                </a>
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 transition-colors"
                >
                  📊 Provider Dashboard
                </a>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 transition-colors"
                >
                  🏠 Home
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
