import { Box } from "@mui/material";
import { SnackbarProvider as NotistackSnackbarProvider
  , enqueueSnackbar as notistackEnqueueSnackbar } from "notistack";

export function enqueueSnackbar(message, noContainer = false){
  notistackEnqueueSnackbar(message, {
    variant: 'info',
    content: (key, message) => {
      return noContainer
        ? message
        : <Box className='bg-white
        dark:bg-gray-800
        overflow-hidden
        shadow-sm
        sm:rounded-lg
        border
        border-indigo-700
        px-3
        py-2
        text-gray-900
        dark:text-gray-300'>{message}</Box>
    }
  });
}

export default function SnackbarProvider(props){
  return <NotistackSnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'top' }} {...props} />
}