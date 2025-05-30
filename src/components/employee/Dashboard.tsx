import React from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Order, OrderStatus } from '../../types';
import { formatDate, formatPrice } from '../../utils/helpers';
import { STATUS_LABELS } from '../../utils/constants';
import { useOrderStatistics, useOrders } from '../../hooks/useOrders'; // Importăm hook-urile

const Dashboard: React.FC = () => {
  // Folosim hook-ul pentru statistici
  const { statistics, loading: statsLoading, error: statsError, refetch: refetchStats } = useOrderStatistics();

  // Folosim hook-ul pentru comenzi recente (ultimele 10 comenzi)
  const { orders, loading: ordersLoading, error: ordersError, refetch: refetchOrders } = useOrders({
    limit: 10, // Limităm la 10 comenzi recente
    page: 1
  });

  // Funcție pentru badge-ul de status
  const getStatusBadge = (status: OrderStatus) => {
    const config = {
      [OrderStatus.REGISTERED]: { color: 'blue', icon: Clock },
      [OrderStatus.IN_PROGRESS]: { color: 'yellow', icon: Clock },
      [OrderStatus.READY]: { color: 'green', icon: CheckCircle },
      [OrderStatus.DELIVERED]: { color: 'gray', icon: CheckCircle },

    };

    const { color, icon: Icon } = config[status];
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      gray: 'bg-gray-100 text-gray-800',
      red: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color as keyof typeof colors]}`}>
        <Icon className="w-3 h-3 mr-1" />
        {STATUS_LABELS[status]}
      </span>
    );
  };

  // Funcție pentru statusul articolelor
  const getItemsStatus = (items: any[]) => {
    const ready = items.filter(item => item.isReady).length;
    const total = items.length;
    return `${ready}/${total}`;
  };

  // Gestionăm starea de încărcare și erorile
  if (statsLoading || ordersLoading) {
    return <div className="p-6">Se încarcă...</div>;
  }

  if (statsError || ordersError) {
    return (
      <div className="p-6 text-red-500">
        Eroare: {statsError || ordersError}
        <button onClick={() => { refetchStats(); refetchOrders(); }} className="ml-2 text-blue-600">
          Reîncearcă
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Comenzi Azi</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{statistics.todayOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{statistics.activeOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Gata pentru ridicare</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{statistics.readyOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Venituri Azi</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{formatPrice(statistics.todayRevenue)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <Link
          to="/employee/new-order"
          className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
        >
          <div className="flex-shrink-0">
            <Package className="h-6 w-6 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="absolute inset-0" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-900">Comandă Nouă</p>
            <p className="text-sm text-gray-500">Creează o comandă nouă</p>
          </div>
        </Link>

        <Link
          to="/employee/scan"
          className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
        >
          <div className="flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="absolute inset-0" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-900">Scanare Articole</p>
            <p className="text-sm text-gray-500">Marchează articole ca finalizate</p>
          </div>
        </Link>

        <Link
          to="/employee/search"
          className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
        >
          <div className="flex-shrink-0">
            <Package className="h-6 w-6 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="absolute inset-0" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-900">Predare Comandă</p>
            <p className="text-sm text-gray-500">Caută și predă comenzi</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Comenzi Recente</h3>
          <Link to="/employee/search" className="text-sm text-blue-600 hover:text-blue-500 flex items-center">
            Vezi toate
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-hidden">
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>{order.customer.name}</div>
                      <div className="text-xs text-gray-400">{order.customer.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span>{getItemsStatus(order.items)}</span>
                      {order.items.some(item => item.isReady) && order.items.some(item => !item.isReady) && (
                        <AlertCircle className="ml-1 h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;