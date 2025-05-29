import React, { useState } from 'react';
import { 
  QrCode, 
  CheckCircle, 
  AlertCircle, 
  Package,
  Clock,
  Search,
  X,
  Loader2
} from 'lucide-react';
import { Order, OrderStatus, OrderItem } from '../../types';
import { formatDate, formatPrice } from '../../utils/helpers';
import { SUCCESS_MESSAGES } from '../../utils/constants';

// Mock data - în producție ar veni din API
const mockOrderData: Order = {
  id: 'CMD-2024-0001',
  customer: { name: 'Ion Popescu', phone: '0721234567', email: 'ion@example.com' },
  items: [
    { 
      id: 'CMD-2024-0001-A1', 
      serviceCode: 'PERNA_50x50_CAT1', 
      serviceName: 'Curățare pernă 50×50', 
      quantity: 2, 
      price: 95, 
      qrCode: 'CMD-2024-0001-A1', 
      isReady: false,
      notes: 'Pete de cafea'
    },
    { 
      id: 'CMD-2024-0001-A2', 
      serviceCode: 'CAMASA_BARBAT', 
      serviceName: 'Cămașă bărbat', 
      quantity: 3, 
      price: 80, 
      qrCode: 'CMD-2024-0001-A2', 
      isReady: true,
      notes: ''
    },
    { 
      id: 'CMD-2024-0001-A3', 
      serviceCode: 'ROCHIE_SIMPLA', 
      serviceName: 'Rochie simplă tricotaj', 
      quantity: 1, 
      price: 120, 
      qrCode: 'CMD-2024-0001-A3', 
      isReady: false,
      notes: 'Material delicat'
    }
  ],
  totalPrice: 510,
  status: OrderStatus.IN_PROGRESS,
  createdAt: new Date('2024-05-28T10:00:00'),
  updatedAt: new Date('2024-05-28T14:30:00')
};

