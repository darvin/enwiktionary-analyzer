var Parsoid = require('parsoid');

var languages = require("./lib/languages");

var Word = require("./lib/word").Word;

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

var langNamesByAnyName = null;
function languageAnyNameToName(anyName){
	if (!langNamesByAnyName) {
		langNamesByAnyName = {};
		for (languageName in languages) {
			langNamesByAnyName[languages[languageName].canonicalName] = languageName;
		}
	}
	return langNamesByAnyName[anyName];
}


var roles = {
	"Noun":"noun",
	"Verb":"verb",
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

function parseTerm(template) {
	if (template.name=="term") {
		return [toPlainString(template.get("lang").value), 
						toPlainString(template.params[0].value)];

	} 
	if (template.name=="m") {
		return [toPlainString(template.params[0].value), 
						toPlainString(template.params[1].value)];
	}
}

function parseEtymology(pdoc, etymology) {
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
				
				var term = parseTerm(e);
				etymology.addFrom(term[0],term[1]);
				// console.log("							term: ", result);

			}
		}
	}

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
						var lang = languageAnyNameToName(headingString);
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
					if (currentHeading&&currentHeading.match(/Etymology.*/)){

						
						parseEtymology(currentElement.contents, word.lastMeaning().etymology);
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

	Word: Word,
}