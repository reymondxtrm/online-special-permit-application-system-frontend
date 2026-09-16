// Stage dates/times come from the API as separate "MM/DD/YYYY" + "hh:mm AM/PM"
// strings; parse them locally so duration can be computed to the minute
// instead of relying on the backend's coarser duration strings (e.g. "1 day +").
export const parseStageDateTime = (stage) => {
  if (!stage?.date) return null;
  const [month, day, year] = stage.date.split("/").map(Number);
  if (!month || !day || !year) return null;

  let hours = 0;
  let minutes = 0;
  const match = stage.time?.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (match) {
    hours = Number(match[1]) % 12;
    minutes = Number(match[2]);
    if (/PM/i.test(match[3])) hours += 12;
  }

  return new Date(year, month - 1, day, hours, minutes);
};

export const formatDuration = (fromStage, toStage) => {
  const from = parseStageDateTime(fromStage);
  const to = parseStageDateTime(toStage);
  if (!from || !to || to < from) return "—";

  let totalMinutes = Math.round((to - from) / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  totalMinutes -= days * 60 * 24;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days} day${days === 1 ? "" : "s"}`);
  if (hours > 0) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);

  if (parts.length === 0) return "Less than a minute";
  return parts.slice(0, 2).join(" and ");
};
