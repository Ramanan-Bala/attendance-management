import { formatDate } from "@angular/common";
export function stringToDate(ip: string): Date {
  let date = ip.split("-");
  return new Date(parseInt(date[2]), parseInt(date[1]) - 1, parseInt(date[0]));
}

export function dateToString(ip: Date): String {
  return formatDate(ip, "dd-MM-yyyy", "en");
}
