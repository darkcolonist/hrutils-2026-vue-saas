import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React from 'react';
import BackButton from '@/Components/BackButton';
import FormSectionSingleColumnWrapper from '@/Components/FormSectionSingleColumnWrapper';
import UpdateRoleInformationForm from './Partials/UpdateRoleInformationForm';
import ViewUpdateRoleInformation from './Partials/ViewRoleInformation';
import UpdatePermissionsForm from './Partials/UpdatePermissionsForm';

export default function Edit({ auth, role }) {
  const pageTitle = `Edit Role - ${role.name}`;

  const handleBack = (e) => {
    e.preventDefault();
    router.visit(route('roles.view', role));
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
            {role.is_protected
              ? <ViewUpdateRoleInformation />
              : <UpdateRoleInformationForm />}
          </FormSectionSingleColumnWrapper>

          <FormSectionSingleColumnWrapper>
            <UpdatePermissionsForm />
          </FormSectionSingleColumnWrapper>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
