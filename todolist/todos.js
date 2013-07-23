(function() {
	
	// Do:
	// var ENTER = 13,
	//     todos = null;
	// Reason: this is mostly a style thing, but very commonly done by JS people. The extra vars are not 
	// necessary, you can accomplish the same thing with var and commas.
	
	var ENTER = 13;
	var todos;
	
	// Do: 
	// var input = $("#inputBox");
	// Reason: Otherwise, below you are fetching this many times, which is not very performant or clean.

	// PARSE LOCALSTORAGE DATA
	if ( localStorage['todos'] )
		todos = JSON.parse(localStorage['todos']);
	else
		todos = [];

	for (var i = 0; i < todos.length; i++) {
		newItem(todos[i]['index'], todos[i]['text'], todos[i]['checked']);
	}
	// Do: create an init() method where you put the localStorage logic as well as what is in
	// the $(document).ready below. 
	// Reason: very organizational, it makes it much easier for people to read if the init logic
	// is in one place.
	

	function newItem(index, text, checked) {
		var task = { index: index, text: text };
		var source = $("#template").html(); 
		var template = Handlebars.compile(source);
		var html = template(task);
		
		// Note: Same var groupingcomment as above. 
		// Also, don't assign vars unless you are saving yourself
		// long lines. If you make a var, you are communicating I'm going to use it more than once.
		

		$("#todolist").append(html);
	
		if ( checked ) {
			$("li[data-index=" + index + "]").addClass('checked');
			$("input[name=cb_" + index + "]").attr('checked', 'checked');
		} 
	}

	function checkItem() {
		var listItem = $(this).parent().parent();
		var index = listItem.data("index");

		listItem.toggleClass('checked');

		if ( $(this).is(':checked') )
			todos[index]['checked'] = true;
		else
			todos[index]['checked'] = false;

		// Do: this can be a single line :), I'll let you figure out how.
		// remmember that is checked is giving you all the info you need.

		updateProgress();
	}

	function removeItem() {
		var listItem = $(this).parent().parent(); 
		// Do: use closest("li") instead of this. R
		// Reason is that if your structure changes, this will break,
		// closest will do a search which is much more resilient. 
		
		var index = listItem.data("index");

		for (var i = index + 1; i < todos.length; i++) {
				$("li[data-index=" + i + "]").attr('data-index', "" + i-1);
				todos[i]['index'] = i-1;
		}
		
		todos.splice($.inArray(todos[index], todos), 1); //nice!	
		
		listItem.parent().remove(); // take .close & select parent => li
		updateProgress();
	}

	function updateProgress() {
		var completed = $("input:checkbox:checked").length;
		var total = $("input:checkbox").length;

		localStorage.setItem('todos', JSON.stringify(todos));

		$("#progress").html("" + completed + " / " + total + " completed! Yay!");
		// Do: Use a template for this too, but it can be a simple one. ie..
		// var tmp = Handlebars.compile("{{completed}} / {{total}} completed! Yey!");
		// Also, same thing, pre-cache (var progress = $("#progress")) this above and reuse
		// where you need to.
	}

	function addNewItem(text) { 
		var index = todos.length;
		newItem(index, text, false);
		todos.push( {index: index, text: text, checked: false} );
		// Naming is a little confusing here, newItem vs... addNewItem? Maybe should be onKeyPress?
		// Imagine another developer would be wondeirng what the difference between the 
		// two are.
		
		$("#inputBox").val("");
		$("#inputBox").focus();
		// Chain inputBox.val("").focus();

		updateProgress();
	}

	$(document).ready(function() {
		$("#inputBox").focus();

		$("#inputBox").keypress(function(e) {
			if ( e.which === ENTER ) {
				var text = $("#inputBox").val();
				if ( text ) { addNewItem(text); }
			}
		});
		// Do: easier way of doing this is at the top your input should be inside a form.
		// then what you can do is $("form").submit(function() { addNewItem(inputBox.val()) }
		
		// Chain here: inputBox.keypress(..).focus();

		$("#add").on('click', function() {
			var text = $("#inputBox").val();
			if ( text ) { addNewItem(text); }
		});
		
		// Shorthand you can just do $("#add").click(..)
		
		$(document).on('click', '.close', removeItem);
		$(document).on('click', 'input[type=checkbox]', checkItem);  // .on(event, selector, function);  Every time click on doc, check .done & perform finishItem
		
		// Do: jQuery is famous for chaining, you can do..
		// $(document).on("click", ..).on("click"..);
		
		// $("#todolist").sortable();  // ???
		updateProgress();
	});
}());
