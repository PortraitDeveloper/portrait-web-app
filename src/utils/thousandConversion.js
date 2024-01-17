// export default function thousandConversion(number) {
//   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }

export default function thousandConversion(number) {
  if (number >= 1000000) {
    const numberM = (number / 1000000).toFixed(1);
    return numberM.endsWith(".0") ? numberM.slice(0, -2) + "M" : numberM + "M";
  } else if (number >= 1000) {
    const numberK = (number / 1000).toFixed(1);
    return numberK.endsWith(".0") ? numberK.slice(0, -2) + "K" : numberK + "K";
  } else {
    return number.toString();
  }
}
