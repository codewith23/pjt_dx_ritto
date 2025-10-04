export type AppView = 'dashboard' | 'schedule' | 'clients' | 'invoices' | 'settings';

export interface UserProfile {
  companyName?: string;
  companyAddress?: string;
  companyTel?: string;
  bankInfo?: string;
  registrationNumber?: string;
  companyLogo?: string; // base64 data URL
}

export interface Client {
  id: string;
  name: string;
  contactPerson?: string;
  address?: string;
  closingDay: number; // 1-31, 99 for end of month
  paymentTerms?: string; // e.g., '翌月末払い'
  dailyRate?: number;
}

export interface WorkEntry {
  id: string;
  date: string; // YYYY-MM-DD
  clientId: string;
  description: string;
  unitPrice: number;
  quantity: number;
  unit: string; // e.g., '時間', '日', '式'
  expenses?: number;
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
}

export interface AppState {
  clients: Client[];
  workEntries: WorkEntry[];
  userProfile: UserProfile;
}

export type AppAction =
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string } // id
  | { type: 'ADD_WORK_ENTRY'; payload: WorkEntry }
  | { type: 'UPDATE_WORK_ENTRY'; payload: WorkEntry }
  | { type: 'DELETE_WORK_ENTRY'; payload: string } // id
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'SET_USER_PROFILE'; payload: UserProfile };
