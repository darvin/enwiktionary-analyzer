
var request = require('superagent');

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

function fetchRandomArticle(callback) {
  wikiJSONAPIReq({
    action: "query",
    list: "random",
    rnlimit: 1
  }, function(err, resp) {
    var result = resp.query.random[0].title;
    if (!err&&result)
      wikiRawIndexReq({
        action:"raw",
        title:result
      }, callback);
    else
      callback("not found");
  })
}

module.exports = {
  fetchLanguages: fetchLanguages,
  fetchArticle: fetchArticle,
  fetchRandomArticle: fetchRandomArticle,
}