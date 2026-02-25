import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Chip, Divider, Link as MuiLink, Stack, Typography } from '@mui/material';
import moment from 'moment/moment';
import BackButton from '@/Components/BackButton';
import Permission from '@/Components/Permission';
import DeleteButton from '@/Components/DeleteButton';
import EditButton from '@/Components/EditButton';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonOnIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CustomJsonView from '@/Components/JsonView';

const KeyValueGrid = React.lazy(() => import('@/Components/KeyValueGrid'));

export default function View({ auth }) {
  const { user } = usePage().props;
  const pageTitle = `View User - ${user.email}`;
  const fieldsDefinition = {
    id: {
      show: false
    },
    firstname: {
      title: "First Name"
    },
    lastname: {
      title: "Last Name"
    },
    email: {
      title: "Email"
    },
    is_active: {
      title: "Status",
      render: value => value
          ? <span><CheckCircleIcon size="small" /> ACTIVE</span>
          : <span><RemoveCircleOutlineIcon size="small" /> INACTIVE</span>
    },
    roleName: {
      title: "Role"
    },
    permissionsArray: {
      title: "Permissions",
      render: value => <div>
        {value.map((v,key) =>
          <Chip sx={{mb: .3, mr:.3}} key={key} variant='outlined' label={v} size='small'></Chip>
        )}
      </div>
    },
    email_verified_at: {
      title: "Email Verified",
      render: value => moment(value).isValid() ? <Typography title={value}>{moment(value).fromNow()}</Typography>
        : 'n/a'
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
    },
    meta: {
      title: "Meta",
      render: value =>
        value === null
        ? "not set"
        : <CustomJsonView src={value} />
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
          <KeyValueGrid entries={user} definitions={fieldsDefinition} />

          {auth.user.email === user.email
            ? <React.Fragment>
                <Divider />
                <Typography paragraph>if you wish to make changes to your profile{' '}
                  <MuiLink href='/profile' component={Link}>click here</MuiLink>
                </Typography>
              </React.Fragment>
            : <Stack spacing={1} direction={'row'}>
              <Permission can="edit users">
                <EditButton href={"/users/edit/" + user.email} />
              </Permission>
              <Permission can="delete users">
                {user.is_active
                  ? <DeleteButton href={"/user/deactivate/" + user.email}
                    confirmMessage={`Are you sure you wish to deactivate ${user.email}?`}
                    confirmTitle='Confirm Deactivation'
                    customAction={() => {
                      patch(route('users.deactivate', user));
                    }}
                    customIcon={<PersonOffIcon />}>
                    deactivate
                  </DeleteButton>
                  : <DeleteButton href={"/user/reactivate/" + user.email}
                    confirmMessage={`Are you sure you wish to reactivate ${user.email}?`}
                    confirmTitle='Confirm Reactivation'
                    customAction={() => {
                      patch(route('users.reactivate', user));
                    }}
                    customIcon={<PersonOnIcon />}>
                    reactivate
                  </DeleteButton>
                }
              </Permission>
            </Stack>}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
