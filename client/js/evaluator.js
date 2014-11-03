define([

], function(

){

	// split string into token objects returned as an array
	function tokenize(str){
			// whether we're within a started quotation
		var quoted,
			// string split by space characters
			split = [],
			// parsed tokens as objects describing them
			tokens;

		// make space around parens for easier parsing
		str = str.replace(/\(/g, " ( ").replace(/\)g/, " ) ");

		// split at spaces and iterate the raw tokens
		// since quoted literals might contain spaces which are split
		// too, we've to append intermediate elements to the last item
		str.split(/\s+/).forEach(function(e){
			if (!quoted && /^'/.test(e) && e !== "''") {
				quoted = true;
				split.push(e);
				return;
			}

			if (!quoted) {
				split.push(e);
			} else {
				split.push(split.pop() + " " + e);
			}

			if (quoted && /'$/.test(e)) {
				quoted = false;
			}
		});

		// create token objects {type, content}
		tokens = split.map(function(e){
			var type;

			if (/(\(|\))/.test(e)) {
				type = "parens";
			} else if (/(!=|==|>=|>|<|<=|xor|and|or)/.test(e)) {
				type = "operator";
			} else if (/(^'[^']*'$|^[0-9])/.test(e)) {
				type = "literal";
				e = e.replace(/^'|'$/g, "");
			} else {
				type = "identifier";
			}

			return {type: type, content: e};
		});

		return tokens;
	}

	// is the token a comparsion?
	function _isComparsion(token){
		return token.type === "operator" && /!=|==|>=|>|<|<=/.test(token.content);
	}

	// compare left and right using operator
	function _compare(operator, left, right){
		switch(operator){
			case "==": return left == right;
			case "!=": return left != right;
			case "<=": return left <= right;
			case ">=": return left >= right;
			case "<": return left < right;
			case ">": return left > right;
		}
	}

	// dump interpreter for comparsions
	// only one "level" <LEFT> <COMPARATOR> <RIGHT> is supported yet
	// ...to be extended...
	function evaluate(context, tokens){
		var left, right, operator, leftValue;

		if (tokens.length !== 3) {
			// that's our limitation so far
			throw new Error("Wrong number of tokens. Expected 3 got " + tokens.length);
		}

		left = tokens.shift().content;

		operator = tokens.shift();

		if (!_isComparsion(operator)) {
			throw new Error("Expected an comparsion operator at position 2");
		}

		operator = operator.content;

		right = tokens.shift().content;

		if (!context[left]) {
			// undefined
			return false;
		}

		// get value for variable. work with stings only
		leftValue = String(context[left]);

		return _compare(operator, leftValue, right);
	}


	return {
		// context should contain an object where the attributes
		// are referenced for identifiers within an expression
		evaluate: function(context, expression){
			// evaluate using the context data and the previously
			// parsed tokens
			return evaluate(context, tokenize(expression));
		}
	};

});
