// Parses a date in the javascript format to a string form of dd/mm/yyyy

function parseDate(date, modifier){
  if (modifier) {
    date.setDate(date.getDate() + modifier);
  };
  var strDate = `${date.getDate()}\/${date.getMonth() + 1}\/${date.getFullYear()}`;
  console.log(strDate);
  return strDate;
}
