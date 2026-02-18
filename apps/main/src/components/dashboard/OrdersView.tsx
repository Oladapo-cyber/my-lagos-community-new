import React from 'react';
import { MoreVertical } from 'lucide-react';

export const OrdersView = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-8">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
      <input 
        type="text" 
        placeholder="Search Orders" 
        className="px-4 py-3 bg-white border border-gray-200 rounded-lg w-full max-w-sm text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
      />
      <button className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">All Orders</button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-[0.15em]">
            <th className="px-6 py-4 rounded-tl-lg">Item</th>
            <th className="px-6 py-4 text-center">Unit Price</th>
            <th className="px-6 py-4 text-center">Quantity</th>
            <th className="px-6 py-4 text-center">Gross</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 rounded-tr-lg w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {[1, 2].map((i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-6 font-extrabold text-gray-900">Product Name</td>
              <td className="px-6 py-6 text-sm font-bold text-gray-600 text-center">500,000</td>
              <td className="px-6 py-6 text-sm font-bold text-gray-600 text-center">x 5</td>
              <td className="px-6 py-6 text-sm font-bold text-gray-600 text-center">120,000,000</td>
              <td className="px-6 py-6">
                <span className={`text-sm font-bold ${i === 1 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {i === 1 ? 'Cancelled' : 'Completed'}
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
