define([], function(){

	var texts = {},
		lang = "de";

	return {
		init: function(texts_){
			texts = texts_;
		},

		setLang: function(lang_){
			var availableLangs = _.keys(texts);

			if (!_.contains(availableLangs, lang_)) {
				// default to en
				lang_ = "en";
			}

			lang = lang_;
		},

		get: function(str){
			return str.replace(/\{\{([a-z0-9-]+)\}\}/g, function(_m, placeholder){
				return texts[lang][placeholder];
			});
		}
	};
});
