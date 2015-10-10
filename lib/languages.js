var fs = require('fs');
var path = require('path');
var languages = JSON.parse(fs.readFileSync(path.join(__dirname, '_generated_language_list.json'), 'utf8'));

var langNamesByAnyName = null;
function languageAnyNameToName(anyName){
  if (!langNamesByAnyName) {
    langNamesByAnyName = {};
    for (var languageName in languages) {
      langNamesByAnyName[languages[languageName].canonicalName] = languageName;
    }
  }
  return langNamesByAnyName[anyName];
}

function canonicalLanguageName(languageName) {
  if (languages[languageName])
    return languages[languageName].canonicalName;
}


function isLanguageInAppendix(langName) {
  var lang = languages[langName];
  return lang.type!="regular";
}
function languagesList() {
  return Object.keys(languages)
}

module.exports = {
  languageAnyNameToName: languageAnyNameToName,
  canonicalLanguageName: canonicalLanguageName,
  languagesList:languagesList,
  isLanguageInAppendix:isLanguageInAppendix
}