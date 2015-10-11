#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var api = require('../').api;

var readmePath = path.join(__dirname, '..', 'README.md');

var readme = fs.readFileSync(readmePath, 'utf8');

var beginMarker = '<!--- begin example -->\n';
var endMarker = '<!--- end example -->\n';


var wiktAnalyzer = require('../');
var articleName = "test";
wiktAnalyzer.api.fetchArticle(articleName, function(err, article) {
    wiktAnalyzer.analyzer.parseArticle(articleName, article, function(err, parsedArticle) {
        var parsedEnglishWord = parsedArticle.en;
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


