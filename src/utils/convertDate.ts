class DateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DateError";
  }
}

export function YMDToDateMs(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (y && m && d) {
    return new Date(y, m - 1, d).getTime();
  }
  throw new DateError("Date format does not matches Y-M-D");
}

export function dateToYMD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
