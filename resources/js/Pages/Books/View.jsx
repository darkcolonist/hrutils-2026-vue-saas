import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Stack, Typography } from '@mui/material';
import moment from 'moment/moment';
import BackButton from '@/Components/BackButton';
import Permission from '@/Components/Permission';
import DeleteButton from '@/Components/DeleteButton';
import EditButton from '@/Components/EditButton';

const KeyValueGrid = React.lazy(() => import('@/Components/KeyValueGrid'));

export default function View({ auth }) {
  const { books } = usePage().props;
  const pageTitle = `View Book - ${books.title}`;
  const fieldsDefinition = {
    id: {
      show: false
    },
    hash: {
      title: "Index"
    },
    title: {
      title: "Title"
    },
    author: {
      title: "Author"
    },
    created_at: {
      title: "Added",
      render: value => <Typography title={value}>{moment(value).fromNow()}</Typography>
    },
    updated_at: {
      title: "Updated",
      render: value => <Typography title={value}>{moment(value).fromNow()}</Typography>
    },
    deleted_at: {
      show: false,
      title: "Deleted",
      render: value => <Typography title={value}>{moment(value).fromNow()}</Typography>
    },
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{pageTitle}</h2>}
    >
      <Head title={pageTitle} />

      <div className="py-5">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <BackButton />
          <KeyValueGrid entries={books} definitions={fieldsDefinition} />
          <Stack spacing={1} direction={'row'}>
            <Permission can="edit books">
              <EditButton href={"/books/edit/" + books.hash} />
            </Permission>
            <Permission can="delete books">
              <DeleteButton href={"/books/edit/" + books.hash}
                confirmMessage={`Are you sure you wish to delete ${books.title}?`} />
            </Permission>
          </Stack>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
