const TIMEZONE = "Asia/Tbilisi";

export function getNextSevenDays(): string[] {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: TIMEZONE });

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(`${today}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + i);
    return d.toISOString().slice(0, 10);
  });
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