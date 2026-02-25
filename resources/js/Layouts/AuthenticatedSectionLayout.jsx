import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AuthenticatedSectionLayout({ auth, title, children, ...props }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{title}</h2>}
    >
      <Head title={title} />

      <div className="max-w-full mx-auto sm:px-6 lg:px-8">
        {children}
      </div>
    </AuthenticatedLayout>
  );
}