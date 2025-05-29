import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  User,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Printer,
  FileText,
  X
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { formatDate, formatPrice, formatPhoneNumber } from '../../utils/helpers';
import { STATUS_LABELS } from '../../utils/constants';

// Date simulate - în producție ar veni din API
const mockOrders: Order[] = [
  {
    id: 'CMD-2024-0001',
    customer: { name: 'Ion Popescu', phone: '0721234567', email: 'ion@example.com' },
    items: [
      { id: 'CMD-2024-0001-A1', serviceCode: 'PERNA_50x50_CAT1', serviceName: 'Pernă 50×50', quantity: 2, price: 95, qrCode: 'CMD-2024-0001-A1', isReady: true },
      { id: 'CMD-2024-0001-A2', serviceCode: 'CAMASA_BARBAT', serviceName: 'Cămașă bărbat', quantity: 3, price: 80, qrCode: 'CMD-2024-0001-A2', isReady: true }
    ],
    totalPrice: 430,
    status: OrderStatus.READY,
    createdAt: new Date('2024-05-28T10:00:00'),
    updatedAt: new Date('2024-05-29T09:00:00'),
    notes: 'Client fidel'
  },
  {
    id: 'CMD-2024-0002',
    customer: { name: 'Maria Ionescu', phone: '0731234567' },
    items: [
      { id: 'CMD-2024-0002-A1', serviceCode: 'ROCHIE_SIMPLA', serviceName: 'Rochie simplă', quantity: 1, price: 120, qrCode: 'CMD-2024-0002-A1', isReady: true }
    ],
    totalPrice: 120,
    status: OrderStatus.READY,
    createdAt: new Date('2024-05-28T09:00:00'),
    updatedAt: new Date('2024-05-28T13:00:00')
  },
  {
    id: 'CMD-2024-0003',
    customer: { name: 'Andrei Popa', phone: '0741234567' },
    items: [
      { id: 'CMD-2024-0003-A1', serviceCode: 'COSTUM_2_PIESE_BARBAT', serviceName: 'Costum 2 piese', quantity: 1, price: 200, qrCode: 'CMD-2024-0003-A1', isReady: false }
    ],
    totalPrice: 200,
    status: OrderStatus.IN_PROGRESS,
    createdAt: new Date('2024-05-28T15:00:00'),
    updatedAt: new Date('2024-05-28T15:00:00')
  },
  {
    id: 'CMD-2024-0004',
    customer: { name: 'Elena Dumitrescu', phone: '0751234567', email: 'elena@example.com' },
    items: [
      { id: 'CMD-2024-0004-A1', serviceCode: 'PLAPUMA_DE_LANA_2_PERSOANE', serviceName: 'Plapumă de lână 2 persoane', quantity: 1, price: 200, qrCode: 'CMD-2024-0004-A1', isReady: true },
      { id: 'CMD-2024-0004-A2', serviceCode: 'PERNA_40x40_CAT1', serviceName: 'Pernă 40×40', quantity: 4, price: 70, qrCode: 'CMD-2024-0004-A2', isReady: true }
    ],
    totalPrice: 480,
    status: OrderStatus.DELIVERED,
    createdAt: new Date('2024-05-25T10:00:00'),
    updatedAt: new Date('2024-05-27T14:00:00'),
    completedAt: new Date('2024-05-27T14:00:00')
  }
];

