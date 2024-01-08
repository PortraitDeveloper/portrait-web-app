export default function paginate(array, perPage, pageNumber) {
  --pageNumber; // Adjust to 0-based index
  const startIndex = parseInt(pageNumber) * parseInt(perPage);
  const endIndex = startIndex + parseInt(perPage);
  return array.slice(startIndex, endIndex);
}
