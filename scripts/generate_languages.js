#!/usr/bin/env node
var api = require('..').api
var path = require('path');
var fs = require('fs');

api.fetchLanguages(function(err, data){
	if (err) {console.log(err);return;}
	var outputFilename = path.join(__dirname,"..","lib", "_generated_language_list.json");
	fs.writeFile(outputFilename, JSON.stringify(data, null, 2), function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("JSON saved to " + outputFilename);
		}
	});
});
