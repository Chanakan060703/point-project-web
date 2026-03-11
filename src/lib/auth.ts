import api from './axios';
import Cookies from 'js-cookie';

export interface AuthResponse {
  token: string;
  user: {
    userId: string;
    username: string;
    role: string;
  };
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', { username, password });
  const { token } = response.data;

  Cookies.set('token', token, { expires: 7, secure: process.env.NODE_ENV === 'production' });

  return response.data;
};

export const register = async (name: string, username: string, password: string, age: number, gender: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', { name, username, password, age, gender });
  const { token } = response.data;

  Cookies.set('token', token, { expires: 7, secure: process.env.NODE_ENV === 'production' });

  return response.data;
};

export const logout = () => {
  Cookies.remove('token');
};

export const getSession = () => {
  return Cookies.get('token');
};
