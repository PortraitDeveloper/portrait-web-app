import moment from "moment";

export default function dateConversion(date) {
  const momentDate = moment(date);
  const day = momentDate.date();
  const monthName = momentDate.format("MMMM");
  const year = momentDate.year();
  const conversionDate = `${day} ${monthName} ${year}`;
  return conversionDate;
}
