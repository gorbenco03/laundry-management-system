import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Package, 
  Users, 
  DollarSign,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import { formatPrice } from '../../utils/helpers';

// Date simulate pentru statistici
const mockStats = {
  today: {
    orders: 45,
    revenue: 12450,
    avgOrderValue: 276.67,
    completedOrders: 38
  },
  week: {
    orders: 312,
    revenue: 87300,
    avgOrderValue: 279.81,
    completedOrders: 298
  },
  month: {
    orders: 1247,
    revenue: 342150,
    avgOrderValue: 274.46,
    completedOrders: 1198
  },
  comparison: {
    ordersChange: 12.5,
    revenueChange: 8.3,
    avgOrderChange: -2.1,
    completionRate: 96.1
  }
};

// Date pentru graficul de venituri pe ultimele 7 zile
const revenueData = [
  { day: 'Lun', revenue: 11200, orders: 41 },
  { day: 'Mar', revenue: 13500, orders: 48 },
  { day: 'Mie', revenue: 12800, orders: 45 },
  { day: 'Joi', revenue: 14200, orders: 52 },
  { day: 'Vin', revenue: 13900, orders: 49 },
  { day: 'Sâm', revenue: 15600, orders: 58 },
  { day: 'Dum', revenue: 8900, orders: 32 }
];

// Top servicii
const topServices = [
  { name: 'Cămașă bărbat', count: 156, revenue: 12480 },
  { name: 'Rochie simplă tricotaj', count: 98, revenue: 11760 },
  { name: 'Costum 2 piese bărbat', count: 67, revenue: 13400 },
  { name: 'Curățare covor', count: 89, revenue: 8010 },
  { name: 'Pernă 50×50', count: 124, revenue: 11780 }
];

// Top clienți
const topCustomers = [
  { name: 'Maria Ionescu', orders: 23, totalSpent: 3450 },
  { name: 'Ion Popescu', orders: 19, totalSpent: 2890 },
  { name: 'Elena Dumitrescu', orders: 17, totalSpent: 2650 },
  { name: 'Andrei Popa', orders: 15, totalSpent: 2340 },
  { name: 'Ana Georgescu', orders: 14, totalSpent: 2120 }
];

const AdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const stats = mockStats[selectedPeriod];

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color,
    prefix = ''
  }: { 
    title: string; 
    value: string | number; 
    change?: number; 
    icon: any;
    color: string;
    prefix?: string;
  }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          {change !== undefined && (
            <div className={`flex items-center text-sm font-medium ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">
            {prefix}{typeof value === 'number' ? value.toLocaleString('ro-RO') : value}
          </dd>
        </div>
      </div>
    </div>
  );

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  return (
    <div className="p-6 space-y-6">
      {/* Selector perioadă */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Statistici Generale</h2>
          <div className="flex space-x-2">
            {(['today', 'week', 'month'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {period === 'today' ? 'Azi' : period === 'week' ? 'Săptămână' : 'Lună'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistici principale */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Comenzi"
          value={stats.orders}
          change={selectedPeriod !== 'today' ? mockStats.comparison.ordersChange : undefined}
          icon={Package}
          color="text-blue-600"
        />
        <StatCard
          title="Venituri"
          value={formatPrice(stats.revenue)}
          change={selectedPeriod !== 'today' ? mockStats.comparison.revenueChange : undefined}
          icon={DollarSign}
          color="text-green-600"
        />
        <StatCard
          title="Valoare Medie"
          value={formatPrice(stats.avgOrderValue)}
          change={selectedPeriod !== 'today' ? mockStats.comparison.avgOrderChange : undefined}
          icon={TrendingUp}
          color="text-purple-600"
        />
        <StatCard
          title="Comenzi Finalizate"
          value={`${stats.completedOrders}/${stats.orders}`}
          icon={CheckCircle}
          color="text-indigo-600"
        />
      </div>

      {/* Grafic venituri și tabele */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafic venituri săptămânale */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Venituri Ultimele 7 Zile</h3>
          <div className="space-y-4">
            {revenueData.map((data, index) => (
              <div key={index} className="flex items-center">
                <div className="w-12 text-sm text-gray-500">{data.day}</div>
                <div className="flex-1 mx-4">
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-8">
                      <div 
                        className="bg-blue-600 h-8 rounded-full flex items-center justify-end pr-3"
                        style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                      >
                        <span className="text-xs text-white font-medium">
                          {formatPrice(data.revenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-16 text-right text-sm text-gray-500">
                  {data.orders} cmd
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total perioada</span>
              <span className="font-medium text-gray-900">
                {formatPrice(revenueData.reduce((sum, d) => sum + d.revenue, 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Rata de finalizare */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rata de Finalizare</h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg className="w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - mockStats.comparison.completionRate / 100)}`}
                  className="text-green-600 transform -rotate-90 origin-center transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {mockStats.comparison.completionRate}%
                  </div>
                  <div className="text-xs text-gray-500">finalizate</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">În procesare</span>
              <span className="font-medium text-yellow-600">
                {stats.orders - stats.completedOrders} comenzi
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Finalizate</span>
              <span className="font-medium text-green-600">
                {stats.completedOrders} comenzi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top servicii și clienți */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top servicii */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top 5 Servicii</h3>
          <div className="space-y-3">
            {topServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-500 w-8">{index + 1}.</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    <div className="text-xs text-gray-500">{service.count} comenzi</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatPrice(service.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top clienți */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top 5 Clienți</h3>
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-500 w-8">{index + 1}.</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    <div className="text-xs text-gray-500">{customer.orders} comenzi</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatPrice(customer.totalSpent)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activitate recentă */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Activitate Recentă</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                Comandă nouă <span className="font-medium">#CMD-2024-0045</span> - Ion Popescu
              </p>
              <p className="text-xs text-gray-500">Acum 5 minute</p>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {formatPrice(245)}
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                Comandă finalizată <span className="font-medium">#CMD-2024-0042</span> - Maria Ionescu
              </p>
              <p className="text-xs text-gray-500">Acum 12 minute</p>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {formatPrice(180)}
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                Comandă în procesare <span className="font-medium">#CMD-2024-0044</span> - Andrei Popa
              </p>
              <p className="text-xs text-gray-500">Acum 25 minute</p>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {formatPrice(320)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;