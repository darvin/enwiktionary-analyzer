var Parsoid = require('parsoid');
var languages = require("./lib/languages");

var ls = {
	setup: function(pc) {
		pc.debug = true;
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

module.exports.parse = function(wikitext, callback) {
	Parsoid.parse(wikitext, {
			pdoc: true,
			wt2html: false,
			config: ls
		}).then(function(pdoc) {
		console.log("DONE!");
			String(pdoc).should.equal(text);
			var templates = pdoc.filterTemplates();
			templates.length.should.equal(1);
			String(templates[0]).should.equal('{{foo|bar|baz|eggs=spam}}');
			var template = templates[0];
			template.name.should.equal('foo');
			template.name = 'notfoo';
			String(template).should.equal('{{notfoo|bar|baz|eggs=spam}}');
			template.params.length.should.equal(3);
			template.params[0].name.should.equal('1');
			template.params[1].name.should.equal('2');
			template.params[2].name.should.equal('eggs');
			String(template.get(1).value).should.equal('bar');
			String(template.get('eggs').value).should.equal('spam');
		}).done();;
}