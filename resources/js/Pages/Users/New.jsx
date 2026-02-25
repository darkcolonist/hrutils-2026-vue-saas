import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Head, router, usePage } from '@inertiajs/react';
import React from 'react';
import BackButton from '@/Components/BackButton';
import FormSectionSingleColumnWrapper from '@/Components/FormSectionSingleColumnWrapper';

import { Transition } from '@headlessui/react';
import { Alert, Stack } from '@mui/material';
import SaveButton from '@/Components/SaveButton';
import MUIDropdown from '@/Components/MUIDropdown';
import DynamicField from '@/Components/DynamicField';

const fields = [
  { label: 'First Name', value: 'firstname', type: 'text' },
  { label: 'Last Name', value: 'lastname', type: 'text' },
  { label: 'Email', value: 'email', type: 'text' },
  { label: 'Password', value: 'password', type: 'password', defaultValue: 'q' },
  { label: 'Confirm Password', value: 'password_confirmation', type: 'password', defaultValue: 'q' },
  { label: 'Role', value: 'roleName', type: 'dropdown', defaultValue: 'user' },
];

export default function New({ auth, availableRoles, userTemplate, env }) {
  const pageTitle = `New User`;

  const handleBack = (e) => {
    e.preventDefault();
    router.visit(route('users'));
  }

  const initialValues = fields.reduce((acc, field) => {
    const anInitialValue = field.defaultValue
      ?? (env.APP_DEBUG ? userTemplate[field.value] : false)
      ?? '';

    acc[field.value] = anInitialValue;
    return acc;
  }, {});

  const [user, setUser] = React.useState(initialValues);

  const { data, setData, post, errors, processing, recentlySuccessful
    , reset } = useForm(user);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('users.store'), {
      onSuccess: (response) => {
        setUser(data);

        if(env.APP_DEBUG){
          setData({...data, ...response.props.userTemplate});
        }else
          reset();
      }
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{pageTitle}</h2>}
    >
      <Head title={pageTitle} />

      <div className="py-5">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <BackButton onClick={handleBack} />

          <FormSectionSingleColumnWrapper>
            <section className='max-w-xl'>
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <Stack spacing={2}>
                  {
                    fields.map((field, key) => <DynamicField
                      key={key}
                      label={field.label}
                      error={errors[field.value] ? true : false}
                      helperText={errors[field.value]}
                      autoComplete={field.value}
                      value={data[field.value]}
                      onChange={(e) => setData(field.value, e.target.value)}
                      type={field.type}
                    />)
                  }

                  <MUIDropdown
                    label='Role'
                    labelId='role-select'
                    id='roleName'
                    value={data.roleName}
                    options={availableRoles}
                    optionKey='name'
                    optionTitle='name'
                    helperText={errors.roleName}
                    error={errors.roleName !== undefined}
                    onChange={(e) => setData("roleName", e.target.value)}
                  />
                </Stack>

                <div className="flex items-center gap-4">
                  <Stack spacing={1} direction={'row'}>
                    <SaveButton processing={processing} />
                  </Stack>
                  <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                  >
                    <Alert color='success' sx={{ my: 2 }}>
                      {user.email} saved successfully.
                    </Alert>
                  </Transition>
                </div>
              </form>
            </section>
          </FormSectionSingleColumnWrapper>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
