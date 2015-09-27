#!/usr/bin/env node
var request = require('superagent');
var path = require('path');
var fs = require('fs');

request
  .get('https://en.wiktionary.org/w/api.php')
  .query({ action:"expandtemplates",
  				text: "{{#invoke:JSON data|export_languages}}",
  				prop:"wikitext",
  				format:"json" })
  .set('Accept', 'application/json')
  .end(function(err, res){
  	if (err) {console.log(err);return;}
  	var data = JSON.parse(res.body.expandtemplates.wikitext);
  	var outputFilename = path.join(__dirname,"..","lib", "languages.json");
  	fs.writeFile(outputFilename, JSON.stringify(data, null, 2), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved to " + outputFilename);
	    }
		}); 
  });
