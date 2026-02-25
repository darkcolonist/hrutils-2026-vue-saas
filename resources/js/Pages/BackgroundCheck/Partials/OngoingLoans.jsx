import ArrayOfObjectsTable from '@/Components/ArrayOfObjectsTable';
import AxiosWrapper from '@/Components/AxiosWrapper';
import RealtimeTimestamp from '@/Components/RealtimeTimestamp';
import moment from 'moment/moment';
import React from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import MUILink from '@mui/material/Link';
import { Link } from '@inertiajs/react';
import { getSearchKeyword } from './Suggestions';

const tableDefaultProps = {

};

// Internal formatter function
const formatLoansData = (rawData) => {
  return rawData.map((loan, index) => {  // Add `index` parameter
    const lowerCaseLoan = {};
    for (const key in loan) {
      lowerCaseLoan[key.toLowerCase()] = loan[key];
    }
    loan = lowerCaseLoan;

    const fullName = `${loan.first_name || 'N/A'} ${loan.last_name || ''}`.trim();

    const formattedLoan = {
      ...loan,
      '#': index + 1,  // Add counter (1-based index)
      name: <>
        {loan.employment_status !== "active"
          ? <WarningIcon color="warning" fontSize="small" />
          : null}{' '}
        {fullName}
      </>,
      company_email: <MUILink component={Link}
        href={route('background.check', {
          "keyword": getSearchKeyword(loan)
        })}>{loan.company_email}</MUILink>,
      receivable: (loan.total_loan_amount - loan.loan_amount).toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
      }),
      maturity: moment(loan.date_applied).add(loan.loan_period, 'months').format('YYYY-MM-DD'),
      employment_status: loan.employment_status === "active"
        ? "employed"
        : <>
          resigned{' '}<RealtimeTimestamp>{loan.resignation_date}</RealtimeTimestamp>
        </>
    };

    // Delete unwanted fields
    delete formattedLoan.first_name;
    delete formattedLoan.last_name;
    delete formattedLoan.total_loan_amount;
    delete formattedLoan.loan_amount;
    delete formattedLoan.balance;
    delete formattedLoan.amount_per_cut_off;
    delete formattedLoan.is_paid;
    delete formattedLoan.loan_period;
    delete formattedLoan.type;
    delete formattedLoan.status;

    /**
     * we will be needing formattedLoan.resignation_date when
     * formatting per row
     */
    // delete formattedLoan.resignation_date;

    return formattedLoan;
  });
};

export default function OngoingLoans() {
  return (
    <AxiosWrapper
      method='get'
      routeName='background.ongoing.loans'
      after={(data) => {
        const formattedData = formatLoansData(data);

        // Calculate total receivables for the coming cut-off (active loans only, exclude resigned)
        const totalReceivables = data
          .filter(loan => loan.employment_status === 'active')
          .reduce((sum, loan) => sum + (parseFloat(loan.amount_per_cut_off) || 0), 0);

        const receivablesThisCutOff = totalReceivables.toLocaleString('en-PH', {
          style: 'currency',
          currency: 'PHP',
          minimumFractionDigits: 2,
        });

        // console.log('Total receivables this coming cut-off (active loans only):', receivablesThisCutOff);

        return (
          <ArrayOfObjectsTable
            defaults={tableDefaultProps}
            getRowProps={(row, idx) => {
              return {
                sx: row.resignation_date !== null ? { backgroundColor: '#300000' } : {}
              }
            }}
            // name={`Ongoing Loans (receivables this cut-off: ${receivablesThisCutOff})`}
            name={<>
              <span>Ongoing Loans</span><br/>
              <small title='receivables this coming cut-off'>{receivablesThisCutOff}</small>
            </>}
            lines={formattedData}
            customizations={{
              '#': { align: 'right' },
              name: {},
              company_email: {},
              employment_status: {},
              date_applied: {
                header: "Applied",
                render: value => (
                  <RealtimeTimestamp>{value}</RealtimeTimestamp>
                ),
                align: 'right'
              },
              date_approved: {
                header: "Approved",
                render: value => (
                  <RealtimeTimestamp>{value}</RealtimeTimestamp>
                ),
                align: 'right'
              },
              maturity: {
                render: value => (
                  <RealtimeTimestamp>{value}</RealtimeTimestamp>
                ),
                align: 'right'
              },
              receivable: {
                align: 'right'
              },
              resignation_date: {
                header: "Resigned at",
                hidden: true
              }
            }}
          />
        );
      }}
    />
  );
}