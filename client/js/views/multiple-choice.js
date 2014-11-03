define([
	"backbone"
], function(
	Backbone
){

	/** Renders a multiple choice view, depending on the config (exclusive) radio or checkboxes. An item might have a free-text field.
	*
	*/
	return Backbone.View.extend({

		className: "ya-multiple-choice",

		events: {
			'change input': "_onChange",
			'click button': "_onButtonClick"
		},

		configs: ["id", "choices", "exclusive", "layout"],

		initialize: function(opts){
			console.log("Multiple-Choice: init with opts=", opts);

			this._texts = opts.texts;

			// add view config attributes to this prefixed with underscore
			// opts.config.x --> this._x
			_.each(_.pick(opts.config, this.configs), function(option, key){
				this["_" + key] = option;
			}, this);
		},

		_onChange: function(e){
			var $input = $(e.target);

			console.log("MC: change: ", $input.attr("name"), $input.val());
			this.model.set($input.attr("name"), $input.val());
		},

		_onButtonClick: function(e){
			var $el = $(e.target).closest("button");
			e.preventDefault();

			if (this._exclusive) {
				$el.parents(".ya-multiple-choice").find("button").removeClass("ya-checked");
				$el.addClass("ya-checked");
			} else {
				$el.parents(".ya-multiple-choice").find("button").toggleClass("ya-checked");
			}

			$el.siblings().filter("input").focus();

			console.log("MC: change: ", $el.attr("name"), $el.val());
			this.model.set($el.attr("name"), $el.val());
		},

		// &#xF10C;&#xF058;

		_renderOne: function(cfg, texts){
			var $el = $('<div />').addClass(this._layout === "column" ? "ya-column" : "ya-row"),
				$btn = $('<button class="ya-button" name="'+ this._id +'" value="'+ cfg.id +'"><span class="ya-icon"></span><span class="ya-label">'+ texts.get(cfg.text) +'</span></button>');

			$btn.appendTo($el);

			if (cfg["free-text"]) {
				$el.append($('<input type="text" name="'+ this._id + "-freetext" +'"/>'));
			}

			return $el;
		},

		render: function(){
			_.each(this._choices, function(choice){
				this.$el.append(this._renderOne(choice, this._texts));
			}, this);

			return this;
		}

	});

});
