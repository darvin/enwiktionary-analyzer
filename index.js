var Parsoid = require('parsoid');

var languages = require("./lib/languages");

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

function parseEtymology(pdoc) {
	var result = {};
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
				if (! result.from) {
					result.from = [];
				}
				var term = parseTerm(e);
				result.from.push(term);
				// console.log("							term: ", result);

			}
		}
	}
	// console.log("Etymology: ", result);
	return result;

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

function parse(wikitext, callback) {
	parsoidParse(wikitext, function(err, pdoc) {
			var result = {};


			var currentLanguage = null;
			var currentLanguageContents = null;
			var currentMeaningContents = null;
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
						currentLanguage = languageAnyNameToName(headingString);
						// console.log("found language ", currentLanguage);
						currentLanguageContents = {
							meanings: [],
						};
						result[currentLanguage] = currentLanguageContents;
					}

					if (heading.level==3 && headingString.match(/Etymology.*/)) {
						// console.log("  found meaning ", headingString);
						// console.log(heading.pnodes);
						currentMeaningContents = {
							etymology:{},
							roles:[],
						};
						currentLanguageContents.meanings.push(currentMeaningContents);
					}

					if ((heading.level==3||heading.level==4)&&isRole(headingString)) {
						// console.log("    found role ", headingString);

						currentMeaningContents.roles.push({
							role:normalizeRole(headingString)
						})
					}
				} else if (currentElement instanceof Parsoid.PTag) {
					if (currentHeading&&currentHeading.match(/Etymology.*/)){

						
						currentMeaningContents.etymology = parseEtymology(currentElement.contents);
					}

				} 
				

			}
			// console.log(result);
			callback(null, result);
		});
}



module.exports = {
	parse: parse,
	parsoidParse: parsoidParse,
	toPlainString: toPlainString,
	parseEtymology: parseEtymology
}