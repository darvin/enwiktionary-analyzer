
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

});

Etymology = function Etymology() {

};

Object.defineProperties(Etymology.prototype, {
	addFrom: { value: function(lang, name) { 
		if (!this.from) {
			this.from = [];
		}
		this.from.push([lang,name]);
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

});


Word = function Word(lang, name) {
	this.wordLink = newWordLink(lang,name);
};

Object.defineProperties(Word.prototype, {

	lang: {
		get: function() { return wordLinkLang(this.wordLink); },
	},

	name: {
		get: function() { return wordLinkName(this.wordLink); },
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

	lastMeaning: { value: function() { 
		if (this.meanings)
			return this.meanings[this.meanings.length-1];
	}},


});


module.exports = {
	Word:Word
}