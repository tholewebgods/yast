define([
	"backbone"
], function(
	Backbone
){

	/** Renders a range view, radioboxes in configurable steps. The lower and upper text is configurable.
	*
	*/
	return Backbone.View.extend({

		className: "ya-range",

		events: {
			"change input": "_onChange"
		},

		configs: ["id", "steps", "lower", "upper"],

		initialize: function(opts){
			console.log("Range: init with opts=", opts);

			this._texts = opts.texts;

			// add view config attributes to this prefixed with underscore
			_.each(_.pick(opts.config, this.configs), function(option, key){
				this["_" + key] = option;
			}, this);
		},

		_onChange: function(e){
			var $input = $(e.target);

			console.log("Range: change: ", $input.attr("name"), $input.val());
			this.model.set($input.attr("name"), $input.val());
		},

		render: function(){
			var $checkboxes = $("<span>").addClass("ya-range-boxes"),
				$input;

			_.times(this._steps, function(value){
				$input = $('<input type="radio" />')
					.attr("value", value)
					.attr("name", this._id);

				$checkboxes.append($input);
			}, this);


			this.$el
				.append('<span class="ya-range-lower">' + this._texts.get(this._lower) + '</span>')
				.append('<span class="ya-sep" />')
				.append($checkboxes)
				.append('<span class="ya-sep" />')
				.append('<span class="ya-range-upper">' + this._texts.get(this._upper) + '</span>');

			return this;
		}

	});

});
