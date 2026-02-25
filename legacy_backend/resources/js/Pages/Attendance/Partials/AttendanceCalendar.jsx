import { Avatar, Badge, Box } from '@mui/material';
import React from 'react';
import CustomCalendar from './CustomCalendar';
import AxiosWrapper from '@/Components/AxiosWrapper';
import CustomJsonView from '@/Components/JsonView';
import CustomDialog from '@/Components/CustomDialog';
import moment from 'moment/moment';

const COLOR_APPROVED = 'green';
const COLOR_PENDING = 'grey';
const COLOR_DEFAULT = 'red';

const CalendarLeaveDaySeries = ({ leaves, day, formats, ...props}) => {
  return <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}>
    {leaves.map((leave, index) => <CalendarLeaveItem formats={formats} key={index} leave={leave} />)}
  </Box>
}

const CalendarSpecialDaySeries = ({ specialDays, day, formats, specialField, ...props}) => {
  const filteredDays = specialDays.filter((specialDay) => {
    return specialDay[specialField] === day;
  })

  return <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}>
    {filteredDays.map((specialDay, index) => <CalendarSpecialDayItem formats={formats} key={index} specialDay={specialDay} />)}
  </Box>
}

function getTitle(leave, formats) {
  const formattedDate = moment(leave.day).format(formats.dates.front_end_moment_human_date);
  return `leave details of ${leave.first_name.split(' ')[0]} on ${formattedDate}`
}

function getModalContent(leave, formats) {
  leave.start_date = moment(leave.start_date).format(formats.dates.front_end_moment_human_date)
  leave.end_date = moment(leave.end_date).format(formats.dates.front_end_moment_human_date)
  leave.paid = leave.is_with_pay ? "yes" : "no"
  leave.halfday = leave.is_halfday ? "yes" : "no"
  leave.reason = leave.reason.trim()
  leave.executor = leave.executor ? leave.executor.split(' ')[0] : null;
  leave.days = Array.isArray(leave.days) ? leave.days : JSON.parse(leave.days);


  const propertiesToRetain = [
    'status'
    , 'reason'
    , 'start_date'
    , 'end_date'
    , 'days'
    , 'executor'
    , 'halfday'
    , 'period'
    , 'leave_hash'
    , 'paid'
  ];

  const filteredLeave = Object.keys(leave)
    .filter(key => propertiesToRetain.includes(key))
    .reduce((obj, key) => {
      obj[key] = leave[key];
      return obj;
    }, {});

  return <CustomJsonView src={filteredLeave} />
}

const CalendarSpecialDayItem = ({ specialDay, formats, ...props }) => {

  const name = specialDay.first_name.split(' ')[0];

  return <Avatar component="span"
      title={name}
      sx={{
        width: 24,
        height: 24,
        m: "1px",
      }}
      src={specialDay.avatar}
    >{name}</Avatar>
}

const HalfdayLeaveWrapper = ({leave, children, component = 'span', ...props}) => {
  return <Badge
    overlap='circular'
    component={component}
    anchorOrigin={{ vertical: leave.period === 'am'
        ? 'top'
        : 'bottom'
      , horizontal: 'right' }}
    badgeContent={
      <Avatar sx={{
        width: 10,
        height: 10,
        fontSize: 5,
        textTransform: 'uppercase',
        backgroundColor: (() => {
          switch (leave.status) {
            case 'pending':
              return COLOR_PENDING;
            case 'approved':
              return COLOR_APPROVED;
            default:
              return COLOR_DEFAULT;
          }
        })(),
        color: '#333'
      }} title={`halfday ${leave.period}`} component={component}
      >{leave.period[0]}</Avatar>
    }
  >{children}</Badge>
}

const CalendarLeaveItem = ({leave, formats, ...props}) => {

  const name = leave.first_name.split(' ')[0];

  let leaveItem = <Avatar component="span"
    title={name}
    sx={{
      width: 24,
      height: 24,
      m: "1px",
      border: (() => {
        switch (leave.status) {
          case 'pending':
            return `2px solid ${COLOR_PENDING}`;
          case 'approved':
            return `2px solid ${COLOR_APPROVED}`;
          default:
            return `2px solid ${COLOR_DEFAULT}`;
        }
      })()
    }}
    src={leave.avatar}
  >{name}</Avatar>

  leaveItem = <CustomDialog component="span"
    buttonLabel={leaveItem}
    dialogTitle={getTitle(leave, formats)}
    dialogContent={getModalContent(leave, formats)} />

  if(leave.is_halfday === 1)
    leaveItem = <HalfdayLeaveWrapper leave={leave}>
      {leaveItem}
    </HalfdayLeaveWrapper>

  return leaveItem
}

const dataBuilder = (data, formats) => {
  const dates = [];

  const uniqueLeaves = data.leaves.filter((leave) => {
    if (!dates.includes(leave.day)) {
      dates.push(leave.day);
      return true;
    }
    return false;
  });

  const formattedLeaves = uniqueLeaves.map((leave) => {
    const sameDayLeaves = data.leaves.filter((candidateLeaveForFiltering) => {
      return candidateLeaveForFiltering.day === leave.day;
    });

    return {
      "title": <CalendarLeaveDaySeries formats={formats} leaves={sameDayLeaves} day={leave.day} />
      , "start": leave.day
      , "end": leave.day
      , "allDay": true
      , "type": "leave"
    };
  });

  const formattedSpecialDates = data.special.map((specialDay) => {
    return {
      "title": <CalendarSpecialDaySeries
        specialDays={data.special}
        day={specialDay.birth_date}
        formats={formats}
        specialField="birth_date" />
      , "start": specialDay.birth_date
      , "end": specialDay.birth_date
      , "allDay": true
      , "type": "birthday"
    };
  });

  const formattedData = [...formattedSpecialDates, ...formattedLeaves];

  return formattedData;
}

export default function AttendanceCalendar({ formats, ...props }) {
  return (
    <Box sx={{py: 1}}>
      <AxiosWrapper method="post" routeName="attendance.calendar"
        after={data => {
          const formattedData = dataBuilder(data, formats);
          return <CustomCalendar data={formattedData} />
        }}
      />
    </Box>
  );
}