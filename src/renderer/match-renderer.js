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
    updateTeams(...red.teams, red.number, match.isPlayoff(), Match.AllianceColor.RED);
    updateTeams(...blue.teams, blue.number, match.isPlayoff(), Match.AllianceColor.BLUE);
    updateMatchPoints(red.matchPoints, Match.AllianceColor.RED);
    updateMatchPoints(blue.matchPoints, Match.AllianceColor.BLUE);
    updateAutonomous(red.mobility, red.autoCharge, red.totalAutoNodes, Match.AllianceColor.RED);
    updateAutonomous(blue.mobility, blue.autoCharge, blue.totalAutoNodes, Match.AllianceColor.BLUE);
    updateGrid(red.totalLowNodes, red.totalMidNodes, red.totalHighNodes, red.links, red.sustainabilityThreshold, red.coopertition, Match.AllianceColor.RED);
    updateGrid(blue.totalLowNodes, blue.totalMidNodes, blue.totalHighNodes, blue.links, blue.sustainabilityThreshold, blue.coopertition, Match.AllianceColor.BLUE);
    updateEndgame(red.endgame, Match.AllianceColor.RED);
    updateEndgame(blue.endgame, Match.AllianceColor.BLUE);
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

function updateTeams(team1, team2, team3, number, isPlayoff, color) {
    let teams = $(`#match-view #match-panel #teams ${getColorClass(color)}`).children();
    [team1, team2, team3].forEach((e, i) => teams.eq(i).text(e.number));
    let allianceNumElement = $(`#match-view #match-panel #teams ${getColorClass(color)}.alliance-number`);
    if (isPlayoff) {
        allianceNumElement.text(number);
        allianceNumElement.show();
    } else {
        allianceNumElement.hide();
    }
}

function updateMatchPoints(points, color) {
    $(`#match-view #match-panel #score-box ${getColorClass(color)}`).text(points);
}

function updateAutonomous(mobility, charge, autoNodes, color) {
    let indicators = $(`#match-view ${getColorClass(color)}.auto-panel .mobility`);
    indicators.each((i, e) => {
        if (i < mobility) {
            $(e).addClass("lit")
            $(e).children().show()
        } else {
           $(e).removeClass("lit");
           $(e).children().hide();  
        }
    });

    $(`#match-view ${getColorClass(color)}.auto-panel .cube`).text(autoNodes);

    let autoChargeIcon = $(`#match-view ${getColorClass(color)}.auto-panel .charge`);
    autoChargeIcon.removeClass("none dock engage");
    if (charge == 0) autoChargeIcon.addClass("none");
    else if (charge == Match.PointValues.AUTO_DOCK) autoChargeIcon.addClass("dock")
    else if (charge == Match.PointValues.AUTO_ENGAGE) autoChargeIcon.addClass("engage")
}

function updateGrid(lowNodes, midNodes, highNodes, links, threshold, coopertition, color) {
    let nodeCounts = [highNodes, midNodes, lowNodes];
    $(`#match-view ${getColorClass(color)}.grid-panel .cube`).each((i, e) => {
        $(e).text(nodeCounts[i]);
    });
    $(`#match-view ${getColorClass(color)}.grid-panel .link-count`).text(`${links}/${threshold}`)
    if (coopertition) $(`#match-view ${getColorClass(color)}.grid-panel .coop-icon`).addClass("lit");
    else $(`#match-view ${getColorClass(color)}.grid-panel .coop-icon`).removeClass("lit");
    
}

function updateEndgame(endgame, color) {
    $(`#match-view ${getColorClass(color)}.endgame-panel .robot.park`).each((i, e) => {
        if (endgame[i] == Match.PointValues.PARK) $(e).show();
        else $(e).hide();
    });
    $(`#match-view ${getColorClass(color)}.endgame-panel .robot.dock`).each((i, e) => {
        if (endgame[i] == Match.PointValues.DOCK || endgame[i] == Match.PointValues.ENGAGE) $(e).show();
        else $(e).hide();
    });

    let chargeIcon = $(`#match-view ${getColorClass(color)}.endgame-panel .charge-station .icon`);
    chargeIcon.removeClass("none dock engage");
    if (endgame.includes(Match.PointValues.ENGAGE)) chargeIcon.addClass("engage");
    else if (endgame.includes(Match.PointValues.DOCK)) chargeIcon.addClass("dock");
    else chargeIcon.addClass("none");
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
