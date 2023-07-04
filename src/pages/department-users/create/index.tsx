import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createDepartmentUser } from 'apiSdk/department-users';
import { Error } from 'components/error';
import { departmentUserValidationSchema } from 'validationSchema/department-users';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { DepartmentInterface } from 'interfaces/department';
import { getUsers } from 'apiSdk/users';
import { getDepartments } from 'apiSdk/departments';
import { DepartmentUserInterface } from 'interfaces/department-user';

function DepartmentUserCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: DepartmentUserInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createDepartmentUser(values);
      resetForm();
      router.push('/department-users');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<DepartmentUserInterface>({
    initialValues: {
      user_id: (router.query.user_id as string) ?? null,
      department_id: (router.query.department_id as string) ?? null,
    },
    validationSchema: departmentUserValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Department User
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<DepartmentInterface>
            formik={formik}
            name={'department_id'}
            label={'Select Department'}
            placeholder={'Select Department'}
            fetcher={getDepartments}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'department_user',
    operation: AccessOperationEnum.CREATE,
  }),
)(DepartmentUserCreatePage);
