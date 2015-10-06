var expect = require('chai').expect;
var chai = require('chai');
chai.should();
chai.use(require('chai-things'));

var analyzer = require('../').analyzer;
var newWordLink = require('../').word.newWordLink;
var path = require('path');
var fs = require('fs');
var prettyjson = require('prettyjson');



var Parsoid = require('parsoid');

describe('wiktionary parser machinery', function(){
  it('should not parse word links with namespace of Wikisaurus:');
  it('should parse word term with non text elements inside', function(done) {
    var element = analyzer.parsoidParse("<nowiki>*</nowiki>tersa", function(err, pdoc) {
      var result = analyzer.toPlainString(pdoc);

      expect(result).to.be.equal("*tersa");
      done(err);
    });
  });

  xit('should parse weird lists of hyponims', function(done) {
    var listOfHyp = "{{hyp3|title=Hyponyms of ''test''|{{l/en|acid test}}|{{l/en|babysitter test}}|{{l/en|blood test}}|{{l/en|duck test}}|{{l/en|flame test}}|{{l/en|inkblot test}}|{{l/en|litmus test}}|{{l/en|multiple-choice test}}|{{l/en|nose test}}|{{l/en|Rorschach test}}|{{l/en|single-choice test}}|{{l/en|smell test}}|{{l/en|smoke test}}|{{l/en|sniff test}}|{{l/en|stress test}}}}";
  })
});


