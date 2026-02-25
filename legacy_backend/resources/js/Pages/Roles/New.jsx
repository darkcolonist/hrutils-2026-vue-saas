import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Head, router } from '@inertiajs/react';
import React from 'react';
import BackButton from '@/Components/BackButton';
import FormSectionSingleColumnWrapper from '@/Components/FormSectionSingleColumnWrapper';

import { Transition } from '@headlessui/react';
import { Alert, Stack } from '@mui/material';
import SaveButton from '@/Components/SaveButton';
import DynamicField from '@/Components/DynamicField';

const fields = [
  { label: 'Name', value: 'name', type: 'text' },
];

export default function New({ auth, env }) {
  const pageTitle = `New Role`;

  const handleBack = (e) => {
    e.preventDefault();
    router.visit(route('roles'));
  }

  const initialValues = fields.reduce((acc, field) => {
    const anInitialValue = field.defaultValue
      ?? '';

    acc[field.value] = anInitialValue;
    return acc;
  }, {});

  const [role, setUser] = React.useState(initialValues);

  const { data, setData, post, errors, processing, recentlySuccessful
    , reset } = useForm(role);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('roles.store'), {
      onSuccess: (response) => {
        setUser(data);
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
                      {role.name} saved successfully.
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
