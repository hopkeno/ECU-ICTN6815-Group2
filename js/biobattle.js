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
}

var newGame = function () {
	score.level = 1;
	score.value = 0;
	score.sarsDelivered = 0;
	score.sars = 0;
	score.paused = false;
	score.gameover = false;
	sars.speed = 2;
	sarsDestroyed = 0;
	sars.x = 0;
	sars.y = 0;
	reset();
}

var cheats = {
	targetIndicator: false,
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
	XtargetSites: [645,645,645,645,645],
	YtargetSites: [200,250,300,350,400],
};
var sarsMultiplier =  Math.floor(2020 / (sars.limit+1));

var sarsDestroyed = 0;
// Handle keyboard controls
var keysDown = {};

addEventListener("keypress", function(e) {
	console.log("keypress: ", e.key);
	if (e.key == " ") {
		if (score.gameover == true) {
			newGame();
		} else {
			if (score.paused == true) {
				console.log("Resuming action");
				score.paused = false;
			} else {
				console.log("Game Paused. ", e.which);
				score.paused = true;
			}
		}
	}
	if (e.key == "t") {
		cheats.targetIndicator = !cheats.targetIndicator;
		console.log("cheats.targetIndicator: ", cheats.targetIndicator);
	}
	if (e.key == "s") {
		sars.speed++;
	} else if (e.key == "S") {
		if (sars.speed > 0) {
			sars.speed--;
		}
	}
}, false);

addEventListener("click", function (e) {
	console.log("Shot fired towards: ", e.clientX, e.clientY);
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
	console.log("Spike position: location", sarsLaunch+1, " ", sars.x, ",", sars.y);
	console.log("Spike Target: location", sarsTarget+1, " ", sars.Xtarget, ",", sars.Ytarget);
	console.log("RNA position: ", rna.x, ",", rna.y);
	console.log("RNA target: ", rna.targetX, ",", rna.targetY);
	console.log("Jonas Salk position: ", jonas.x, ",", jonas.y);
};

// Update game objects
var update = function (modifier) {
	if (score.paused == false) {
		rna.x = rna.targetX;
		rna.y = rna.targetY;
		sars.x += sars.speed;
		
	//	console.log("RNA position: ", rna.x, ",", rna.y, "; Trajectory: ", rna.targetX, ",", rna.targetY);

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
				levelUp(score.level);
			}
			score.value += score.multiplier;
			console.log("SARS Destroyed! Current score: ", sarsDestroyed );
			reset();
		} else if (sars.x >= 645) {
				strikeActive = true;
				score.sarsDelivered++;
				score.sars += sarsMultiplier;
				console.log("SARS Spike has hit the Earth! Current Spike count: ", score.sarsDelivered);
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
const delay = ms => new Promise(res => setTimeout(res, ms));
var levelUp = async function (level) {
	ctx.font = "92px Impact";
	ctx.textAlign = "left";
	ctx.fillText("LEVEL " + level, 210, 325);
	await delay(3000);
}
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
		} else if (rnaReady && sarsReady) {
			ctx.drawImage(rnaImage, rna.x, rna.y);
			ctx.drawImage(sarsImage, sars.x, sars.y);
		}
	}

	// Target Indicator
	if ( cheats.targetIndicator == true ) {
		ctx.fillStyle = "red";
		ctx.textAlign = "center";
		ctx.font = "16px Arial Black";
		ctx.fillText("X", sars.Xtarget, sars.Ytarget+13);
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
