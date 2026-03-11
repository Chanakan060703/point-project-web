import api from './axios';

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
  const response = await api.get<Transaction>(`/transaction/${id}`);
  return response.data;
};

export const createTransaction = async (data: CreateTransactionRequest): Promise<Transaction> => {
  const response = await api.post<Transaction>('/transaction', data);
  return response.data;
};

export const updateTransaction = async (id: number, data: Partial<CreateTransactionRequest>): Promise<Transaction> => {
  const response = await api.patch<Transaction>(`/transaction/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<Transaction> => {
  const response = await api.delete<Transaction>(`/transaction/${id}`);
  return response.data;
};