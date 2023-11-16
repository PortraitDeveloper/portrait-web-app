export default function is8601Format(timeDiff, dateTime) {
  const dateTimeFormat = new Date(dateTime);
  dateTimeFormat.setHours(dateTimeFormat.getHours() + timeDiff);

  return dateTimeFormat;
}
