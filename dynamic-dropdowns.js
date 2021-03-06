var start = new Date();

// Prepares spreadsheet and individual sheets
var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheet = ss.getSheetByName('main');
var listSheet = ss.getSheetByName('lists');
timeSince("Sheet setup complete", start);


function onEdit() {
  // Gets range in main sheets
  var rangeData = sheet.getDataRange();
  var lastRow = rangeData.getLastRow();
  
  // Gets range in lists sheet (each column containing the data for each drop-down, with the selector dropdown at the top)
  var lists = listSheet.getDataRange();
  var lastRowOfLists = lists.getLastRow();
  var lastColOfLists = lists.getLastColumn();
  var listNames = lists.getValues()[0];
  
  // Get values in the C column, to iterate through (assuming C contains the master dropdown, which the next dropdown is based on)
  var selectors = sheet.getRange(`C1:C${lastRow}`).getValues();
  timeSince("Got ranges", start);
  
  // Iterates through each cell in the C column, getting the appropriate dropdown list and applying it to the cell in the same row, in column F
  var dropdownArrArr = [];
  timeSince("Starting iterating to get dropdowns", start);
  for (let i = 3; i < lastRow; i++){
    var dropdownRange = getDropdownArray(selectors[i], listNames);
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(dropdownRange, true).build();
    dropdownArrArr.push([rule]);
  }
  timeSince("Iteration complete", start);
  
  var dropdownCells = sheet.getRange(`F4:F${lastRow}`);
  dropdownCells.setDataValidations(dropdownArrArr);
  timeSince("Applied dropdowns", start);
}

// Uses the value in column C to find the list for a dropdown
function getDropdownArray(selector, listNames, lastRowOfLists) {
  var index = findIndex(selector, listNames);
  var dropdownRange = listSheet.getRange(2, index + 1, 10, 1).getValues().filter(item => item != '');
  return dropdownRange;
}

// Custom find function for "==" equivalence rather than "==="
function findIndex(word, array) {
  var len = array.length;
  for (let i = 0; i < len; i++) {
    if (word == array[i]) {
      return i;
    }
  }
  return -1;
}

// Logs time and a message, for improving speed
function timeSince(point, start) {
  let current = new Date();
  let runTime = (current - start)/1000;
  console.log(`${point}, duration - ${runTime} seconds`);
}
