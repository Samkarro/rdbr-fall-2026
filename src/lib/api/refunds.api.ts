const REFUND_CUTOFF_MS = 2 * 60 * 60 * 1000;

export function formatRefundDeadline(startsAt: string): string {
  const deadline = new Date(new Date(startsAt).getTime() - REFUND_CUTOFF_MS);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    weekday: "short",
    month: "short",
    timeZone: "Asia/Tbilisi",
  }).format(deadline);
}