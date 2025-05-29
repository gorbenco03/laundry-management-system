import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { ID_PREFIXES, DATE_FORMATS } from './constants';

// Generează ID pentru comandă (format: CMD-2024-0001)
export const generateOrderId = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9999) + 1;
  const paddedNumber = random.toString().padStart(4, '0');
  return `${ID_PREFIXES.ORDER}-${year}-${paddedNumber}`;
};

// Generează ID pentru articol (format: CMD-2024-0001-A1)
export const generateItemId = (orderId: string, itemIndex: number): string => {
  return `${orderId}-${ID_PREFIXES.ITEM}${itemIndex + 1}`;
};

// Formatează data pentru afișare
export const formatDate = (date: Date | string, formatType: keyof typeof DATE_FORMATS = 'DISPLAY'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, DATE_FORMATS[formatType], { locale: ro });
};

// Formatează prețul în RON
export const formatPrice = (price: number): string => {
  return `${price.toFixed(2)} RON`;
};

// Calculează prețul total al unei comenzi
export const calculateOrderTotal = (items: Array<{ price: number; quantity: number }>): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Validează număr de telefon românesc
export const isValidPhoneNumber = (phone: string): boolean => {
  // Acceptă formate: 0712345678, +40712345678, 0040712345678
  const phoneRegex = /^(\+40|0040|0)[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Validează email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Formatează număr de telefon pentru afișare
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.startsWith('+40')) {
    return cleaned.replace('+40', '0');
  } else if (cleaned.startsWith('0040')) {
    return cleaned.replace('0040', '0');
  }
  return cleaned;
};

// Obține inițialele unui nume
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};