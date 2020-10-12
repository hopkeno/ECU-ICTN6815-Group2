var debug = {
	level: "warn",
};

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 820;
canvas.height = 800;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Background Earth Strike image
var strikeReady = false;
var strikeActive = false;
var strikeImage = new Image();
strikeImage.onload = function () {
	strikeReady = true;
};
strikeImage.src = "images/strike.png";

// Prep the rectangular game area
var gameArea = {
	x: 100,
	y: 75,
	width: 850,
	height: 425,
}

var score = {
	multiplier: 50,
	level: 1,
	value: 0,
	sarsDelivered: 0,
	sars: 0,
	paused: false,
	gameover: false,
	levelup: false,
}

var newGame = function () {
	score.level = 1;
	score.value = 0;
	score.sarsDelivered = 0;
	score.sars = 0;
	score.paused = false;
	score.gameover = false;
	sars.speed = 2;
	score.levelup = false;
	sarsDestroyed = 0;
	sars.x = 0;
	sars.y = 0;
	reset();
}

var cheats = {
	targetIndicators: false,
	sarsTargetIndicator: false,
	originIndicators: false,
	hud: false,
}

// Position the cannon of the Jonas Salk
var jonasReady = false;
var jonasImage = new Image();
jonasImage.onload = function () {
	jonasReady = true;
}
jonasImage.src = "images/jonas.png";

// RNA image
var rnaReady = false;
var rnaImage = new Image();
rnaImage.onload = function () {
	rnaReady = true;
};
rnaImage.src = "images/rna.png";

// SARS image
var sarsReady = false;
var sarsImage = new Image();
sarsImage.onload = function () {
	sarsReady = true;
};
sarsImage.src = "images/corona.png";

// Game objects
var jonas = {
	x: 555,
	y: 475
}

var rna = {
	speed: 256, // movement in pixels per second
	count: 5,    // number or RNA particles allowed
	targetX: null,
	targetY: null
};
var sars = {
	speed: 2, // movement in pixels per second
	count: 5,	// number of SARS Spikes on screen
	limit: 10,	// number of SARS Spikes that can hit earth
	XlaunchSites: [145,170,170,145,99],
	YlaunchSites: [200,250,300,350,400],
	XtargetSites: [700,655,645,655,700],
	YtargetSites: [170,225,285,350,400],
	pps: 0,
};
var sarsMultiplier =  Math.floor(2020 / (sars.limit+1));

var sarsDestroyed = 0;
// Handle keyboard controls
var keysDown = {};

addEventListener("keypress", function(e) {
	if (debug.level == "verbose") console.log("keypress: ", e.key);
	if (e.key == " ") {
		if (score.gameover == true) {
			newGame();
		} else {
			if (score.paused == true) {
				if (debug.level == "info") console.log("Resuming action");
				score.paused = false;
			} else {
				if (debug.level == "info") console.log("Game Paused. ", e.which);
				score.paused = true;
			}
		}
	}
	if (e.key == "t") {
		cheats.targetIndicators = !cheats.targetIndicators;
		if (debug.level == "info") console.log("cheats.targetIndicators: ", cheats.targetIndicators);
	}
	if (e.key == "T") {
		cheats.sarsTargetIndicator = !cheats.sarsTargetIndicator;
		if (debug.level == "info") console.log("cheats.sarsTargetIndicator: ", cheats.sarsTargetIndicator);
	}
	if (e.key == "o") {
		cheats.originIndicators = !cheats.originIndicators;
		if (debug.level == "info") console.log("cheats.originIndicators: ", cheats.originIndicators);
	}

	if (e.key == "s") {
		sars.speed++;
	} else if (e.key == "S") {
		if (sars.speed > 0) {
			sars.speed--;
		}
	}
	if (e.key == "h") {
		cheats.hud = !cheats.hud;
		if (debug.level == "info") console.log("cheats.hud: ", cheats.hud);
	}
	if (e.key == "?") {
		cheats.menu = !cheats.menu;
		if (debug.level == "info") console.log("cheats.menu: ", cheats.menu);
	}
}, false);

addEventListener("click", function (e) {
	if (score.levelup == true) {
		score.levelup = false;
	} else {
		if (debug.level == "info") console.log("Shot fired towards: ", e.clientX, e.clientY);
		// the - 21 is an adjustment to move the image to the middle of the crosshairs
		// otherwise the top left corner of the image is placed at the bottom right corner of the crosshair
		rna.targetX = e.clientX - 21;
		rna.targetY = e.clientY - 21;
		// keep the cursor target on the battleground
		if (rna.targetX < 100) {
			rna.targetX = 100;
		} else if (rna.targetX > 735) {
			rna.targetX = 735;
		}
		if (rna.targetY < 60) {
			rna.targetY = 60;
		} else if (rna.targetY > 475) {
			rna.targetY = jonas.y - 13;
		}
	}
}, false);

