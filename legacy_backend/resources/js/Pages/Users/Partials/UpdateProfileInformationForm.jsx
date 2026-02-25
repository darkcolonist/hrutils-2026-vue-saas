import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Alert, Stack, TextField, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import SaveButton from '@/Components/SaveButton';

export default function UpdateProfileInformation({ className = '' }) {
  const user = usePage().props.user;

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(route('users.edit', user ));
  };

  return (
    <section className={className}>
      <header>
        <Typography variant='h2' fontSize={18}>Profile Information</Typography>
        <Typography paragraph variant='body2' color={grey[600]}>Update your account's profile information and email address.</Typography>
      </header>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Stack spacing={2}>
          {
            [
              { label: 'First Name', value: 'firstname' },
              { label: 'Last Name', value: 'lastname' },
              { label: 'Email', value: 'email' },
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
              {user.email} saved successfully.
            </Alert>
          </Transition>
        </div>
      </form>
    </section>
  );
}
