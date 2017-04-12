/*
See https://trello.com/docs for a list of available API URLs
The API development board is at https://trello.com/api
*/

$( document ).ready(function() {
$('.loggedIn').hide();

var getBoards = function (){
	updateLoggedIn();
	$("#boardList").empty();
	Trello.members.get("me", function(member){
	    $(".fullName").text(member.fullName);

	    var $boardList = $('<div>')
	        .text("Fetching your Trello Boards. Please wait.")
	        .appendTo("#boardList");

	    // Output a list of all of the boards that the member
	    Trello.get("members/me/boards", {filter: "open"}, function(boards) {
	        $boardList.empty();
	        var output = '<div id="lists"><h2>Your boards</h2><p>Select a board to view. If you want to come back to this screen, just refresh the page.</p>';
	        output += '<div class="row">';
	        $.each(boards, function(ix, board) {
	        	output += '<div class="col-xs-12 col-sm-6"><a data-board-id = "'+board.id+'" href="#"><p>'+board.name+'</p></a></div>';
	        });
	        output += '</div></div>';
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

	var displayColumns = $("input:radio[name=display-mode--option--columns]:checked").val();
	var displayCheckMarks = document.getElementById("display-mode--option--check-marks").checked;
	var displayDueDates = document.getElementById("display-mode--option--due-date").checked;
	var displayLabels = document.getElementById("display-mode--option--labels").checked;
	var displayLayout = $("input:radio[name=display-mode--option--layout]:checked").val();

	if (displayLayout == "list--filter-label") {

		Trello.get("boards/" + board.id + "/labels", function(labels) {

			Trello.get("boards/" + board.id + "/cards", function(cards) {

			dashboardDate();

			output = '<div class="container"><div class="row" style="display:flex;">';

			    $.each(board.lists, function (i){

				    var idList = this.id;
					output += "<div class='col-xs-" + displayColumns + " list'>";
					output += "<h2>"+this.name+"</h2>";

				    $.each(labels, function(index, label) {

						var idLabels = this.id;

						if (idLabels )

						if (displayLabels == true) {

						    output += "<h3 class='list-title " + this.color + "'>" + this.name + "</h3>";

						}

						output+= "<ul>";

						$.each(board.cards, function(i){
							var idCard = this.id;

							if (displayCheckMarks == true) {

			       				output += "<li class='ticks-on'>";

			       			} else {

				       			output += "<li>";

			       			}


								if (this.idList == idList){

									if (this.idLabels == idLabels){

										if (displayCheckMarks == true) {

											if (this.dueComplete == true) {
											    output += "<span class='tick'>✓</span>";
											} else {
											    output += "<span class='empty-tick'></span>";
											}

										}

										if (displayDueDates == true) {

											if (this.due != null) {
												var cardDue = new Date(this.due);
												var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
						  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
												output += " <span class='label label-pink--inverse'>" + cardDue.getDate() + ' ' + monthShortNames[cardDue.getMonth()] + "</span>";
											}

										}

							       			output += this.name;

							       	}

							   	}


			       			output += "</li>";

						});

						output+= "</ul>";

					});

					output += "</div>";
				});

				output += '</div></div>';
				$('#output').html(output);

				document.getElementById('board-name').innerHTML = board.name;

			});

		});

	} else {

		Trello.get("boards/" + board.id + "/cards", function(cards) {

			dashboardDate();

			output = '<div class="container"><div class="row" style="display:flex;">';

			    $.each(board.lists, function (i){
					var idList = this.id;
					output += "<div class='col-xs-" + displayColumns + " list'>";
					output += "<h2>"+this.name+"</h2>";

					output+= "<ul>";

					$.each(cards, function(i){
						var idCard = this.id;

						var cardStickers = idCard.stickers;

						if (this.idList == idList){

							if (displayCheckMarks == true) {

			       				output += "<li class='ticks-on'>";

			       			} else {

				       			output += "<li>";

			       			}

							if (displayCheckMarks == true) {

								if (this.dueComplete == true) {
								    output += "<span class='tick'>✓</span>";
								} else {
								    output += "<span class='empty-tick'></span>";
								}

							}

							if (displayDueDates == true) {

								if (this.due != null) {
									var cardDue = new Date(this.due);
									var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
							"Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
									output += " <span class='label label-pink--inverse'>" + cardDue.getDate() + ' ' + monthShortNames[cardDue.getMonth()] + "</span>";
								}

							}

							if (displayLabels == true) {

				       			var cardLabels = this.labels;

				       			for (i = 0; i < cardLabels.length ; i++) {
								    output += "<span class='label label-"+cardLabels[i].color+"'>" + cardLabels[i].name + "</span>";
								}
							}

			       			output += this.name;

			       			output += "</li>";
						}

					});
					output += "</div>";
				});

				output += '</div></div>';
				$('#output').html(output);

				document.getElementById('board-name').innerHTML = board.name;


		});

	}

	$('#boardList').hide();
	$('#instructions').hide();
	$('#options').hide();

}




var dashboardDate = function() {
	var dateString = new Date();
	var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
	document.getElementById('print-date').innerHTML = 'Created on: ' + dateString.getDate() + ' ' + monthNames[dateString.getMonth()] + ' ' + dateString.getFullYear();
}

var updateLoggedIn = function() {
    var isLoggedIn = Trello.authorized();
    if (isLoggedIn){
    	console.log('logged in');
    	$(".loggedIn").show();
    	$(".loggedOut").hide();
    } else {
    	console.log('not logged in');
    	$(".loggedIn").hide();
    	$(".loggedOut").show();
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

Trello.authorize({
    interactive:false,
    success: getBoards
});

$("#connectLink")
.click(function(){
    Trello.authorize({
        type: "popup",
        success: getBoards,
        name: 'GEO Dashboards'
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

});