// Reset the game when the player destroys a sars
var reset = function () {
	rna.targetX = rna.x = jonas.x;
	rna.targetY = rna.y = jonas.y - 13;

	// Throw the sars somewhere on the screen randomly
	// Select a random launch site
	var sarsLaunch = Math.floor((Math.random() * sars.count));
	sars.x = sars.XlaunchSites[sarsLaunch];
	sars.y = sars.YlaunchSites[sarsLaunch];
	var sarsTarget = Math.floor((Math.random() * sars.count));
	sars.Xtarget = sars.XtargetSites[sarsTarget];
	sars.Ytarget = sars.YtargetSites[sarsTarget];
	if (debug.level == "info") {
		console.log("Spike position: location", sarsLaunch+1, " ", sars.x, ",", sars.y);
		console.log("Spike Target: location", sarsTarget+1, " ", sars.Xtarget, ",", sars.Ytarget);
		console.log("RNA position: ", rna.x, ",", rna.y);
		console.log("RNA target: ", rna.targetX, ",", rna.targetY);
		console.log("Jonas Salk position: ", jonas.x, ",", jonas.y);
	}
	if (debug.level == "verbose") console.log("Distance between SARS Spike and Earth: ", 	sarsTrajectory({x: sars.x,y: sars.y},{x: sars.Xtarget, y: sars.Ytarget}));
};

// Update game objects
var update = function (modifier) {
	if (score.paused == false && score.levelup == false) {
		rna.x = rna.targetX;
		rna.y = rna.targetY;
		sars.x += sars.speed;
		sars.pps = sars.speed/modifier;
		if (debug.level == "verbose") console.log("RNA position: ", rna.x, ",", rna.y, "; Trajectory: ", rna.targetX, ",", rna.targetY);
		if (debug.level == "verbose") console.log("SARS position: ", sars.x, ",", sars.y, "; Trajectory: ", sars.Xtarget, ",", sars.Ytarget);
		sars.y += (sars.Ytarget-sars.y)/(sars.Xtarget-sars.x);
		// Are they touching?
		if (
			rna.x <= (sars.x + 25)
			&& sars.x <= (rna.x + 25)
			&& rna.y <= (sars.y + 25)
			&& sars.y <= (rna.y + 25)
		) {
			sarsDestroyed++;
			if (sarsDestroyed % 5 == 0) {
				score.level++;
				sars.speed+=2;
				score.levelup = !score.levelup;
			}
			score.value += score.multiplier;
			if (debug.level == "info") console.log("SARS Destroyed! Current score: ", sarsDestroyed );
			reset();
		} else if (sars.x >= sars.Xtarget - 25) {
				strikeActive = true;
				score.sarsDelivered++;
				score.sars += sarsMultiplier;
				if (debug.level == "info") console.log("SARS Spike has hit the Earth! Current Spike count: ", score.sarsDelivered);
				if (score.sarsDelivered > sars.limit) {
					score.gameover = true;
					//Keep the stats the same but flash the earth
					score.sars = 2020;
					score.sarsDelivered = sars.limit + 1;
					sars.speed = 75;
				}
				reset();
		}
	}
};

