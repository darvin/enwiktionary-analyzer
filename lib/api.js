
var request = require('superagent');
var analyzer = require('./analyzer');

function wikiJSONAPIReq(queryOpts, callback) {
  queryOpts.format = "json";
  request
    .get('https://en.wiktionary.org/w/api.php')
    .query(queryOpts)
    .set('Accept', 'application/json')
    .end(function(err, res){
      if (err) {console.log(err);}
      callback(err, res.body);
    });
}

function wikiRawIndexReq(queryOpts, callback) {
  request
    .get('https://en.wiktionary.org/w/index.php')
    .query(queryOpts)
    .end(function(err, res){
      if (err) {console.log(err);}
      callback(err, res.text);
    });
}



function fetchLanguages(callback) {
  wikiJSONAPIReq({ action:"expandtemplates",
    text: "{{#invoke:JSON data|export_languages}}",
    prop:"wikitext",
    }, function(err, body){
      callback(err, JSON.parse(body.expandtemplates.wikitext));
  });
}

function fetchArticle(articleName, callback) {
  wikiRawIndexReq({
    action:"raw",
    title:articleName,
  }, callback);
}

function fetchArticleHtml(articleName, callback) {
  wikiRawIndexReq({
    title:articleName
  }, callback);
}

function fetchArticleForLanguageHtml(articleName, language, callback) {
  fetchArticleHtml(articleName, function(err, htmlArticle) {
    if (err) {
      return callback(err);
    }
    var languageSectionName = analyzer.canonicalLanguageName(language);
    var env = require('jsdom').env;

    // first argument can be html string, filename, or url
    env(htmlArticle, function (errors, window) {
      console.log(errors);

      var $ = require('jquery')(window)
        ;

      var reshtml = "";

      var firstHeader = $("h2").has( "#"+languageSectionName).next();

      $(".mw-editsection").remove();
      $( "h2" ).addClass( "header-language" );
      $(":header").each(function() {
        var tagname= $(this).prop("tagName");
        ;
      });

      firstHeader.nextUntil(".header-language").addBack().each(function() {
        reshtml += $(this)[0].outerHTML; //$(this).clone().wrap('<p>').parent().html();
      });
      console.log(reshtml);

      callback(null, reshtml);

    });


  })
}

function fetchRandomArticle(callback) {
  wikiJSONAPIReq({
    action: "query",
    list: "random",
    rnlimit: 1,
    rnnamespace: 0
  }, function(err, resp) {
    var result = resp.query.random[0].title;
    if (!err&&result)
      wikiRawIndexReq({
        action:"raw",
        title:result
      }, function(err, articletext) {
        callback(err, articletext, result);
      });
    else
      callback("not found");
  })
}

module.exports = {
  fetchLanguages: fetchLanguages,
  fetchArticle: fetchArticle,
  fetchArticleHtml: fetchArticleHtml,
  fetchArticleForLanguageHtml: fetchArticleForLanguageHtml,
  fetchRandomArticle: fetchRandomArticle,
}