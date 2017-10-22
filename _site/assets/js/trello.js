$( document ).ready(function() {

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
	
			Trello.get("boards/" + board.id + "/labels", function(labels) {

	Trello.get("boards/" + board.id + "/cards", function(cards) {

		output = "<div id='cover-page'>"
	
			output += "<h1>" + board.name + "</h1>";
			output += "<p>Created on " + printDate + "</p>";
			output += "<p class='foot'>Made with Printello:<br>http://localhost:4000/dashello</p>"
	
		output += "</div>"
	
		output += "<div id='lists' class='columns-" + displayColumns + "'>";

	    $.each(board.lists, function (i){

		    var idList = this.id;
			output += "<div class='list'>";
			output += "<h2>"+this.name+"</h2>";

		    $.each(labels, function(index, label) {

				var idLabels = this.id;

				if (displayLabels == true) {

				    output += "<h3 class='" + this.color + "'>" + this.name + "</h3>";

				}

				output+= "<ul class='cards'>";

					$.each(board.cards, function(i){
						var idCard = this.id;

						if (displayCheckMarks == true) {

		       				output += "<li class='ticks-on'>";

		       			} else {

			       			output += "<li class='ticks-off'>";

		       			}


							if (this.idList == idList){

								if (this.idLabels == idLabels){

									if (displayCheckMarks == true) {

										if (this.dueComplete == true) {
										    output += "<span class='tick'></span>";
										} else {
										    output += "<span class='no-tick'></span>";
										}

									}

									output += "<span class='content'>";

									if (displayDueDates == true) {

										if (this.due != null) {
											var cardDue = new Date(this.due);
											var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
					  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
											output += " <span class='date'>" + cardDue.getDate() + ' ' + monthShortNames[cardDue.getMonth()] + "</span>";
										}

									}

						       		output += this.name + "</span>";

						       	}

						   	}


		       			output += "</li>";

					});

				output+= "</ul>";

			});

			output += "</div>";
		});

		output += '</div>';
		$('#output').html(output);

		document.getElementById('board-name').innerHTML = board.name;

	});

});

	
		} else if (displayLayout == "list--unordered-list") {
	
			Trello.get("boards/" + board.id + "/cards", function(cards) {
	
	output = "<div id='cover-page'>"

		output += "<h1>" + board.name + "</h1>";
		output += "<p>Created on " + printDate + "</p>";
		output += "<p class='foot'>Made with Printello:<br>http://localhost:4000/dashello</p>"

	output += "</div>"

	output += "<div id='lists' class='columns-" + displayColumns + "'>";

		

	    $.each(board.lists, function (i){
			var idList = this.id;
			output += "<div class='list'>";
			output += "<h2>"+this.name+"</h2>";

			output+= "<ul class='cards'>";

			$.each(cards, function(i){
				var idCard = this.id;

				var cardStickers = idCard.stickers;

				if (this.idList == idList){

					if (displayCheckMarks == true) {

	       				output += "<li class='ticks-on'>";

	       			} else {

		       			output += "<li class='ticks-off'>";

	       			}

					if (displayCheckMarks == true) {

						if (this.dueComplete == true) {
						    output += "<span class='tick'></span>";
						} else {
						    output += "<span class='no-tick'></span>";
						}

					}
					
					output += "<span class='content'>";

					if (displayDueDates == true) {

						if (this.due != null) {
							var cardDue = new Date(this.due);
							var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
					"Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
							output += " <span class='date'>" + cardDue.getDate() + ' ' + monthShortNames[cardDue.getMonth()] + "</span>";
						}

					}

					if (displayLabels == true) {

		       			var cardLabels = this.labels;

		       			for (i = 0; i < cardLabels.length ; i++) {
						    output += "<span class='label "+cardLabels[i].color+"'>" + cardLabels[i].name + "</span>";
						}
					}

	       			output += this.name + "</span>";
	       			
	       			output += "</li>";
				}

			});

			output += "</ul>";
			output += "</div>";
		});

	output += "</div>"

	$('#output').html(output);

	document.getElementById('board-name').innerHTML = board.name;

});

	
		} else if (displayLayout == "list--swim-lanes") {
	
			Trello.get("boards/" + board.id + "/labels", function(labels) {

	Trello.get("boards/" + board.id + "/cards", function(cards) {

		output = "<div id='cover-page'>"
	
			output += "<h1>" + board.name + "</h1>";
			output += "<p>Created on " + printDate + "</p>";
			output += "<p class='foot'>Made with Printello:<br>http://localhost:4000/dashello</p>"
	
		output += "</div>"
		
		output += "<div id='swim-lanes'>";

		var listCount = 0;

	    $.each(board.lists, function (i){
	        listCount++;
	    });

		console.log('The number of lists is ' + listCount);

		var pagesCount = Math.ceil(listCount / displayColumns);

		console.log('The number of pages will be ' + pagesCount);

		for (i = 0; i < pagesCount; i++) {
			var page = (i+1);
		    console.log('Create page ' + page);
    		output += "<div class='swim-lane-page columns-" + displayColumns + "'>";
    		output += "<div class='headings'>";
			output += "<div class='blank-space'></div>";

			var lists = board.lists;
			var listsSlice = lists.slice(
				(0 + (i * displayColumns)),
				(0 + ((i+1) * displayColumns))
			)

			$.each(listsSlice, function (i){

			    var idList = this.id;

			    console.log('Create list ' + this.name);

				output += "<h2 class='label'>"+this.name+"</h2>";

		    });

    		output += "</div>";

		    $.each(labels, function(index, label) {

 				var idLabels = this.id;

				output += "<div class='swim-lane'>";

				output += "<div class='first-column'>";
				output += "<h2 class='label'>" + this.name + "</h2>";
	    		output += "</div>";

	    		$.each(listsSlice, function (i){

				    var idList = this.id;

				    console.log('Create cards for the list ' + this.name);

					output += "<div class='column'>";
					output += "<ul class='cards'>";

						$.each(board.cards, function(i){
							var idCard = this.id;

							if (displayCheckMarks == true) {

			       				output += "<li class='ticks-on'>";

			       			} else {

				       			output += "<li class='ticks-off'>";

			       			}


								if (this.idList == idList){

									if (this.idLabels == idLabels){

										if (displayCheckMarks == true) {

											if (this.dueComplete == true) {
											    output += "<span class='tick'></span>";
											} else {
											    output += "<span class='no-tick'></span>";
											}

										}
										
										output += "<span class='content'>";

										if (displayDueDates == true) {

											if (this.due != null) {
												var cardDue = new Date(this.due);
												var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
						  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
												output += " <span class='date'>" + cardDue.getDate() + ' ' + monthShortNames[cardDue.getMonth()] + "</span>";
											}

										}

							       		output += "<span class='content'>" + this.name + "</span>";

							       	}

							   	}


			       			output += "</li>";

						});

					output += "</ul>";

		    		output += "</div>";

			    });

	    		output += "</div>";

			});

    		output += "</div>";
		}

		output += "</div>";

		$('#output').html(output);

		document.getElementById('board-name').innerHTML = board.name;

	});

});
	
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
	    	$("#boardSelect").show();
	    	$("#loggedOut").hide();
	    	$("#printScreen").hide();
	    	$("#output").hide();
	    } else {
	    	console.log('not logged in');
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
		$('#boardSelect').show();
		$('#loggedOut').hide();
		$('#printScreen').hide();
		$('#output').hide();
		document.getElementById('board-name').innerHTML = "";
	}
	
	var print = function() {
		$("#output").show();
		$("#boardSelect").hide();
		$("#printScreen").hide();
		window.print();
		$("#printScreen").show();
		$("#output").hide();
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
	        name: 'Printello'
	    })
	});
	
	$("#showLink").click(function(){
		console.log('show link clicked');
		Trello.authorize({
		    interactive:false,
		    success: getBoards
		});
	});
	
	$("#disconnect").click(logout);
	$("#print").click(print);
	$("#restart").click(restart);

});