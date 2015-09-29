var assert = require('chai').assert;
var expect = require('chai').expect;
var wiktParser = require('../');
var prettyjson = require('prettyjson');
var Word = wiktParser.Word;
var WordLink = wiktParser.WordLink;



describe('Word', function(){
  it('should be created properly', function() {
    var w = new Word('en', 'sample');
    expect(w.lang).to.be.eql('en');
    expect(w.name).to.be.eql('sample');
    expect(w.toObject().wordLink).to.be.eql(['en', 'sample']);
    w.addMeaning();
    expect(w.lastMeaning()).to.be.ok;
    expect(w.lastMeaning()).to.be.equal(w.meanings[0]);
    expect(w.meanings.length).to.be.equal(1);

    expect(w.toObject()).to.be.eql({ wordLink: [ 'en', 'sample' ], meanings: [ {etymology:{}} ] });

    w.lastMeaning().etymology.addFrom('enm', 'sample');
    w.meanings[0].etymology.addFrom('fro', 'essample');


    expect(w.toObject().meanings[0]).to.be.eql({ etymology: { from: [ ['enm', 'sample'], ['fro', 'essample'] ] } });


    w.meanings[0].addRole('verb');
    w.meanings[0].addRole('noun');

    expect(w.toObject().meanings[0].roles).to.be.eql([ { role: 'verb' }, { role: 'noun' } ]);

  });
  it('should have non implicit last meaning', function() {
    var w = new Word('en', 'sample');
    expect(w.lastMeaning()).to.be.ok;

  });

});