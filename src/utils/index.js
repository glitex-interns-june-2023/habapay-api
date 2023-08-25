function snakeCase(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function camelCase(str) {
  return str.replace(/_[a-z]/g, (letter) => letter[1].toUpperCase());
}

// format timestamp to 25 August 2023, 06:30 AM
function formatTimestamp(timestamp) {
  const months = [
    "January","February","March","April","May","June","July","August","September","October","November","December"
  ];

  const date = new Date(timestamp);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert to 12-hour format
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const formattedTimestamp = `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  return formattedTimestamp;
}


module.exports = {
    snakeCase,
    camelCase,
    formatTimestamp
}