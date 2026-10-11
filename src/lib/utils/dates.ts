const TIMEZONE = "Asia/Tbilisi";

export function getNextSevenDays(): string[] {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: TIMEZONE });

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(`${today}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export function getToday({ days = 0, months = 0, years = 0 } = {}): string {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: TIMEZONE });
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCFullYear(d.getUTCFullYear() + years);
  d.setUTCMonth(d.getUTCMonth() + months);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatDateParts(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  return {
    weekday: new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      timeZone: "UTC",
    }).format(d),
    day: d.getUTCDate(),
  };
}