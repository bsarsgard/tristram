// Declare game object
var Game = {
// game variables
name: "",
speed: 10,
gold: 0,
day: 0,
dayPart: 0,
ticks: 0,
heroes: [],
staff: [],
cheevos: [],

// collections
classes: [{
	id: 0,
	name: "Peasant",
},{
	id: 1,
	name: "Warrior",
},{
	id: 2,
	name: "Thief",
},{
	id: 3,
	name: "Mage",
}],
dayParts: [{
	id: 0,
	name: "Morning",
	night: false,
},{
	id: 1,
  name: "Afternoon",
	night: false,
},{
	id: 2,
  name: "Evening",
	night: true,
},{
	id: 3,
  name: "Late Night",
	night: true,
}],
awards: [{
	id: 0,
	name: "Heroes welcome",
	desc: "Get 1 viewer",
	check: function() {
		return Game.heroes.length > 0;
	},
}],

// serialization
save: function() {
	$.cookie('tristram', {
		name: this.name,
    heroes: this.heroes,
	}, { expires: 365 });
},
load: function() {
	var cookie = $.cookie('tristram');
	if (cookie !== undefined) {
		this.name = cookie.name;
		this.heroes = cookie.heroes;
	}
},
reset: function() {
	Game.name = "Shop #" + Math.floor(Math.random() * 99 + 1);
  Game.heroes = [];
	Game.refreshHeroes();
	Game.save();
},

// game methods

// display
refreshHeroes: function() {
  this.updateHeroes();
},
updateHeroes: function() {
},
updateStats: function() {
	$(".stat-name").text(this.name);
},
updateProgress: function() {
	$(".stat-progress").css('width', this.ticks + '%');
},
updateCheevos: function() {
},

// the big loop
tick: function() {
	Game.ticks += Game.speed;
	if (Game.ticks > 100) {
		Game.ticks = 0;
		if (++Game.dayPart >= Game.dayParts.length) {
			// advance day
			Game.dayPart = 0;
			Game.refreshHeroes();
		}

		// save to cookie
		Game.save();

		// update screen
		Game.updateStats();
		Game.updateHeroes();
	}
	// check cheevos
	var iAwards = Game.awards.length;
	while (iAwards--) {
		if (Game.cheevos.indexOf(iAwards) == -1) {
			var award = Game.awards[iAwards];
			if (award.check()) {
        alert('award');
			}
		}
	}
	Game.updateCheevos();
	Game.updateProgress();
	setTimeout(Game.tick, 1000);
},
};

// Load
$(function() {
	$.cookie.json = true;
	if ($.cookie('tristram') !== undefined) {
		Game.load();
	} else {
		Game.reset();
	}
	// game reset
	$(".button-reset").click(function(evt) {
		if (confirm("This will delete all progress! Are you sure?")) {
			evt.preventDefault();
			Game.reset();
		}
	});
	// rename
	$(".stat-name").click(function(evt) {
		var name = prompt("Rename Channel?", Game.name);
		if (name != '' && name !== null) {
			Game.name = name;
			Game.updateStats();
		}
	});
	// speed controls
	$(".button-speed-pause").click(function(evt) {
		Game.speed = 0;
		$(".button-speed-pause").removeClass("btn-default").addClass("btn-primary");
		$(".button-speed-slow").removeClass("btn-primary").addClass("btn-default");
		$(".button-speed-normal").removeClass("btn-primary").addClass("btn-default");
		$(".button-speed-fast").removeClass("btn-primary").addClass("btn-default");
	});
	$(".button-speed-slow").click(function(evt) {
		Game.speed = 5;
		$(".button-speed-pause").removeClass("btn-primary").addClass("btn-default");
		$(".button-speed-slow").removeClass("btn-default").addClass("btn-primary");
		$(".button-speed-normal").removeClass("btn-primary").addClass("btn-default");
		$(".button-speed-fast").removeClass("btn-primary").addClass("btn-default");
	});
	$(".button-speed-normal").click(function(evt) {
		Game.speed = 10;
		$(".button-speed-pause").removeClass("btn-primary").addClass("btn-default");
		$(".button-speed-slow").removeClass("btn-primary").addClass("btn-default");
		$(".button-speed-normal").removeClass("btn-default").addClass("btn-primary");
		$(".button-speed-fast").removeClass("btn-primary").addClass("btn-default");
	});
	$(".button-speed-fast").click(function(evt) {
		Game.speed = 20;
		$(".button-speed-pause").removeClass("btn-primary").addClass("btn-default");
		$(".button-speed-slow").removeClass("btn-primary").addClass("btn-default");
		$(".button-speed-normal").removeClass("btn-primary").addClass("btn-default");
		$(".button-speed-fast").removeClass("btn-default").addClass("btn-primary");
	});

	// initiate game loop
	Game.tick();

	// initialize display
	Game.updateStats();
	Game.updateHeroes();
});
