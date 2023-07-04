import axios from 'axios';
import queryString from 'query-string';
import { DepartmentInterface, DepartmentGetQueryInterface } from 'interfaces/department';
import { GetQueryInterface } from '../../interfaces';

export const getDepartments = async (query?: DepartmentGetQueryInterface) => {
  const response = await axios.get(`/api/departments${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createDepartment = async (department: DepartmentInterface) => {
  const response = await axios.post('/api/departments', department);
  return response.data;
};

export const updateDepartmentById = async (id: string, department: DepartmentInterface) => {
  const response = await axios.put(`/api/departments/${id}`, department);
  return response.data;
};

export const getDepartmentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/departments/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDepartmentById = async (id: string) => {
  const response = await axios.delete(`/api/departments/${id}`);
  return response.data;
};
