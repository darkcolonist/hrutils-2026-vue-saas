import { Avatar, Divider, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LineLabel from '@/Components/LineLabel';
import CommentHistoryPopoverWidget from '@/Components/CommentHistoryPopoverWidget';
import { formatPhoneNumber } from '@/Helpers/Number';
import { getInitials } from '@/Helpers/String';
import moment from 'moment/moment';

const StatusIcon = function (props) {
  const { status } = props;

  let render;

  if (status.toLowerCase() === "active") {
    render = <CheckCircleIcon color="success" />
  } else {
    render = <CancelIcon color="error" />
  }

  return render;
}

export default function UserProfile({ user, ...props }) {
  const avatarSize = {lg: 'auto', xs: 150};

  user['mobile_number_formatted'] = user['mobile_number'] ? formatPhoneNumber(user['mobile_number']) : null;
  user['department_initials'] = user['department'] ? getInitials(user['department']) : null;
  user['age'] = user['birth_date'] ? moment(user['birth_date']).fromNow(true) : null;

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} lg={3}>
        <Avatar sx={{ mt: 2, height: avatarSize, width: avatarSize }} src={user.avatarURL} />
      </Grid>
      <Grid item xs={12} lg={9}>
        <Stack direction="row" alignItems="center" gap={1}
          divider={<Divider orientation="vertical" flexItem />}>
          <StatusIcon status={user.status} />
          <Typography sx={{ fontSize: "1.2em" }}>
            {user.first_name} {user.last_name}</Typography>
          <Typography sx={{ fontSize: ".6em" }}>{user.id}</Typography>
          <CommentHistoryPopoverWidget email={user.company_email} />
        </Stack>
        {[
          { label: "Employee Status", name: "status" }
          , { label: "Department", name: "department_initials" }
          , { label: "Age", name: "age" }
          , { label: "Hired", name: "hired_date" }
          , { label: "Email", name: "personal_email" }
          , { label: "Mobile", name: "mobile_number_formatted" }
          , { label: "Gross", name: "current_salary" }
          , { label: "Title", name: "job_title" }
          , { label: "Position", name: "position" }
          , { label: "Employment Status", name: "employment_status" }
        ].map((fieldEl, i) => (
          <Typography key={i} sx={{ fontSize: ".9em" }}><LineLabel>{fieldEl.label}</LineLabel>{" "}
            {user[fieldEl.name]}</Typography>
        ))}
      </Grid>
      {/* <Grid item xs={12}><pre>{JSON.stringify(user, null, 2)}</pre></Grid> */}
    </Grid>
  );
}