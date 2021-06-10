import { Competition } from "./controller.js";
import { FmsFirmware } from "./fms-firmware.js"
import { Match } from "./match.js";

/**
 * Refreshes the display.
 */
function update() {
    Competition.update(); // TODO: Competition can update at a different rate
    updateTimer();
    updateRedTask();
    updateBlueTask();
    updatePhase(FmsFirmware.red.activatedPhase, Match.AllianceColor.RED);
    updatePhase(FmsFirmware.blue.activatedPhase, Match.AllianceColor.BLUE);
}

function updateTimer() {
    const MATCH_LENGTH = 150 * 1000; // milliseconds
    $("#timer #bar").width(((Competition.matchMillisElapsed / MATCH_LENGTH) * 100) + "%");
    $("#timer #time").text(Competition.friendlyMatchTime);
    // TODO: Color
}

function updateRedTask() { // TODO: Refactor to updateTask(color)
    if (FmsFirmware.red.powerCellsInPhase < 9) {
        updateRedPowerCell(9 - FmsFirmware.red.powerCellsInPhase);
    }
}

function updateBlueTask() {
    if (FmsFirmware.blue.powerCellsInPhase < 9) {
        updateBluePowerCell(9 - FmsFirmware.blue.powerCellsInPhase);
    }
}

let prevRedPowerCellsRemaining = -1;
function updateRedPowerCell(cellsRemaining) {
    if (prevRedPowerCellsRemaining != cellsRemaining) {
        prevRedPowerCellsRemaining = cellsRemaining;
        $(".red.task-panel .power-cell circle").stop(true);
        $(".red.task-panel .power-cell circle").animate({ "stroke-dashoffset": cellsRemaining * (101 / 9), queue: false}, 500);
        $(".red.task-panel .power-cell .capacity").text(cellsRemaining);
    }
}

let prevBluePowerCellsRemaining = -1;
function updateBluePowerCell(cellsRemaining) {
    if (prevBluePowerCellsRemaining != cellsRemaining) {
        prevBluePowerCellsRemaining = cellsRemaining;
        $(".blue.task-panel .power-cell circle").stop(true);
        $(".blue.task-panel .power-cell circle").animate({ "stroke-dashoffset": cellsRemaining * (101 / 9), queue: false}, 500);
        $(".blue.task-panel .power-cell .capacity").text(cellsRemaining);
    }
}

function updatePhase(phase, color) {

    function setIndicators(indicators, on1, on2, on3) {
        [on1, on2, on3].forEach((e, i) => {
            e ? indicators.eq(i).addClass("lit") : indicators.eq(i).removeClass("lit");
        });
    }

    let indicators = $((color == Match.AllianceColor.RED ? ".red" : ".blue") + ".rp-panel .phase .indicators").children();
    
    if (phase == Match.Phase.NONE) {
        setIndicators(indicators, false, false, false);
    } else if (phase == Match.Phase.PHASE_1) {
        setIndicators(indicators, true, false, false);
    } else if (phase == Match.Phase.PHASE_2) {
        setIndicators(indicators, true, true, false);
    } else if (phase == Match.Phase.PHASE_3) {
        setIndicators(indicators, true, true, true);
    }
}

function fadeInResult() {
    $("#results-view").addClass("fade-in");
}

function fadeOutResult() {
    $("#results-view").removeClass("fade-in");
}

function setUpStream() {
    console.log("Media devices:", navigator.mediaDevices.enumerateDevices());
    let video = document.querySelector("#stream video");
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            video.srcObject = stream;
        }).catch((e) => console.log("Could not find camera.", e));
    }
}

// Refresh the display 50 times per second
// TODO: make sure this doesn't get called more than once
$(() => setInterval(update, 20));
$(setUpStream);
// fadeInResult();
Competition.startMatch();
console.log("Renderer started.");