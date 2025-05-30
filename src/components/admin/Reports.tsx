import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  FileText,
  DollarSign,
  Package,
  Users,
  Printer,
  Filter
} from 'lucide-react';
import { formatDate, formatPrice } from '../../utils/helpers';
import { OrderStatus } from '../../types';
import { STATUS_LABELS } from '../../utils/constants';

// Date simulate pentru rapoarte
const generateReportData = () => {
  const currentDate = new Date();
  const dailyData = [];
  const monthlyData = [];
  
  // Date zilnice pentru ultima lună
  for (let i = 30; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    
    dailyData.push({
      date,
      orders: Math.floor(Math.random() * 50) + 20,
      revenue: Math.floor(Math.random() * 15000) + 5000,
      newCustomers: Math.floor(Math.random() * 10) + 2,
      avgOrderValue: Math.floor(Math.random() * 200) + 150
    });
  }
  
  // Date lunare pentru ultimul an
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    
    monthlyData.push({
      date,
      orders: Math.floor(Math.random() * 1500) + 800,
      revenue: Math.floor(Math.random() * 400000) + 200000,
      newCustomers: Math.floor(Math.random() * 200) + 50,
      avgOrderValue: Math.floor(Math.random() * 300) + 200
    });
  }
  
  return { dailyData, monthlyData };
};

const { dailyData, monthlyData } = generateReportData();

// Date pentru servicii populare
const serviceStats = [
  { name: 'Cămașă bărbat', count: 1542, revenue: 123360, percentage: 22 },
  { name: 'Rochie simplă tricotaj', count: 987, revenue: 118440, percentage: 18 },
  { name: 'Costum 2 piese bărbat', count: 654, revenue: 130800, percentage: 15 },
  { name: 'Curățare covor', count: 892, revenue: 80280, percentage: 12 },
  { name: 'Pernă 50×50', count: 1123, revenue: 106685, percentage: 10 },
  { name: 'Alte servicii', count: 2341, revenue: 187280, percentage: 23 }
];

