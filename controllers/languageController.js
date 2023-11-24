const languages = require('../language/language.json'); // Adjust the path to your language JSON file

// Get language data based on the language key
const getLanguageData = (req, res) => {
  const { languageKey } = req.body; // Assuming languageKey is sent in the request body

  // Check if the language key is valid
  if (languages[languageKey]) {
    const languageData = languages[languageKey];
    res.status(200).json(languageData);
  } else {
    // If the language key is not valid, return an error response
    res.status(400).json({ error: 'Invalid language key' });
  }
};

module.exports = { getLanguageData };
