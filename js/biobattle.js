// BioBattle - an ECU ICTN6815 Group project
// https://github.com/hopkeno/ECU-ICTN6815-Group2.git

var debug = {
	level: "info",
};

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 820;
canvas.height = 760;
document.body.appendChild(canvas);

// Title Screen
var titleReady = false;
var firstLoad = false;
var titleImage = new Image();
titleImage.onload = function () {
	titleReady = true;
	firstLoad = true;
	document.body.style.backgroundColor = "black";
}
titleImage.src = "images/background.png";

// Audio Clips
var audioTitle = new Audio("audio/title.mp3");
var audioTitleReady = true;
var audioRNA = new Audio("audio/fire.mp3");
var audioHIT = new Audio("audio/hit.mp3");

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
	sars.speed = 1;
	score.levelup = false;
	sarsDestroyed = 0;
	sars.x = sars.y = 0;
	sars.Xtarget = sars.Ytarget = 0;
	reset();
}

var cheats = {
	targetIndicators: false,
	sarsTargetIndicator: false,
	originIndicators: false,
	sarsLaunchIndicator: false,
	hud: false,
	nextLaunch: false,
	mute: false,
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
	speed: 10, // movement in pixels per interval
	count: 5,  // number or RNA particles allowed
	pps: 0,	   // pixels per second speed of RNA
	Xtarget: null,
	Ytarget: null
};
var sars = {
	speed: 1, // movement in pixels per interval
	count: 5,	// number of SARS Spikes on screen
	limit: 10,	// number of SARS Spikes that can hit earth
	XlaunchSites: [145,170,170,145,99],
	YlaunchSites: [200,250,300,350,400],
	XtargetSites: [700,655,645,655,700],
	YtargetSites: [170,225,285,350,400],
	pps: 0,
};
var sarsMultiplier =  Math.ceil(2020 / (sars.limit+1));

var sarsDestroyed = 0;
// Handle keyboard controls
var keysDown = {};

