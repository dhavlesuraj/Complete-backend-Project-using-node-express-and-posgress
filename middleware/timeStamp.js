
function isUTC0530(dateUTC) {
  // Get the time zone offset in minutes
  const timezoneOffset = dateUTC.getTimezoneOffset();
  // For UTC+05:30, the offset should be -330 minutes (-5 hours and 30 minutes)
  return timezoneOffset === -330;
}
function getTimeStamp(dateUTC) {
  //console.log(dateUTC);
  if (isUTC0530(dateUTC)) {
    //console.log("The date is not in UTC+05:30 timezone.");
    dateUTC.setHours(dateUTC.getHours() + 5);
    dateUTC.setMinutes(dateUTC.getMinutes() + 30);
    //console.log(dateUTC);
    return dateUTC;
  } else {
    return dateUTC;
  }
}

export default getTimeStamp;
