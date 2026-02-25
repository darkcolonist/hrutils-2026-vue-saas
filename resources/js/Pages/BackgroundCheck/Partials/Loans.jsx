import ArrayOfObjectsTable from '@/Components/ArrayOfObjectsTable';
import AxiosWrapper from '@/Components/AxiosWrapper';
import { format } from '@/Helpers/Number';
import { Typography } from '@mui/material';
import moment from 'moment/moment';
import React from 'react';

const tableDefaultProps = {
  align: "right"
};

export default function Loans({ user, ...props }) {
  return (
    user.company_email ? <AxiosWrapper
      method='post'
      routeName='background.check.loans'
      params={{
        email: user.company_email
      }}
      after={(data) =>
        <ArrayOfObjectsTable name="loan" lines={data}
          // hidable
          defaults={tableDefaultProps}
          customizations={{
            "type": {} // for ordering
            , "total_loan": {
              render: value => format(value, 2)
            }
            , "base_loan": {
              render: value => format(value, 2)
            }
            , "per_cut_off": {
              render: value => format(value, 2)
            }
            , "period": {
              render: value => format(value)
            }
            , "date_applied": {
              render: value => <Typography
                title={moment(value).format('dddd MMMM DD, YYYY')}
                variant='body2'>{moment(value).fromNow()}</Typography>
            }
          }}
        />
      }
    /> : 'user doesn\'t have an email'
  );
}