import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Alert, Stack, Typography } from '@mui/material';
import SaveButton from '@/Components/SaveButton';
import MUIDropdown from '@/Components/MUIDropdown';

export default function UpdateRoleForm({ className = '' }) {

  const { user, availableRoles } = usePage().props;

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    roleName: user.roleName
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(route('users.edit.role', user ));
  };

  return (
    <section className={className}>
      <header>
        <Typography variant='h2' fontSize={18}>Change Role</Typography>
      </header>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Stack spacing={2}>
          <MUIDropdown
            label='Role'
            labelId='role-select'
            id='roleName'
            value={data.roleName}
            options={availableRoles}
            optionKey='name'
            optionTitle='name'
            helperText={errors.roleName}
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
              {user.email} role changed to {data.roleName}
            </Alert>
          </Transition>
        </div>
      </form>
    </section>
  );
}
