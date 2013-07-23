(function() {
	var ENTER = 13;
	var todos;

	// PARSE LOCALSTORAGE DATA
	if ( localStorage['todos'] )
		todos = JSON.parse(localStorage['todos']);
	else
		todos = [];

	for (var i = 0; i < todos.length; i++) {
		newItem(todos[i]['index'], todos[i]['text'], todos[i]['checked']);
	}

	function newItem(index, text, checked) {
		var task = { index: index, text: text };
		var source = $("#template").html();
		var template = Handlebars.compile(source);
		var html = template(task);

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

		updateProgress();
	}

	function removeItem() {
		var listItem = $(this).parent().parent();
		var index = listItem.data("index");

		for (var i = index + 1; i < todos.length; i++) {
				$("li[data-index=" + i + "]").attr('data-index', "" + i-1);
				todos[i]['index'] = i-1;
		}
		
		todos.splice($.inArray(todos[index], todos), 1);	
		
		listItem.remove(); // take .close & select parent => li
		updateProgress();
	}

	function updateProgress() {
		var completed = $("input:checkbox:checked").length;
		var total = $("input:checkbox").length;

		localStorage.setItem('todos', JSON.stringify(todos));

		$("#progress").html("" + completed + " / " + total + " completed! Yay!");
	}

	function addNewItem(text) {
		var index = todos.length;
		newItem(index, text, false);
		todos.push( {index: index, text: text, checked: false} );
		
		$("#inputBox").val("");
		$("#inputBox").focus();

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

		$("#add").on('click', function() {
			var text = $("#inputBox").val();
			if ( text ) { addNewItem(text); }
		});
		
		$(document).on('click', '.close', removeItem);
		$(document).on('click', 'input[type=checkbox]', checkItem);  // .on(event, selector, function);  Every time click on doc, check .done & perform finishItem
		
		// $("#todolist").sortable();  // ???
		updateProgress();
	});
}());