// Date pentru performanță angajați
const employeeStats = [
  { name: 'Ion Popescu', role: 'Angajat', ordersProcessed: 342, avgProcessingTime: '2.5 ore', satisfaction: 4.8 },
  { name: 'Maria Ionescu', role: 'Angajat', ordersProcessed: 298, avgProcessingTime: '2.8 ore', satisfaction: 4.9 },
  { name: 'Andrei Popa', role: 'Angajat', ordersProcessed: 276, avgProcessingTime: '3.1 ore', satisfaction: 4.7 },
  { name: 'Elena Dumitrescu', role: 'Angajat', ordersProcessed: 312, avgProcessingTime: '2.6 ore', satisfaction: 4.8 }
];

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'custom'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [customDateRange, setCustomDateRange] = useState({
    start: formatDate(new Date(new Date().setDate(new Date().getDate() - 30)), 'API'),
    end: formatDate(new Date(), 'API')
  });

  // Calculează totaluri pentru perioada selectată
  const periodTotals = useMemo(() => {
    let data = reportType === 'daily' ? dailyData : monthlyData;
    
    if (reportType === 'monthly') {
      data = monthlyData.filter(d => 
        d.date.getMonth() === selectedMonth && 
        d.date.getFullYear() === selectedYear
      );
    }
    
    const totals = data.reduce((acc, day) => ({
      orders: acc.orders + day.orders,
      revenue: acc.revenue + day.revenue,
      newCustomers: acc.newCustomers + day.newCustomers,
      avgOrderValue: acc.avgOrderValue + day.avgOrderValue
    }), { orders: 0, revenue: 0, newCustomers: 0, avgOrderValue: 0 });
    
    if (data.length > 0) {
      totals.avgOrderValue = totals.avgOrderValue / data.length;
    }
    
    return totals;
  }, [reportType, selectedMonth, selectedYear]);

  // Compară cu perioada anterioară
  const comparison = useMemo(() => {
    const current = periodTotals;
    let previous = { orders: 0, revenue: 0, newCustomers: 0, avgOrderValue: 0 };
    
    if (reportType === 'monthly' && selectedMonth > 0) {
      const prevMonthData = monthlyData.filter(d => 
        d.date.getMonth() === selectedMonth - 1 && 
        d.date.getFullYear() === selectedYear
      );
      
      if (prevMonthData.length > 0) {
        previous = prevMonthData.reduce((acc, day) => ({
          orders: acc.orders + day.orders,
          revenue: acc.revenue + day.revenue,
          newCustomers: acc.newCustomers + day.newCustomers,
          avgOrderValue: acc.avgOrderValue + day.avgOrderValue / prevMonthData.length
        }), { orders: 0, revenue: 0, newCustomers: 0, avgOrderValue: 0 });
      }
    }
    
    return {
      orders: previous.orders > 0 ? ((current.orders - previous.orders) / previous.orders * 100).toFixed(1) : 0,
      revenue: previous.revenue > 0 ? ((current.revenue - previous.revenue) / previous.revenue * 100).toFixed(1) : 0,
      newCustomers: previous.newCustomers > 0 ? ((current.newCustomers - previous.newCustomers) / previous.newCustomers * 100).toFixed(1) : 0,
      avgOrderValue: previous.avgOrderValue > 0 ? ((current.avgOrderValue - previous.avgOrderValue) / previous.avgOrderValue * 100).toFixed(1) : 0
    };
  }, [periodTotals, reportType, selectedMonth, selectedYear]);

  // Export PDF
  const exportPDF = () => {
    alert('Funcția de export PDF va fi implementată cu o librărie precum jsPDF');
  };

  // Export Excel
  const exportExcel = () => {
    alert('Funcția de export Excel va fi implementată cu o librărie precum SheetJS');
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  const months = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header cu selectoare */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Rapoarte Detaliate</h2>
            <p className="text-sm text-gray-500">Analizează performanța afacerii tale</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={exportPDF}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </button>
            <button
              onClick={exportExcel}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Printer className="h-4 w-4 mr-2" />
              Printează
            </button>
          </div>
        </div>

        {/* Selectoare perioadă */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tip raport</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="daily">Zilnic (ultima lună)</option>
              <option value="monthly">Lunar</option>
              <option value="custom">Perioadă personalizată</option>
            </select>
          </div>

          {reportType === 'monthly' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Luna</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">An</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                </select>
              </div>
            </>
          )}

          {reportType === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">De la</label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Până la</label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Statistici principale */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className={`flex items-center text-sm font-medium ${
              Number(comparison.orders) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {Number(comparison.orders) >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(Number(comparison.orders))}%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{periodTotals.orders.toLocaleString('ro-RO')}</h3>
          <p className="text-sm text-gray-500">Total comenzi</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className={`flex items-center text-sm font-medium ${
              Number(comparison.revenue) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {Number(comparison.revenue) >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(Number(comparison.revenue))}%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatPrice(periodTotals.revenue)}</h3>
          <p className="text-sm text-gray-500">Venituri totale</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className={`flex items-center text-sm font-medium ${
              Number(comparison.newCustomers) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {Number(comparison.newCustomers) >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(Number(comparison.newCustomers))}%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{periodTotals.newCustomers}</h3>
          <p className="text-sm text-gray-500">Clienți noi</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div className={`flex items-center text-sm font-medium ${
              Number(comparison.avgOrderValue) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {Number(comparison.avgOrderValue) >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(Number(comparison.avgOrderValue))}%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatPrice(periodTotals.avgOrderValue)}</h3>
          <p className="text-sm text-gray-500">Valoare medie comandă</p>
        </div>
      </div>

      {/* Grafice și analize */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafic evoluție venituri */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Evoluție Venituri</h3>
          <div className="space-y-4">
            {(reportType === 'daily' ? dailyData.slice(-7) : monthlyData.slice(-6)).map((data, index) => {
              const maxRevenue = Math.max(...(reportType === 'daily' ? dailyData : monthlyData).map(d => d.revenue));
              const percentage = (data.revenue / maxRevenue) * 100;
              
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      {reportType === 'daily' 
                        ? formatDate(data.date, 'DISPLAY')
                        : months[data.date.getMonth()]
                      }
                    </span>
                    <span className="font-medium">{formatPrice(data.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribuție servicii */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Servicii după Venituri</h3>
          <div className="space-y-4">
            {serviceStats.map((service, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">{service.name}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{formatPrice(service.revenue)}</span>
                    <span className="text-xs text-gray-500 ml-2">({service.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === 0 ? 'bg-blue-600' :
                      index === 1 ? 'bg-green-600' :
                      index === 2 ? 'bg-yellow-600' :
                      index === 3 ? 'bg-purple-600' :
                      index === 4 ? 'bg-pink-600' :
                      'bg-gray-600'
                    }`}
                    style={{ width: `${service.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabel performanță angajați */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performanță Angajați</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Angajat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comenzi procesate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timp mediu procesare
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satisfacție clienți
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performanță
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeeStats.map((employee, index) => {
                const performance = (employee.ordersProcessed / 350) * 100;
                
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.role}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.ordersProcessed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.avgProcessingTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">{employee.satisfaction}</span>
                        <span className="ml-1 text-yellow-400">★</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            performance >= 90 ? 'bg-green-600' :
                            performance >= 70 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${performance}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{performance.toFixed(0)}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rezumat raport */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Rezumat Raport</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Perioada analizată: {reportType === 'monthly' ? `${months[selectedMonth]} ${selectedYear}` : 'Ultima lună'}</p>
          <p>• Total venituri: {formatPrice(periodTotals.revenue)}</p>
          <p>• Rata medie de finalizare: 94.2%</p>
          <p>• Cel mai solicitat serviciu: Cămașă bărbat (22% din total)</p>
          <p>• Recomandare: Creștere capacitate pentru servicii de curățare costume în perioada următoare</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;