define([
	"underscore",
	"backbone",
	"./step",
	"./navigation"
], function(
	_,
	Backbone,
	Step,
	Navigation
){
	/** Main survey view.
	*
	* new Survey({texts: <TEXTS JSON>, data: <FORM JSON>, model: <BACKBONE MODEL STORING THE DATA>})
	*/
	return Backbone.View.extend({

		className: "ya-survey",

		initialize: function(opts){
			var data = opts.data;

			this._navModel = new Backbone.Model({
				page: 0,
				pages: opts.data.length
			});

			this.listenTo(this._navModel, "change:page", this._onNavigate);

			this._steps = [];

			_.each(data, function(step){
				this._steps.push(new Step({
					model: this.model,
					config: step,
					texts: opts.texts
				}));
			}, this);

			this._navigation = new Navigation({
				model: this._navModel
			});
		},

		_onNavigate: function(navModel, newPage){
			var prevPage = navModel._previousAttributes.page;

			console.log("Step: nav prev-page=", prevPage, " new-page=", newPage);

			this._steps[prevPage].hide();

			if (!this._steps[newPage].isApplicable()) {
				navModel.set("page", newPage + (newPage > prevPage ? 1 : -1));
				return;
			}

			this._steps[newPage].show();

			if (newPage == navModel.get("pages") - 1) {
				this.trigger("done", {});
			}
		},

		render: function(){
			this.$form = $('<form>');
			this.$steps = $('<div/>').addClass("ya-steps").append(this.$form);

			_.each(this._steps, function(step, idx){
				step.render().$el.appendTo(this.$form);

				if (idx === 0) {
					step.show();
				}
			}, this);

			this.$el
				.append(this.$steps)
				.append(this._navigation.render().$el);

			return this;
		}

	});

});
