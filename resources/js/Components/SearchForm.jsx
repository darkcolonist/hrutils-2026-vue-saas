import React from "react";
import { useFormik } from 'formik';
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export default function SearchForm(props){
  const { searchCallback
    , customError
    , searchURL
    , searchDefault
    , searchOnMount } = props;

  const submitButtonRef = React.useRef(null);

  if (searchOnMount){
    React.useEffect(() => {
      submitButtonRef.current.click();
    }, []);
  }

  React.useEffect(() => {
    if(customError.message === undefined || customError.message == null)
      return;

    formik.setErrors({"txtSearch": customError.message});
    customError.display = false;
  }, [customError]);

  const formik = useFormik({
    initialValues: {
      txtSearch: searchDefault ? searchDefault : ""
    },
    validate: values => {
      const errors = {};
      if (!values.txtSearch) {
        errors.txtSearch = 'Required';
      } else if (values.txtSearch.length < 3) {
        errors.txtSearch = 'Must be 3 characters or more';
      }

      return errors;
    },
    onSubmit: (values, actions) => {
      axios.post(searchURL, values)
        .then((response) => {
          // if(response.data.code !== 200)
          //   formik.setErrors({ "txtSearch": "so sad :(" });

          if(typeof searchCallback === 'function')
            searchCallback(response.data);
        })
        .then(() => {
          actions.setSubmitting(false);
        })
        .catch((err) => {
          console.error({searchURL, err});
          actions.setSubmitting(false);
        });
    },
  });

  return <Box
    component="form"
    sx={{
      '& > :not(style)': { m: 1, width: '25ch' },
    }}
    noValidate
    onSubmit={formik.handleSubmit}
  >
    <TextField label="Search" variant="outlined" size="small"
      autoComplete="search"
      error={formik.errors.txtSearch !== undefined}
      helperText={formik.errors.txtSearch}
      id="txtSearch" name="txtSearch" onChange={formik.handleChange} value={formik.values.txtSearch} />
    <Button ref={submitButtonRef}
      startIcon={formik.isSubmitting ? <CircularProgress size={16} /> : <SearchIcon />} variant="outlined"
      type="submit" size="large" disabled={formik.isSubmitting}>Submit</Button>
  </Box>
}