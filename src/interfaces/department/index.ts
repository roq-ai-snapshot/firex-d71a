import { DepartmentUserInterface } from 'interfaces/department-user';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface DepartmentInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  department_user?: DepartmentUserInterface[];
  user?: UserInterface;
  _count?: {
    department_user?: number;
  };
}

export interface DepartmentGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
