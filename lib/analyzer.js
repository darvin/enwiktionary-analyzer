var Parsoid = require('parsoid');

var languages = require("./languages");

var Word = require("./word").Word;
var WORDLINK_PLACEHOLDER = require("./word").WORDLINK_PLACEHOLDER;
var newWordLink = require("./word").newWordLink;

var ls = {
	setup: function(pc) {
		pc.debug = false;
		pc.fetchTemplates = false;
		pc.expandExtensions = false;
		pc.fetchConfig = false;
		pc.fetchImageInfo = false;
		pc.loadWMF =false;
		pc.usePHPPreProcessor =false;
		pc.defaultWiki = "enwiktionary";
		pc.setMwApi({
			prefix:"enwiki",
			uri:"wikiisnotavailable.com/something.php"
		})
	},
};


var roles = {
	"Noun":"noun",
  "Verb":"verb",
  "Proper noun":"properNoun",
	"Pronoun":"pronoun"
}


function canonicalRoleName(roleName) {
  for (var canonicalName in roles) {
    if (roles[canonicalName]==roleName) {
      return canonicalName;
    }
  }
}

function isRole(str) {
	return roles.hasOwnProperty(str);
}

function normalizeRole(role) {
	return roles[role];
}



function toPlainString(pdocOrpText) {
	var result = "";
  var addPtext = function(e) {
    result += e.toString().replace(/\<\/?nowiki\>/gi, "");
  };
  if (pdocOrpText.filterText)
    pdocOrpText.filterText().forEach(addPtext);
  else if (pdocOrpText instanceof Parsoid.PText)
    addPtext(pdocOrpText);
	return result;
}

//  templates to process:

// {{sense|an oath or affirmation}} 

// {{l|cs|háček}} - link
// {{m|la|*tersa||dry land}} - mention
// {{term|test|lang=fro||an earthen vessel}}

// {{t|ast|prueba|f}} - translation
// {{t+|sw|jaribio}}
function isTerm(template) {
	return template.name=="term" || template.name=="m";
}

function parseLinkTerm(link, lang) {
	//fixme not good using text of link instead of title.
	var linkWord = toPlainString(link.text);
	var splitLink = link.title.split("#");
	var linkLang = splitLink[1] ? languages.languageAnyNameToName(splitLink[1]) : lang;
	return newWordLink(linkLang, linkWord);
}

function parseTranslation(template) {
	if (template.name=="t+"||template.name=="t") {
		return newWordLink(toPlainString(template.params[0].value), toPlainString(template.params[1].value));
	}
}

function parseContext(template) {
  if (template instanceof Parsoid.PTemplate && template.name=="context") {
    return toPlainString(template.params[0].value)
  }
}

function parseTerm(template, defaultLang) {
	if (template.name=="term") {
    var lang = template.has("lang") ? toPlainString(template.get("lang").value) : defaultLang;
		return newWordLink(lang,
						toPlainString(template.params[0].value));

	} 
	if (template.name=="m") {
		return newWordLink(toPlainString(template.params[0].value), 
						toPlainString(template.params[1].value));
	}

  if (template.name=="l") {
    return newWordLink(toPlainString(template.params[0].value),
      toPlainString(template.params[1].value));
  }

  if (template.name.split("/")[0]=="l") {
    return newWordLink(template.name.split("/")[1],
      toPlainString(template.params[0].value));
  }
}

function isParsableToWordLink(pelement) {
  return (pelement instanceof Parsoid.PTemplate && isTerm(pelement)) || pelement instanceof Parsoid.PWikiLink;
}

function parseToWordLink(pelement, defaultLang) {
  if (pelement instanceof Parsoid.PTemplate && isTerm(pelement))
    return parseTerm(pelement, defaultLang);
  else if (pelement instanceof Parsoid.PWikiLink)
    return parseLinkTerm(pelement, defaultLang);
}



function parseExplanations(pdoc, role, defaultLang) {

  forEachInList(pdoc, function(expE) {
    var textFragments = [];
    var wordLinks = [];
    var nonTextFragments = [];
    for (var i=0; i<expE.contents.length; i++) {
      var e = expE.contents.get(i);

      if (e instanceof Parsoid.PText) {
        textFragments.push(toPlainString(e));

      } else if (isParsableToWordLink(e)) {
        textFragments.push(WORDLINK_PLACEHOLDER);
        wordLinks.push(parseToWordLink(e, defaultLang));
      } else {
        nonTextFragments.push(e);
      }
    }
    var explanationText = textFragments.join("");
    var exp = role.addExplanation({
      mentionedWords:wordLinks,
      explanation:explanationText
    });

    nonTextFragments.forEach(function(e) {
      var context = parseContext(e);
      if (context)
        exp.context = context;
      if (isDefinitionList(e)||isList(e)) {
        forEachInList(e.contents, function(e) {
          //add usage
          exp.addUsage({
            usage:toPlainString(e.contents)
          });
        });
      }
    });
    //console.log("EXP: - ", exp);
  });
  return;
}

