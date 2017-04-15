Trello.get("boards/" + board.id + "/cards", function(cards) {

	output = "<div id='lists'>";

		output += "<div id='meta' class='print-col-" + displayColumns + " list'>"

			output += "<h1>" + board.name; + "</h1>";
			output += "<p>Created on " + printDate + "</p>";
			output += "<p class='foot'>Made with {{ site.title }}:<br>{{ site.url | append: site.baseurl }}</p>"

		output += "</div>"

	    $.each(board.lists, function (i){
			var idList = this.id;
			output += "<div class='print-col-" + displayColumns + " list'>";
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

	$('#output').html(output);

});
