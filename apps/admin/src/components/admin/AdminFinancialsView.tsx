import React from 'react';
import { TrendingUp, TrendingDown, FileText } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';

export const AdminFinancialsView = () => {
  // Transaction chart data
  const transactionData = {
    labels: ['2am', '4am', '6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm', '12am'],
    datasets: [
      {
        label: 'Transactions',
        data: [120, 100, 80, 70, 90, 110, 120, 90, 135, 100, 80, 60],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index' as const, intersect: false },
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

  // Revenue from Events donut chart
  const eventsRevenueData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [77, 23],
        backgroundColor: ['#10b981', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  // Revenue from Shop donut chart  
  const shopRevenueData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [77, 23],
        backgroundColor: ['#2563eb', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
      },
    },
  };

  const metricCards = [
    {
      label: "Today's Sales",
      value: '₦54,290',
      change: '+8.5% since last week',
      isPositive: true,
    },
    {
      label: "This Week's Sales",
      value: '₦54,290',
      change: '-2.5% since last week',
      isPositive: false,
    },
    {
      label: "This Month's Sales",
      value: '₦28M',
      change: '+12.3% since last month',
      isPositive: true,
    },
    {
      label: "This Year's Sales",
      value: '₦504M',
      change: '+18.7% since last year',
      isPositive: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Financials</h1>
        <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          <FileText size={18} />
          Export CSV
        </button>
      </div>

      {/* Main Grid: Left (Transactions + Metrics) + Right (Donuts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Transactions Chart + Metric Cards */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Transactions Chart Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Transactions</h3>
                <p className="text-xs text-gray-500">Total Revenue Generated</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700">
                  Daily
                </button>
                <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100">
                  Monthly
                </button>
                <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100">
                  Annually
                </button>
              </div>
            </div>

            {/* Chart Container */}
            <div className="relative h-[300px]">
              <Line data={transactionData} options={chartOptions} />
              <div className="absolute top-1/2 left-1/3 bg-white px-3 py-2 rounded border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-600">28 Nov, 2019</p>
                <p className="text-lg font-bold text-gray-900">₦200,000</p>
              </div>
            </div>
          </div>

          {/* Metric Cards Grid: 4 columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metricCards.map((card, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                  </div>
                  {card.isPositive ? (
                    <TrendingUp className="text-emerald-500" size={20} />
                  ) : (
                    <TrendingDown className="text-red-500" size={20} />
                  )}
                </div>
                <p className={`text-xs font-medium ${card.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {card.change}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Donut Charts (Full Height) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Revenue From Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-800">Revenue From Events</h3>
              <p className="text-xs text-gray-500">Total amount in ticket sales</p>
            </div>

            {/* Total Amount */}
            <div className="mb-4">
              <p className="text-2xl font-bold text-gray-900">₦366,600,462</p>
            </div>

            {/* Horizontal Layout: Legend on left, Donut on right */}
            <div className="flex items-center gap-6">
              {/* Legend - Left Side */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full mt-1"></span>
                  <div>
                    <p className="text-xs text-gray-500">Income Amount</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">₦6,600,462</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-3 h-3 bg-amber-400 rounded-full mt-1"></span>
                  <div>
                    <p className="text-xs text-gray-500">Pay Out Amount</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">₦360,000,000</p>
                  </div>
                </div>
              </div>

              {/* Donut Chart - Right Side */}
              <div className="w-32 h-32 relative flex-shrink-0">
                <Doughnut data={eventsRevenueData} options={donutOptions} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-3xl font-bold text-gray-800">23%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue From Shop */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-800">Revenue From Shop</h3>
              <p className="text-xs text-gray-500">Total amount in sales</p>
            </div>

            {/* Total Amount */}
            <div className="mb-4">
              <p className="text-2xl font-bold text-gray-900">₦366,600,462</p>
            </div>

            {/* Horizontal Layout: Legend on left, Donut on right */}
            <div className="flex items-center gap-6">
              {/* Legend - Left Side */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-3 h-3 bg-blue-600 rounded-full mt-1"></span>
                  <div>
                    <p className="text-xs text-gray-500">Income Amount</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">₦360,600,462</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-3 h-3 bg-red-500 rounded-full mt-1"></span>
                  <div>
                    <p className="text-xs text-gray-500">Expenditure Amount</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">₦60,000,000</p>
                  </div>
                </div>
              </div>

              {/* Donut Chart - Right Side */}
              <div className="w-32 h-32 relative flex-shrink-0">
                <Doughnut data={shopRevenueData} options={donutOptions} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-3xl font-bold text-gray-800">23%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
