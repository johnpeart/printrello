Trello.get("boards/" + board.id + "/labels", function(labels) {

	Trello.get("boards/" + board.id + "/cards", function(cards) {

		output = "<div id='swim-lanes'>";

		output += "<div id='thead' class='swim-lane'>";
		output += "<h1 class='display-4'>"+board.name+"</h1>";
		output += "<p>Created on " + printDate + "</p>";
		output += "<p class='foot'>Made with {{ site.title }} - {{ site.url | append: site.baseurl }}</p>"
		output += "</div>";

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
    		output += "<div class='swim-lane-group'>";
    		output += "<div class='columns'>";
			output += "<div class='first-column'><span class='blank'></span></div>";

			var lists = board.lists;
			var listsSlice = lists.slice(
				(0 + (i * displayColumns)),
				(0 + ((i+1) * displayColumns))
			)

			$.each(listsSlice, function (i){

			    var idList = this.id;

			    console.log('Create list ' + this.name);

				output += "<div class='print-col-" + displayColumns + " column'>";
				output += "<h2 class='label'>"+this.name+"</h2>";
				output += "</div>";

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

					output += "<div class='print-col-" + displayColumns + " column'>";
					output += "<span class='blank'></span>"
					output += "<ul class='cards'>";

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

					output += "</ul>";

		    		output += "</div>";

			    });

	    		output += "</div>";

			});

    		output += "</div>";
		}

		output += "</div>";

		$('#output').html(output);

	});

});