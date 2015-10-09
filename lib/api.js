
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
/*

-- https://en.wiktionary.org/w/index.php?title=Module:links&action=edit


-- Creates a basic wikilink to the given term. If the text already contains
-- links, these are replaced with links to the correct section.
local function language_link2(text, alt, lang, id, allowSelfLink)
  local sectFix = false
  local tracking = ""
  
  if text and text:gsub("&#[Xx]?[0-9A-Fa-f]+;", ""):find("#", nil, true) then
    sectFix = true
  end
  
  if ignore_cap[lang:getCode()] and text then
    text = mw.ustring.gsub(text, "%^", "")
  end
  
  -- If the text begins with * and another character,
  -- then act as if each link begins with *
  local allReconstructed = false
  
  if text:find("^*.") then
    allReconstructed = true
  end
  
  -- Do we have embedded wikilinks?
  if text:find("[[", nil, true) then
    if id then
      require("Module:debug").track("language link/bad id")
    end
    
    local function repl(linktext)
      local link = parseLink(linktext)
      
      if allReconstructed then
        link.target = "*" .. link.target
      end
      
      return makeLangLink(link, lang, id, allowSelfLink)
    end
    
    text = mw.ustring.gsub(text, "%[%[([^%]]+)%]%]", repl)
    
    -- Remove the extra * at the beginning if it's immediately followed
    -- by a link whose display begins with * too
    if allReconstructed then
      text = mw.ustring.gsub(text, "^%*%[%[([^|%]]+)|%*", "[[%1|*")
    end
  else
    -- There is no embedded wikilink, make a link using the parameters.
    text = makeLangLink({target = text, display = alt}, lang, id, allowSelfLink)
  end
  
  return text .. (sectFix and "[[Category:Link with section]]" or "") .. tracking
end






-- Make a language-specific link from given link's parts
local function makeLangLink(link, lang, id, allowSelfLink)
  -- If there is no display form, then create a default one
  if not link.display then
    link.display = link.target
    
    -- Strip the prefix from the displayed form
    -- TODO: other interwiki links?
    if link.display:find("^:") then
      link.display = link.display:gsub("^:", "")
    elseif link.display:find("^w:") then
      link.display = link.display:gsub("^w:", "")
    end
  end
  
  -- If the link contains unexpanded template parameters, then don't create a link
  if link.target:find("{{{", nil, true) then
    return link.display
  end
  
  -- Process the target
  if not (link.target:find("^:") or link.target:find("^w:")) then
    -- Remove diacritics from the page name
    link.target = lang:makeEntryName(link.target)
    
    -- Link to appendix for reconstructed terms and terms in appendix-only languages
    if link.target:find("^*.") then
      if lang:getCode() == "und" then
        return link.display
      else
        link.target = "Appendix:" .. lang:getCanonicalName() .. "/" .. mw.ustring.sub(link.target, 2)
      end
    elseif lang:getType() == "reconstructed" then
      error("The specified language " .. lang:getCanonicalName() .. " is unattested, while the given word is not marked with '*' to indicate that it is reconstructed")
    elseif lang:getType() == "appendix-constructed" then
      link.target = "Appendix:" .. lang:getCanonicalName() .. "/" .. link.target
    end
  end
  
  -- If the target is the same as the current page, then return a "self-link" like the software does
  if not allowSelfLink and (link.target == mw.title.getCurrentTitle().prefixedText or link.target == ":" .. mw.title.getCurrentTitle().prefixedText) then
    return "<strong class=\"selflink\">" .. link.display .. "</strong>"
  end
  
  -- Add fragment
  -- Do not add a section link to "Undetermined", as such sections do not exist and are invalid.
  -- TabbedLanguages handles links without a section by linking to the "last visited" section,
  -- but adding "Undetermined" would break that feature.
  if not link.fragment and lang:getCode() ~= "und" and not link.target:find("^w:") then
    if id then
      link.fragment = lang:getCanonicalName() .. "-" .. id
    elseif not link.target:find("^Appendix:") then
      link.fragment = lang:getCanonicalName()
    end
  end
  
  return "[[" .. link.target .. (link.fragment and "#" .. link.fragment or "") .. "|" .. link.display .. "]]"
end

 */

function getArticleName(word, langName) {
  var result = null;
  if (!word.match(/^\:/) || !word.match(/^w\:/)) {
    //TODO: Remove diacritics from the page name
    word = word; //lang:makeEntryName
  }

  if (word.match(/^\*/) && langName!="und")
    result = "Appendix:"+analyzer.canonicalLanguageName(langName)+"/"+word.replace(/^\*/, "");
  else
    result = word;
  return result;
}


function fetchArticleForLanguageHtml(wordName, language, callback) {
  var articleName = getArticleName(wordName, language);
  fetchArticleHtml(articleName, function(err, htmlArticle) {
    if (err) {
      return callback(err);
    }
    var languageSectionName = analyzer.canonicalLanguageName(language);
    var env = require('jsdom').env;

    // first argument can be html string, filename, or url
    env(htmlArticle, function (errors, window) {
      var $ = require('jquery')(window)
        ;

      var reshtml = "";


      $(".mw-editsection").remove();
      $(".noprint").remove();
      $(".interProject").remove();
      $(".thumb").remove();

      var HEADER_PROMOTION_LEVEL = 2;
      $(":header").replaceWith(function() {
        var tagname= $(this).prop("tagName");
        var tagLevel = parseInt(tagname.match(/h([0-9])/i)[1]);
        var newLevel = tagLevel - HEADER_PROMOTION_LEVEL;
        if (newLevel<1) {
          newLevel = 1;
        }
        var newTagname = "h"+newLevel;

        var $res = $('<'+newTagname+'>', {html: $(this).html()});
        $.each(this.attributes, function(i, attribute){
          $res.attr(attribute.name, attribute.value);
        });

        if (tagLevel==2) {
          $res.addClass( "header-language" );
        }
        return $res;


      });
      var firstHeader = $(".header-language").has( "#"+languageSectionName).next();

      firstHeader.nextUntil(".header-language").addBack().each(function() {
        reshtml += $(this)[0].outerHTML; //$(this).clone().wrap('<p>').parent().html();
      });

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
  getArticleName: getArticleName
}