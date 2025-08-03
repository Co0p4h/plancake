import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(localeData);

/**
 * converts a UTC date string to local datetime format (YYYY-MM-DDTHH:mm)
 */
export function formatDateTimeLocal(utcDate: Date | dayjs.Dayjs | string | null | undefined): string {
  if (!utcDate) return "";
  try {
    const date = dayjs(utcDate);
    if (!date.isValid()) return "";
    
    const localDateTime = date.local().format('YYYY-MM-DDTHH:mm');
    return localDateTime;
  } catch (error) {
    console.error("error formatting date:", error);
    return "";
  }
}

/**
 * checks if a date is today
 */
export function isToday (date: dayjs.Dayjs) {
  return date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
};

/**
 * returns an array containing days of the week starting from the ISO week 
 * that contains the provided date.
 */
export function getDaysOfWeek (currentDate: dayjs.Dayjs) {
  const startOfWeek = currentDate.startOf('isoWeek');
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    days.push(startOfWeek.add(i, 'day'));
  }

  return days;
}

/**
 * returns an array containing days of the week starting from the ISO week 
 * that contains the provided date. spliced around the current date to center it in the week view.
 */
export function getSplicedDaysOfWeek (currentDate: dayjs.Dayjs, column_offset: number) {
  const startOfWeek = currentDate.startOf('isoWeek');
  const isoDayNumber = currentDate.isoWeekday();
  // console.log("startOfWeek", startOfWeek.format("YYYY-MM-DD"));
  // console.log("startOfWeek + 1", startOfWeek.add(7, 'day').format("YYYY-MM-DD"));
  
  console.log("isoDayNumber", isoDayNumber);

  const daysBefore = Math.floor((column_offset - 1) / 2);
  const idealStart = isoDayNumber - daysBefore; 
  
  let windowStartIsoDay: number;
  if (idealStart < 1) {
    windowStartIsoDay = 1;
  } else if (idealStart + column_offset - 1 > 7) {
    windowStartIsoDay = 7 - column_offset + 1;
  } else {
    windowStartIsoDay = idealStart;
  }

  console.log("windowstartisoday (clamped)", windowStartIsoDay);

  const days = [];
  
  for (let i = 0; i < column_offset; i++) {
    const dayOffset = windowStartIsoDay - 1 + i;
    const day = startOfWeek.add(dayOffset, 'day');
    days.push(day);
  }

  console.log("spliced days: ", days);

  return days;
}


/**
 * 
 */
export function getCurrentWeekDates(firstDayOfWeek: 'monday' | 'sunday') {
  const today = dayjs();
  
  const startOfWeek = firstDayOfWeek === 'monday' 
    ? today.startOf('isoWeek') // monday
    : today.startOf('week'); // sunday
    
  const endOfWeek = startOfWeek.endOf('day').add(6, 'days');
  
  return {
    start: startOfWeek.startOf('day').toDate(),
    end: endOfWeek.endOf('day').toDate()
  };
}