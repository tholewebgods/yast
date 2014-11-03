define([
	"underscore",
	"backbone",
	"./group",
	"../evaluator",
], function(
	_,
	Backbone,
	Group,
	Evaluator
){
	/** Contains other views like Group. Checks "depends"
	*
	*/
	return Group.extend({

		className: "ya-step",

		initialize: function(opts){

			// handle a step like a group by overriding the type
			Group.prototype.initialize.call(this, {
				model: opts.model,
				texts: opts.texts,

				config: opts.config.content
			});

			// template option "depends"
			// contains an expression to compare a previously stored
			// answer (by id) against a value
			this._depends = opts.config.depends;
		},

		isApplicable: function(){
			if (!this._depends) {
				// no depends expression defined, default to "yes, it's applicable"
				return true;
			}

			// pass the survey model and the expression
			return Evaluator.evaluate(this.model.toJSON(), this._depends);
		},

		show: function(){
			this.$el.addClass("ya-active");
		},

		hide: function(){
			this.$el.removeClass("ya-active");
		},


		render: function(){
			return Group.prototype.render.apply(this, arguments);
		}

	});
});
