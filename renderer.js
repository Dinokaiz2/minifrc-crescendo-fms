import { Competition } from "./controller.js";

/**
 * Refreshes the display.
 */
function update() {
    updateTimer();
}

function updateTimer() {
    const MATCH_LENGTH = 150 * 1000; // milliseconds
    $(".timer-bar").width(((Competition.matchMillisElapsed / MATCH_LENGTH) * 100) + "%");
    console.log(Competition.matchMillisElapsed);
    //console.log(((Competition.matchMillisElapsed / MATCH_LENGTH) * 100).toFixed(1) + "%")
}

// Refresh the display 50 times per second
// TODO: make sure this doesn't get called more than once
setInterval(update, 20);
Competition.startMatch();
console.log("Renderer started.");