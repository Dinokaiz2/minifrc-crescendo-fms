import { Competition } from "./controller.js";

/**
 * Refreshes the display.
 */
function update() {
    updateTimer();
}

function updateTimer() {
    const MATCH_LENGTH = 150 * 1000; // milliseconds
    $("#timer-bar").width(((Competition.matchMillisElapsed / MATCH_LENGTH) * 100) + "%");
    $("#timer-time").text(Competition.friendlyMatchTime);
    // TODO: Color
}

function fadeInResult() {
    $("#result-bg").addClass("fade-in");
}

function fadeOutResult() {
    $("#result-bg").removeClass("fade-in");
}

// Refresh the display 50 times per second
// TODO: make sure this doesn't get called more than once
setInterval(update, 20);
Competition.startMatch();
console.log("Renderer started.");