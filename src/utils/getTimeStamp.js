export default function getTimeStamp(timeDiff) {
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + timeDiff);

  return currentDate;
}
