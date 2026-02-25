import AxiosWrapper from '@/Components/AxiosWrapper';
import KeyValueGrid, { defaultAdditional } from '@/Components/KeyValueGrid';
import { format } from '@/Helpers/Number';
import { Typography } from '@mui/material';
import moment from 'moment/moment';
import React from 'react';

const renderDigits = (number, decimals = 0) => {
  number = format(number, decimals);
  return <Typography textAlign="right">{number}</Typography>
}

const renderPercentDigit = (number) => {
  number = format(number);
  return <Typography textAlign="right">{number}%</Typography>
}

const LoanStatisticsTable = ({ summary }) => {
  summary.contributions = summary.total_loan_amount - summary.total_base_loan_amount;
  summary.approval_rate = (summary.total_approved / (summary.total_approved + summary.total_unapproved)) * 100;

  const definitions = {
    total_base_loan_amount: {
      title: "Overall",
      render: value => renderDigits(value, 2)
    },
    total_loan_amount: {
      title: "Overall with Interest",
      render: value => renderDigits(value, 2)
    },
    total_base_loan_average: {
      title: "Average",
      render: value => renderDigits(value, 2)
    },
    contributions: {
      title: "Contributions",
      render: value => renderDigits(value, 2)
    },
    total_approved: {
      title: "Approved",
      render: renderDigits
    },
    total_unapproved: {
      title: "Unapproved",
      render: renderDigits
    },
    approval_rate: {
      title: "Approval Rate",
      render: renderPercentDigit
    }
  };

  const additional = {
    ...defaultAdditional,
    label_xs: 6,
    value_xs: 6,
    grid_spacing: 0,
    grid_item_sx: {
      ...defaultAdditional.grid_item_sx,
      borderBottom: '1px dotted #aaa',
      px: 1
    },
    grid_container_sx: {
      ...defaultAdditional.grid_container_sx,
      '&:hover': {
        backgroundColor: '#333', // Highlight color on hover
      },
    }
  }

  return <React.Fragment>
    <Typography variant='h6'>Loan Statistics</Typography>
    <KeyValueGrid entries={summary} definitions={definitions}
      additional={additional}
    />
  </React.Fragment>
}

export default function LoanStatistics({ user, ...props }) {
  return (
    user.company_email ? <AxiosWrapper
      method='post'
      routeName='background.check.loans.statistics'
      params={{
        email: user.company_email
      }}
      after={(data) =>
        <React.Fragment>
          <LoanStatisticsTable summary={data.statistics} />
        </React.Fragment>
      }
    /> : 'user doesn\'t have an email'
  );
}