define([
	"underscore",
	"backbone",
	"./text",
	"./freetext",
	"./multiple-choice",
	"./range"
], function(
	_,
	Backbone,
	Text,
	FreeText,
	MultipleChoice,
	Range
){

	/** Contains other views.
	*
	*/
	var Group = Backbone.View.extend({

		className: "ya-group",

		initialize: function(opts){
			var data = opts.config,
				// map view string to concrete class
				// has to be located in initialize because the reference
				// to Group would be undefined during module definition
				// phase
				viewMap = {
					"text": Text,
					"freetext": FreeText,
					"group": Group,
					"multiplechoice": MultipleChoice,
					"range": Range
				};

			this.views = [];

			_.each(data, function(group){
				var type = group.type,
					klass = viewMap[type],
					view;

				if (!klass) {
					throw new Error("No view class found for type '"+ type +"'");
				}

				this.views.push(new klass({
					model: this.model,
					texts: opts.texts,
					// config for this view
					config: (type === "group" ? group.content : group)
				}));
			}, this);
		},

		render: function(){
			_.each(this.views, function(view){
				this.$el.append(
					view.render().$el
				);
			}, this);

			return this;
		}

	});


	return Group;

});
