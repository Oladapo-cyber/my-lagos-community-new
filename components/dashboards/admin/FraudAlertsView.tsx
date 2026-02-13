import React, { useState } from 'react';
import { AlertTriangle, Shield, CheckCircle, Clock, Eye, Search } from 'lucide-react';

export const FraudAlertsView = () => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  const alerts = [
    { id: 'FRD-001', type: 'Suspicious Login', user: 'user_2847@email.com', severity: 'critical', description: 'Multiple failed login attempts from 5 different IPs within 2 minutes', time: '2 hours ago', resolved: false },
    { id: 'FRD-002', type: 'Chargeback', user: 'merchant_124@email.com', severity: 'high', description: 'Customer initiating chargeback on order #ORD-3421 worth ₦125,000', time: '5 hours ago', resolved: false },
    { id: 'FRD-003', type: 'Unusual Activity', user: 'customer_891@email.com', severity: 'medium', description: 'Large order placed from new account, shipping to different state than billing', time: '1 day ago', resolved: false },
    { id: 'FRD-004', type: 'Account Takeover', user: 'user_1234@email.com', severity: 'critical', description: 'Password changed and email updated within 5 minutes, followed by large purchase', time: '2 days ago', resolved: true },
    { id: 'FRD-005', type: 'Suspicious Login', user: 'user_567@email.com', severity: 'low', description: 'Login from new device / location', time: '3 days ago', resolved: true },
  ];

  const filtered = alerts.filter(a => filterSeverity === 'all' || a.severity === filterSeverity);

  const severityColors: Record<string, { bg: string; text: string }> = {
    critical: { bg: 'bg-red-50', text: 'text-red-600' },
    high: { bg: 'bg-orange-50', text: 'text-orange-600' },
    medium: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
    low: { bg: 'bg-blue-50', text: 'text-blue-600' },
  };

  const unresolvedCount = alerts.filter(a => !a.resolved).length;

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-extrabold text-red-600">{alerts.filter(a => a.severity === 'critical' && !a.resolved).length}</p>
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mt-1">Critical</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-extrabold text-orange-600">{alerts.filter(a => a.severity === 'high' && !a.resolved).length}</p>
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mt-1">High</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-extrabold text-yellow-600">{alerts.filter(a => a.severity === 'medium').length}</p>
          <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mt-1">Medium</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-extrabold text-emerald-600">{alerts.filter(a => a.resolved).length}</p>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">Resolved</p>
        </div>
      </div>

      {/* Alert Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-extrabold text-gray-900">Fraud Alerts</h2>
            {unresolvedCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unresolvedCount} active</span>
            )}
          </div>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as any)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 bg-white outline-none"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="space-y-3">
          {filtered.map((alert) => {
            const colors = severityColors[alert.severity];
            return (
              <div key={alert.id} className={`border rounded-xl p-5 ${alert.resolved ? 'border-gray-100 opacity-60' : 'border-gray-200'} hover:shadow-sm transition-shadow`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-4 h-4 ${colors.text} shrink-0`} />
                    <span className="text-sm font-extrabold text-gray-900">{alert.type}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} uppercase`}>
                      {alert.severity}
                    </span>
                    {alert.resolved && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Resolved
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {alert.time}
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-medium mb-2 ml-7">{alert.description}</p>
                <div className="flex items-center justify-between ml-7">
                  <span className="text-[10px] font-bold text-gray-400">{alert.id} &middot; {alert.user}</span>
                  {!alert.resolved && (
                    <div className="flex items-center gap-2">
                      <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider">Investigate</button>
                      <button className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider">Resolve</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
