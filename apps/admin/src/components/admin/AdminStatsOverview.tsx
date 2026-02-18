import React, { useRef, useState } from 'react';
import { DollarSign, List, Calendar, Users, TrendingUp, TrendingDown, MoreHorizontal, ShoppingBag } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler // Register Filler plugin
);

export const AdminStatsOverview = () => {
  // --- Data ---
  const summaryCards = [
    { label: 'Total Listings', value: '10,000', change: '+10%', positive: true, icon: List, color: 'bg-emerald-500' },
    { label: 'Total Events', value: '10,000', change: '+10%', positive: true, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Total Sales', value: '₦10,000', change: '-10%', positive: false, icon: ShoppingBag, color: 'bg-indigo-500' }, // Assuming Naira for Lagos context
    { label: 'Total Users', value: '10,000', change: '+10%', positive: true, icon: Users, color: 'bg-purple-500' },
  ];

  const orderStatusData = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ['#10b981', '#fbbf24', '#ef4444'],
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Total Sales',
        data: [12000, 19000, 3000, 5000, 2000, 3000, 15000, 25000, 27000, 23000, 29000, 35000],
        borderColor: '#2563eb', // Blue-600 to match "Image A" blue theme
        backgroundColor: 'rgba(37, 99, 235, 0.1)', // Subtle fill
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Target',
        data: [10000, 15000, 20000, 18000, 22000, 25000, 28000, 30000, 32000, 35000, 38000, 40000],
        borderColor: '#9ca3af', // Gray-400 for better visibility
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const listingsVsEventsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Listings',
        data: [50, 60, 70, 65, 80, 90],
        borderColor: '#10b981',
        tension: 0.4,
      },
      {
        label: 'Events',
        data: [20, 30, 25, 40, 45, 55],
        borderColor: '#3b82f6',
        tension: 0.4,
      },
    ],
  };

  const topListings = [
    { id: 1, name: 'Luxury Apartment in Lekki', rating: 4.9, reviews: 120, price: '₦150k' },
    { id: 2, name: 'Toyota Camry 2020', rating: 4.8, reviews: 85, price: '₦8.5M' },
    { id: 3, name: 'iPhone 15 Pro Max', rating: 4.7, reviews: 200, price: '₦1.8M' },
    { id: 4, name: 'Men\'s Casual Shirt', rating: 4.6, reviews: 50, price: '₦15k' },
  ];

  const topEvents = [
    { id: 1, name: 'Lagos Tech Fest 2026', date: 'Oct 15', tickets: 'Sold Out' },
    { id: 2, name: 'Afrobeat Concert', date: 'Nov 02', tickets: '85% Sold' },
    { id: 3, name: 'Startup Pitch Night', date: 'Sep 28', tickets: 'Available' },
    { id: 4, name: 'Food & Drink Festival', date: 'Dec 10', tickets: 'Fast Selling' },
  ];

  const bestProducts = [
    { id: 1, name: 'Traditional Adire Fabric', sales: 1250, revenue: '₦6.2M' },
    { id: 2, name: 'Leather Handbag', sales: 850, revenue: '₦4.1M' },
    { id: 3, name: 'Handmade Beads', sales: 600, revenue: '₦1.8M' },
    { id: 4, name: 'Organic Shea Butter', sales: 450, revenue: '₦900k' },
  ];

  // chart refs & visibility state for custom legend toggles
  const revenueChartRef = useRef<any>(null);
  const [visibleSets, setVisibleSets] = useState({ total: true, target: true });

  const toggleDataset = (key: 'total' | 'target') => {
    const chart = revenueChartRef.current as any;
    const idx = key === 'total' ? 0 : 1;
    const newVisibility = !visibleSets[key];
    setVisibleSets((p) => ({ ...p, [key]: newVisibility }));
    if (chart && chart.data && chart.data.datasets && chart.data.datasets[idx]) {
      chart.data.datasets[idx].hidden = !newVisibility;
      // Chart.js instance may be exposed directly on ref.current
      if (typeof chart.update === 'function') chart.update();
    }
  };

  // --- Options ---
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        grid: { display: true, borderDash: [2, 4], color: '#f3f4f6' },
        ticks: { font: { size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { position: 'bottom' as const, labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } } },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2">
             <Calendar size={16} /> Last 30 Days
           </button>
           <button className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 shadow-sm">
             Download Report
           </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{card.value}</h3>
              <div className={`flex items-center text-xs font-bold ${card.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                {card.positive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                {card.change}
                <span className="text-gray-400 font-normal ml-1">vs last month</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${card.color} text-white shadow-lg shadow-blue-500/20`}>
              <card.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Order Status */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Order Status</h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
          </div>
          <div className="h-[280px] flex items-center justify-center relative">
            <Doughnut data={orderStatusData} options={donutOptions} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xs text-gray-400 font-medium">Total Orders</p>
                <p className="text-xl font-bold text-gray-800">4,250</p>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                <span className="text-gray-600">Completed</span>
              </div>
              <span className="font-bold text-gray-800">75%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                <span className="text-gray-600">Pending</span>
              </div>
              <span className="font-bold text-gray-800">15%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-gray-600">Cancelled</span>
              </div>
              <span className="font-bold text-gray-800">10%</span>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Revenue</h3>
              <p className="text-xs text-gray-500">Total Sales of the month</p>
            </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100">
                    Daily
                  </button>
                  <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700">
                    Monthly
                  </button>
                  <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100">
                    Annually
                  </button>
                </div>

                {/* Custom legend using radio-like toggles */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDataset('total')}
                    className="flex items-center gap-2 text-sm text-gray-600"
                    aria-pressed={visibleSets.total}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center border ${visibleSets.total ? 'bg-[rgba(37,99,235,1)] border-[rgba(37,99,235,1)]' : 'border-gray-300 bg-white'}`}>
                      {visibleSets.total && <span className="w-2 h-2 bg-white rounded-full" />}
                    </span>
                    <span className="text-xs">Total Sales</span>
                  </button>

                  <button
                    onClick={() => toggleDataset('target')}
                    className="flex items-center gap-2 text-sm text-gray-600"
                    aria-pressed={visibleSets.target}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center border ${visibleSets.target ? 'bg-gray-400 border-gray-400' : 'border-gray-300 bg-white'}`}>
                      {visibleSets.target && <span className="w-2 h-2 bg-white rounded-full" />}
                    </span>
                    <span className="text-xs">Target</span>
                  </button>
                </div>
              </div>
          </div>
          <div className="h-[280px] relative">
            <Line ref={revenueChartRef} data={revenueData} options={lineOptions} />
            {/* <div className="absolute top-2 right-16 text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
              <p>May, 2022 - 2026</p>
            </div>
            <div className="absolute top-12 right-16 text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
              <p>May, 2021 - 100k</p>
            </div> */}
          </div>
        </div>

        {/* Best Products */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Best Product</h3>
            <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">See All</a>
          </div>
          <div className="space-y-4">
            {bestProducts.map((item) => (
              <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <ShoppingBag size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.sales} sold</p>
                </div>
                <p className="text-sm font-bold text-red-500 whitespace-nowrap">{item.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lists Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Listings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top Listings</h3>
          <div className="space-y-4">
            {topListings.map((item) => (
              <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0" /> {/* Placeholder for image */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.reviews} reviews</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-600">★ {item.rating}</p>
                  <p className="text-xs font-semibold text-gray-700">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Events */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top Events</h3>
          <div className="space-y-4">
            {topEvents.map((item) => (
              <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {item.date.split(' ')[0]}<br/>{item.date.split(' ')[1]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  item.tickets === 'Sold Out' ? 'bg-red-100 text-red-600' : 
                  item.tickets.includes('Selling') ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {item.tickets}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Comparison Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Listings vs Events Growth</h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
          </div>
          <div className="h-[250px]">
             <Line data={listingsVsEventsData} options={lineOptions} />
          </div>
      </div>
    </div>
  );
};
