#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var api = require('../').api;

var readmePath = path.join(__dirname, '..', 'README.md');

var readme = fs.readFileSync(readmePath, 'utf8');

var beginMarker = '<!--- begin example -->\n';
var endMarker = '<!--- end example -->\n';


function preprocess(word) {
	function traverse(o,func) {
    for (var i in o) {
      func.apply(this,[i,o[i]]);  
      if (o[i] !== null && typeof(o[i])=="object") {
        //going on step down in the object tree!!
        traverse(o[i],func);
      }
    }
	}

	var w = JSON.parse(JSON.stringify(word));
	traverse(w, function(key, value) {
		var max = 2;
		if (value instanceof Array) {
			this[key] = value.splice(max, value.length - max);
		}
	});
	return w;
}

var wiktAnalyzer = require('../');
var articleName = "test";
wiktAnalyzer.api.fetchArticle(articleName, function(err, article) {
    wiktAnalyzer.analyzer.parseArticle(articleName, article, function(err, parsedArticle) {
        var parsedEnglishWord = preprocess(parsedArticle.en);
        console.log(parsedEnglishWord);
			 	readme = readme.replace(new RegExp(beginMarker+'[\\s\\S]*'+endMarker), 
			 		beginMarker+ 
			 		'\n```javascript\n' +
			 		JSON.stringify(parsedEnglishWord, null, 2)+
			 		'\n```\n'+
			 		endMarker);
			 	fs.writeFileSync(readmePath, readme, 'utf8');
    });
});


