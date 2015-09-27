#!/usr/bin/env node
var fs = require('fs');
var path = require('path');


var Parser = require("jison").Parser;
var grammar = fs.readFileSync(path.join(__dirname, "..", "lib", "parser_grammar.jison"), "utf8");
parser = new Parser(grammar);
var parserSource = parser.generate();
fs.writeFileSync(path.join(__dirname, "..", "lib", "_generated_parser.js"), parserSource, "utf8")


var JisonLex = require('jison-lex');
var lexerGrammar = fs.readFileSync(path.join(__dirname, "..", "lib", "lexer_grammar.jisonlex"), "utf8");
lexer = new JisonLex(lexerGrammar);
var lexerSource = lexer.generateCommonJSModule();
var lexerGeneratedPath = path.join(__dirname, "..", "lib", "_generated_lexer.js");
fs.writeFileSync(lexerGeneratedPath, lexerSource, "utf8")