function parseEtymology(pdoc, etymology, defaultLang) {
	var lastMeaningfulText = ".";
	for (var i=0; i<pdoc.length; i++) {
		var e = pdoc.get(i);
		var newText = null;
		if (e instanceof Parsoid.PText) {
			newText = e.toString();
			if (newText) {
				if (newText.match(/from/i)) {
					lastMeaningfulText = "from";
				} else if (newText.match(/\./)) {
					lastMeaningfulText = ".";
				}
			}
		}
		


		if (e instanceof Parsoid.PTemplate) {
			if (lastMeaningfulText=="from" && isTerm(e)) {
				
				var wordLink = parseTerm(e, defaultLang);
				etymology.addFrom(wordLink);
				// console.log("							term: ", result);

			}
		}
	}

}

function forEachMultiAnonArgTemplate(template, func) {
	for (var i=0; i<template.params.length; i++) {

		var param=template.params[i];
		if (!isNaN(param.name)) {
			func(param.value);
		}
	}
}

function isListItem(e) {
  return e instanceof Parsoid.PTag && (e.tagName=="li"||e.tagName=="dd");
}

function isDefinitionList(e) {
  return e instanceof Parsoid.PTag && e.tagName=="dl";
}

function isList(e) {
  return e instanceof Parsoid.PTag && (e.tagName=="ol"||e.tagName=="ul");
}

function forEachInList(pdoc, func) {
	for (var i=0; i<pdoc.length; i++) {
		var e = pdoc.get(i);
		if (isListItem(e)) {
      func(e);
		}
	}
}

function forEachInWordList(pdoc, func) {
  if (pdoc.length==1 && pdoc.get(0) instanceof Parsoid.PTemplate && pdoc.get(0).name=="hyp3") {
    forEachMultiAnonArgTemplate(pdoc.get(0), function(e) {
      e.filterTemplates().forEach(func);
    });
  } else {
    forEachInList(pdoc, function(listItem) {
      listItem.contents.filterTemplates().forEach(func);
      listItem.contents.filterWikiLinks().forEach(func);
    })
  }
}

function parseTranslations(pdoc, wordRole, lang) {
	forEachInList(pdoc, function(e) {
		e.contents.filterTemplates().forEach(function (template) {
			var term = parseTranslation(template, lang);
      if (term) //sometimes there are qualifiers
			  wordRole.addTranslation(term);
		});
	});
}


function forEachWordlinkInPdoc(pdoc, defaultLang, callback) {
  forEachInWordList(pdoc, function(e) {
    var wordLink = null;
    if (e instanceof  Parsoid.PTemplate)
      wordLink = parseTerm(e, defaultLang);
    else if (e instanceof  Parsoid.PWikiLink)
      wordLink = parseLinkTerm(e, defaultLang);
    if (wordLink)
      callback(wordLink);
  });
}

function parsePronunciation(pdoc, word) {
	var pronounItem = null;
	var storePronounItem = function() {
		if (!pronounItem) {
			return;
		}
		if (pronounItem.hyphenation) {
			word.addHyphenation(pronounItem);
		}
		if (pronounItem.audioFile) {
			word.addPronunciation(pronounItem);
		}
		if (pronounItem.pronunciation) {
			word.addPronunciation(pronounItem);
		}
		if (pronounItem.rhyme) {
			word.addRhyme(pronounItem);
		}
	}
	forEachInList(pdoc, function(e) {
		storePronounItem();
		pronounItem = {};
		e.contents.filterTemplates().forEach(function (template) {
			switch(template.name) {
				case "a":
					pronounItem.accent=toPlainString(template.params[0].value);
					break;
				case "rhymes":
					pronounItem.rhyme=toPlainString(template.params[0].value);
					break;
				case "IPA":
					pronounItem.pronunciation=toPlainString(template.params[0].value);
					break;
				case "hyphenation":
          pronounItem.hyphenation = [];
					forEachMultiAnonArgTemplate(template, function(e) {
            pronounItem.hyphenation.push(toPlainString(e));
          });
					break;
				case "audio":
					pronounItem.audioFile=toPlainString(template.params[0].value);
					pronounItem.audioDescription=toPlainString(template.params[1].value);
					break;

			}

		});
	});
	storePronounItem();
}

