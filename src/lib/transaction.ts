import api from './axios';
import { unwrapOne } from './response';

export type TransactionType = 'EARN' | 'REDEEM';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface Transaction {
  id: number;
  userId: number;
  billId?: number;
  point: number;
  status: TransactionStatus;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
  bill?: {
    name: string;
    amount: string;
  };
  user?: {
    id: number;
    username: string;
    name?: string;
  };
}

export interface CreateTransactionRequest {
  userId: number;
  billId?: number;
  point: number;
  status?: TransactionStatus;
  type: TransactionType;
}

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>('/transaction');
  return response.data;
};

export const getTransactionById = async (id: number): Promise<Transaction> => {
  const response = await api.get<Transaction | Transaction[]>(`/transaction/${id}`);
  return unwrapOne(response.data);
};

export const createTransaction = async (data: CreateTransactionRequest): Promise<Transaction> => {
  const response = await api.post<Transaction | Transaction[]>('/transaction', data);
  return unwrapOne(response.data);
};

export const updateTransaction = async (id: number, data: Partial<CreateTransactionRequest>): Promise<Transaction> => {
  const response = await api.patch<Transaction | Transaction[]>(`/transaction/${id}`, data);
  return unwrapOne(response.data);
};

export const deleteTransaction = async (id: number): Promise<Transaction> => {
  const response = await api.delete<Transaction | Transaction[]>(`/transaction/${id}`);
  return unwrapOne(response.data);
};
