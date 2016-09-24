var SPONSOR_LIKE = 0;
var SPONSOR_OTHER = 1;
var SPONSOR_RANDOM = 2;

var same_sum = 0;
var simulation_runs = 0;
var random_sum = 0;
var other_sum = 0;

class Employee {
	constructor (diverse) {
		this.diverse = diverse;
		this.promo_chances = Math.random();
		this.attritted = 0;
		this.number = Math.floor(Math.random()*1000);
	}

	attrit(odds) {
		this.attritted = Number(Math.random()<odds);
	}

	print(tag) {
		console.log(tag + " #"+this.number+" (Diverse: " + this.diverse + " Promo Odds: "+ this.promo_chances+" Attritted: "+this.attritted+")");
	}
}

class ManagementLayer {
	constructor (size, diversity) {
		this.layer = new Array();
		for(var i = 0; i < size; i++){
			this.layer.push(new Employee(ManagementLayer.assignDiversity(diversity)));
		}
	}

	print(tag) {
		console.log(tag+"s:");
		this.layer.forEach(function(entry){
			entry.print("  "+tag);
		});
	}

	diversity() {
		var diversity = 0;
		this.layer.forEach(function(entry){
			diversity += entry.diverse;
		});
		return diversity / this.layer.length;
	}

	printDiversity(tag) {
		console.log(tag+"s: " + this.diversity());
	}

	sponsor (reports, tactic, rate) {
		switch(tactic){
			case SPONSOR_LIKE:
				this.layer.forEach(function(entry){
					var report = reports.layer[Math.floor(Math.random()*reports.layer.length)];

					while(report.diverse != entry.diverse)
						report = reports.layer[Math.floor(Math.random()*reports.layer.length)];

					report.promo_chances += rate;
				});
				break;

			// Not reliable.
			case SPONSOR_OTHER:
				this.layer.forEach(function(entry){
					var report = reports.layer[Math.floor(Math.random()*reports.layer.length)];

					while(report.diverse == entry.diverse)
						report = reports.layer[Math.floor(Math.random()*reports.layer.length)];

					report.promo_chances += rate;
				});
				break;

			case SPONSOR_RANDOM:
				this.layer.forEach(function(entry){
					reports.layer[Math.floor(Math.random()*reports.layer.length)].promo_chances += rate;
				});
				break;
		}
	}

	attrit(odds) {
		this.layer.forEach(function(entry){
			entry.attrit(odds);
		})
	}

	hire(hiring_diversity) {
		this.layer.forEach(function(entry){
			if(entry.attritted == 1) {
				entry.attritted = 0;
				entry.promo_chances = Math.random();
				entry.diverse = ManagementLayer.assignDiversity(hiring_diversity);
			}
		});
	}

	backfill(reports) {
		this.layer.forEach(function(entry){
			if(entry.attritted == 1) {
				var successor = reports.promoteEmployee();
				successor.attrit()
				entry.diverse = successor.diverse;
				entry.promo_chances = successor.promo_chances;
				entry.attritted = 0;
			}
		});
	}

	//TODO: Still promotes attritted employees and doesn't account for promo odds
	promoteEmployee() {

		var totalOdds = 0;
		this.layer.forEach(function(entry){
			if(entry.attritted == 0) {
				totalOdds += entry.promo_chances;
			//	console.log("+= "+entry.promo_chances + " ==> " + totalOdds);
			}
		});

		var random = Math.random()*totalOdds;

	//	console.log("Total Odds: "+totalOdds);
	//	console.log("Random: "+random);

		var employeeToPromote;
		var index = -1;
		while(random >= Number(0))
		{
			index++;
			random -= this.layer[index].promo_chances;
		}
		return this.layer[index];
	}

	static assignDiversity (diversity)
	{
		return Number(Math.random() < diversity);
	}
}

class Company {
	constructor (size, starting_diversity, hiring_diversity, attrition_rate,sponsorship_rate,sponsorship_tactic) {
		console.log("Founding a company ("+size+")");
		this.vps = new ManagementLayer(size,starting_diversity);
		this.managers = new ManagementLayer(size*size,starting_diversity);
		this.ics = new ManagementLayer(size*size*size,starting_diversity);
		this.hiring_diversity = hiring_diversity;
		this.attrition_rate = attrition_rate;
		this.tactic = sponsorship_tactic;
		this.sponsorship_rate = sponsorship_rate;
	}

	print() {
		console.log("Company: ");
		this.vps.print("VP");
		this.managers.print("Manager");
		this.ics.print("Employee");
	}

	attrit() {
		this.vps.attrit(this.attrition_rate);
		this.managers.attrit(this.attrition_rate);
		this.ics.attrit(this.attrition_rate);
	}

	promote() {
		this.vps.backfill(this.managers);
		this.managers.backfill(this.ics);
		this.ics.hire(this.hiring_diversity);
	}

	sponsor() {
		this.vps.sponsor(this.managers, this.tactic, this.sponsorship_rate);
		this.managers.sponsor(this.ics, this.tactic, this.sponsorship_rate);
	}

	printSummary() {
		console.log("Company: ");
		this.vps.printDiversity("VP");
		this.managers.printDiversity("Manager");
		this.ics.printDiversity("Employee");
	}

	incrementClock() {
		this.sponsor();
		this.attrit();
		this.promote();
	}

	timeToEqualVPs (){
	    var time = 0;
	    //console.log("Initial state:");
	    //this.printSummary();
	    while (this.vps.diversity()<this.hiring_diversity) {
	    	this.incrementClock();
	    	time++;

	    	//if (time % 25 == 0)
	    		//console.log("Round #"+time);
	    }
	    //console.log("Final state ("+time+" rounds):");
	    //this.printSummary();
	    return time;
	}
}

function runSimulation() {

	var size = parseInt($("#size").val());
	var diversity = parseFloat($("#diversity").val());
	var hiring_diversity = parseFloat($("#hiring_diversity").val());
	var attrition_rate = parseFloat($("#attrition_rate").val());
	var sponsorship_rate = parseFloat($("#sponsorship_rate").val());
	simulation_runs = parseFloat($("#simulation_runs").val());

	console.log(size, diversity, hiring_diversity, attrition_rate, sponsorship_rate);

	same_sum = 0;
	for (var i = 0; i < simulation_runs; i++) {
		var company_like = new Company(size,diversity,hiring_diversity,attrition_rate,sponsorship_rate,SPONSOR_LIKE);
		var time_like = company_like.timeToEqualVPs();
		same_sum += time_like;
	}
	console.log("Sponsor same: Average "+same_sum/simulation_runs+" years to equal VPs.");

	random_sum = 0;
	for (var i = 0; i < simulation_runs; i++) {
		var company_random = new Company(size,diversity,hiring_diversity,attrition_rate,sponsorship_rate,SPONSOR_RANDOM);
		var time_random = company_random.timeToEqualVPs();
		random_sum += time_random;
  }
	console.log("Sponsor at random: Average "+random_sum/simulation_runs+" years to equal VPs.");

	other_sum = 0;
	for (var i = 0; i < simulation_runs; i++) {
		var company_other = new Company(size,diversity,hiring_diversity,attrition_rate,sponsorship_rate,SPONSOR_OTHER);
		var time_other = company_other.timeToEqualVPs();
		other_sum += time_other;
	}
	console.log("Sponsor others: Average "+other_sum/simulation_runs+" years to equal VPs.");

}
