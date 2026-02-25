import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Chip, Stack, Typography } from '@mui/material';
import moment from 'moment/moment';
import BackButton from '@/Components/BackButton';
import Permission from '@/Components/Permission';
import DeleteButton from '@/Components/DeleteButton';
import EditButton from '@/Components/EditButton';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import LockIcon from '@mui/icons-material/Lock';

const KeyValueGrid = React.lazy(() => import('@/Components/KeyValueGrid'));

export default function View({ auth }) {
  const { role } = usePage().props;
  const pageTitle = `View Role - ${role.name}`;
  const fieldsDefinition = {
    id: {
      show: false
    },
    guard_name: {
      show: false
    },
    is_protected: {
      show: false
    },
    name: {
      title: "Name",
      render: value => <Stack direction='row' spacing={1}>
        {role.is_protected ? <span title='record cannot be deleted'>
          <LockIcon color='success' />
        </span> : null}
        <span>{value}</span>
      </Stack>
    },
    permissions: {
      title: "Permissions",
      render: value => <div>
        {value.map((v,key) =>
          <Chip sx={{mb: .3, mr:.3}} key={key} variant='outlined' label={v.name} size='small'></Chip>
        )}
      </div>
    },
    created_at: {
      title: "Added",
      render: value => <Typography title={value}>{moment(value).fromNow()}</Typography>
    },
    updated_at: {
      title: "Updated",
      render: value => <Typography title={value}>{moment(value).fromNow()}</Typography>
    },
    roles: {
      show: false
    }
  };

  const { patch } = useForm();

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{pageTitle}</h2>}
    >
      <Head title={pageTitle} />

      <div className="py-5">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <BackButton />
          <KeyValueGrid entries={role} definitions={fieldsDefinition} />

          <Stack spacing={1} direction={'row'}>
            <Permission can="edit roles">
              <EditButton href={"/roles/edit/" + role.name} />
            </Permission>
            <Permission can="delete roles" additionalFlags={[!role.is_protected]}>
              <DeleteButton href={route('roles.delete', role)}
                confirmMessage={`Are you sure you wish to delete ${role.name}?`} />
            </Permission>
          </Stack>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
