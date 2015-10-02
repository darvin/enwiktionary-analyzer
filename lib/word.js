var pluralize = require('pluralize');
var capitalize = require('capitalize');

function newWordLink(lang, name) {
	return [lang, name];
}

function wordLinkName(wordLink) {
	return wordLink[1];
}

function wordLinkLang(wordLink) {
	return wordLink[0];
}

function _DefineOneToManyPropertyOnPrototype(obj, propertySingularName, storedObj, propertyPluralName) {
  if (!propertySingularName||!obj||!storedObj) {
    throw "bad usage";
  }


  var prop = propertyPluralName || pluralize(propertySingularName);
  var capSingularName = capitalize(propertySingularName);

  var addFuncName = "add"+capSingularName;
  var lastFuncName = "last"+capSingularName;

  Object.defineProperty(obj.prototype, addFuncName, {
    value: function(opts) {
      if (! this[prop]) {
        this[prop] = [];
      }
      var newObj = storedObj==Object ? opts : new storedObj(opts);
      this[prop].push(newObj);
    }
  });
  Object.defineProperty(obj.prototype, lastFuncName, {
    value: function() {
      if (! this[prop]) {
        this[addFuncName]();
      }
      return this[prop][this[prop].length-1];
    }
  });


}

Role = function Role(roleName) {
	this.role = roleName;
};


_DefineOneToManyPropertyOnPrototype(Role, "synonym", Object);
_DefineOneToManyPropertyOnPrototype(Role, "hyponym", Object);
_DefineOneToManyPropertyOnPrototype(Role, "translation", Object);


Etymology = function Etymology() {

};

_DefineOneToManyPropertyOnPrototype(Etymology, "from", Object, "from");


WordMeaning = function WordMeaning() {

	this.etymology = new Etymology;

};

_DefineOneToManyPropertyOnPrototype(WordMeaning, "role", Role);


Pronunciation = function Pronunciation(opts) {
	if (opts.accent)
		this.accent = opts.accent;
	if (opts.audioFile)
		this.audioFile = opts.audioFile;
	if (opts.audioDescription)
		this.audioDescription = opts.audioDescription;
	if (opts.pronunciation)
		this.pronunciation = opts.pronunciation;
};

Hyphenation = function Hyphenation(opts) {
	if (opts.hyphenation)
		this.hyphenation = opts.hyphenation;
};

Rhyme = function Rhyme(opts) {
	if (opts.rhyme)
		this.rhyme = opts.rhyme;
};



Word = function Word(lang, name) {
	this.word = newWordLink(lang,name);
};

_DefineOneToManyPropertyOnPrototype(Word, "rhyme", Rhyme);
_DefineOneToManyPropertyOnPrototype(Word, "pronunciation", Pronunciation);
_DefineOneToManyPropertyOnPrototype(Word, "hyphenation", Hyphenation);
_DefineOneToManyPropertyOnPrototype(Word, "meaning", WordMeaning);

Object.defineProperties(Word.prototype, {

	lang: {
		get: function() { return wordLinkLang(this.word); },
	},

	name: {
		get: function() { return wordLinkName(this.word); },
	},




	toObject: { value: function() { 
		return this; 
	}}


});


module.exports = {
	Word:Word,
	newWordLink:newWordLink,
};