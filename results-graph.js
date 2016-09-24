var timeline_length = 400;
var max_time = 0;
var same_result = 0;
var random_result = 0;
var other_result = 0;

window.onload = function() {
	var s = Snap("#svg");
	// Lets create big circle in the middle:
	var how_long_t = s.paper.text(139, 100, 'How long would it take');
	var equal_vp_t = s.paper.text(152, 130,'to get to equal VPs?');
	var button = s.paper.rect(165, 175, 170, 35, 5).attr({
			fill: "#eeeeee",
	});
	var run_t = s.paper.text(175, 200,'Run simulation');
	run_t.click(
			function(){
				runSimulation();
				s.paper.clear();
				drawTimeline(s);
				drawRunAgain(s);
		}).hover(
				function() {
					button.attr({
							fill: "#f7f7f7",
					});
					this.attr({
							fill: "#000000"
					});
				},
				function() {
					button.attr({
							fill: "#eeeeee",
					});
					this.attr({
							fill: "#498dc1"
					});
				});

	var all_text = [how_long_t, equal_vp_t, run_t];

	for (var i = 0; i < all_text.length; i++) {
		all_text[i].attr({
			fill: "#498dc1",
	    "font-size": "20px",
			"font-family": "Nixie One",
			"font-style": "cursive",
		});
	}
}

function drawTimeline(s) {

	same_result = Math.round(same_sum/simulation_runs);
	random_result = Math.round(random_sum/simulation_runs);
	other_result = Math.round(other_sum/simulation_runs);

	max_time = calculateMax();

	var line = s.paper.rect(50, 150, timeline_length, 2, 1);
	var start_dot = s.paper.circle(50, 150, 4);
	var end_dot = s.paper.circle(450, 150, 4);
	var zero_t = s.paper.text(46, 170, '0');
	var end_t = s.paper.text(425, 170, max_time +' years');

	var year_to_pixel = timeline_length / max_time;

	var same_line = s.paper.rect(50+(same_result*year_to_pixel), 70, 2, 80, 1);
	var random_line = s.paper.rect(50+(random_result*year_to_pixel), 100, 2, 50, 1);
	var other_line = s.paper.rect(50+(other_result*year_to_pixel), 130, 2, 20, 1);

	var same_text = s.paper.text(50+(same_result*year_to_pixel), 30, ['Sponsor same', same_result+' years']);
	console.log(same_text.selectAll('tspan')[0].getBBox().width);
	var random_text = s.paper.text(50+(random_result*year_to_pixel), 60, ['Sponsor randomly', random_result+' years']);
	var other_text = s.paper.text(50+(other_result*year_to_pixel), 90, ['Sponsor other', other_result+' years']);

	var timeline = [line, start_dot, end_dot, same_line, random_line, other_line];
	var timeline_text = [zero_t, end_t, same_text, random_text, other_text];

	for (var i = 0; i < timeline.length; i++) {
		timeline[i].attr({
			fill: "#e6e6e6"
		});
	}

	for (var i = 0; i < timeline_text.length; i++) {
		timeline_text[i].attr({
			fill: "#498dc1",
			"font-size": "12px",
			"font-family": "Nixie One",
			"font-style": "cursive",
		});
		var text_lines = timeline_text[i].selectAll('tspan');
		for (var j = 0; j < text_lines.length; j++) {
			text_lines[j].attr({
				dx : '-5em',
				dy: '1.2em',
			});
		}
	}
}

function drawRunAgain(s) {
	var button = s.paper.rect(165, 195, 170, 35, 5).attr({
			fill: "#eeeeee",
	});
	var run_t = s.paper.text(195, 220,'Run again?').attr({
		fill: "#498dc1",
		"font-size": "20px",
		"font-family": "Nixie One",
		"font-style": "cursive",
	});
	run_t.click(
			function(){
				runSimulation();
				s.paper.clear();
				drawTimeline(s);
				drawRunAgain(s);
		}).hover(
				function() {
					button.attr({
							fill: "#f7f7f7",
					});
					this.attr({
							fill: "#000000"
					});
				},
				function() {
					button.attr({
							fill: "#eeeeee",
					});
					this.attr({
							fill: "#498dc1"
					});
				});
}

function calculateMax() {
	var largest_result;

	if ( same_result > random_result ) {
		largest_result = same_result;
	} else {
		largest_result = random_result;
	}

	if ( largest_result < 40 ) {
		return 40;
	} else if ( largest_result < 50 ) {
		return 50;
	} else if ( largest_result < 60) {
		return 60;
	} else {
		return 70;
	}
}
