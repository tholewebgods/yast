
var Express = require("express"),
	Connect = require("connect"),
	BodyParser = require('body-parser'),
	ServeStatic = require('serve-static'),
	fs = require("fs")
	_ = require("underscore"),

	app = Express();


app.param(function(name, fn){
  if (fn instanceof RegExp) {
	return function(req, res, next, val){
	  var captures;
	  if (captures = fn.exec(String(val))) {
		req.params[name] = captures;
		next();
	  } else {
		next('route');
	  }
	}
  }
});

app.param('id', /^[0-9a-z]+$/);
app.param('timestamp', /^[0-9a-z]+$/);
app.param('name', /^\w+$/);


// order matters here, first configure CORS,
// then inject the JSON parser

app.all('*', function(req, res, next) {
	res.header(
		"Access-Control-Allow-Origin",
		"*"
	);

	res.header(
		"Access-Control-Allow-Headers",
		"Content-Type, X-Requested-With"
	);

	next();
});

app.use(BodyParser.json());
app.use(ServeStatic(
	'client/',
	{'index': ['index.html']}
));

app.get("/offer/:id/:name", function(req, res){
	var params = req.params, id,
		answer, form, texts,
		path;

	id = params.id[0];

	if (!/^[0-9]+$/.test(id)) {
		console.log('Malformed "id": ', id);

		res.status(400)
			.send('Malformed "id" parameter. Expecting ^[0-9]+$');
		return;
	}

	path = "data/"+ id;

	if (!fs.existsSync(path)) {
		console.log('ID not found:', id);

		res.status(404)
			.send('ID ' + id + ' not found.');
		return;
	}

	form = JSON.parse(fs.readFileSync(path + "/form.json", "UTF-8"));
	texts = JSON.parse(fs.readFileSync(path +"/texts.json", "UTF-8"));

	answer = {
		form: form,
		texts: texts
	};

	console.log("Start new survey/feedback: ", "id=", id, "name=", params.name[0]);

	res.status(200)
		.contentType("application/json")
		.send(answer);
});

app.post("/send/:id", function(req, res){
	var params = req.params,
		id,
		path,
		data;

	id = params.id[0];

	if (req.headers["content-type"] !== "application/json") {
		console.log('Unexpected Content-Type: ', req.headers["content-type"]);

		res.status(400)
			.send('Unexpected Content-Type: expecting application/json');
		return;
	}

	if (!/^[0-9]+$/.test(id)) {
		console.log('Malformed "id": ', id);

		res.status(400)
			.send('Malformed "id" parameter. Expecting ^[0-9]+$');
		return;
	}

	path = "received/"+ id;

	if (!fs.existsSync(path)) {
		console.log('ID not found:', id);

		res.status(404)
			.send('ID ' + id + ' not found.');
		return;
	}

	console.log("Received survey/feedback: ", id);
	console.log("Data: ", req.body);

	data = JSON.stringify(req.body);

	fs.writeFileSync(path + "/" + new Date().getTime(), data);

	res.status(200)
		.contentType("application/json")
		.send(JSON.stringify({status: "OK"}));
});


app.get("/results/:id/", function(req, res){
	var params = req.params, id,
		answer, form, texts,
		path,
		files, results = [],
		keys = [],
		data = {};

	id = params.id[0];

	if (!/^[0-9]+$/.test(id)) {
		console.log('Malformed "id": ', id);

		res.status(400)
			.send('Malformed "id" parameter. Expecting ^[0-9]+$');
		return;
	}

	path = "received/"+ id;

	if (!fs.existsSync(path)) {
		console.log('ID not found:', id);

		res.status(404)
			.send('ID ' + id + ' not found.');
		return;
	}

	console.log("Return survey results for ID ", id);

	files = fs.readdirSync(path);

	files.forEach(function(file){
		results.push(JSON.parse(fs.readFileSync(path + "/" + file)));
	});


	// get all keys found in all results
	_.each(results, function(result){
		keys = _._.union(keys, _.keys(result));
	});

	// initalize value arrays for each key
	_.each(keys, function(key){
		data[key] = [];
	});


	// iterate each result and each key
	// (iterating an array)
	_.each(results, function(result){
		// (iteraing an object)
		_.each(result, function(resultValue, resultKey){
			if (/^[0-9]+$/.test(resultValue)) {
				resultValue = Number(resultValue);
			}

			if (resultValue === "") {
				resultValue = "<empty>";
			}

			if (data[resultKey]) {
				data[resultKey].push(resultValue);
			}
		});
	});

	// data is now mapping a key to an array of values

	results = data;

	// iterating each key with its values
	_.each(results, function(values, key){
			// get unique values
		var unionValues = _.union(values),
			// sum votes for this key
			overallVotes;

		// create an object maping a value to zero, initially
		// this creates a value --> number-of-votes map
		unionValues = _.reduce(unionValues, function(memo, value){
			memo[value] = 0;
			return memo;
		}, {});

		// for each value increment the value (occurence)
		_.each(values, function(value){
			unionValues[value]++;
		});

		overallVotes = values.length;

		// to percent
		_.each(unionValues, function(votes, value){
			unionValues[value] = Math.round(votes * 100 / overallVotes);
		});

		data[key] = unionValues;
	});


	res.status(200)
		.contentType("application/json")
		.send(JSON.stringify(data));

});


app.listen(7072);

