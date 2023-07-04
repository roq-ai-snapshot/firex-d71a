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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getDepartmentUserById, updateDepartmentUserById } from 'apiSdk/department-users';
import { Error } from 'components/error';
import { departmentUserValidationSchema } from 'validationSchema/department-users';
import { DepartmentUserInterface } from 'interfaces/department-user';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { DepartmentInterface } from 'interfaces/department';
import { getUsers } from 'apiSdk/users';
import { getDepartments } from 'apiSdk/departments';

function DepartmentUserEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<DepartmentUserInterface>(
    () => (id ? `/department-users/${id}` : null),
    () => getDepartmentUserById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: DepartmentUserInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateDepartmentUserById(id, values);
      mutate(updated);
      resetForm();
      router.push('/department-users');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<DepartmentUserInterface>({
    initialValues: data,
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
            Edit Department User
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(DepartmentUserEditPage);