const ScanItems: React.FC = () => {
  const [scanMode, setScanMode] = useState<'scanning' | 'manual' | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [scannedItem, setScannedItem] = useState<OrderItem | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Simulare scanare QR
  const handleScan = (code: string) => {
    setIsProcessing(true);
    
    // Simulare delay pentru efect realist
    setTimeout(() => {
      // Verifică dacă este un cod valid de articol (format: CMD-YYYY-XXXX-AX)
      if (code.match(/^CMD-\d{4}-\d{4}-A\d+$/)) {
        // Găsește articolul în comandă
        const item = mockOrderData.items.find(i => i.qrCode === code);
        
        if (item) {
          setCurrentOrder(mockOrderData);
          setScannedItem(item);
          setScanMode(null);
          setManualCode('');
        } else {
          alert('Articolul nu a fost găsit în sistem');
        }
      } else {
        alert('Cod QR invalid. Formatul corect: CMD-YYYY-XXXX-AX');
      }
      
      setIsProcessing(false);
    }, 1000);
  };

  // Marchează articolul ca finalizat
  const markItemAsReady = () => {
    if (!scannedItem || !currentOrder) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      // Actualizează statusul articolului
      const updatedItems = currentOrder.items.map(item =>
        item.id === scannedItem.id ? { ...item, isReady: true } : item
      );
      
      // Verifică dacă toate articolele sunt gata
      const allReady = updatedItems.every(item => item.isReady);
      
      // Actualizează comanda
      const updatedOrder = {
        ...currentOrder,
        items: updatedItems,
        status: allReady ? OrderStatus.READY : currentOrder.status,
        updatedAt: new Date()
      };
      
      setCurrentOrder(updatedOrder);
      setSuccessMessage(SUCCESS_MESSAGES.ITEM_MARKED_READY);
      
      // Dacă toate articolele sunt gata, trimite notificare
      if (allReady) {
        setSuccessMessage(`${SUCCESS_MESSAGES.ITEM_MARKED_READY} - Comanda este complet finalizată!`);
      }
      
      // Reset după 3 secunde
      setTimeout(() => {
        setScannedItem(null);
        setSuccessMessage('');
        if (allReady) {
          setCurrentOrder(null);
        }
      }, 3000);
      
      setIsProcessing(false);
    }, 1000);
  };

  // Calculează progresul comenzii
  const getOrderProgress = (order: Order) => {
    const readyItems = order.items.filter(item => item.isReady).length;
    const totalItems = order.items.length;
    const percentage = (readyItems / totalItems) * 100;
    
    return { readyItems, totalItems, percentage };
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Selector mod scanare */}
      {!scanMode && !currentOrder && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6 text-center">
            Selectează metoda de scanare
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setScanMode('scanning')}
              className="relative rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex flex-col items-center">
                <QrCode className="h-12 w-12 text-gray-600 mb-3" />
                <h3 className="text-sm font-medium text-gray-900">Scanare cu Camera</h3>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Folosește camera pentru a scana codul QR
                </p>
              </div>
            </button>
            
            <button
              onClick={() => setScanMode('manual')}
              className="relative rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex flex-col items-center">
                <Search className="h-12 w-12 text-gray-600 mb-3" />
                <h3 className="text-sm font-medium text-gray-900">Introducere Manuală</h3>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Introdu manual codul de pe etichetă
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Mod scanare cu camera */}
      {scanMode === 'scanning' && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Scanare QR</h2>
            <button
              onClick={() => setScanMode(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Placeholder pentru scanner */}
          <div className="bg-gray-900 rounded-lg aspect-square max-w-md mx-auto mb-6 flex items-center justify-center">
            <div className="text-center">
              <QrCode className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Camera va fi activată aici</p>
              <p className="text-sm text-gray-500 mt-2">
                În producție, aici va fi componenta de scanare QR
              </p>
            </div>
          </div>
          
          {/* Simulare scanare */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">Pentru testare, apasă butonul de mai jos</p>
            <button
              onClick={() => handleScan('CMD-2024-0001-A1')}
              disabled={isProcessing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Se procesează...
                </>
              ) : (
                'Simulează Scanare (CMD-2024-0001-A1)'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mod introducere manuală */}
      {scanMode === 'manual' && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Introducere Cod Manual</h2>
            <button
              onClick={() => {
                setScanMode(null);
                setManualCode('');
              }}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cod articol (de pe etichetă)
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="ex: CMD-2024-0001-A1"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => handleScan(manualCode)}
                disabled={!manualCode || isProcessing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Formatul corect: CMD-YYYY-XXXX-AX (ex: CMD-2024-0001-A1)
            </p>
          </div>
        </div>
      )}

      {/* Detalii comandă și articol scanat */}
      {currentOrder && scannedItem && (
        <div className="space-y-6">
          {/* Info comandă */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Detalii Comandă</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">ID Comandă</p>
                <p className="font-medium">{currentOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Client</p>
                <p className="font-medium">{currentOrder.customer.name}</p>
                <p className="text-sm text-gray-500">{currentOrder.customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data înregistrării</p>
                <p className="font-medium">{formatDate(currentOrder.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total comandă</p>
                <p className="font-medium">{formatPrice(currentOrder.totalPrice)}</p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progres comandă</span>
                <span>
                  {getOrderProgress(currentOrder).readyItems} din {getOrderProgress(currentOrder).totalItems} articole finalizate
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getOrderProgress(currentOrder).percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Articol scanat */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Articol Scanat</h2>
            
            {scannedItem.isReady ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Acest articol a fost deja marcat ca finalizat
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Finalizat la: {formatDate(new Date(), 'DISPLAY_WITH_TIME')}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <p className="ml-3 text-sm font-medium text-green-800">
                    {successMessage}
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Cod articol</p>
                  <p className="font-mono font-medium">{scannedItem.qrCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center">
                    {scannedItem.isReady ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-700">Finalizat</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-yellow-700">În procesare</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Serviciu</p>
                <p className="font-medium">{scannedItem.serviceName}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Cantitate</p>
                  <p className="font-medium">{scannedItem.quantity} buc</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preț</p>
                  <p className="font-medium">{formatPrice(scannedItem.price * scannedItem.quantity)}</p>
                </div>
              </div>
              
              {scannedItem.notes && (
                <div>
                  <p className="text-sm text-gray-500">Observații</p>
                  <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex">
                      <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />
                      <p className="ml-2 text-sm text-yellow-800">{scannedItem.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex space-x-3">
              {!scannedItem.isReady && !successMessage && (
                <button
                  onClick={markItemAsReady}
                  disabled={isProcessing}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Se procesează...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marchează ca Finalizat
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={() => {
                  setScannedItem(null);
                  setScanMode('scanning');
                  setSuccessMessage('');
                }}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Scanează Alt Articol
              </button>
            </div>
          </div>

          {/* Lista tuturor articolelor din comandă */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Toate articolele din comandă</h3>
            <div className="space-y-3">
              {currentOrder.items.map((item) => (
                <div 
                  key={item.id} 
                  className={`border rounded-lg p-3 ${
                    item.id === scannedItem.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{item.serviceName}</p>
                      <p className="text-xs text-gray-500">Cod: {item.qrCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{item.quantity} buc</p>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanItems;