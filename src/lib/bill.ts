import api from './axios';

export interface Bill {
  id: number;
  userId: number;
  name: string;
  price: string;
  discount: string;
  amount: string;
  point: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    name: string;
    pointTotal: number;
  };
}

export interface CreateBillRequest {
  userId: number;
  name: string;
  price: number;
  redeemPoint?: number;
}

export const getBills = async (): Promise<Bill[]> => {
  const response = await api.get<Bill[]>('/bill');
  return response.data;
};

export const getBillById = async (id: number): Promise<Bill> => {
  const response = await api.get<Bill>(`/bill/${id}`);
  return response.data;
};

export const createBill = async (data: CreateBillRequest): Promise<Bill> => {
  const response = await api.post<Bill>('/bill', data);
  return response.data;
};

export const updateBill = async (id: number, data: Partial<CreateBillRequest>): Promise<Bill> => {
  const response = await api.patch<Bill>(`/bill/${id}`, data);
  return response.data;
};

export const deleteBill = async (id: number): Promise<Bill> => {
  const response = await api.delete<Bill>(`/bill/${id}`);
  return response.data;
};
