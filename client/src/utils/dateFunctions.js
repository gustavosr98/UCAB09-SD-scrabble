// Returns date with the format: 29 de abril de 2020
export function fullDate(dateWithTimezone) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateWithTimezone).toLocaleString("es-es", options);
}

export function dateFormat(dateWithTimezone) {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  return new Date(dateWithTimezone).toLocaleString("es-es", options);
}
