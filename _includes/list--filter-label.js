Trello.get("boards/" + board.id + "/labels", function(labels) {

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

		    $.each(labels, function(index, label) {

				var idLabels = this.id;

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
