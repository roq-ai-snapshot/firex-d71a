const mapping: Record<string, string> = {
  departments: 'department',
  'department-users': 'department_user',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
