import AxiosWrapper from '@/Components/AxiosWrapper';
import DesktopOnly from '@/Components/DesktopOnly';
import MobileOnly from '@/Components/MobileOnly';
import RealtimeTimestamp from '@/Components/RealtimeTimestamp';
import { Link } from '@inertiajs/react';
import { Stack, Typography, Button, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import MUILink from '@mui/material/Link';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from '@/Helpers/Number';

function getTimestamp(value, formats){
  return <RealtimeTimestamp
    titleDisplayFormat={formats.dates.front_end_moment_human}
    sx={{opacity: .5}}>
      {value.date_applied}
    </RealtimeTimestamp>
}

export function getDisplayName(value) {
  return <span>{`${value.last_name}, ${value.first_name}`}</span>
}

export function getSearchKeyword(value) {
  return value.first_name.split(' ')[0] + " " + value.last_name;
}

export function getBackgroundCheckRoute(user){
  return route('background.check', {
    keyword: getSearchKeyword(user)
  });
}

function getAdditionalInfo(value){
  return <Typography component='span' sx={{
    fontSize: ".8em",
    opacity: .4
  }}>
    &#183;
    {' '}{format(value.loan_amount, 2)}{' '}
    &#183;
  </Typography>
}

export default function Suggestions({ user, formats, ...props }) {
  return (
    <AxiosWrapper method="post"
      routeName="background.pending.loans"
      after={(data) =>
        <React.Fragment>
          {data.length > 0 ?
            <Accordion sx={{mb:3}}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="suggestions-content"
                id="suggestions-panel"
              >
                <Typography>Suggested</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DesktopOnly>
                  <Stack sx={{ pl: 1 }}>
                    {data.map((value, index) =>
                      <Box key={index}>
                        <MUILink href={getBackgroundCheckRoute(value)} component={Link}>
                          {getDisplayName(value)}
                        </MUILink>
                        &nbsp; {getAdditionalInfo(value)}
                        &nbsp; {getTimestamp(value, formats)}
                      </Box>
                    )}
                  </Stack>
                </DesktopOnly>
                <MobileOnly>
                  <Stack sx={{ pl: 1 }} spacing={1}>
                    {data.map((value, index) =>
                      <Button key={index} href={getBackgroundCheckRoute(value)}
                        component={Link} variant='contained' fullWidth>
                        {getDisplayName(value)}
                        &nbsp; {getAdditionalInfo(value)}
                        &nbsp; {getTimestamp(value, formats)}
                      </Button>
                    )}
                  </Stack>
                </MobileOnly>
              </AccordionDetails>
            </Accordion>
          : null}
        </React.Fragment>
      } />
  );
}