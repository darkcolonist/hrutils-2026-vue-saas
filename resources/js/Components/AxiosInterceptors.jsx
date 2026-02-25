/**
 * @date February 06, 2023 4:31 PM
 * solution taken from https://stackoverflow.com/a/71047161/27698
 */

import { useEffect } from 'react';
import React from 'react';
import { enqueueSnackbar } from "./AppNotistack";
import { Alert, Typography } from '@mui/material';
import CustomJsonView from './JsonView';

const TimedReloadTypography = ({ milliseconds }) => {
  const [timeLeft, setTimeLeft] = React.useState(milliseconds / 1000);

  React.useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  React.useEffect(() => {
    if (timeLeft <= 0) {
      window.location.reload();
    }
  }, [timeLeft]);

  return (
    <Typography>
      {timeLeft > 0 ?
        `Page expired, reloading in ${timeLeft}` :
        'Reloading...'
      }
    </Typography>
  );
};

const infoSnackbar = message => enqueueSnackbar(
  <Alert severity="info">
    <Typography>{message}</Typography>
  </Alert>, true
);

export default function () {
  const fallback = (error) => {
    if(error?.response?.status == 404){
      // console.debug('ignoring error', error?.response?.status);
      // do not catch this, let it proceed
      return;
    }

    if(error?.code === "ERR_CANCELED"){
      infoSnackbar("background operation cancelled");
      return;
    }

    if(error?.code === "ECONNABORTED"){
      infoSnackbar("background operation aborted");
      return;
    }

    if(error === undefined || error?.response === undefined){
      console.debug("uncaught", error);
      enqueueSnackbar(
        <Alert severity="error">
          <Typography>unknown error occurred</Typography>
        </Alert>, true
      );
      return;
    }

    switch(error?.response?.status){
      case 419:
      case 409:
        enqueueSnackbar(
          <Alert severity="error">
            <TimedReloadTypography milliseconds={5000}/>
          </Alert>, true
        );
        break;
      case 403:
        enqueueSnackbar(
          <Alert severity="warning">
            Verily, thou art not bestowed with adequate permissions to accomplish such a deed.
          </Alert>, true
        );
        break;
      default:
        enqueueSnackbar(
          <Alert severity="error">
            <Typography>{error.message}</Typography>
            <CustomJsonView src={error.response?.data} collapsed={1}
              maxHeight="300px"
            />
          </Alert>, true
        );
    }
  }

  useEffect(() => {
    axios.interceptors.response.use(
      response => {
        // // console.log("found", response.data);
        // if (response.data.type !== undefined
        //   && response.data.type === "token_mismatch") {
        //   fallback("token mismatch detected, reloading page.");
        //   // console.log("token mismatch detected, reloading page."); //☺old implementations
        //   // window.location.reload();☺                               // old implementations
        //   // return Promise.reject("token_mismatch");☺                // old implementations
        // }

        return response;
      }
      , error => {
        fallback(error);

        // let axios interceptor know that we're handling the error on
        //   our end. this is important otherwise we will receive an
        //   error in the console like this:
        //     Uncaught (in promise)
        //       Object { response: undefined }
        return Promise.reject(error);
      }
    )
  });
}