import api from './api';
import { Order, OrderItem, OrderStatus } from '../types';

interface CreateOrderDto {
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  items: Array<{
    serviceCode: string;
    quantity: number;
    price: number;
    notes?: string;
  }>;
  notes?: string;
  isExpress?: boolean;
}

interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

interface OrderResponse {
  success: boolean;
  data: Order;
}

interface CreateOrderResponse {
  success: boolean;
  data: {
    order: Order;
    qrCodes: string[]; // Array de imagini base64
  };
  message: string;
}

interface StatisticsResponse {
  success: boolean;
  data: {
    todayOrders: number;
    todayRevenue: number;
    activeOrders: number;
    readyOrders: number;
    averageOrderValue: number;
    popularServices: Array<{ serviceName: string; count: number }>;
  };
}

interface ScanResponse {
  success: boolean;
  data: {
    order: Order;
    allItemsReady: boolean;
    notification?: string;
  };
  message: string;
}

class OrdersService {
  // Creare comandă nouă
  async createOrder(orderData: CreateOrderDto): Promise<CreateOrderResponse> {
    const response = await api.post<CreateOrderResponse>('/orders', orderData);
    return response.data;
  }

  // Obține toate comenzile cu filtrare
  async getOrders(params?: {
    status?: OrderStatus;
    phone?: string;
    customerName?: string;
    orderId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<OrdersResponse> {
    const response = await api.get<OrdersResponse>('/orders', { params });
    return response.data;
  }

  // Obține o comandă specifică după ID
  async getOrderById(orderId: string): Promise<OrderResponse> {
    const response = await api.get<OrderResponse>(`/orders/${orderId}`);
    return response.data;
  }

  // Obține o comandă după numărul comenzii
  async getOrderByNumber(orderNumber: string): Promise<OrderResponse> {
    const response = await api.get<OrderResponse>(`/orders/number/${orderNumber}`);
    return response.data;
  }

  // Scanează QR și marchează articol ca finalizat
  async markItemAsReady(qrCode: string): Promise<ScanResponse> {
    const response = await api.post<ScanResponse>('/orders/scan', { qrCode });
    return response.data;
  }

  // Scanare multiplă de QR codes
  async batchScanQRCodes(qrCodes: string[]): Promise<{
    success: boolean;
    data: {
      successful: Array<{ qrCode: string; success: boolean; order: string; allItemsReady: boolean }>;
      failed: Array<{ qrCode: string; success: boolean; error: string }>;
      summary: { total: number; successful: number; failed: number };
    };
    message: string;
  }> {
    const response = await api.post('/orders/batch-scan', { qrCodes });
    return response.data;
  }

  // Marchează comandă ca livrată
  async markOrderAsDelivered(orderId: string, paymentMethod?: string): Promise<OrderResponse> {
    const response = await api.put<OrderResponse>(`/orders/${orderId}/deliver`, { paymentMethod });
    return response.data;
  }

  // Anulează comandă
  async cancelOrder(orderId: string, reason: string): Promise<OrderResponse> {
    const response = await api.put<OrderResponse>(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  }

  // Actualizează comandă
  async updateOrder(orderId: string, updateData: {
    status?: OrderStatus;
    notes?: string;
    paymentMethod?: string;
    isPaid?: boolean;
  }): Promise<OrderResponse> {
    const response = await api.put<OrderResponse>(`/orders/${orderId}`, updateData);
    return response.data;
  }

  // Obține statistici pentru dashboard
  async getStatistics(dateRange?: { startDate: string; endDate: string }): Promise<StatisticsResponse> {
    const params = dateRange ? { ...dateRange } : {};
    const response = await api.get<StatisticsResponse>('/orders/statistics', { params });
    return response.data;
  }

  // Căutare comenzi după telefon
  async searchByPhone(phone: string): Promise<{ success: boolean; data: Order[] }> {
    const response = await api.get(`/orders/search/phone/${encodeURIComponent(phone)}`);
    return response.data;
  }

  // Căutare comenzi după nume client
  async searchByCustomerName(name: string): Promise<{ success: boolean; data: Order[] }> {
    const response = await api.get(`/orders/search/customer/${encodeURIComponent(name)}`);
    return response.data;
  }

  // Găsește comandă după QR code
  async findOrderByQR(qrCode: string): Promise<{
    success: boolean;
    data: { order: Order; item: OrderItem | null };
  }> {
    const response = await api.get(`/orders/qr/${encodeURIComponent(qrCode)}`);
    return response.data;
  }

  // Obține comenzile unui client
  async getCustomerOrders(customerId: string): Promise<{ success: boolean; data: Order[] }> {
    const response = await api.get(`/orders/customer/${customerId}`);
    return response.data;
  }

  // Obține comenzile întârziate (doar admin)
  async getDelayedOrders(): Promise<{ success: boolean; data: Order[] }> {
    const response = await api.get('/orders/admin/delayed');
    return response.data;
  }

  // Obține comenzile gata pentru ridicare
  async getReadyOrders(): Promise<{ success: boolean; data: Order[] }> {
    const response = await api.get('/orders/status/ready');
    return response.data;
  }

  // Regenerează QR codes pentru o comandă
  async regenerateQRCodes(orderId: string): Promise<{
    success: boolean;
    data: { orderNumber: string; qrCodes: string[] };
    message: string;
  }> {
    const response = await api.get(`/orders/${orderId}/qr-codes`);
    return response.data;
  }

  // Generează bon fiscal
  async generateReceipt(orderId: string): Promise<{
    success: boolean;
    data: {
      orderNumber: string;
      customer: any;
      items: OrderItem[];
      totalPrice: number;
      createdAt: Date;
      deliveredAt?: Date;
      qrCode: string;
      businessInfo: any;
    };
    message: string;
  }> {
    const response = await api.get(`/orders/${orderId}/receipt`);
    return response.data;
  }

  // Obține raport pentru o perioadă (doar admin)
  async getOrdersReport(startDate: string, endDate: string): Promise<{
    success: boolean;
    data: {
      totalOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
      ordersByStatus: Array<{ status: string; count: number; revenue: number }>;
      ordersByDay: Array<{ date: string; count: number; revenue: number }>;
      topServices: Array<{ serviceName: string; count: number; revenue: number }>;
      topCustomers: Array<{ customerName: string; orders: number; revenue: number }>;
    };
  }> {
    const response = await api.get('/orders/admin/reports', {
      params: { startDate, endDate }
    });
    return response.data;
  }
}

export default new OrdersService();