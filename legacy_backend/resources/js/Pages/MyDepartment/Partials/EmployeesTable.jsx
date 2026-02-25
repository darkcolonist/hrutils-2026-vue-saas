import ArrayOfObjectsTable from '@/Components/ArrayOfObjectsTable';
import AxiosWrapper from '@/Components/AxiosWrapper';
import CustomDialog from '@/Components/CustomDialog';
import { HidableComponent } from '@/Components/HidableComponent';
import CustomJsonView from '@/Components/JsonView';
import KeyValueGrid from '@/Components/KeyValueGrid';
import RealtimeTimestamp from '@/Components/RealtimeTimestamp';
import { format } from '@/Helpers/Number';
import { usePage } from '@inertiajs/react';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import moment from 'moment/moment';
import React from 'react';

const BaseDataGrid = React.lazy(() => import('@/Components/DataGrid'));
const money = value => format(value, 2)

function SensitiveText({...props}){
  return (
    <HidableComponent component={Box} hidden timeout={3000}>
      {props.children}
    </HidableComponent>
  )
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function getLeavesHistoryTable(params){
  return <AxiosWrapper
    method='get'
    routeName='attendance.leaves'
    params={{
      employeeCompanyEmail: params.row.company_email
    }}
    after={(data) => (
      <ArrayOfObjectsTable
        name="leaves"
        lines={(() => {
          return data.map(item => ({
            ...item,
            days: (() => {
              const display = item.is_halfday ? 0.5 : JSON.parse(item.original_dates).length
              const original_dates = JSON.parse(item.original_dates).map(date => moment(date).format('dddd, MMMM D, YYYY'));

              return {
                display,
                original_dates,
                is_paid: item.is_with_pay
              };
            })(),
            reason: (() => {
              return item.reason || JSON.parse(item.original_dates).join(', ');
            })(),

          }));
        })()}
        customizations={{
          days_ago: { hidden: true },
          is_halfday: { hidden: true },
          is_with_pay: { hidden: true },
          original_dates: { hidden: true },
          date: {
            header: "Date",
            render: value => (
              <RealtimeTimestamp>{value}</RealtimeTimestamp>
            ),
            align: 'right'
          },
          days: {
            header: "Days",
            render: value => (
              <span title={value.original_dates.join('\n')} style={{ fontFamily: 'monospace' }}>
                {value.is_paid
                  ? <span style={{ backgroundColor: '#90EE90', color: '#121212', fontWeight: 'bold', borderRadius: '4px', padding: '0 4px' }}>{value.display}</span>
                  : <span>{value.display}</span>}
              </span>
            ),
            align: 'right'
          },
          reason: {
            header: "Reason"
          },
          category: {
            header: "Type"
          },
        }}
      />
    )}
  />
}

function getLeavesReport(params) {
  return <AxiosWrapper
    method='get'
    routeName='attendance.leaves.report'
    params={{
      employeeCompanyEmail: params.row.company_email
    }}
    after={(data) => (
      <React.Fragment>
        <ArrayOfObjectsTable
          name="report"
          customizations={{
            from: {},
            to: {},
            total_leaves: { align: 'right', render: value => Number(value).toFixed(1) },
            paid_leaves: { align: 'right', render: value => Number(value).toFixed(1) }
          }}
          lines={(() => {
            const newReport = data.report;
            newReport.push({
              from: "",
              to: "Grand Total",
              total_leaves: data.total_summary.total_leaves,
              paid_leaves: data.total_summary.paid_leaves,
            });
            return newReport;
          })()}
        />
        {/* <CustomJsonView src={data} /> */}
      </React.Fragment>
    )}
  />
}

function renderTotalLeavesCell(params){
  return <CustomDialog
      buttonLabel={params.value}
      dialogTitle={`${params.row.first_name.split(' ')[0]}'s leaves history`}
      dialogContent={
        <Stack spacing={1}>
          {getLeavesReport(params)}
          {getLeavesHistoryTable(params)}
        </Stack>
      }
    />
}

export default function EmployeesTable({ ...props }) {
  const { result, formats } = usePage().props;

  const columns = [
    { field: 'id', headerName: 'ID', width: 125, sortable: false },
    {
      field: 'fullName', width: 250, headerName: "Employee"
      , valueGetter: params => `${params.row.last_name}, ${params.row.first_name}`
      , sortable: false
      , renderCell: (params) => (
        <Stack direction='row' alignItems='center' spacing={1}>
          <Avatar src={params.row.avatar}
            sx={{
              width: 24,
              height: 24
            }}
          />
          <Typography>
            {params.row.first_name.split(' ')[0]} {params.row.last_name}
          </Typography>
        </Stack>
      )
    },
    { field: 'hired_date', headerName: 'Hired', width: 100, sortable: false },
    {
      field: 'tenureship', headerName: 'Tenureship', width: 100, sortable: false
      , valueGetter: params => moment().diff(moment(params.row.hired_date), 'days')
      , renderCell: params =>
        <RealtimeTimestamp
          titleDisplayFormat={formats.dates.front_end_moment_human_date}
          removeSuffix>{params.row.hired_date}</RealtimeTimestamp>
      //   (
      //   moment(params.row.hired_date).fromNow(true)
      //   // params.row.hired_date
      // )
    },
    { field: 'position', headerName: 'Position', width: 125, sortable: false },
    { field: 'job_title', headerName: 'Job Title', width: 150, sortable: false },
    {
      field: 'current_salary', headerName: 'Salary', width: 100
      , sortable: false
      , renderCell: params => <SensitiveText>{money(params.value)}</SensitiveText>
      , align: 'right'
      , headerAlign: 'right'
    },
    {
      field: 'base_salary', headerName: 'Base Salary', width: 100
      , sortable: false
      , renderCell: params => <SensitiveText>{money(params.value)}</SensitiveText>
      , align: 'right'
      , headerAlign: 'right'
    },
    { field: 'total_leaves', headerName: 'Leaves', width: 100
      , align: 'right'
      , headerAlign: 'right'
      , renderCell: renderTotalLeavesCell
    },
    { field: 'total_paid_leaves', headerName: 'Paid Leaves', width: 100
      , align: 'right'
      , headerAlign: 'right'
    },
  ];

  return (
    <BaseDataGrid
      rows={result.list}
      columns={columns}
      rowCount={result.total}
      pageSizeOptions={[result.perPage]}
      slots={{
        toolbar: CustomToolbar
      }}
    />
  );
}