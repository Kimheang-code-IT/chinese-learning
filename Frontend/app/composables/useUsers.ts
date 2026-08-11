import type { User, CreateUserPayload, UpdateUserPayload } from '~/types/user';
import { useApi } from './useApi';

export const useUsers = () => {
  const api = useApi();

  const getUsers = async () => {
    return await api.get<User[]>('/users');
  };

  const getUser = async (id: number) => {
    return await api.get<User>(`/users/${id}`);
  };

  const createUser = async (payload: CreateUserPayload) => {
    return await api.post<User>('/users', payload);
  };

  const updateUser = async (id: number, payload: UpdateUserPayload) => {
    return await api.put<User>(`/users/${id}`, payload);
  };

  const deleteUser = async (id: number) => {
    return await api.delete(`/users/${id}`);
  };

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
  };
};
