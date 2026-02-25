import { useForm, usePage } from '@inertiajs/react';
import { Stack, TextField, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

export default function ViewUpdateRoleInformation({ className = 'max-w-xl' }) {
  const role = usePage().props.role;

  const { data, setData, errors } = useForm({
    name: role.name
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className={className}>
      <header>
        <Typography variant='h2' fontSize={18}>Role Information</Typography>
        <Typography paragraph variant='body2' color={grey[600]}>This role is protected and cannot be edited</Typography>
      </header>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Stack spacing={2}>
          {
            [
              { label: 'Name', value: 'name' }
            ].map((field, key) => <TextField
              InputProps={{
                readOnly: true,
              }}
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
      </form>
    </section>
  );
}
