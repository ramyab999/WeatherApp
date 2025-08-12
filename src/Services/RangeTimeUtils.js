export function range(start, stop, step) {
  return Array.from(
    { length: (stop - start) / step },
    (_, i) => start + i * step
  );
}

export function createWeatherObject(timeArr, valuesObj, weatherCodesMapping) {
  const result = {};

  timeArr.forEach((time, index) => {
    if (!time) return;

    const entry = {};
    Object.keys(valuesObj).forEach((key) => {
      entry[key] = valuesObj[key]?.[index];
    });

    const weatherCode = valuesObj.weatherCode?.[index];
    entry.weatherCondition = weatherCodesMapping?.[weatherCode]?.label;

    result[time] = entry;
  });

  return result;
}

export function getTodayClosestTime(dataObj) {
  const now = new Date();
  const entries = Object.entries(dataObj).filter(([t]) => {
    const d = new Date(t);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  if (!entries.length) return [];

  let closestIndex = 0;
  let closestDiff = Math.abs(now - new Date(entries[0][0]));

  entries.forEach(([time], idx) => {
    const diff = Math.abs(now - new Date(time));
    if (diff < closestDiff) {
      closestDiff = diff;
      closestIndex = idx;
    }
  });

  return entries.map(([date, values], index) => ({
    date,
    values,
    isClosestTime: index === closestIndex,
  }));
}
