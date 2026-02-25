import moment from 'moment/moment';

export const getWorkDays = (start,end) => {
  let startDate = moment(start);
  let endDate = moment(end);
  let currentDate = moment(startDate);
  let workdays = 0;

  while (currentDate.isSameOrBefore(endDate)) {
    // Check if the current day is a workday (Monday to Friday)
    if (currentDate.day() !== 0 && currentDate.day() !== 6) {
      workdays++;
    }
    currentDate.add(1, 'days'); // Move to the next day
  }

  return workdays;
}