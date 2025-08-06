import type { ScheduleItem } from "$lib/server/db/schema";
import type dayjs from "dayjs";

export const deleteModal = $state<{show: boolean, item: ScheduleItem | null}>({ show: false, item: null });
export const editModal = $state<{show: boolean, item: ScheduleItem | null}>({ show: false, item: null });
export const addModal = $state<{show: boolean, initialDate: dayjs.Dayjs | undefined}>({ show: false, initialDate: undefined });