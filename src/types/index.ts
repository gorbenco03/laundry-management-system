// Enum pentru statusul comenzilor
export enum OrderStatus {
  REGISTERED = 'registered',
  IN_PROGRESS = 'in_progress',
  READY = 'ready',
  DELIVERED = 'delivered'
}

// Enum pentru rolurile utilizatorilor
export enum UserRole {
  EMPLOYEE = 'employee',
  ADMIN = 'admin'
}

// Enum pentru categoriile de servicii
export enum ServiceCategory {
  PERNE = 'Perne',
  CURATATORIE = 'Curatatorie',
  COVOARE = 'Covoare'
}

// Tipul pentru un serviciu/articol
export interface Service {
  code: string;
  name: string;
  category: ServiceCategory;
  unit: string;
  price: number;
  priceMax?: number;
}

// Tipul pentru un articol dintr-o comandă
export interface OrderItem {
  id: string;
  serviceCode: string;
  serviceName: string;
  quantity: number;
  price: number;
  notes?: string;
  qrCode: string;
  isReady: boolean;
}

// Tipul pentru client
export interface Customer {
  name: string;
  phone: string;
  email?: string;
}

// Tipul pentru o comandă
export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  notes?: string;
}

// Tipul pentru utilizator
export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}