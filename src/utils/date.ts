import moment from 'moment'
export function formatTime(date: Date, pattern: string = 'yyyy-MM-DD'): string {
  return moment(date).format(pattern)
}
