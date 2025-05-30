import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import ordersService from '../services/orders.service';

interface UseOrdersFilters {
  status?: OrderStatus;
  phone?: string;
  customerName?: string;
  orderId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const useOrders = (filters?: UseOrdersFilters) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 0,
    limit: 20,
    hasNext: false,
    hasPrev: false
  });

  const fetchOrders = async (newFilters?: UseOrdersFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ordersService.getOrders({
        ...filters,
        ...newFilters
      });
      
      setOrders(response.data.orders);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.message || 'Eroare la încărcarea comenzilor');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const refetch = (newFilters?: UseOrdersFilters) => {
    fetchOrders(newFilters);
  };

  return {
    orders,
    loading,
    error,
    pagination,
    refetch
  };
};

export const useOrder = (orderId?: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ordersService.getOrderById(id);
      setOrder(response.data);
    } catch (err: any) {
      setError(err.message || 'Eroare la încărcarea comenzii');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  const refetch = () => {
    if (orderId) {
      fetchOrder(orderId);
    }
  };

  return {
    order,
    loading,
    error,
    refetch
  };
};

export interface PopularService {
  serviceName: string;
  count: number;
}

export interface OrderStatistics {
  todayOrders: number;
  todayRevenue: number;
  activeOrders: number;
  readyOrders: number;
  averageOrderValue: number;
  popularServices: PopularService[];
}

export const useOrderStatistics = () => {
  const [statistics, setStatistics] = useState<OrderStatistics>({
    todayOrders: 0,
    todayRevenue: 0,
    activeOrders: 0,
    readyOrders: 0,
    averageOrderValue: 0,
    popularServices: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async (dateRange?: { startDate: string; endDate: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ordersService.getStatistics(dateRange);
      setStatistics(response.data);
    } catch (err: any) {
      setError(err.message || 'Eroare la încărcarea statisticilor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const refetch = (dateRange?: { startDate: string; endDate: string }) => {
    fetchStatistics(dateRange);
  };

  return {
    statistics,
    loading,
    error,
    refetch
  };
};

export const useOrderActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanQRCode = async (qrCode: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ordersService.markItemAsReady(qrCode);
      return response;
    } catch (err: any) {
      setError(err.message || 'Eroare la scanarea QR code-ului');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deliverOrder = async (orderId: string, paymentMethod?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ordersService.markOrderAsDelivered(orderId, paymentMethod);
      return response;
    } catch (err: any) {
      setError(err.message || 'Eroare la livrarea comenzii');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string, reason: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ordersService.cancelOrder(orderId, reason);
      return response;
    } catch (err: any) {
      setError(err.message || 'Eroare la anularea comenzii');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ordersService.createOrder(orderData);
      return response;
    } catch (err: any) {
      setError(err.message || 'Eroare la crearea comenzii');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    scanQRCode,
    deliverOrder,
    cancelOrder,
    createOrder,
    clearError: () => setError(null)
  };
};