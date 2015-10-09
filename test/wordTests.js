var expect = require('chai').expect;
var prettyjson = require('prettyjson');
var Word = require('../').word.Word;
var newWordLink = require('../').word.newWordLink;
var WORDLINK_PLACEHOLDER = require('../').word.WORDLINK_PLACEHOLDER;


describe('Word', function(){
  it('should be created properly', function() {
    var w = new Word('en', 'sample');
    expect(w.lang).to.be.eql('en');
    expect(w.name).to.be.eql('sample');
    expect(w.toObject().word).to.be.eql(['en', 'sample']);
    w.addMeaning();
    expect(w.lastMeaning()).to.be.ok;
    expect(w.lastMeaning()).to.be.equal(w.meanings[0]);
    expect(w.meanings.length).to.be.equal(1);

    expect(w.toObject()).to.be.eql({ word: [ 'en', 'sample' ], meanings: [ {etymology:{}} ] });

    w.lastMeaning().etymology.addFrom(['enm', 'sample']);
    w.meanings[0].etymology.addFrom(['fro', 'essample']);


    expect(w.toObject().meanings[0]).to.be.eql({ etymology: { from: [ ['enm', 'sample'], ['fro', 'essample'] ] } });


    w.meanings[0].addRole('verb');
    w.meanings[0].addRole('noun');

    expect(w.toObject().meanings[0].roles).to.be.eql([ { role: 'verb' }, { role: 'noun' } ]);

  });
  it('should have non implicit last meaning', function() {
    var w = new Word('en', 'sample');
    expect(w.lastMeaning()).to.be.ok;

  });

  it('should have proper explanation', function() {
    var w = new Word('en', 'sample');
    expect(w.toObject().word).to.be.eql(['en', 'sample']);
    w.addMeaning();
    w.lastMeaning().addRole();
    var exp = w.lastMeaning().lastRole().addExplanation({
      context: "science",
      explanation: "That means something like "+WORDLINK_PLACEHOLDER+", and also maybe like"+WORDLINK_PLACEHOLDER+"."
    });
    exp.addMentionedWord(newWordLink('en','experiment'));
    exp.addMentionedWord(newWordLink('en','mad experiment'));

    expect(exp).to.be.ok;

    exp.addUsage({
      usage:"sample usage",
      type:"book"
    });

    var str = exp.mapMentionedWords(function(wordLink) {
      return '<a>'+wordLink[0]+'/'+wordLink[1]+'</a>';
    });

    var arr = exp.toFragmentsAndWordLinks();

    expect(arr).to.be.eql(["That means something like ",newWordLink("en","experiment"),", and also maybe like", newWordLink("en","mad experiment"), "."]);

    expect(str).to.be.ok;
    expect(str).to.be.eql('That means something like <a>en/experiment</a>, and also maybe like<a>en/mad experiment</a>.');



    exp = w.lastMeaning().lastRole().addExplanation({
      context: "science",
      explanation: "That means something like "+WORDLINK_PLACEHOLDER
    });
    exp.addMentionedWord(newWordLink('en','experiment'));

    expect(exp).to.be.ok;



    var str = exp.mapMentionedWords(function(wordLink) {
      return '<a>'+wordLink[0]+'/'+wordLink[1]+'</a>';
    });

    expect(str).to.be.ok;
    expect(str).to.be.eql('That means something like <a>en/experiment</a>');

    exp = w.lastMeaning().lastRole().addExplanation({
      context: "science",
      explanation: "That means something like "
    });

    expect(exp).to.be.ok;
    arr = exp.toFragmentsAndWordLinks();

    expect(arr).to.be.eql(["That means something like "]);

  })

});