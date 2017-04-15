$( document ).ready(function() {
$('#loggedIn').hide();

var getBoards = function (){
	updateLoggedIn();
	$("#boardList").empty();
	Trello.members.get("me", function(member){
//	    $(".fullName").text(member.fullName);

	    var $boardList = $('<div>')
	        .text("Fetching your Trello Boards. Please wait.")
	        .appendTo("#boardList");

	    // Output a list of all of the boards that the member
	    Trello.get("members/me/boards", {filter: "open"}, function(boards) {
	        $boardList.empty();
	        var output = '<div id="lists"><h1>Select a board</h1>';
	        output += '<div class="row">';
	        $.each(boards, function(ix, board) {
	        	output += '<div class="col-12 col-sm-4"><a data-board-id = "'+board.id+'" href="#"><p>'+board.name+'</p></a></div>';
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

			output = '<div class="row">';

				output += "<div id='meta' class='col-" + displayColumns + "'>"

					output += "<h1>" + board.name; + "</h1>";

					output += "<p>Created on " + printDate + "</p>";

				output += "</div>"

			    $.each(board.lists, function (i){

				    var idList = this.id;
					output += "<div class='col-" + displayColumns + " list'>";
					output += "<h1>"+this.name+"</h1>";

				    $.each(labels, function(index, label) {

						var idLabels = this.id;

						if (idLabels )

						if (displayLabels == true) {

						    output += "<h2 class='" + this.color + "'>" + this.name + "</h2>";

						}

						output+= "<ul class='cards'>";

						$.each(board.cards, function(i){
							var idCard = this.id;

							if (displayCheckMarks == true) {

			       				output += "<li class='ticks-on'><p>";

			       			} else {

				       			output += "<li class='ticks-off'><p>";

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
												output += " <span class='badge badge-pink--inverse'>" + cardDue.getDate() + ' ' + monthShortNames[cardDue.getMonth()] + "</span>";
											}

										}

							       			output += this.name;

							       	}

							   	}


			       			output += "</p></li>";

						});

						output+= "</ul>";

					});

					output += "</div>";
				});

				output += '</div>';
				$('#output').html(output);

			});

		});

	} else {

		Trello.get("boards/" + board.id + "/cards", function(cards) {

			output = '<div id="lists">';
			output += '<div class="row">';

				output += "<div id='meta' class='col-" + displayColumns + "'>"

					output += "<h1>" + board.name; + "</h1>";

					output += "<p>Created on " + printDate + "</p>";

				output += "</div>"

			    $.each(board.lists, function (i){
					var idList = this.id;
					output += "<div class='col-" + displayColumns + " list'>";
					output += "<h1>"+this.name+"</h1>";

					output+= "<ul class='cards'>";

					$.each(cards, function(i){
						var idCard = this.id;

						var cardStickers = idCard.stickers;

						if (this.idList == idList){

							if (displayCheckMarks == true) {

			       				output += "<li class='ticks-on'><p>";

			       			} else {

				       			output += "<li class='ticks-off'><p>";

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
									output += " <span class='badge badge-pink--inverse'>" + cardDue.getDate() + ' ' + monthShortNames[cardDue.getMonth()] + "</span>";
								}

							}

							if (displayLabels == true) {

				       			var cardLabels = this.labels;

				       			for (i = 0; i < cardLabels.length ; i++) {
								    output += "<span class='badge badge-"+cardLabels[i].color+"'>" + cardLabels[i].name + "</span>";
								}
							}

			       			output += this.name;

			       			output += "</p></li>";
						}

					});

					output += "</ul>";
					output += "</div>";
				});

			output += "</div>"
			output += '</div>';

			$('#output').html(output);

		});

	}

	$('#loggedIn-Options').hide();

}

var updateLoggedIn = function() {
    var isLoggedIn = Trello.authorized();
    if (isLoggedIn){
    	console.log('logged in');
    	$("#loggedIn").show();
    	$("#loggedOut").hide();
    } else {
    	console.log('not logged in');
    	$("#loggedIn").hide();
    	$("#loggedOut").show();
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

var reset = function() {
	$("#options").show();
	$("#options-layout").show();
	$("#options-columns").hide();
	$("#options-data").hide();
	$("#boardList").hide();
	$("#loggedIn-Options").show();
	$("#loggedIn-Output").hide();
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
        name: 'Dash for Trello'
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

$("#reset").click(reset);

});

function swapDivs(div1,div2) {
   d1 = document.getElementById(div1);
   d2 = document.getElementById(div2);
   if( d2.style.display == "none" )
   {
      d1.style.display = "none";
      d2.style.display = "inherit";
   }
   else
   {
      d1.style.display = "block";
      d2.style.display = "none";
   }
}