---
---

$( document ).ready(function() {

	var showNavigationLinks = function () {
		var isLoggedIn = Trello.authorized();
	    if (isLoggedIn){
	    	console.log('logged in');
	    	$(".header-options").show();
	    } else {
	    	console.log('not logged in');
	    	$(".header-options").hide();
	    }
	}

		showNavigationLinks();

	$('#boardSelect').hide();
	$('#printScreen').hide();
	$('#output').hide();
	
	var getBoards = function (){
		updateLoggedIn();
		Trello.members.get("me", function(member){
	//	    $(".fullName").text(member.fullName);
	
		    var $boardList = $('<div id="displayBoards">')
		        .text("Fetching your Trello Boards. Please wait.")
		        .appendTo("#boardSelect");
	
		    // Output a list of all of the boards that the member
		    Trello.get("members/me/boards", {filter: "open"}, function(boards) {
		        $boardList.empty();
		        var output = '<h1>Select a board</h1>';
		        output += '<div id="boards">';
		        $.each(boards, function(ix, board) {
		        	output += '<a data-board-id = "'+board.id+'" href="#"><div class="board-name">'+board.name+'</div></a>';
		        });
		        output += '</div>';
		        $boardList.html(output);
		        //attach behaviours
		        $('a', $boardList).click( function(){
		        	var id = $(this).data('board-id');
		        	Trello.boards.get(id, {lists: "open", cards: "visible"}, displayBoard);
		        	return false;
		        });
		    });
		});
	}
	
	var displayBoard = function(board){
	
		$("#output").empty();

		var dateString = new Date();
		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var printDate = dateString.getDate() + ' ' + monthNames[dateString.getMonth()] + ' ' + dateString.getFullYear();
	
		var displayColumns = $("input:radio[name=display-mode--option--columns]:checked").val();
		var displayCheckMarks = document.getElementById("display-mode--option--check-marks").checked;
		var displayDueDates = document.getElementById("display-mode--option--due-date").checked;
		var displayLabels = document.getElementById("display-mode--option--labels").checked;
		var displayLayout = $("input:radio[name=display-mode--option--layout]:checked").val();
	
		if (displayLayout == "list--filter-label") {
	
			{% include list--filter-label.js %}
	
		} else if (displayLayout == "list--unordered-list") {
	
			{% include list--unordered-list.js %}
	
		} else if (displayLayout == "list--swim-lanes") {
	
			{% include list--swim-lanes.js %}
	
		} else {
	
		}
	
		$('#loggedOut').hide();
		$('#boardSelect').hide();
		$('#printScreen').show();
	}
	
	var updateLoggedIn = function() {
	    var isLoggedIn = Trello.authorized();
	    if (isLoggedIn){
	    	console.log('logged in');
	    	$(".header-options").show();
	    	$("#boardSelect").show();
	    	$("#loggedOut").hide();
	    	$("#printScreen").hide();
	    	$("#output").hide();
	    } else {
	    	console.log('not logged in');
	    	$(".header-options").hide();
	    	$("#loggedOut").show();
	    	$("#boardSelect").hide();
	    	$("#printScreen").hide();
	    	$("#output").hide();
	    }
	};
	
	var getDateStamp = function(){
		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth() + 1;
		var day = d.getDate();
		return year+'-'+month+'-'+day;
	};
	
	var logout = function() {
	    Trello.deauthorize();
	    updateLoggedIn();
	};
	
	var restart = function() {
		$("#displayBoards").remove();
		$("#output").empty();
		getBoards();
	}
	
	var print = function() {
		window.print();
	}
	
	Trello.authorize({
	    interactive:false,
	    success: getBoards
	});
	
	$("#connectLink")
	.click(function(){
	    Trello.authorize({
	        type: "redirect",
	        success: getBoards,
	        name: '{{ site.title }}'
	    })
	});
	
	$("#disconnect").click(logout);
	$("#print").click(print);
	$(".restart").click(restart);

});