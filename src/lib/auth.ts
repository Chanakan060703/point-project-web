import api from './axios';
import Cookies from 'js-cookie';

export interface AuthUser {
  userId: number;
  username: string;
  role: string;
  name?: string;
}

export interface AuthResponse {
  access_token?: string;
  token?: string;
  user: AuthUser;
}

export interface UserProfile {
  userId: number;
  username: string;
  role: string;
}

export interface UserInfo {
  id: number;
  username: string;
  name?: string;
  role: string;
  pointTotal: number;
}

export const getAllUsers = async (): Promise<UserInfo[]> => {
  const response = await api.get<UserInfo[]>('/user');
  return response.data;
};

export const login = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', {
    username,
    password
  });
  const token = response.data.access_token || response.data.token;

  if (token) {
    Cookies.set('token', token, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production'
    });
  }

  return response.data;
};

export const register = async (
  name: string,
  username: string,
  password: string,
  age: number,
  gender: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', {
    name,
    username,
    password,
    age,
    gender
  });
  const token = response.data.access_token || response.data.token;

  if (token) {
    Cookies.set('token', token, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production'
    });
  }

  return response.data;
};


export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>('/auth/profile');
  return response.data;
};

export const logout = () => {
  Cookies.remove('token');
};

export const getSession = () => {
  return Cookies.get('token');
};

export const getCurrentPoints = async (id: number): Promise<number> => {
  const response = await api.get<{ pointTotal: number }>(`/user/${id}/points`);
  return response.data.pointTotal;
};
