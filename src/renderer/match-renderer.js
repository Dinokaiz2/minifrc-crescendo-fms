import { Competition } from "./controller.js";
import { Match } from "./match.js";

export function show() {
    // Always on bottom
}

export function hide() {
    // Stays on bottom
}

/**
 * Refreshes the display.
 */
export function update() {
    let match = Competition.match;
    if (!match) return;
    let red = match.red;
    let blue = match.blue;
    updateTimer();
    updateMatchName(match.friendlyName);
    updateTeams(...red.teams, Match.AllianceColor.RED);
    updateTeams(...blue.teams, Match.AllianceColor.BLUE);
    updateMatchPoints(red.matchPoints, Match.AllianceColor.RED);
    updateMatchPoints(blue.matchPoints, Match.AllianceColor.BLUE);
    updateAutonomous(red.reaches, red.autoCrossings, Match.AllianceColor.RED);
    updateAutonomous(blue.reaches, blue.autoCrossings, Match.AllianceColor.BLUE);
    updateOpponentDefenses(red.defenseStrengths, Match.AllianceColor.RED);
    updateOpponentDefenses(blue.defenseStrengths, Match.AllianceColor.BLUE);
    updateOpponentTower(red.totalLowGoals, red.totalHighGoals, red.opponentTowerProgress, red.capturePossible, Match.AllianceColor.RED);
    updateOpponentTower(blue.totalLowGoals, blue.totalHighGoals, blue.opponentTowerProgress, blue.capturePossible, Match.AllianceColor.BLUE);
    updateEndgame(red.endgame, Match.AllianceColor.RED);
    updateEndgame(blue.endgame, Match.AllianceColor.BLUE);
    updateRankingPoints(red.breach, red.capture, Match.AllianceColor.RED);
    updateRankingPoints(blue.breach, blue.capture, Match.AllianceColor.BLUE);
}

function updateTimer() {
    if (Competition.inMatch) {
        const MATCH_LENGTH = 150 * 1000; // milliseconds
        $("#timer #bar").width(((Competition.matchMillisElapsed / MATCH_LENGTH) * 100) + "%");
        $("#timer #time").text(Competition.friendlyMatchTime);
        if (Competition.inEndgame) $("#timer #bar").css("background-color", "yellow");
        else if (Competition.inAuto || Competition.inTeleop) $("#timer #bar").css("background-color", "green");
    } else {
        if (Competition.matchOver) {
            $("#timer #bar").css("background-color", "red");
            $("#timer #bar").width("100%");
        }
        else $("#timer #bar").width("0%");
        $("#timer #time").text("0");
    }
}

function updateMatchName(name) {
    $("#match-view #match-name").text(name);
}

function updateTeams(team1, team2, team3, color) {
    let teams = $(`#match-view #match-panel #teams ${getColorClass(color)}`).children();
    [team1, team2, team3].forEach((e, i) => teams.eq(i).text(e.number));
}

function updateMatchPoints(points, color) {
    $(`#match-view #match-panel #score-box ${getColorClass(color)}`).text(points);
}

function updateAutonomous(reaches, crossings, color) {
    let indicators = $(`#match-view ${getColorClass(color)}.indicator-panel .auto .indicators`).children();
    indicators.each((i, e) => {
        i < reaches + crossings ? $(e).addClass("lit") : $(e).removeClass("lit");
        i < crossings ? $(e).children().show() : $(e).children().hide();
    });
}

const STRENGTH_TO_WIDTH = { 0: "100%", 1: "50%", 2: "5%" }

function updateOpponentDefenses(defenseStrengths, color) {
    $(`#match-view ${getOpponentColorClass(color)} .defense .bar`).each((i, e) => $(e).css("width", STRENGTH_TO_WIDTH[defenseStrengths[i]]));
}

function updateOpponentTower(low, high, progress, capturePossible, color) {
    $(`#match-view ${getOpponentColorClass(color)}.tower-panel .low.goal`).text(low);
    $(`#match-view ${getOpponentColorClass(color)}.tower-panel .high.goal`).text(high);
    $(`#match-view ${getOpponentColorClass(color)}.tower-panel .capture-progress .bar`).height(progress + "%");
    let captureBar = $(`#match-view ${getOpponentColorClass(color)}.tower-panel .capture-progress .bar`);
    if (capturePossible) captureBar.addClass("flashing");
    else captureBar.removeClass("flashing");
}

function updateEndgame(endgame, color) {
    $(`#match-view ${getOpponentColorClass(color)}.tower-panel .scale`).each((i, e) => {
        if (endgame[i] == Match.PointValues.SCALE) $(e).show();
        else $(e).hide();
    });
    $(`#match-view ${getOpponentColorClass(color)}.tower-panel .challenge`).each((i, e) => {
        if (endgame[i] == Match.PointValues.CHALLENGE) $(e).show();
        else $(e).hide();
    });
}

function updateRankingPoints(breach, capture, color) {
    if (breach) $(`#match-view ${getColorClass(color)} .breach`).addClass("lit");
    else $(`#match-view ${getColorClass(color)} .breach`).removeClass("lit");
    if (capture) $(`#match-view ${getColorClass(color)} .capture`).addClass("lit");
    else $(`#match-view ${getColorClass(color)} .capture`).removeClass("lit");
}

function getColorClass(color) {
    if (color == Match.AllianceColor.RED) return ".red";
    else if (color == Match.AllianceColor.BLUE) return ".blue";
    else throw "Color must be a Match.AllianceColor";
}

function getOpponentColorClass(color) {
    if (color == Match.AllianceColor.RED) return ".blue";
    else if (color == Match.AllianceColor.BLUE) return ".red";
    else throw "Color must be a Match.AllianceColor";
}

// Set up video stream
console.log("Media devices:", navigator.mediaDevices.enumerateDevices());
let video = document.querySelector("#stream video");
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { width: { exact: 1920 }, height: { exact: 1080 } } }).then(stream => {
        video.srcObject = stream;
    }).catch((e) => console.log("Could not find camera.", e));
}
