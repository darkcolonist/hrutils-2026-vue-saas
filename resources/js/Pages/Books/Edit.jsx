import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Alert, Box, Stack, TextField } from '@mui/material';
import { Transition } from '@headlessui/react';
import SaveButton from '@/Components/SaveButton';
import CancelButton from '@/Components/CancelButton';

export default function Edit({ auth }) {
  const { books } = usePage().props;
  const pageTitle = `Edit Book - ${books.title}`;
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    title: books.title,
    author: books.author
  });

  const handleCancel = (e) => {
    e.preventDefault();
    router.visit(`/books/view/${books.hash}`)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(route('books.edit', {
      books
    }));
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{pageTitle}</h2>}
    >
      <Head title={pageTitle} />

      <div className="py-5">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit}>
            <Box sx={{py:2}}>
              <Stack spacing={2}>
                <TextField
                  label="title"
                  error={errors.title ? true : false}
                  helperText={errors.title}
                  autoComplete="title"
                  value={data.title}
                  onChange={(e) => setData("title", e.target.value)}
                />
                <TextField
                  label="author"
                  error={errors.author ? true : false}
                  helperText={errors.author}
                  autoComplete="author"
                  value={data.author}
                  onChange={(e) => setData("author", e.target.value)}
                />
              </Stack>
            </Box>

            <Stack spacing={1} direction={'row'}>
              <CancelButton processing={processing} onClick={handleCancel} />
              <SaveButton processing={processing}/>
            </Stack>

            <Transition
              show={recentlySuccessful}
              enter="transition ease-in-out"
              enterFrom="opacity-0"
              leave="transition ease-in-out duration-500"
              leaveTo="opacity-0"
            >
              <Alert color='success' sx={{my:2}}>
                {books.title} saved successfully.
              </Alert>
            </Transition>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
