import React from 'react';
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export const SupportTicketsView = () => {
  const tickets = [
    { id: 'TKT-001', subject: 'Order not delivered', status: 'open', priority: 'high', date: 'Feb 10, 2026', lastReply: '2 hours ago' },
    { id: 'TKT-002', subject: 'Refund request for cancelled order', status: 'in-progress', priority: 'medium', date: 'Feb 5, 2026', lastReply: '1 day ago' },
    { id: 'TKT-003', subject: 'Account verification', status: 'resolved', priority: 'low', date: 'Jan 28, 2026', lastReply: '5 days ago' },
  ];

  const statusStyles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    'open': { bg: 'bg-red-50', text: 'text-red-600', icon: <AlertCircle className="w-3 h-3" /> },
    'in-progress': { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: <Clock className="w-3 h-3" /> },
    'resolved': { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <CheckCircle className="w-3 h-3" /> },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-extrabold text-gray-900">Support Tickets</h2>
          </div>
          <button className="px-6 py-2.5 bg-[#2563eb] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-500/20 flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Send className="w-3.5 h-3.5" />
            New Ticket
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-[0.15em]">
                <th className="px-6 py-4 rounded-tl-lg">Ticket ID</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Last Reply</th>
                <th className="px-6 py-4 rounded-tr-lg">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tickets.map((ticket) => {
                const style = statusStyles[ticket.status];
                return (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-5 font-extrabold text-blue-600 text-sm">{ticket.id}</td>
                    <td className="px-6 py-5 text-sm font-bold text-gray-800">{ticket.subject}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${style.bg} ${style.text}`}>
                        {style.icon}
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-xs font-bold ${
                        ticket.priority === 'high' ? 'text-red-500' :
                        ticket.priority === 'medium' ? 'text-yellow-500' : 'text-gray-400'
                      }`}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs font-medium text-gray-400">{ticket.lastReply}</td>
                    <td className="px-6 py-5 text-xs font-medium text-gray-400">{ticket.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
