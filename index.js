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



//  templates to process:

// {{sense|an oath or affirmation}} 

// {{l|cs|háček}} - link
// {{m|la|*tersa||dry land}} - mention
// {{term|test|lang=fro||an earthen vessel}}

// {{t|ast|prueba|f}} - translation
// {{t+|sw|jaribio}}


module.exports.parse = function(wikitext, callback) {
	Parsoid.parse(wikitext, {
			pdoc: true,
			wt2html: false,
			config: ls
		}).then(function(pdoc) {
			var result = {};


			var headings = pdoc.filterHeadings();
			var currentLanguage = null;
			var currentLanguageContents = null;
			var currentMeaningContents = null;
			headings.forEach(function(heading) {
				var headingString = heading.title.toString();
				if (heading.level==2) {
					currentLanguage = languageAnyNameToName(headingString);
					console.log("found language ", currentLanguage);
					currentLanguageContents = {
						meanings: [],
					};
					result[currentLanguage] = currentLanguageContents;
				}

				if (heading.level==3 && headingString.match(/Etymology.*/)) {
					console.log("  found meaning ", headingString);
					currentMeaningContents = {
						etymology:{},
						roles:[],
					};
					currentLanguageContents.meanings.push(currentMeaningContents);
				}

				if ((heading.level==3||heading.level==4)&&isRole(headingString)) {
					console.log("    found role ", headingString);

					currentMeaningContents.roles.push({
						role:normalizeRole(headingString)
					})
				}

			});

			console.log(result);
			callback(null, result);
		}).done();
}