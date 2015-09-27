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

module.exports.parse = function(wikitext, callback) {
	Parsoid.parse(wikitext, {
			pdoc: true,
			wt2html: false,
			config: ls
		}).then(function(pdoc) {
			var result = {};


			var headings = pdoc.filterHeadings();
			headings.forEach(function(heading) {
				if (heading.level==2) {
					var language = languageAnyNameToName(heading.title.toString());
					console.log("found language ", language);
					result[language] = {}
				}

			});
			callback(null, result);
		}).done();;
}