// Draw everything
var render = function () {
	if (strikeReady && strikeActive) {
		ctx.drawImage(strikeImage, 0, 0);
		strikeActive = false;
	} else if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	if (jonasReady) {
		ctx.drawImage(jonasImage, jonas.x, jonas.y);
	}
	if (score.gameover) {
		ctx.font = "92px Impact";
		ctx.textAlign = "left";
		ctx.fillText("GAME OVER", 210, 325)
		ctx.font = "16px Impact";
		ctx.fillText("Press spacebar for new game", 330, 350);
	} else {
		if (score.paused) {
			ctx.font = "92px Impact";
			ctx.textAlign = "left";
			ctx.fillText("PAUSED", 275, 325);	
			ctx.font = "16px Impact";
			ctx.fillText("Press spacebar to resume", 330, 350);
		} else if (score.levelup) {
			ctx.font = "92px Impact";
			ctx.textAlign = "center";
			ctx.fillText("LEVEL " + score.level, 410, 325);
			ctx.font = "16px Impact";
			ctx.fillText("Click to begin level " + score.level, 410, 350);	
		} else if (rnaReady && sarsReady) {
			ctx.drawImage(sarsImage, sars.x, sars.y);
			ctx.drawImage(rnaImage, rna.x, rna.y);
		}
	}
	if (cheats.menu) {
		ctx.font = "14px Arial Black";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		var start = 225;
		ctx.fillText("Cheat/Shortcut Menu", 410, start);
		ctx.fillText("--------------------------------------", 410, start+=15);
		ctx.fillText("space - Pause/Resume game", 410,start+=15);
		ctx.fillText("h - Toggle HUD (Heads Up Display)", 410, start+=15);
		ctx.fillText("T - Toggle SARS Spike Target Indicator", 410, start+=15);
		ctx.fillText("t - Toggle all potential SARS Spike Target Indicators", 410, start+=15);
		ctx.fillText("o - Toggle SARS Spike Origin Indicators", 410, start+=15);
		ctx.fillText("s - Increase SARS speed", 410, start+=15);
		ctx.fillText("S - Decrease SARS speed", 410, start+=15);
		ctx.fillText("? - Toggle cheat menu", 410, start+=15);
	}

	if (cheats.hud) {
		ctx.font = "14px Arial Black";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		var distance = sarsTrajectory({x: sars.x,y: sars.y},{x: sars.Xtarget, y: sars.Ytarget});
		ctx.fillText("SARS Spike Speed: " + sars.pps.toFixed(2) + " pps", 410, 75);
		ctx.fillText("Distance to Impact: " + distance.toFixed(2) + " pixels", 410, 90);
		ctx.fillText("Time to Impact: " + (distance/sars.pps).toFixed(1) + " seconds", 410, 105);
	}

	// Target Indicators
	if ( cheats.targetIndicators == true ) {
		ctx.fillStyle = "red";
		ctx.textAlign = "center";
		ctx.font = "16px Arial Black";
		for (let index = 0; index < (sars.XtargetSites).length; index++) {
			ctx.fillText("x", (sars.XtargetSites)[index], (sars.YtargetSites)[index]+13);			
		}
	}
	if ( cheats.sarsTargetIndicator == true ) {
		ctx.fillStyle = "red";
		ctx.textAlign = "center";
		ctx.font = "16px Arial Black";
		ctx.fillText("X", sars.Xtarget, sars.Ytarget+13);			
	}

	// Origin Indicators
	if ( cheats.originIndicators == true ) {
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.font = "16px Arial Black";
		for (let index = 0; index < (sars.XlaunchSites).length; index++) {
			ctx.fillText("O", (sars.XlaunchSites)[index], (sars.YlaunchSites)[index]+13);			
		}
	}


	// Title
//	ctx.fillStyle = "red";
	var my_gradient = ctx.createLinearGradient(50, 700, 350, 700);
	my_gradient.addColorStop(0, "red");
	my_gradient.addColorStop(1, "#d0fa0d");
	ctx.fillStyle = my_gradient;

	// Title
	ctx.font = "92px Impact";
	ctx.textAlign = "left";
	ctx.fillText("BioBattle", 50, 700);

	// Text properties
	ctx.fillStyle = "white";
	ctx.font = "16px Arial Black";

	// Level Indicator
	ctx.textAlign = "left";
	ctx.fillText("Level ", 175, 725);
	ctx.fillText(score.level, 225, 725);

	// Scoreboard
	ctx.beginPath();
	ctx.textAlign = "left";
	ctx.fillText("Spikes Destroyed:", 475, 625);
	ctx.fillText("Lives saved:", 475, 650);
	ctx.strokeStyle = "white";
	ctx.lineWidth = 5;
	ctx.moveTo(475, 670);
	ctx.lineTo(720, 670);
	ctx.fillText("Spikes Delivered:", 475, 700);
	ctx.fillText("Lives lost:", 475, 725);
	ctx.textAlign = "right";
	ctx.fillStyle = "#d0fa0d";
	ctx.fillText(sarsDestroyed, 720, 625);
	ctx.fillText(score.value, 720, 650);
	ctx.fillStyle = "red";
	ctx.fillText(score.sarsDelivered, 720, 700);
	ctx.fillText(score.sars, 720, 725);
	ctx.stroke();

};

var sarsTrajectory = function(start,end) {
	var xdistance = (end.x - start.x);
	var ydistance = (end.y - start.y);
	// use pythagoras theorem to work out the magnitude of the vector
	var magnitude = Math.sqrt(xdistance * xdistance + ydistance * ydistance);
	return magnitude;
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
