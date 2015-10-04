var expect = require('chai').expect;
var chai = require('chai');
chai.should();
chai.use(require('chai-things'));
var api = require('../').api;


describe('API', function() {
  it('should fetch languages', function (done) {
    api.fetchLanguages(function(err, languages) {
      expect(err).to.not.be.ok;
      expect(languages).to.be.ok;
      expect(languages).to.be.eql(require("../").languages);

      done();
    })
  });
  it('should fetch article', function (done) {
    api.fetchArticle("test", function(err, article) {
      expect(err).to.not.be.ok;

      expect(article).to.be.ok;
      expect(article).to.have.length.above(3000);
      done();
    })

  });

  it('should fetch random article', function (done) {
    api.fetchRandomArticle(function(err, article) {
      expect(err).to.not.be.ok;

      expect(article).to.be.ok;
      expect(article).to.have.length.above(40);
      done();
    })

  });
});