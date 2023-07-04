import * as yup from 'yup';

export const departmentUserValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  department_id: yup.string().nullable().required(),
});
