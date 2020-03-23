export const DateDiff = (date1: Date, date2: Date) => {
  const t1 = date1.getTime();
  const t2 = date2.getTime();

  const diffMS = t1 - t2;

  const diffSeconds = diffMS / 1000;

  const diffMinuts = diffSeconds / 60;

  const diffHours = diffMinuts / 60;

  const diffDays = diffHours / 24;

  const diffMonths = diffDays / 30;

  const diffYears = diffMonths / 12;

  return {
    diffMS,
    diffMonths,
    diffSeconds,
    diffHours,
    diffDays,
    diffYears
  };
};
