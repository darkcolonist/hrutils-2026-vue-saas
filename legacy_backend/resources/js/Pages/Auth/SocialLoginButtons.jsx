import { Button, Stack } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';

export default function SocialLoginButtons(){
  return <Stack>
    <Button
      variant="contained"
      startIcon={<GoogleIcon />}
      size="large"
      style={{ justifyContent: 'flex-start' }}
      onClick={() => {
        window.location.href = route('google.redirect');
      }}
    >
      login with google
    </Button>
  </Stack>
}