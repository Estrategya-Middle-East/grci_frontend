export const parseTimeString = (time: string | undefined): Date | null => {
  if (!time) return null;
  const [hh, mm, ss] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hh, mm, ss || 0, 0);
  return date;
};

export const formatTimeOnly = (date: Date | string): string => {
  if (!date) return "";
  const d = new Date(date);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};
