import moment from "moment";
import "moment-timezone";

// export default function dateConversion(date) {
//   const momentDate = moment(date).tz("Asia/Jakarta");
//   const day = momentDate.date();
//   const monthName = momentDate.format("MMMM");
//   const year = momentDate.year();
//   const conversionDate = `${day} ${monthName} ${year}`;
//   return conversionDate;
// }

export default function dateConversion(date) {
  const conversionDate = moment(date).tz("Asia/Jakarta").format("DD MMMM YYYY");
  return conversionDate;
}
