define([
	"underscore",
	"backbone"
], function(
	_,
	Backbone
){

	/** Renders a textarea.
	*
	*/
	return Backbone.View.extend({

		className: "ya-freetext",

		events: {
			"blur textarea": "_onChange"
		},

		initialize: function(opts){
			this._id = opts.config.id,

			console.log("Freetext: init with opts=", opts);
		},

		_onChange: function(e){
			var $input = $(e.target);

			console.log("Freetext: change: ", $input.attr("name"), $input.val());
			this.model.set($input.attr("name"), $input.val());
		},

		render: function(){
			this.$el
				.append(
					$('<textarea class="ya-textarea"></textarea>')
					.attr("name", this._id)
				);

			return this;
		}

	});
});
