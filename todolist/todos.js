(function() {
	var ENTER = 13;

	var todos;

	// localStorage.clear();

	if ( localStorage['todos'] )
		todos = JSON.parse(localStorage['todos']);
	else
		todos = [];

	function indexOf(array, searchID) {
		var index = -1;
		for (var i = 0; i < array.length; i++) {
			if ( array[i]["id"] === searchID ) {
				index = i;
				break;
			}
		}
		return index;
	}

	function newItem(id, text, checked) {
		if ( checked ) {
			$("#todolist").append('<li align="center" id=' + id + '><label><input type="checkbox" class="checked" />   ' + text + '   <button class="close">&times;</button></label></li>');
				console.log("checked, UGHHHHHHHHHH!!!!!!");
		} else {
			$("#todolist").append('<li align="center" id=' + id + '><label><input type="checkbox" />   ' + text + '   <button class="close">&times;</button></label></li>');
				console.log("unchecked, BAHHHHHHHHHHH!!!!");
		}
	}

	// Parse in localStorage data
	for (var i = 0; i < todos.length; i++) {
		newItem(todos[i]['id'], todos[i]['text'], todos[i]['checked']);

		if ( todos[i]['checked'] ) {
			console.log(i + " true");
			todos[i]['text'].className = true;
		} else {
			console.log(i + " false");
			todos[i]['text'].className = false;
		}

		//updateProgress();
	}

	function checkItem() {
		var listItem = $(this).parent().parent();
		var id = listItem.attr("id");
		var index = indexOf(todos, id);
			console.log("checkedbox: " + index);

		if ( $(this).is(':checked') ) {
			console.log("checked!");
			todos[index]['checked'] = true;
		} else {
			console.log("not checked!");
			todos[index]['checked'] = false;
		}
		
		listItem.toggleClass('checked');
		updateProgress();
	}

	function removeItem() {
		var listItem = $(this).parent().parent();
		var id = listItem.attr("id");
		var index = indexOf(todos, id);
			console.log("removeitem index: " + index);
		
		todos.splice(index, 1);
		
		listItem.remove(); // take .close & select parent => li
		updateProgress();
	}

	function updateProgress() {
		var completed = $("input:checkbox:checked").length;
		var total = $("input:checkbox").length;

		localStorage.setItem('todos', JSON.stringify(todos));
			console.log(JSON.parse(localStorage['todos']));

		$("#progress").html("" + completed + " / " + total + " completed! Yay!");
	}

	function addNewItem(text) {
		//var id = _.uniqueId()
		var date = new Date();
		var id = "" + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
			console.log("UNIQUEID: " + id);

		newItem(id, text, false);
		todos.push( {id: id, text: text, checked: false} );
		
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

		updateProgress();
	});
}());