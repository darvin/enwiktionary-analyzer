var expect = require('chai').expect;
var chai = require('chai');
chai.should();
chai.use(require('chai-things'));
var api = require('../').api;

var analyzer = require('../').analyzer;
var prettyjson = require('prettyjson');

function parseRandomArticle(callback) {
  api.fetchRandomArticle(function (err, article, articleTitle) {
    expect(err).to.not.be.ok;

    expect(article).to.be.ok;
    //expect(article).to.have.length.above(20);
    console.log("PARSING ARTICLE: '"+articleTitle+"' =================");
    analyzer.parseArticle(articleTitle, article, function (err, result) {
      expect(err).to.not.be.ok;
      expect(result).to.be.ok;

      console.log(prettyjson.render(result));
      console.log("END ARTICLE:   '"+articleTitle+"' ------------------");

      callback(err);

    });
  });
}

function parseArticle(articleTitle, callback) {
  api.fetchArticle(articleTitle, function (err, article) {
    expect(err).to.not.be.ok;

    expect(article).to.be.ok;
    //expect(article).to.have.length.above(20);
    console.log("PARSING ARTICLE: '"+articleTitle+"' =================");
    analyzer.parseArticle(articleTitle, article, function (err, result) {
      expect(err).to.not.be.ok;
      expect(result).to.be.ok;

      console.log(prettyjson.render(result));
      console.log("END ARTICLE:   '"+articleTitle+"' ------------------");

      callback(err);

    });
  });
}

describe('Analyzer (long tests)', function() {
  it('should parse random article', function (done) {
    this.timeout(1000*10);

    parseRandomArticle(done);
  });

  it('should parse tricky articles', function(done) {
    var articles = ['consultant', 'carthoun'];
    var currentIndex = 0;
    var parseArticleAndRepeat = function() {
      parseArticle(articles[currentIndex], function(err) {
        expect(err).to.not.be.ok;
        currentIndex++;
        if (currentIndex>=articles.length) {
          parseArticleAndRepeat();
        } else {
          done();
        }
      });
    }
    parseArticleAndRepeat();

  });

  it('should parse a bunch of random articles', function (done) {
    this.timeout(1000*60*50);
    var repeatUntil = 300;
    var parseRandomArticleAndRepeat = function() {
      parseRandomArticle(function(err) {
        expect(err).to.not.be.ok;
        repeatUntil--;
        if (repeatUntil>0) {
          parseRandomArticleAndRepeat();
        } else {
          done();
        }
      });
    }
    parseRandomArticleAndRepeat();

  });

});