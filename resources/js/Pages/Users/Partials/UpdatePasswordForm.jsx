import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Alert, Stack, TextField, Typography } from '@mui/material';
import SaveButton from '@/Components/SaveButton';

export default function UpdatePasswordForm({ className = '' }) {
  const user = usePage().props.user;

  const { data, setData, patch, errors, processing, recentlySuccessful, reset } = useForm({
    password: '',
    password_confirmation: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(route('users.edit.password', user), {
      onSuccess: () => {
        reset();
      }
    });
  };

  return (
    <section className={className}>
      <header>
        <Typography variant='h2' fontSize={18}>Update Password</Typography>
      </header>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Stack spacing={2}>
          {
            [
              { label: 'Password', value: 'password' },
              { label: 'Confirm Password', value: 'password_confirmation' },
            ].map((field, key) => <TextField
              key={key}
              type='password'
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
              {user.email} password updated
            </Alert>
          </Transition>
        </div>
      </form>
    </section>
  );
}