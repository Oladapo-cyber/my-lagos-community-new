import React from 'react';
import { Clock, AlertCircle, CheckCircle, XCircle, Server, Globe, Shield, Database } from 'lucide-react';

export const SystemLogsView = () => {
  const logs = [
    { id: 1, timestamp: '2026-02-12 14:32:15', type: 'security', event: 'Failed login attempt', details: 'IP: 102.89.23.45 - User: admin@mlc.com - 3 failed attempts', severity: 'warning' },
    { id: 2, timestamp: '2026-02-12 14:28:00', type: 'api', event: 'API rate limit exceeded', details: 'Endpoint: /api/products - Merchant ID: 124 - 500 requests/min', severity: 'warning' },
    { id: 3, timestamp: '2026-02-12 14:15:22', type: 'system', event: 'Database backup completed', details: 'Full backup - Size: 2.3GB - Duration: 45s', severity: 'info' },
    { id: 4, timestamp: '2026-02-12 13:45:00', type: 'api', event: 'Payment webhook received', details: 'Provider: Paystack - Event: charge.success - Amount: ₦45,000', severity: 'info' },
    { id: 5, timestamp: '2026-02-12 13:12:33', type: 'security', event: 'Admin role assigned', details: 'User: admin@mlc.com granted admin access by system', severity: 'info' },
    { id: 6, timestamp: '2026-02-12 12:00:00', type: 'system', event: 'Scheduled maintenance window', details: 'CDN cache purge - Duration: 2min - No downtime', severity: 'info' },
    { id: 7, timestamp: '2026-02-12 11:45:18', type: 'api', event: 'Xano API error', details: 'Endpoint: /auth/me - Status: 500 - Internal server error', severity: 'error' },
    { id: 8, timestamp: '2026-02-12 10:30:00', type: 'security', event: 'Merchant account suspended', details: 'Merchant: Quick Fix Auto (ID: 6) - Reason: Policy violation', severity: 'warning' },
  ];

  const typeIcons: Record<string, React.ReactNode> = {
    security: <Shield className="w-4 h-4 text-red-500" />,
    api: <Globe className="w-4 h-4 text-blue-500" />,
    system: <Server className="w-4 h-4 text-purple-500" />,
    database: <Database className="w-4 h-4 text-emerald-500" />,
  };

  const severityColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    error: { bg: 'bg-red-50', text: 'text-red-600', icon: <XCircle className="w-3.5 h-3.5" /> },
    warning: { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: <AlertCircle className="w-3.5 h-3.5" /> },
    info: { bg: 'bg-blue-50', text: 'text-blue-600', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <p className="text-sm font-extrabold text-gray-900">API Status</p>
            <p className="text-xs text-emerald-600 font-bold">Operational</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <p className="text-sm font-extrabold text-gray-900">Database</p>
            <p className="text-xs text-emerald-600 font-bold">Healthy</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <p className="text-sm font-extrabold text-gray-900">CDN</p>
            <p className="text-xs text-emerald-600 font-bold">Active</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
          <div>
            <p className="text-sm font-extrabold text-gray-900">Uptime</p>
            <p className="text-xs text-yellow-600 font-bold">99.7% (30d)</p>
          </div>
        </div>
      </div>

      {/* Log Entries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-extrabold text-gray-900">System Logs</h2>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live</span>
        </div>

        <div className="space-y-2">
          {logs.map((log) => {
            const severity = severityColors[log.severity];
            return (
              <div key={log.id} className="flex items-start gap-4 p-3.5 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="shrink-0 mt-0.5">{typeIcons[log.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                    <span className="font-extrabold text-gray-900 text-sm">{log.event}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${severity.bg} ${severity.text} self-start`}>
                      {severity.icon}
                      {log.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{log.details}</p>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-gray-400">
                  <Clock className="w-3 h-3" />
                  {log.timestamp.split(' ')[1]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