describe('wiktionary parser', function() {



  describe('parses "test"', function () {
  	var r = null;
  	before(function(done) {
      this.timeout(10000);
			var wikitext = fs.readFileSync(path.join(__dirname,"fixtures", "test.wiki"), {encoding:'utf8'});

      analyzer.parseArticle("test", wikitext, function(err, result) {
        console.log(prettyjson.render(result));  
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
    it('should have pronunciation for russian word');
    describe('parsed polish word', function() {
      var w = null;
      before(function() {
        w = r["pl"];
      });
      it('should have 1 meaning', function() {
        expect(w.meanings).to.be.ok;
        expect(w.meanings.length).to.be.equal(1);
        expect(w.meanings[0]).to.have.property('roles');
        expect(w.meanings[0].roles[0].role).to.be.equal('noun');

      });
 
    })
    it('turkish word should should have hyphenation', function() {
      expect(r.tr.hyphenations).to.be.ok;
      expect(r.tr.hyphenations.length).to.be.equal(1);
      expect(r.tr.hyphenations[0].hyphenation).to.be.eql(['test']);
    });
    describe('parsed english word', function() {
    	var w = null;
    	before(function() {
    		w = r["en"];
    	});
      it('should have pronunciation', function() {
        expect(w.pronunciations).to.be.ok;

        expect(w.pronunciations).to.be.eql([ { pronunciation: '/tɛst/' },
  { audioFile: 'en-us-test.ogg', audioDescription: 'Audio (US)' },
  { audioFile: 'En-uk-a test.ogg',
    audioDescription: 'Audio (UK)' },
  { accent: 'South African', pronunciation: '/test/' } ]);
      });
    	it('should have 2 meanings', function() {
        expect(w.meanings).to.be.ok;
        expect(w.meanings.length).to.be.equal(2);
      });
      it('should have anagrams');
    	describe('meaning 1', function() {
        var m = null;
        before(function() {
          m = r["en"].meanings[0];
        });
    		it('should have etymology', function() {
          expect(m).to.have.property("etymology");
          expect(m.etymology).to.eql({ from: 
                 [ [ 'fro', 'test' ],
                   [ 'la', 'testum' ],
                   [ 'la', '*terstus' ],
                   [ 'la', 'terra' ],
                   [ 'la', '*tersa' ] ] });
        });
    		it('should have 2 roles', function() {
          expect(m).to.have.property("roles");
          expect(m.roles).to.be.ok;
          expect(m.roles.length).to.be.equal(2);
        });
        it('should have noun role', function() {
          expect(m.roles[0].role).to.be.equal('noun');
        });
        describe('noun role', function() {
          var role = null;
          before(function() {
            role = m.roles[0];
          });

          it('should have synonyms', function() {
            expect(role).to.have.property('synonyms');
            expect(role.synonyms).to.be.eql([
              [ 'en', 'challenge' ],
              [ 'en', 'trial' ],
              [ 'en', 'quiz' ],
              [ 'en', 'examination' ] ]);
          });
          it('should have hyponyms', function() {
            expect(role).to.have.property('hyponyms');
            role.hyponyms.should.include.something.that.eql(newWordLink('en', 'Rorschach test'));
            role.hyponyms.should.include.something.that.eql(newWordLink('en', 'stress test'));

          });
          it('should have translations', function() {
            expect(role).to.have.property('translations');
            role.translations.should.include.something.that.eql(newWordLink( 'sh', 'тест' ));
            role.translations.should.include.something.that.eql(newWordLink( 'pl', 'sprawdzian' ));
            expect(role.translations).all.be.ok;
          });
          it('should have antonyms', function() {
            expect(role).to.have.property('antonyms');
            expect(role.antonyms).to.be.eql([ newWordLink('en', 'breeze'), newWordLink('en', 'recess') ]);
          });
          it('should have derived terms', function() {
            expect(role).to.have.property('derivedTerms');
            expect(role.derivedTerms).to.be.eql([ newWordLink('en', 'tester') ]);
          });
          it('should have descendants', function() {
            expect(role).to.have.property('descendants');
            expect(role.descendants).to.be.eql([ newWordLink('de', 'Test'), newWordLink('de', 'test') ]);
          });
          it('should have related terms', function() {
            expect(role).to.have.property('relatedTerms');
            expect(role.relatedTerms).to.be.eql([
              newWordLink('en', 'test case'),
              newWordLink('en', 'test drive'),
              newWordLink('en', 'test flight'),
              newWordLink('en', 'test run'),
              newWordLink('en', 'test tube'),
            ]);
          });

        });
        it('should have verb role');
    	});
    	describe('meaning 2', function() {
        var m = null;
        before(function() {
          m = r["en"].meanings[1];
        });

        it('should have etymology', function() {
          expect(m).to.have.property("etymology");
          expect(m.etymology).to.eql({ from: 
                 [ [ 'fro', 'tester' ],
                   [ 'la', 'testari' ],
                   [ 'la', 'testis' ]] });
        });
        it('should have 2 roles', function() {
          expect(m).to.have.property("roles");
          expect(m.roles).to.be.ok;
          expect(m.roles.length).to.be.equal(2);
        });
        it('should have noun role');



    		it('should have verb role');
    	});



    })
  });


  it('parses without etymology', function(done) {
    analyzer.parseArticle("test","==Polish==\n===Noun===\n{{pl-noun|m-in}}\n\n# {{l|en|test}}", function(err, result) {
      console.log(prettyjson.render(result));  
      expect(result).to.have.property('pl');
      expect(result.pl).to.have.property('meanings');
      expect(result.pl.meanings[0]).to.have.property('roles');
      expect(result.pl.meanings[0].roles[0].role).to.be.equal('noun');
      done(err);
    });
  });

  describe('parses "consultant"', function () {
    var r = null;
    before(function (done) {
      var wikitext = fs.readFileSync(path.join(__dirname, "fixtures", "consultant.wiki"), {encoding: 'utf8'});

      analyzer.parseArticle("consultant", wikitext, function (err, result) {
        console.log(prettyjson.render(result));
        r = result;
        done(err);
      });
    });

    it('should parse wiki', function () {
      expect(r).to.be.ok;
    });
  });

  describe('parses "sample"', function () {
  	var r = null;
  	before(function(done) {
			var wikitext = fs.readFileSync(path.join(__dirname,"fixtures", "sample.wiki"), {encoding:'utf8'});

      analyzer.parseArticle("sample", wikitext, function(err, result) {
        console.log(prettyjson.render(result));  
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
      it('should have pronunciations', function() {
        expect(w.pronunciations).to.be.ok;
        expect(w.pronunciations).to.be.eql([
          { "accent": "RP", "pronunciation": "/ˈsɑːm.pəl/"},
          { "accent": "US", "pronunciation": "/ˈsæm.pəl/"},]);
      });
      it('should have rhymes', function() {
        expect(w.rhymes).to.be.ok;
        expect(w.rhymes).to.be.eql([
          { "rhyme": "æmpəl"},
          { "rhyme": "ɑːmpəl"},]);
      });
      it('should have anagrams');

    	it('should have 1 meaning', function() {
        expect(w.meanings).to.be.ok;
        expect(w.meanings.length).to.be.equal(1);
      });
    	describe('meaning 1', function() {
        var m = null;
        before(function() {
          m = w.meanings[0];
        });
        it('should have proper etymology', function() {
          expect(m.etymology).to.be.ok;
          expect(m.etymology).to.have.property('from');
          expect(m.etymology.from).to.eql([ 
                [ 'enm', 'sample' ],
                [ 'enm', 'asaumple' ],
                [ 'fro', 'essample' ],
                [ 'la', 'exemplum' ] ]);
        }); 

    		it('should have noun role', function() {
          expect(m).to.be.ok;
          var role = m.roles[0];
          expect(role).to.be.ok;
          expect(role.role).to.be.equal("noun");
        });
        describe('noun role', function() {
          var role = null;
          before(function() {
            role = m.roles[0];
          });

          it('should have synonyms', function() {
            expect(role).to.have.property('synonyms');
            expect(role.synonyms).to.be.eql([ [ 'en', 'specimen' ], [ 'en', 'example' ] ]);
          });
          it('should have hyponyms', function() {
            expect(role).to.have.property('hyponyms');
            expect(role.hyponyms).to.be.eql([ [ 'en', 'product sample' ] ]);
          });
          it('should have translations', function() {
            expect(role).to.have.property('translations');
            role.translations.should.include.something.that.eql(['pl','próba']);
            role.translations.should.include.something.that.eql(['be','узо́р']);
            expect(role.translations).all.be.ok;

          });
        });
      });
    });
  });
});