const SearchOrder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'id' | 'name' | 'phone'>('phone');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliverySuccess, setDeliverySuccess] = useState(false);

  // Funcție de căutare
  const searchOrders = (): Order[] => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    
    return mockOrders.filter(order => {
      switch (searchType) {
        case 'id':
          return order.id.toLowerCase().includes(query);
        case 'name':
          return order.customer.name.toLowerCase().includes(query);
        case 'phone':
          return formatPhoneNumber(order.customer.phone).includes(query.replace(/\s/g, ''));
        default:
          return false;
      }
    });
  };

  const searchResults = searchOrders();

  // Obține badge pentru status
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

  // Procesare predare comandă
  const handleDelivery = () => {
    if (!selectedOrder) return;

    setIsProcessing(true);

    // Simulare API call
    setTimeout(() => {
      setDeliverySuccess(true);
      setIsProcessing(false);

      // Reset după 3 secunde
      setTimeout(() => {
        setShowDeliveryModal(false);
        setSelectedOrder(null);
        setDeliverySuccess(false);
        setSearchQuery('');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Bara de căutare */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Căutare Comandă</h2>
        
        <div className="space-y-4">
          {/* Selector tip căutare */}
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="phone"
                checked={searchType === 'phone'}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">După telefon</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="name"
                checked={searchType === 'name'}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">După nume</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="id"
                checked={searchType === 'id'}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">După ID comandă</span>
            </label>
          </div>

          {/* Input căutare */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchType === 'phone' ? 'ex: 0721234567' :
                searchType === 'name' ? 'ex: Ion Popescu' :
                'ex: CMD-2024-0001'
              }
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Rezultate căutare */}
      {searchQuery && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Rezultate căutare ({searchResults.length})
            </h3>
          </div>

          {searchResults.length > 0 ? (
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
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Acțiuni</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="font-medium text-gray-900">{order.customer.name}</div>
                          <div className="text-gray-500">{formatPhoneNumber(order.customer.phone)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items.length} articole
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Vezi detalii
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nu s-au găsit comenzi</h3>
              <p className="mt-1 text-sm text-gray-500">
                Verificați criteriile de căutare și încercați din nou
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal detalii comandă */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
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

            {/* Content */}
            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Info client */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Informații Client
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nume</p>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefon</p>
                    <p className="font-medium flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-gray-400" />
                      {formatPhoneNumber(selectedOrder.customer.phone)}
                    </p>
                  </div>
                  {selectedOrder.customer.email && (
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        {selectedOrder.customer.email}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Info comandă */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Informații Comandă</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data înregistrării</p>
                    <p className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {formatDate(selectedOrder.createdAt, 'DISPLAY_WITH_TIME')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ultima actualizare</p>
                    <p className="font-medium">{formatDate(selectedOrder.updatedAt, 'DISPLAY_WITH_TIME')}</p>
                  </div>
                </div>
                {selectedOrder.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Observații</p>
                    <p className="mt-1 text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded p-2">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Lista articolelor */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Articole ({selectedOrder.items.length})</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Articol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cod QR
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cantitate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preț
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.serviceName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                            {item.qrCode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity} buc
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatPrice(item.price * item.quantity)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
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
                        <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                          Total:
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                          {formatPrice(selectedOrder.totalPrice)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Avertismente */}
              {selectedOrder.status === OrderStatus.IN_PROGRESS && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Comandă în procesare
                      </h3>
                      <p className="mt-1 text-sm text-yellow-700">
                        Nu toate articolele sunt finalizate. Verificați cu departamentul de producție înainte de predare.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedOrder.status === OrderStatus.DELIVERED && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Comandă deja livrată
                      </h3>
                      <p className="mt-1 text-sm text-blue-700">
                        Această comandă a fost livrată la {selectedOrder.completedAt && formatDate(selectedOrder.completedAt, 'DISPLAY_WITH_TIME')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
              <div className="flex space-x-3">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Printează
                </button>
                <button
                  onClick={() => alert('Generare bon fiscal...')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Bon Fiscal
                </button>
              </div>
              
              {selectedOrder.status === OrderStatus.READY && (
                <button
                  onClick={() => setShowDeliveryModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Predă Comanda
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmare predare */}
      {showDeliveryModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            {!deliverySuccess ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Confirmare Predare Comandă
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    Confirmați predarea comenzii <span className="font-mono font-bold">{selectedOrder.id}</span> către clientul:
                  </p>
                  <p className="mt-2 font-medium text-gray-900">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-gray-500">{formatPhoneNumber(selectedOrder.customer.phone)}</p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800">
                        Asigurați-vă că ați verificat toate articolele și că clientul a plătit suma de {formatPrice(selectedOrder.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeliveryModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Anulează
                  </button>
                  <button
                    onClick={handleDelivery}
                    disabled={isProcessing}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {isProcessing ? 'Se procesează...' : 'Confirmă Predarea'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Comandă predată cu succes!
                </h3>
                <p className="text-sm text-gray-500">
                  Comanda {selectedOrder.id} a fost marcată ca livrată.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchOrder;