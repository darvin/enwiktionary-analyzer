var Parsoid = require('parsoid');

var languages = require("./languages");

var Word = require("./word").Word;
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



function toPlainString(pdoc) {
	var result = "";
	pdoc.filterText().forEach(function(t) {
		result += t.toString().replace(/\<\/?nowiki\>/gi,"");
	});
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

function forEachInList(pdoc, func) {
	for (var i=0; i<pdoc.length; i++) {
		var e = pdoc.get(i);
		if (e instanceof Parsoid.PTag && e.tagName=="li") {
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
			var currentHeading = null;


			for (var i=0; i<pdoc.length; i++) {
				var currentElement = pdoc.get(i);
				if (currentElement instanceof Parsoid.PHeading) {
					var heading = currentElement;
					var headingString = heading.title.toString();

					if (currentHeadingLevel!=null) {
						for (var hpopi=0; hpopi<(currentHeadingLevel-heading.level+1); hpopi++){
							currentHeadingBreadCrumps.pop();
						}
					}
					currentHeadingBreadCrumps.push(headingString);
					currentHeading = headingString;

					currentHeadingLevel = heading.level;
					if (heading.level==2) {
						var lang = languages.languageAnyNameToName(headingString);
						// console.log("found language ", currentLanguage);
						word = new Word(lang, wordName);
						result[lang] = word;
					}

					if (heading.level==3 && headingString.match(/Etymology.*/)) {
						word.addMeaning();
					}

					if ((heading.level==3||heading.level==4)&&isRole(headingString)) {
						// console.log("    found role ", headingString);
						word.lastMeaning().addRole(normalizeRole(headingString));
					}
				} else if (currentElement instanceof Parsoid.PTag) {
          var isHeading = function(str) {
            return currentHeading&&currentHeading.match(new RegExp(str+".*", "i"));
          }
					if (isHeading("Etymology")){
						parseEtymology(currentElement.contents, word.lastMeaning().etymology);
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