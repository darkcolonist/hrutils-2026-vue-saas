import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Alert, Stack, TextField, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import SaveButton from '@/Components/SaveButton';

export default function UpdateRoleInformationForm({ className = 'max-w-xl' }) {
  const role = usePage().props.role;

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    name: role.name
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(route('roles.edit', role ));
  };

  return (
    <section className={className}>
      <header>
        <Typography variant='h2' fontSize={18}>Role Information</Typography>
        <Typography paragraph variant='body2' color={grey[600]}>Update the role name</Typography>
      </header>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Stack spacing={2}>
          {
            [
              { label: 'Name', value: 'name' }
            ].map((field, key) => <TextField
              key={key}
              label={field.label}
              error={errors[field.value] ? true : false}
              helperText={errors[field.value]}
              autoComplete={field.value}
              value={data[field.value]}
              onChange={(e) => setData(field.value, e.target.value)}
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
  );
}
