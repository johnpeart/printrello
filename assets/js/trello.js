---
---

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

		{% include list--filter-label.js %}

	} else if (displayLayout == "list--unordered-list") {

		{% include list--unordered-list.js %}

	} else if (displayLayout == "list--swim-lanes") {

		{% include list--swim-lanes.js %}

	} else {

	}

	$('#boardList').hide();
	$('#loggedIn-PrintScreen').show();
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
	$("#loggedIn-PrintScreen").hide();
}

var print = function() {
	$("#loggedIn-Options").hide();
	$("#loggedIn-Output").show();
	window.print();
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
        name: '{{ site.title }}'
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
$("#print").click(print);

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