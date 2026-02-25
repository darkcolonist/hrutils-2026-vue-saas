import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React from 'react';
import BackButton from '@/Components/BackButton';
import FormSectionSingleColumnWrapper from '@/Components/FormSectionSingleColumnWrapper';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateRoleForm from './Partials/UpdateRoleForm';
import UpdateMetaForm from './Partials/UpdateMetaForm';

export default function Edit({ auth, user, status }) {
  const pageTitle = `Edit User - ${user.email}`;

  const handleBack = (e) => {
    e.preventDefault();
    router.visit(route('users.view', user));
  }

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
            <UpdateProfileInformationForm
              status={status}
              className="max-w-xl"
            />
          </FormSectionSingleColumnWrapper>

          <FormSectionSingleColumnWrapper>
            <UpdateMetaForm className="max-w-xl" />
          </FormSectionSingleColumnWrapper>

          <FormSectionSingleColumnWrapper>
            <UpdatePasswordForm className="max-w-xl" />
          </FormSectionSingleColumnWrapper>

          <FormSectionSingleColumnWrapper>
            <UpdateRoleForm className="max-w-xl" />
          </FormSectionSingleColumnWrapper>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
