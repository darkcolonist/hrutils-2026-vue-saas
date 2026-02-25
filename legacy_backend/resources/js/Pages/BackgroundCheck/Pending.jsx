import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Avatar, Stack, Typography } from '@mui/material';
import AuthenticatedSectionLayout from '@/Layouts/AuthenticatedSectionLayout';
import UserProfileGroup from './Partials/UserProfileGroup';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OngoingLoans from './Partials/OngoingLoans';

const avatarSize = 24;

const lessImportantTypographySx = { fontSize: ".8em", opacity: .4 };

export default function Pending({ auth, loaners }) {
  return <AuthenticatedSectionLayout auth={auth} title="Pending Loaners">
    <Stack spacing={1} sx={{m:1}}>
      {(loaners.length)
        ? loaners.map((user, index) =>
            <React.Fragment key={index}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="suggestions-content"
                  id="suggestions-panel"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ ...lessImportantTypographySx }}>{loaners.length - index}</Typography>
                    <Avatar sx={{ height: avatarSize, width: avatarSize }} src={user.avatarURL} />
                    <Typography>{user.last_name}, {user.first_name}</Typography>
                    <Typography sx={{ ...lessImportantTypographySx }}>{user.position} | {user.job_title} | {user.department}</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <UserProfileGroup user={user} />
                </AccordionDetails>
              </Accordion>
            </React.Fragment>
          )
        : <Alert>no pending loaners at this time</Alert>}

        <OngoingLoans />
    </Stack>
  </AuthenticatedSectionLayout>
}
