export function formatExpiry(raw: string, isDeleting = false): string {
  let digits = raw.replace(/\D/g, "").slice(0, 4);

  if (digits.length === 1 && digits > "1") digits = "0" + digits;

  if (digits.length >= 2) {
    const month = Number(digits.slice(0, 2));
    if (month < 1 || month > 12) digits = digits.slice(0, 1);
  }

  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;

  if (digits.length === 2 && !isDeleting) return `${digits}/`;
  return digits;
}