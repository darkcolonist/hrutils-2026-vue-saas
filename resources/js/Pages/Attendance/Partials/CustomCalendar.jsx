import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment/moment'
import '../../../../css/custom-react-big-calendar.css';
import { Box } from '@mui/material';

const localizer = momentLocalizer(moment)

function Event({ event }) {
  // console.debug(event);
  return (
    <Box title={event.type} sx={{
      // backgroundImage: 'linear-gradient(to bottom right, red, yellow);',
      backgroundImage: (() => {
        switch (event.type) {
          case 'birthday':
            return 'linear-gradient(to right, #190033, #190033, #00004d, #003300, #4d4d00, #663300, #660000)';
          default:
            return; // no color
        }
      })()
      , borderRadius: 2
      , p: .3
    }}>
      <strong>{event.title}</strong>
    </Box>
    // <span title=''>
    //   <strong>{event.title}</strong>
    //   {event.desc && ':  ' + event.desc}
    // </span>
  )
}

export default function CustomCalendar({data, ...props}){
  const { components } = React.useMemo(
    () => ({
      components: {
        event: Event,
      },
    }),
    []
  )

  return <div>
    <Calendar
      localizer={localizer}
      components={components}
      events={data}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 600 }}
    />
  </div>
}