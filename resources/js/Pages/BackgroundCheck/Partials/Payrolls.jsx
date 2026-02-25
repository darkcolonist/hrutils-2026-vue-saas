import ArrayOfObjectsTable from '@/Components/ArrayOfObjectsTable';
import AxiosWrapper from '@/Components/AxiosWrapper';
import { format } from '@/Helpers/Number';
import { Typography } from '@mui/material';
import React, { useMemo } from 'react';

const tableDefaultProps = {
  align: "right"
};

const getAverages = (data) => {
  const sum = data.reduce((acc, obj) => {
    acc.net_pay += parseFloat(obj.net_pay);
    // acc.basic_pay += parseFloat(obj.basic_pay);
    // acc.cut_off_pay += parseFloat(obj.cut_off_pay);
    // acc.total_days += parseFloat(obj.total_days);
    return acc;
  }, { net_pay: 0
    // , basic_pay: 0, cut_off_pay: 0, total_days: 0
  });

  const average = {
    // basic_pay: sum.basic_pay / data.length,
    // cut_off_pay: sum.cut_off_pay / data.length,
    // total_days: sum.total_days / data.length
    net_pay: sum.net_pay / data.length,
  };

  return average;
}

const addFooters = (data, average) => {
  return [...data, {
    cut_off_date: 'average',
    // basic_pay: average.basic_pay,
    // cut_off_pay: average.cut_off_pay,
    // total_days: average.total_days
    net_pay: average.net_pay
  }];
}

const Warnable = ({ value, average, decimals, ...props }) => {
  const isSuspicious = value < average;

  return <Typography
    variant="body2"
    color={isSuspicious ? "error" : "normal"}
  >{format(value, decimals)}</Typography>
}

export default function Payrolls({ user, ...props }) {
  const memoizedData = useMemo(() => {
    if (user.company_email) {
      return <AxiosWrapper
        method='post'
        routeName='background.check.payrolls'
        params={{
          email: user.company_email
        }}
        after={(data) => {
          const average = getAverages(data);
          const newData = addFooters(data, average);
          return <ArrayOfObjectsTable name="payroll" lines={newData}
            // hidable
            defaults={tableDefaultProps}
            customizations={{
              "basic_pay": {
                render: value => <Warnable value={value}
                  average={average.basic_pay}
                  decimals={2} />
              }
              , "net_pay": {
                render: value => <Warnable value={value}
                  average={average.cut_off_pay}
                  decimals={2} />
              }
            }}
          />
        }}
      />;
    } else {
      return 'User doesn\'t have an email';
    }
  }, [user.company_email]);

  return memoizedData;
}
