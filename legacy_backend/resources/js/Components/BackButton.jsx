import { Button } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { router } from "@inertiajs/react";
import React from "react";

export default React.forwardRef((props, ref) => {
  const goBack = () => {
    if (localStorage.getItem('back-url')){
      router.visit(localStorage.getItem('back-url'));
    }else{
      window.history.back()
    }
  }

  return <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={goBack}
    ref={ref} {...props}>
      back
    </Button>
});