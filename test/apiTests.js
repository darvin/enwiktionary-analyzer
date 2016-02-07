var expect = require('chai').expect;
var chai = require('chai');
chai.should();
chai.use(require('chai-things'));
var api = require('../').api;


describe('API', function() {
  this.timeout(16000);
  it('should fetch languages', function (done) {
    api.fetchLanguages(function(err, languages) {
      expect(err).to.not.be.ok;
      expect(languages).to.be.ok;
      expect(Object.keys(languages)).to.be.eql(Object.keys(require("../lib/_generated_language_list.json")));

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
  it('should fetch rendered article', function (done) {
    api.fetchArticleHtml("test", function(err, article) {
      expect(err).to.not.be.ok;

      expect(article).to.be.ok;
      expect(article).to.have.length.above(3000);
      done();
    })

  });

  it('should fetch rendered article with specified language', function (done) {
    api.fetchArticleForLanguageHtml("test", "en", function(err, article) {
      expect(err).to.not.be.ok;
      expect(article).to.be.ok;
      expect(article).to.have.length.above(3000);
      done();
    })
  });
  it('should fetch rendered article with specified proto language', function (done) {
    api.fetchArticleForLanguageHtml("*ǵʰew-", "ine-pro", function(err, article) {
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