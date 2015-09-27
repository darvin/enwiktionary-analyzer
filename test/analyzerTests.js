
var assert = require('chai').assert;
var expect = require('chai').expect;
var wiktParser = require('../');
var path = require('path');
var fs = require('fs');


describe('wiktionary parser', function() {

  describe('parses "test"', function () {
  	var r = null;
  	before(function(done) {
      this.timeout(10000);
			var wikitext = fs.readFileSync(path.join(__dirname,"fixtures", "test.wiki"), {encoding:'utf8'});

      wiktParser.parse(wikitext, function(err, result) {
        r = result;
        done(err);
      });	  
    });

    it('should parse wiki', function () {
      expect(r).to.be.ok;
    });
    it('should have multiple languages', function() {
      expect(r).to.have.property("en");
      expect(r).to.have.property("br");
      expect(r).to.have.property("fro");
      expect(r).to.have.property("lld");
    });
    describe('parsed english word', function() {
    	var w = null;
    	before(function() {
    		w = r["en"];
    	});
    	it('should have 2 meanings', function() {
        expect(w.meanings).to.be.ok;
        expect(w.meanings.length).to.be.equal(2);
      });
    	describe('meaning 1', function() {
    		it('should have etymology');
    		it('should have noun role');
    		it('should have verb role');
    	});
    	describe('meaning 2', function() {
    		it('should have etymology');
    		it('should have noun role');
    		it('should have verb role');
    	});



    })
  });

  describe('parses "sample"', function () {
  	var r = null;
  	before(function(done) {
			var wikitext = fs.readFileSync(path.join(__dirname,"fixtures", "sample.wiki"), {encoding:'utf8'});

      wiktParser.parse(wikitext, function(err, result) {
        r = result;
        done(err);
      });   
    });

    it('should parse wiki', function () {
      expect(r).to.be.ok;
    });
    describe('parsed english word', function() {
    	var w = null;
    	before(function() {
    		w = r["en"];
    	});
    	it('should have 1 meaning', function() {
        expect(w.meanings).to.be.ok;
        expect(w.meanings.length).to.be.equal(1);
      });
    	describe('meaning 1', function() {
    		it('should have noun role');
    	});
    

    })
  });
});
