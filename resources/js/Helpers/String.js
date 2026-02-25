export const underscoreToTitleCase = (string) => {
  string = string.split("_")
  .map(substr => (
    substr.charAt(0).toUpperCase() +
    substr.substr(1).toLowerCase()
    ))
    .join(" ");

    return string;
}

export const getInitials = (sentence) => {
  // Split the sentence into words
  const words = sentence.split(' ');

  // Initialize an empty string to store initials
  let initials = '';

  // Iterate through each word
  words.forEach(word => {
    // Append the first character (initial) of each word to the initials string
    initials += word.charAt(0).toUpperCase();
  });

  return initials;  // Return the final initials
}