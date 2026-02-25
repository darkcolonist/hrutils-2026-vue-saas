export const parse = (string) => {
  let parsedValue;
  const sanitized = sanitizeJsonString(string);

  try {
    parsedValue = JSON.parse(sanitized);
  } catch (e) {
    console.debug("Trouble parsing JSON:", sanitized);
    parsedValue = "N/A";
  }

  // Use parsedValue in your application
  return parsedValue;
}

const sanitizeJsonString = (jsonString) => {
  // Replace single backslashes with double backslashes
  jsonString = jsonString.replace(/\\/g, '\\\\');
  // Replace incorrectly escaped double quotes with correctly escaped double quotes
  jsonString = jsonString.replace(/\\"/g, '"');

  // Add more custom sanitization rules as needed

  return jsonString;
}