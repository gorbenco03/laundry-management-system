import api from './api';
import { Order, OrderItem } from '../types';

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
}

interface StatisticsResponse {
  success: boolean;
  data: {
    todayOrders: number;
    todayRevenue: number;
    activeOrders: number;
    readyOrders: number;
  };
}

class OrdersService {
  // Creare comandă nouă
  async createOrder(orderData: CreateOrderDto): Promise<CreateOrderResponse> {
    const response = await api.post<CreateOrderResponse>('/orders', orderData);
    return response.data;
  }

  // Obține toate comenzile cu filtrare
  async getOrders(params?: {
    status?: string;
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

  // Obține o comandă specifică
  async getOrderById(orderId: string): Promise<OrderResponse> {
    const response = await api.get<OrderResponse>(`/orders/${orderId}`);
    return response.data;
  }

  // Scanează QR și marchează articol ca finalizat
  async markItemAsReady(qrCode: string): Promise<{
    success: boolean;
    data: {
      order: Order;
      allItemsReady: boolean;
      notification?: string;
    };
  }> {
    const response = await api.post('/orders/scan', { qrCode });
    return response.data;
  }

  // Marchează comandă ca livrată
  async markOrderAsDelivered(orderId: string): Promise<OrderResponse> {
    const response = await api.put<OrderResponse>(`/orders/${orderId}/deliver`);
    return response.data;
  }

  // Anulează comandă
  async cancelOrder(orderId: string, reason?: string): Promise<OrderResponse> {
    const response = await api.put<OrderResponse>(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  }

  // Obține statistici pentru dashboard
  async getStatistics(): Promise<StatisticsResponse> {
    const response = await api.get<StatisticsResponse>('/orders/statistics');
    return response.data;
  }
}

export default new OrdersService();