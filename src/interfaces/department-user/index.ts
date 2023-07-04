import { UserInterface } from 'interfaces/user';
import { DepartmentInterface } from 'interfaces/department';
import { GetQueryInterface } from 'interfaces';

export interface DepartmentUserInterface {
  id?: string;
  user_id: string;
  department_id: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  department?: DepartmentInterface;
  _count?: {};
}

export interface DepartmentUserGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  department_id?: string;
}
