import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  X,
  CheckCircle,
  Clock,
  Package,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { formatDate, formatPrice, formatPhoneNumber } from '../../utils/helpers';
import { STATUS_LABELS } from '../../utils/constants';

// Date simulate extinse
const generateMockOrders = (): Order[] => {
  const customers = [
    { name: 'Ion Popescu', phone: '0721234567', email: 'ion@example.com' },
    { name: 'Maria Ionescu', phone: '0731234567' },
    { name: 'Andrei Popa', phone: '0741234567' },
    { name: 'Elena Dumitrescu', phone: '0751234567', email: 'elena@example.com' },
    { name: 'Ana Georgescu', phone: '0761234567' },
    { name: 'Mihai Constantin', phone: '0771234567', email: 'mihai@example.com' },
    { name: 'Alexandra Radu', phone: '0781234567' },
    { name: 'Cristian Stanescu', phone: '0791234567' }
  ];

  const services = [
    { code: 'CAMASA_BARBAT', name: 'Cămașă bărbat', price: 80 },
    { code: 'ROCHIE_SIMPLA', name: 'Rochie simplă', price: 120 },
    { code: 'COSTUM_2_PIESE', name: 'Costum 2 piese', price: 200 },
    { code: 'PERNA_50x50', name: 'Pernă 50×50', price: 95 },
    { code: 'CURATARE_COVOR', name: 'Curățare covor', price: 30 }
  ];

  const statuses = [OrderStatus.REGISTERED, OrderStatus.IN_PROGRESS, OrderStatus.READY, OrderStatus.DELIVERED];

  const orders: Order[] = [];
  
  // Generăm 50 de comenzi pentru ultimele 30 de zile
  for (let i = 0; i < 50; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const numItems = Math.floor(Math.random() * 4) + 1;
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));
    
    const items = [];
    let totalPrice = 0;
    
    for (let j = 0; j < numItems; j++) {
      const service = services[Math.floor(Math.random() * services.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const itemId = `CMD-2024-${String(i + 1).padStart(4, '0')}-A${j + 1}`;
      
      items.push({
        id: itemId,
        serviceCode: service.code,
        serviceName: service.name,
        quantity,
        price: service.price,
        qrCode: itemId,
        isReady: Math.random() > 0.3
      });
      
      totalPrice += service.price * quantity;
    }
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    orders.push({
      id: `CMD-2024-${String(i + 1).padStart(4, '0')}`,
      customer,
      items,
      totalPrice,
      status,
      createdAt: orderDate,
      updatedAt: new Date(orderDate.getTime() + Math.random() * 86400000),
      completedAt: status === OrderStatus.DELIVERED ? new Date() : undefined,
      notes: Math.random() > 0.7 ? 'Client fidel' : undefined
    });
  }
  
  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

const mockOrders = generateMockOrders();

const OrdersList: React.FC = () => {
  // State pentru filtre și căutare
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const itemsPerPage = 10;

  // Filtrare comenzi
  const filteredOrders = useMemo(() => {
    let filtered = [...mockOrders];

    // Căutare
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.phone.includes(query) ||
        order.items.some(item => item.serviceName.toLowerCase().includes(query))
      );
    }

    // Filtru status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filtru dată
    const now = new Date();
    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.toDateString() === now.toDateString();
        });
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(order => 
          new Date(order.createdAt) >= weekAgo
        );
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(order => 
          new Date(order.createdAt) >= monthAgo
        );
        break;
    }

    return filtered;
  }, [searchQuery, statusFilter, dateFilter]);

  // Paginare
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Statistici pentru filtrele curente
  const stats = useMemo(() => {
    const total = filteredOrders.length;
    const revenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const byStatus = {
      [OrderStatus.REGISTERED]: filteredOrders.filter(o => o.status === OrderStatus.REGISTERED).length,
      [OrderStatus.IN_PROGRESS]: filteredOrders.filter(o => o.status === OrderStatus.IN_PROGRESS).length,
      [OrderStatus.READY]: filteredOrders.filter(o => o.status === OrderStatus.READY).length,
      [OrderStatus.DELIVERED]: filteredOrders.filter(o => o.status === OrderStatus.DELIVERED).length,
    };
    
    return { total, revenue, byStatus };
  }, [filteredOrders]);

  // Export CSV
  const exportToCSV = () => {
    const headers = ['ID Comandă', 'Client', 'Telefon', 'Email', 'Status', 'Total', 'Data Creare', 'Articole'];
    const rows = filteredOrders.map(order => [
      order.id,
      order.customer.name,
      order.customer.phone,
      order.customer.email || '',
      STATUS_LABELS[order.status],
      order.totalPrice,
      formatDate(order.createdAt),
      order.items.map(item => `${item.serviceName} x${item.quantity}`).join('; ')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `comenzi_${formatDate(new Date(), 'API')}.csv`;
    link.click();
  };

  // Status badge
  const getStatusBadge = (status: OrderStatus) => {
    const config = {
      [OrderStatus.REGISTERED]: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      [OrderStatus.IN_PROGRESS]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      [OrderStatus.READY]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [OrderStatus.DELIVERED]: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle }
    };

    const { color, icon: Icon } = config[status];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {STATUS_LABELS[status]}
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* Header cu statistici */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Total Comenzi</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">În Procesare</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.byStatus[OrderStatus.REGISTERED] + stats.byStatus[OrderStatus.IN_PROGRESS]}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Finalizate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.byStatus[OrderStatus.READY] + stats.byStatus[OrderStatus.DELIVERED]}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Valoare Totală</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.revenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtre și căutare */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Căutare */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Caută după ID, client, telefon sau serviciu..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filtru status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toate statusurile</option>
              <option value={OrderStatus.REGISTERED}>Înregistrate</option>
              <option value={OrderStatus.IN_PROGRESS}>În procesare</option>
              <option value={OrderStatus.READY}>Gata pentru ridicare</option>
              <option value={OrderStatus.DELIVERED}>Livrate</option>
            </select>
          </div>

          {/* Filtru perioadă */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toate perioadele</option>
              <option value="today">Azi</option>
              <option value="week">Ultima săptămână</option>
              <option value="month">Ultima lună</option>
            </select>
          </div>
        </div>

        {/* Acțiuni */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Afișare {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOrders.length)} din {filteredOrders.length} comenzi
          </p>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabel comenzi */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Comandă
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Articole
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Acțiuni</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                    <div className="text-sm text-gray-500">{formatPhoneNumber(order.customer.phone)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.items.length} {order.items.length === 1 ? 'articol' : 'articole'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.items.filter(item => item.isReady).length} finalizate
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(order.totalPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginare */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Următor
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Pagina <span className="font-medium">{currentPage}</span> din{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal detalii comandă */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Detalii Comandă {selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Informații client */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Informații Client</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nume</p>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefon</p>
                    <p className="font-medium">{formatPhoneNumber(selectedOrder.customer.phone)}</p>
                  </div>
                  {selectedOrder.customer.email && (
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedOrder.customer.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Informații comandă */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Informații Comandă</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data înregistrării</p>
                    <p className="font-medium">{formatDate(selectedOrder.createdAt, 'DISPLAY_WITH_TIME')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ultima actualizare</p>
                    <p className="font-medium">{formatDate(selectedOrder.updatedAt, 'DISPLAY_WITH_TIME')}</p>
                  </div>
                </div>
              </div>

              {/* Lista articolelor */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Articole</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Serviciu
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Cantitate
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Preț unitar
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {item.serviceName}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {formatPrice(item.price)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </td>
                          <td className="px-4 py-2">
                            {item.isReady ? (
                              <span className="inline-flex items-center text-xs text-green-700">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Finalizat
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-xs text-yellow-700">
                                <Clock className="h-3 w-3 mr-1" />
                                În procesare
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right font-medium">
                          Total comandă:
                        </td>
                        <td className="px-4 py-2 font-bold text-gray-900">
                          {formatPrice(selectedOrder.totalPrice)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;