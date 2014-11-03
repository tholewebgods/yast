define([
	"underscore",
	"backbone"
], function(
	_,
	Backbone
){

	/** Renders text.
	*
	*/
	return Backbone.View.extend({

		className: "ya-text",

		initialize: function(opts){
			console.log("Text: init with opts=", opts);

			this._text = opts.config.content;

			this._texts = opts.texts;
		},

		render: function(){
			this.$el.html(
				_.escape(this._texts.get(this._text))
			);

			return this;
		}

	});

});
