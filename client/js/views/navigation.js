define([
	"underscore",
	"backbone"
], function(
	_,
	Backbone
){

	/** Navigator view. Encapuslates prev/next logic. The pagination is communicated through a model
	*
	*/
	return Backbone.View.extend({
		className: "ya-navigation",

		tpl: _.template([
			'<button class="ya-button ya-nav-prev" rel="prev">Prev</button>',
			'<button class="ya-button ya-nav-next" rel="next">Next</button>'
		].join("")),

		events: {
			"click button": "_onNavButtonClick"
		},

		initialize: function(){

		},

		_onNavButtonClick: function(e){
			var navModel = this.model,
				maxPage = navModel.get("pages") - 1,
				page = navModel.get("page"),
				dir = $(e.target).attr("rel");

			// inc/dev page accordingly
			page += (dir === "prev") ? -1 : 1;

			// constrain
			page = Math.max(0, Math.min(page, maxPage));

			navModel.set("page", page);

			this._updateState();
		},

		_updateState: function(){
			var navModel = this.model,
				maxPage = navModel.get("pages") - 1,
				page = navModel.get("page");

			// don't show at first page and don't show at last page either
			this.$el.find(".ya-button").eq(0)[page === 0 || page === maxPage ? "hide" : "show"]();
			this.$el.find(".ya-button").eq(1)[page === maxPage ? "hide" : "show"]();
			this.$el.find(".ya-button").eq(1).attr("disabled", page === maxPage ? "disabled" : null);
		},

		render: function(){
			this.$el.append(this.tpl());

			this._updateState();

			return this;
		}

	});
});
