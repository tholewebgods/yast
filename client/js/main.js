require.config({
	shim: {
		'underscore': {
			exports: '_'
		}
	},
	paths: {
		"jquery": "../libs/jquery",
		"underscore": "../libs/underscore",
		"backbone": "../libs/backbone"
	}
});

require([
	"jquery",
	"backbone",
	"./texts",
	"views/survey"
], function(
	$,
	Backbone,
	texts,
	Survey
) {

	$(function(){
		var hash = location.hash.replace(/^#/, ""),
			match,
			id, mode,
			$container,
			SurveyModel,
			survey, surveyModel;

		match = /^(standalone|in-overlay),([0-9]+)$/.exec(hash);

		if (!match) {
			$("body").text("Error: bad part after the hash. Expected #<MODE>,<ID>");
			return;
		}

		mode = match[1];
		id = match[2];

		if (id === "") {
			$("body").text("Missing ID: surf to #<ID>");
			return;
		}

		$container = $("#" + mode).show();

		if (mode === "in-overlay") {
			$container = $container.find(".overlay-content");
		}

		SurveyModel = Backbone.Model.extend({
			url: "/send/" + id
		});

		surveyModel = new SurveyModel({})

		$.ajax({url: "/offer/"+ id +"/test", type: "get"})
			.done(function(data){
				texts.init(data.texts);

				texts.setLang(navigator.language.split("-")[0]);

				survey = new Survey({
					model: surveyModel,
					data: data.form,
					texts: texts
				});

				survey.render().$el.appendTo($container);

				survey.on("done", function(){
					surveyModel.save();
				})
			});

	})

});