function parsoidParse(wikitext, callback) {
	Parsoid.parse(wikitext, {
			pdoc: true,
			wt2html: false,
			config: ls
		}).then(function(pdoc) { 
			callback(null, pdoc); //fixme pass error
		}).done();
}

function parseArticle(articleName, wikitext, callback) {
	parsoidParse(wikitext, function(err, pdoc) {
			var result = {};

			var word = null;
			var wordName = articleName; //fixme

			var currentHeadingBreadCrumps = [];
			var currentHeadingLevel = null;
			var currentHeadingString = null;
      var currentHeading = null;
      var isHeadingRole = function() {
        return currentHeadingString && ((currentHeading.level==3||currentHeading.level==4)&&isRole(headingString));
      };
      var isHeading = function(str) {
        return currentHeadingString&&currentHeadingString.match(new RegExp(str+".*", "i"));
      };

			for (var i=0; i<pdoc.length; i++) {
				var currentElement = pdoc.get(i);
				if (currentElement instanceof Parsoid.PHeading) {
					currentHeading = currentElement;
					var headingString = currentHeading.title.toString();

					if (currentHeadingLevel!=null) {
						for (var hpopi=0; hpopi<(currentHeadingLevel-currentHeading.level+1); hpopi++){
							currentHeadingBreadCrumps.pop();
						}
					}
					currentHeadingBreadCrumps.push(headingString);
					currentHeadingString = headingString;

					currentHeadingLevel = currentHeading.level;
					if (currentHeading.level==2) {
						var lang = languages.languageAnyNameToName(headingString);
						// console.log("found language ", currentLanguage);
						word = new Word(lang, wordName);
						result[lang] = word;
					}

					if (currentHeading.level==3 && headingString.match(/Etymology.*/)) {
						word.addMeaning();
					}

					if (isHeadingRole()) {
						// console.log("    found role ", headingString);
						word.lastMeaning().addRole(normalizeRole(headingString));
					}
				} else if (currentElement instanceof Parsoid.PTag) {
          if (isHeadingRole()){
            parseExplanations(currentElement.contents, word.lastMeaning().lastRole(), word.lang);
          }
					if (isHeading("Etymology")){
						parseEtymology(currentElement.contents, word.lastMeaning().etymology, word.lang);
					}
					if (isHeading("Synonyms")){
            forEachWordlinkInPdoc(currentElement.contents, word.lang, function(wordLink) {
              word.lastMeaning().lastRole().addSynonym(wordLink);
            });
					}
					if (isHeading("Hyponyms")){
            forEachWordlinkInPdoc(currentElement.contents, word.lang, function(wordLink) {
              word.lastMeaning().lastRole().addHyponym(wordLink);
            });
          }

          if (isHeading("Antonyms")){
            forEachWordlinkInPdoc(currentElement.contents, word.lang, function(wordLink) {
              word.lastMeaning().lastRole().addAntonym(wordLink);
            });
          }

          if (isHeading("Derived Terms")){
            forEachWordlinkInPdoc(currentElement.contents, word.lang, function(wordLink) {
              word.lastMeaning().lastRole().addDerivedTerm(wordLink);
            });
          }

          if (isHeading("Descendants")){
            forEachWordlinkInPdoc(currentElement.contents, word.lang, function(wordLink) {
              word.lastMeaning().lastRole().addDescendant(wordLink);
            });
          }

          if (isHeading("Related Terms")){
            forEachWordlinkInPdoc(currentElement.contents, word.lang, function(wordLink) {
              word.lastMeaning().lastRole().addRelatedTerm(wordLink);
            });
          }

          if (isHeading("Anagrams")){
            forEachWordlinkInPdoc(currentElement.contents, word.lang, function(wordLink) {
              word.addAnagram(wordLink);
            });
          }

          if (isHeading("Translations")){
						parseTranslations(currentElement.contents, word.lastMeaning().lastRole(), word.lang);
					}

					if (isHeading("Pronunciation")){
						parsePronunciation(currentElement.contents, word);
					}
				} 
				

			}
			// console.log(result);
			callback(null, result);
		});
}



module.exports = {
	parseArticle: parseArticle,
	parsoidParse: parsoidParse,
	toPlainString: toPlainString,
	parseEtymology: parseEtymology,
  canonicalRoleName: canonicalRoleName,
}