addEventListener("keypress", function(e) {
	if (debug.level == "verbose") console.log("keypress: ", e.key);
	if (e.key == " ") {
		if (score.gameover == true || firstLoad) {
			newGame();
		} else {
			score.paused = !score.paused;
			if (debug.level == "info") console.log("Game Paused: ", score.paused);
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
	if (e.key == "O") {
		cheats.sarsLaunchIndicator = !cheats.sarsLaunchIndicator;
		if (debug.level == "info") console.log("cheats.sarsLaunchIndicator: ", cheats.sarsLaunchIndicator);
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
	if (e.key == "1" || e.key == "2" || e.key == "3" || e.key == "4" || e.key == "5") {
		cheats.nextLaunch = e.key;
		console.log("Next SARS Launch Location set to :" + cheats.nextLaunch);
	}
	if (e.key == "6" || e.key == "7" || e.key == "8" || e.key == "9" || e.key == "0") {
		cheats.nextTarget = e.key;
		cheats.nextTarget = (Math.abs(cheats.nextTarget - 5));
		console.log("Next SARS Target Location set to :" + cheats.nextTarget);
	}
	if (e.key ==  "q") {
		console.log ("Quitting game and starting over");
		if (score.paused) {
			score.paused = !score.paused;
			score.gameover = !score.gameover;
		}
	}
	if (e.key == "m") {
		cheats.mute = !cheats.mute;
		if (debug.level == "info") console.log("cheats.mute: ", cheats.mute);
	}
}, false);

addEventListener("mousemove", function (e) {
	// just track mouse movements
	if (cheats.hud) {
		rna.Xcrosshair = e.clientX - 21;
		rna.Ycrosshair = e.clientY - 21;
	}
}, false);

addEventListener("contextmenu", function (e) {
	e.preventDefault();
	if (!firstLoad) {
		score.paused = !score.paused;
		if (debug.level == "info") console.log("Game Paused: ", score.paused);
	}
}, false);

addEventListener("click", function (e) {
	if (firstLoad) {
		firstLoad = !firstLoad;
		audioTitleReady = !audioTitleReady;
		reset();
	} else {
		if (score.levelup) {
			score.levelup = !score.levelup;
		} else {
			if (debug.level == "info") console.log("Shot fired towards: ", e.clientX, e.clientY);
			// the - 21 is an adjustment to move the image to the middle of the crosshairs
			// otherwise the top left corner of the image is placed at the bottom right corner of the crosshair
			if (!cheats.mute) {audioRNA.play() };
			rna.Xtarget = e.clientX - 21;
			rna.Ytarget = e.clientY - 21;
			// keep the cursor target on the battleground
			if (rna.Xtarget < 100) {
				rna.Xtarget = 100;
			} else if (rna.Xtarget > 735) {
				rna.Xtarget = 735;
			}
			if (rna.Ytarget < 60) {
				rna.Ytarget = 60;
			} else if (rna.Ytarget > 475) {
				rna.Ytarget = jonas.y - 13;
			}
		}
	}
}, false);

// Reset the game when the player destroys a sars
var reset = function () {
	rna.Xtarget = null;
	rna.x = jonas.x;
	rna.Ytarget = null;
	rna.y = jonas.y - 13;

	// Select a random launch site
	var sarsLaunch = Math.floor((Math.random() * sars.count));
	// random...  unless, that is, we have a cheat telling us where to launch from 
	if (cheats.nextLaunch) {
		sarsLaunch = sars.launchPosition = cheats.nextLaunch-1;
		cheats.nextLaunch = false;
	} else {
		sars.launchPosition = sarsLaunch;
	}
	sars.x = sars.XlaunchSites[sarsLaunch];
	sars.y = sars.YlaunchSites[sarsLaunch];
	// Select a random target site
	var sarsTarget = Math.floor((Math.random() * sars.count));
	// random...  unless, that is, we have a cheat telling us where to target 
	if (cheats.nextTarget) {
		sarsTarget = cheats.nextTarget-1;
		cheats.nextTarget = false;
	}
	sars.Xtarget = sars.XtargetSites[sarsTarget];
	sars.Ytarget = sars.YtargetSites[sarsTarget];
	if (debug.level == "info") {
		console.log("Spike position: location", sarsLaunch+1, " ", sars.x, ",", sars.y);
		console.log("Spike Target: location", sarsTarget+1, " ", sars.Xtarget, ",", sars.Ytarget);
		console.log("RNA position: ", rna.x, ",", rna.y);
		console.log("RNA target: ", rna.Xtarget, ",", rna.Ytarget);
		console.log("Jonas Salk position: ", jonas.x, ",", jonas.y);
	}
	if (debug.level == "verbose") console.log("Distance between SARS Spike and Earth: ", 	trajectory({x: sars.x,y: sars.y},{x: sars.Xtarget, y: sars.Ytarget}));
};

// Update game objects
var update = function (modifier) {
	if (score.paused == false && score.levelup == false) {
		// rna movements
		var fireShots = true;  //set to false for click based, true for shooting action

		// click based targeting
		if (!fireShots) {
			rna.x = rna.Xtarget;
			rna.y = rna.Ytarget;
		}

		// shot based firing
		if (fireShots && rna.Xtarget && rna.Ytarget) {
			rna.y -= rna.speed;	//move vertically at our existing speed
			rna.x -= (rna.Xtarget-rna.x)/(rna.Ytarget-rna.y) * rna.speed;
			rna.pps = rna.speed/modifier;
			// reload the Jonas Salk cannon when the RNA leaves the battleground
			if (rna.x < 100) {
				rna.Xtarget = null;
				rna.x = jonas.x;
				rna.Ytarget = null;
				rna.y = jonas.y - 13;
			} else if (rna.y < 60) {
				rna.Xtarget = null;
				rna.x = jonas.x;
				rna.Ytarget = null;
				rna.y = jonas.y - 13;
			}
		} else {
			// distance is to crosshairs
		}
		// sars movements
		sars.x += sars.speed;
		sars.pps = sars.speed/modifier;
		if (debug.level == "verbose") console.log("RNA position: ", rna.x, ",", rna.y, "; Trajectory: ", rna.Xtarget, ",", rna.Ytarget);
		if (debug.level == "verbose") console.log("SARS position: ", sars.x, ",", sars.y, "; Trajectory: ", sars.Xtarget, ",", sars.Ytarget);
		sars.y += (sars.Ytarget-sars.y)/(sars.Xtarget-sars.x) * sars.speed;
		// Are they touching?
		if (
			rna.x <= (sars.x + 25)
			&& sars.x <= (rna.x + 25)
			&& rna.y <= (sars.y + 25)
			&& sars.y <= (rna.y + 25)
		) {
			if (!cheats.mute) {audioHIT.play() };
			sarsDestroyed++;
			if (sarsDestroyed % 2 == 0) {
				sars.speed ++;
			}
			if (sarsDestroyed % 5 == 0) {
				score.level++;
				sars.speed = score.level + 3;
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
					sars.speed = 50;
				}
				reset();
		}
	}
};

// Draw everything
var render = function () {
	if (firstLoad) {
		if (titleReady && audioTitleReady) {
			ctx.drawImage(titleImage, 0,0);
			//document.body.style.backgroundColor = initial;
			if (!cheats.mute) {audioTitle.play() } else { audioTitle.pause() };
			// Game Logo 
			var title_gradient = ctx.createLinearGradient(235, 325, 535, 325);
			title_gradient.addColorStop(0, "red");
			title_gradient.addColorStop(1, "#d0fa0d");
			ctx.fillStyle = title_gradient;
			ctx.font = "92px Impact";
			ctx.textAlign = "left";
			ctx.fillText("BioBattle", 235, 330)
			ctx.font = "16px Impact";
			ctx.fillText("Click for new game", 335, 355);


		}
	} else if (strikeReady && strikeActive) {
		ctx.drawImage(strikeImage, 0, 0);
		strikeActive = false;
	} else if (bgReady) {
		audioTitle.pause();
		audioTitleReady = false;
		ctx.drawImage(bgImage, 0, 0);
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
				ctx.textAlign = "center";
				ctx.fillText("PAUSED", 410, 325);	
				ctx.font = "16px Impact";
				ctx.fillText("Right-click or press spacebar to resume", 410, 350);
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
			ctx.fillText("space/right-click - Pause/Resume game", 410,start+=15);
			ctx.fillText("q - Quit game (must be paused first)", 410,start+=15);
			ctx.fillText("m - Toggle sound effects", 410, start+=15);
			ctx.fillText("h - Toggle HUD (Heads Up Display)", 410, start+=15);
			ctx.fillText("T - Toggle SARS Spike Target Indicator", 410, start+=15);
			ctx.fillText("t - Toggle all potential SARS Spike Target Indicators", 410, start+=15);
			ctx.fillText("O - Toggle SARS Spike Launch Origin Indicator", 410, start+=15);
			ctx.fillText("o - Toggle all SARS Spike Origin Indicators", 410, start+=15);
			ctx.fillText("s - Increase SARS speed", 410, start+=15);
			ctx.fillText("S - Decrease SARS speed", 410, start+=15);
			ctx.fillText("1-5 - Press 1 through 5 to set next SARS launch position", 410, start+=15);
			ctx.fillText("6-0 - Press 6 through 0 to set next SARS target position", 410, start+=15);
			ctx.fillText("? - Toggle cheat menu", 410, start+=15);
		}

		if (cheats.hud) {
			ctx.font = "14px Arial Black";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			var sarsDistance = trajectory({x: sars.x,y: sars.y},{x: sars.Xtarget, y: sars.Ytarget});
			var rnaDistance = trajectory({x: rna.x,y: rna.y},{x: rna.Xtarget, y: rna.Ytarget});
			var sarsHudStart = rnaHudStart = 75;
			ctx.fillText("SARS Spike Speed: " + sars.pps.toFixed(2) + " pps", 230, sarsHudStart);
			ctx.fillText("SARS Distance to Target: " + sarsDistance.toFixed(2) + " pixels", 230, sarsHudStart+=15);
			ctx.fillText("SARS Time to Impact: " + (sarsDistance/sars.pps).toFixed(1) + " seconds", 230, sarsHudStart+=15);
			ctx.fillText("RNA Speed: " + rna.pps.toFixed(2) + " pps", 610, rnaHudStart);
			ctx.fillText("RNA Distance to Target: " + rnaDistance.toFixed(2) + " pixels", 610, rnaHudStart+=15);
			ctx.fillText("RNA Time to Target: " + (rnaDistance/rna.pps).toFixed(1) + " seconds", 610, rnaHudStart+=15);
			ctx.textAlign = "left";
			ctx.fillText(rna.Xcrosshair + "," + rna.Ycrosshair, rna.Xcrosshair + 21, rna.Ycrosshair);
			ctx.fillText(Math.floor(rna.x) + "," + Math.floor(rna.y), rna.x + 21, rna.y);
			ctx.fillStyle = "red";
			ctx.fillText("S", sars.x, sars.y);
			ctx.fillText("X", sars.Xtarget, sars.Ytarget);
			ctx.beginPath();
			ctx.strokeStyle = "green";
			ctx.lineWidth = 2;
			ctx.moveTo(jonas.x+13, jonas.y);
			ctx.lineTo(rna.Xcrosshair+13, rna.Ycrosshair+18 );
			ctx.stroke();
			ctx.beginPath();
			ctx.strokeStyle = "red";
			ctx.lineWidth = 2;
			ctx.moveTo(sars.x, sars.y);
			ctx.lineTo(sars.Xtarget, sars.Ytarget);
			ctx.stroke();
			ctx.beginPath();

		
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
				ctx.fillText("o", (sars.XlaunchSites)[index], (sars.YlaunchSites)[index]+13);			
			}
		}
		if ( cheats.sarsLaunchIndicator == true ) {
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.font = "16px Arial Black";
			ctx.fillText("O", (sars.XlaunchSites)[sars.launchPosition], (sars.YlaunchSites)[sars.launchPosition]+13);			
		}


		// Game Logo 
		var my_gradient = ctx.createLinearGradient(50, 700, 350, 700);
		my_gradient.addColorStop(0, "red");
		my_gradient.addColorStop(1, "#d0fa0d");
		ctx.fillStyle = my_gradient;
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
	}
};

var trajectory = function(start,end) {
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
