import React from 'react';
import AuthenticatedSectionLayout from '@/Layouts/AuthenticatedSectionLayout';
import ArrayOfObjectsTable from '@/Components/ArrayOfObjectsTable';
import RealtimeTimestamp from '@/Components/RealtimeTimestamp';
import MUILink from '@mui/material/Link';
import { Link } from '@inertiajs/react';
import { getSearchKeyword } from '../BackgroundCheck/Partials/Suggestions';
import { stringToColorStyle } from '@/Helpers/stringToColor';

// Internal formatter function
const prepareData = (rawData) => {
  return rawData.map((rawDataLine, index) => {
    const lowerCaseRawDataLine = {};
    for (const key in rawDataLine) {
      lowerCaseRawDataLine[key.toLowerCase()] = rawDataLine[key];
    }
    rawDataLine = lowerCaseRawDataLine;

    const fullName = `${rawDataLine.first_name || 'N/A'} ${rawDataLine.last_name || ''}`.trim();
    const department = rawDataLine.department.split('-').shift().trim().split(' ').map(word => word[0]).join('');
    const departmentExpanded = rawDataLine.department;

    const formattedDataLine = {
      ...rawDataLine,
      counter: index + 1,
      name: fullName,
      company_email: <MUILink component={Link}
        href={route('background.check', {
          "keyword": getSearchKeyword(rawDataLine)
        })}>{rawDataLine.company_email}</MUILink>,
      designation: <>
        <span
          className="inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-1"
          style={stringToColorStyle(departmentExpanded)}
          title={departmentExpanded}
        >
          {department}
        </span>
        <span
          className="inline-block rounded-full px-3 py-1 text-sm font-semibold"
          style={stringToColorStyle(rawDataLine.job_title)}
        >
          {rawDataLine.job_title}
        </span>
      </>,
    };

    // Delete unwanted fields
    delete formattedDataLine.first_name;
    delete formattedDataLine.last_name;
    delete formattedDataLine.job_title;
    delete formattedDataLine.position;
    delete formattedDataLine.department;
    delete formattedDataLine.avatar;
    delete formattedDataLine._baseid;
    delete formattedDataLine.log_type;
    delete formattedDataLine.current_status;

    return formattedDataLine;
  });
};

export default function EmployeesOnDuty({ auth, response, formats }) {
  const employees = prepareData(response.employees);

  return <AuthenticatedSectionLayout auth={auth} title="Employees On Duty">
    <ArrayOfObjectsTable
      lines={employees}
      className="w-full"
      rowClassName="hover:bg-gray-50"
      headerClassName="bg-gray-100 font-medium"
      customizations={{
        counter: { header: "#" },
        employee_id: { header: "Employee Id" },
        name: { header: "Name" },
        company_email: { header: "Company Email" },
        designation: {},
        log_time: {
          header: "Log Time",
          render: (value) => <RealtimeTimestamp>{value}</RealtimeTimestamp>
        },
      }}
    />
  </AuthenticatedSectionLayout>
}
