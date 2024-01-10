export default function dateConvertion(date) {
  const inputDate = date;
  const dateObject = new Date(inputDate);

  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("id-ID", options).format(
    dateObject
  );

  return formattedDate;
}
