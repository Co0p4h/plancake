import type { ScheduleItem } from "$lib/server/db/schema";
import dayjs from "dayjs";

// https://calendar.google.com/calendar/render?action=TEMPLATE&text=Example+Google+Calendar+Event&details=More+help+see:+https://support.google.com/calendar/thread/81344786&dates=20201231T160000/20201231T170000&recur=RRULE:FREQ%3DWEEKLY;UNTIL%3D20210603&ctz=America/Toronto 
export const createGoogleCalendarLink = (item: ScheduleItem) => {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const params = new URLSearchParams();

  params.set('text', item.title);
  params.set('details', item.description ?? '');
  const endTime = item.endTime ? dayjs(item.endTime) : dayjs(item.startTime).add(1, 'hour');
  params.set('dates', `${dayjs(item.startTime).format('YYYYMMDDTHHmmss')}/${endTime.format('YYYYMMDDTHHmmss')}`);

  return `${baseUrl}&${params.toString()}`;
}
