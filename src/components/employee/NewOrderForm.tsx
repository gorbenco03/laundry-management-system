import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  User,
  Phone,
  Mail,
  X,
  Search,
  AlertCircle,
  CheckCircle,
  Package
} from 'lucide-react';
import { Service, ServiceCategory, OrderItem, Customer } from '../../types';
import { generateOrderId, generateItemId, formatPrice, isValidPhoneNumber, isValidEmail } from '../../utils/helpers';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/constants';
import servicesData from '../../data/services.json';

interface NewOrderItem {
  tempId: string;
  serviceCode: string;
  serviceName: string;
  category: string;
  quantity: number;
  price: number;
  priceMax?: number;
  notes: string;
}

const NewOrderForm: React.FC = () => {
  // Customer data
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    phone: '',
    email: ''
  });
  const [customerErrors, setCustomerErrors] = useState<Partial<Customer>>({});

  // Order items
  const [orderItems, setOrderItems] = useState<NewOrderItem[]>([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Services data
  const services: Service[] = servicesData as Service[];
  const categories = Array.from(new Set(services.map(s => s.category)));

  // Filter services based on search and category
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate total price
  const totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Validate customer data
  const validateCustomer = (): boolean => {
    const errors: Partial<Customer> = {};
    
    if (!customer.name.trim()) {
      errors.name = ERROR_MESSAGES.REQUIRED_FIELD;
    }
    
    if (!customer.phone.trim()) {
      errors.phone = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!isValidPhoneNumber(customer.phone)) {
      errors.phone = ERROR_MESSAGES.INVALID_PHONE;
    }
    
    if (customer.email && !isValidEmail(customer.email)) {
      errors.email = ERROR_MESSAGES.INVALID_EMAIL;
    }
    
    setCustomerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add service to order
  const addService = (service: Service) => {
    const newItem: NewOrderItem = {
      tempId: Date.now().toString(),
      serviceCode: service.code,
      serviceName: service.name,
      category: service.category,
      quantity: 1,
      price: service.price,
      priceMax: service.priceMax,
      notes: ''
    };
    
    setOrderItems([...orderItems, newItem]);
    setShowServiceModal(false);
    setSearchQuery('');
  };

  // Update item quantity
  const updateItemQuantity = (tempId: string, quantity: number) => {
    if (quantity < 1) return;
    setOrderItems(orderItems.map(item => 
      item.tempId === tempId ? { ...item, quantity } : item
    ));
  };

  // Update item price (for items with price range)
  const updateItemPrice = (tempId: string, price: number) => {
    setOrderItems(orderItems.map(item => 
      item.tempId === tempId ? { ...item, price } : item
    ));
  };

  // Update item notes
  const updateItemNotes = (tempId: string, notes: string) => {
    setOrderItems(orderItems.map(item => 
      item.tempId === tempId ? { ...item, notes } : item
    ));
  };

  // Remove item from order
  const removeItem = (tempId: string) => {
    setOrderItems(orderItems.filter(item => item.tempId !== tempId));
  };

  // Submit order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCustomer()) {
      return;
    }
    
    if (orderItems.length === 0) {
      alert('Vă rugăm adăugați cel puțin un articol la comandă');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate order ID
      const newOrderId = generateOrderId();
      setOrderId(newOrderId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, this would be an API call to save the order
      console.log('Order submitted:', {
        id: newOrderId,
        customer,
        items: orderItems.map((item, index) => ({
          ...item,
          id: generateItemId(newOrderId, index),
          qrCode: generateItemId(newOrderId, index)
        })),
        totalPrice
      });
      
      setShowSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setCustomer({ name: '', phone: '', email: '' });
        setOrderItems([]);
        setShowSuccess(false);
        setOrderId('');
      }, 3000);
      
    } catch (error) {
      alert('A apărut o eroare. Vă rugăm încercați din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                {SUCCESS_MESSAGES.ORDER_CREATED}
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>ID Comandă: <span className="font-mono font-bold">{orderId}</span></p>
                <p className="mt-1">QR-urile au fost generate și sunt gata pentru printare.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Date Client
          </h2>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nume și Prenume *
              </label>
              <input
                type="text"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  customerErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="ex: Ion Popescu"
              />
              {customerErrors.name && (
                <p className="mt-1 text-sm text-red-600">{customerErrors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon *
              </label>
              <input
                type="tel"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  customerErrors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="ex: 0721234567"
              />
              {customerErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{customerErrors.phone}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (opțional)
              </label>
              <input
                type="email"
                value={customer.email || ''}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  customerErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="ex: client@email.com"
              />
              {customerErrors.email && (
                <p className="mt-1 text-sm text-red-600">{customerErrors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Articole Comandă</h2>
            <button
              type="button"
              onClick={() => setShowServiceModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adaugă Articol
            </button>
          </div>

          {orderItems.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Niciun articol adăugat</h3>
              <p className="mt-1 text-sm text-gray-500">
                Începeți prin a adăuga articole la comandă
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adaugă primul articol
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <div key={item.tempId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {index + 1}. {item.serviceName}
                      </h4>
                      <p className="text-sm text-gray-500">Cod: {item.serviceCode}</p>
                      <p className="text-sm text-gray-500">Categorie: {item.category}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.tempId)}
                      className="ml-4 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cantitate
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(item.tempId, parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preț per bucată
                      </label>
                      {item.priceMax ? (
                        <input
                          type="number"
                          min={item.price}
                          max={item.priceMax}
                          value={item.price}
                          onChange={(e) => updateItemPrice(item.tempId, parseInt(e.target.value) || item.price)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <input
                          type="text"
                          value={formatPrice(item.price)}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      )}
                      {item.priceMax && (
                        <p className="mt-1 text-xs text-gray-500">
                          Interval: {formatPrice(item.price)} - {formatPrice(item.priceMax)}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subtotal
                      </label>
                      <input
                        type="text"
                        value={formatPrice(item.price * item.quantity)}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-medium"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observații (opțional)
                    </label>
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => updateItemNotes(item.tempId, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ex: pete de vin, material delicat"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total and Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total comandă</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(totalPrice)}</p>
            </div>
            <div className="space-x-3">
              <button
                type="button"
                onClick={() => {
                  setCustomer({ name: '', phone: '', email: '' });
                  setOrderItems([]);
                  setCustomerErrors({});
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Anulează
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Se salvează...' : 'Salvează Comanda'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Service Selection Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Selectează Serviciu</h3>
                <button
                  onClick={() => {
                    setShowServiceModal(false);
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Caută după nume sau cod..."
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      !selectedCategory 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Toate
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[60vh]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviciu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preț
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acțiune
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServices.map((service) => (
                    <tr key={service.code} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          <div className="text-sm text-gray-500">Cod: {service.code}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.priceMax ? (
                          <span>{formatPrice(service.price)} - {formatPrice(service.priceMax)}</span>
                        ) : (
                          formatPrice(service.price)
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => addService(service)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredServices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nu s-au găsit servicii</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewOrderForm;