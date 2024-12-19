function snakeCase(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function camelCase(str) {
  return str.replace(/_[a-z]/g, (letter) => letter[1].toUpperCase());
}

// format timestamp to 25 August 2023, 06:30 AM
function formatTimestamp(timestamp) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Africa/Nairobi", // Specify the Nairobi timezone
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedTimestamp = formatter.format(new Date(timestamp));

  return formattedTimestamp;
}

const getTimestamp = () => {
  const dateString = new Date().toLocaleDateString("en-us", {
    timeZone: "Africa/Nairobi",
  });
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const timestamp = `${year}${month}${day}${hour}${minutes}${seconds}`;
  return timestamp;
};

module.exports = {
  snakeCase,
  camelCase,
  formatTimestamp,
  getTimestamp,
};
