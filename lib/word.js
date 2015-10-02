
function newWordLink(lang, name) {
	return [lang, name];
}

function wordLinkName(wordLink) {
	return wordLink[1];
}

function wordLinkLang(wordLink) {
	return wordLink[0];
}


Role = function Role(roleName) {
	this.role = roleName;
};

Object.defineProperties(Role.prototype, {
	addSynonym: { value: function(wordLink) { 
		if (! this.synonyms) {
			this.synonyms = [];
		}
		this.synonyms.push(wordLink);
	}},
	addHyponym: { value: function(wordLink) { 
		if (! this.hyponyms) {
			this.hyponyms = [];
		}
		this.hyponyms.push(wordLink);
	}},
	addTranslation: { value: function(wordLink) { 
		if (! this.translations) {
			this.translations = [];
		}
		this.translations.push(wordLink);
	}},

});

Etymology = function Etymology() {

};

Object.defineProperties(Etymology.prototype, {
	addFrom: { value: function(wordLink) { 
		if (!this.from) {
			this.from = [];
		}
		this.from.push(wordLink);
	}},
});

WordMeaning = function WordMeaning() {

	this.etymology = new Etymology;

};

Object.defineProperties(WordMeaning.prototype, {
	addRole: { value: function(roleName) { 
		if (! this.roles) {
			this.roles = [];
		}
		this.roles.push(new Role(roleName));
	}},
	lastRole: { value: function() {
		if (! this.roles){ 
			this.roles();
		}
		return this.roles[this.roles.length-1];
	}},


});

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


Object.defineProperties(Word.prototype, {

	lang: {
		get: function() { return wordLinkLang(this.word); },
	},

	name: {
		get: function() { return wordLinkName(this.word); },
	},




	toObject: { value: function() { 
		return this; 
	}},

	addMeaning: { value: function() { 
		if (! this.meanings) {
			this.meanings = [];
		}
		this.meanings.push(new WordMeaning);
	}},

	addPronunciation: { value: function(opts) { 
		if (! this.pronunciations) {
			this.pronunciations = [];
		}
		this.pronunciations.push(new Pronunciation(opts));
	}},

	addRhyme: { value: function(opts) { 
		if (! this.rhymes) {
			this.rhymes = [];
		}
		this.rhymes.push(new Rhyme(opts));
	}},

	addHyphenation: { value: function(opts) { 
		if (! this.hyphenations) {
			this.hyphenations = [];
		}
		this.hyphenations.push(new Hyphenation(opts));
	}},




	lastMeaning: { value: function() {
		if (! this.meanings){ 
			this.addMeaning();
		}
		return this.meanings[this.meanings.length-1];
	}},


});


module.exports = {
	Word:Word,
	newWordLink:newWordLink,
};