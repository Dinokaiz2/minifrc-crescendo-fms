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
    updateTimer();
    if (!Competition.postMatch) { // Don't update live scores after match before showing results
        [match.red, match.blue].forEach(alliance =>
            updateMatchPanel(
                match.friendlyName, alliance.teamNumbers, alliance.number, match.isPlayoff(),
                alliance.matchPoints, alliance.mobility, alliance.autoCharge,
                alliance.autoNodes, [alliance.totalLowNodes, alliance.totalMidNodes, alliance.totalHighNodes],
                alliance.links, alliance.sustainabilityThreshold, alliance.coopertition, alliance.endgame, alliance.color
            )
        );
    }
}

// Separated to allow rendering match panel in control window
export function updateMatchPanel(
    matchName, teams, number, isPlayoff,
    matchPoints, mobility, autoCharge, autoNodes,
    nodeTotals, links, linkThreshold, coopertition, endgame, color
) {
    updateMatchName(matchName);
    updateTeams(...teams, number, isPlayoff, color);
    updateMatchPoints(matchPoints, color);
    updateAutonomous(mobility, autoCharge, autoNodes, color);
    updateGrid(nodeTotals[0], nodeTotals[1], nodeTotals[2], links, linkThreshold, coopertition, color);
    updateEndgame(endgame, color);
}

export function startVideo() {
    console.log("Media devices:", navigator.mediaDevices.enumerateDevices());
    let video = document.querySelector("#stream video");
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { width: { exact: 1920 }, height: { exact: 1080 } } }).then(stream => {
            video.srcObject = stream;
        }).catch((e) => console.log("Could not find camera.", e));
    }
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
    [team1, team2, team3].forEach((teamNum, i) => teams.eq(i).text(teamNum));
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