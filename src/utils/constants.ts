// Constante pentru aplicație

// Prefixe pentru ID-uri
export const ID_PREFIXES = {
  ORDER: 'CMD',
  ITEM: 'A',
} as const;

// Formate pentru date
export const DATE_FORMATS = {
  DISPLAY: 'dd.MM.yyyy',
  DISPLAY_WITH_TIME: 'dd.MM.yyyy HH:mm',
  API: 'yyyy-MM-dd',
} as const;

// Mesaje de eroare
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Nume de utilizator sau parolă incorectă',
  ORDER_NOT_FOUND: 'Comanda nu a fost găsită',
  REQUIRED_FIELD: 'Acest câmp este obligatoriu',
  INVALID_PHONE: 'Număr de telefon invalid',
  INVALID_EMAIL: 'Adresă de email invalidă',
} as const;

// Mesaje de succes
export const SUCCESS_MESSAGES = {
  ORDER_CREATED: 'Comanda a fost creată cu succes',
  ORDER_UPDATED: 'Comanda a fost actualizată',
  ITEM_MARKED_READY: 'Articolul a fost marcat ca finalizat',
} as const;

// Status labels în română
export const STATUS_LABELS = {
  registered: 'Înregistrată',
  in_progress: 'În procesare',
  ready: 'Gata pentru ridicare',
  delivered: 'Livrată',
} as const;

// Credențiale hardcodate (temporar, doar pentru dezvoltare)
export const DEMO_CREDENTIALS = {
  EMPLOYEE: {
    username: 'angajat',
    password: 'angajat',
  },
  ADMIN: {
    username: 'admin',
    password: 'root',
  },
} as const;