import axios from 'axios';
import queryString from 'query-string';
import { DepartmentUserInterface, DepartmentUserGetQueryInterface } from 'interfaces/department-user';
import { GetQueryInterface } from '../../interfaces';

export const getDepartmentUsers = async (query?: DepartmentUserGetQueryInterface) => {
  const response = await axios.get(`/api/department-users${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createDepartmentUser = async (departmentUser: DepartmentUserInterface) => {
  const response = await axios.post('/api/department-users', departmentUser);
  return response.data;
};

export const updateDepartmentUserById = async (id: string, departmentUser: DepartmentUserInterface) => {
  const response = await axios.put(`/api/department-users/${id}`, departmentUser);
  return response.data;
};

export const getDepartmentUserById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/department-users/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDepartmentUserById = async (id: string) => {
  const response = await axios.delete(`/api/department-users/${id}`);
  return response.data;
};
