import React from 'react';
import { MoreVertical } from 'lucide-react';

export const EventsView = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-8">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
      <input 
        type="text" 
        placeholder="Search events" 
        className="px-4 py-3 bg-white border border-gray-200 rounded-lg w-full max-w-sm text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
      />
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">All Events</button>
        <button className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">Export CSV</button>
        <button className="px-6 py-3 bg-[#2563eb] text-white rounded-lg text-sm font-bold uppercase tracking-wider shadow-lg shadow-blue-500/20">CREATE EVENT</button>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-[0.15em]">
            <th className="px-6 py-4 rounded-tl-lg">Event Name</th>
            <th className="px-6 py-4 text-center">Tickets Sold</th>
            <th className="px-6 py-4 text-center">Gross</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 rounded-tr-lg w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {[1, 2].map((i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-6">
                <div className="font-extrabold text-gray-900">Oshey's Cafe</div>
                <div className="text-xs text-gray-400 font-medium">Landmark Centre, Lagos | +234 801 234 5678</div>
              </td>
              <td className="px-6 py-6 text-sm font-bold text-gray-600 text-center">{i === 1 ? '100' : '230'}</td>
              <td className="px-6 py-6 text-sm font-bold text-gray-600 text-center">{i === 1 ? '10,000' : '8,000'}</td>
              <td className="px-6 py-6">
                <span className={`text-sm font-bold ${i === 2 ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {i === 2 ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="px-6 py-6"><MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
