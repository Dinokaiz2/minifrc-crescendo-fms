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
    if (!Competition.match) return;
    updateTimer();
    updateMatchName(Competition.match.friendlyName);
    updateTeams(...Competition.match.red.teams, Match.AllianceColor.RED);
    updateTeams(...Competition.match.blue.teams, Match.AllianceColor.BLUE);
    updateMatchPoints(Competition.match.red.matchPoints, Match.AllianceColor.RED);
    updateMatchPoints(Competition.match.blue.matchPoints, Match.AllianceColor.BLUE);
    updateAutonomous(Competition.match.red.initiationLine, Match.AllianceColor.RED);
    updateAutonomous(Competition.match.blue.initiationLine, Match.AllianceColor.BLUE);
    updateEndgame(Competition.match.red.parks, Competition.match.red.hangs, Competition.match.red.level, Match.AllianceColor.RED);
    updateEndgame(Competition.match.blue.parks, Competition.match.blue.hangs, Competition.match.blue.level, Match.AllianceColor.BLUE);
    updateRankingPoints(Competition.match.red.shieldGeneratorEnergized, Competition.match.red.shieldGeneratorOperational, Match.AllianceColor.RED);
    updateRankingPoints(Competition.match.blue.shieldGeneratorEnergized, Competition.match.blue.shieldGeneratorOperational, Match.AllianceColor.BLUE);
    updateTask(Match.AllianceColor.RED);
    updateTask(Match.AllianceColor.BLUE);
    updatePhase(Competition.match.red.phase, Match.AllianceColor.RED);
    updatePhase(Competition.match.blue.phase, Match.AllianceColor.BLUE);
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
    // TODO: Color
}

function updateMatchName(name) {
    $("#match-view #match-panel #match-name").text(name);
}

function updateTeams(team1, team2, team3, color) {
    let teams = $("#match-view #match-panel #teams " + getColorClass(color)).children();
    [team1, team2, team3].forEach((e, i) => teams.eq(i).text(e.number));
}

function updateMatchPoints(points, color) {
    $("#match-view #match-panel #score-box " + getColorClass(color)).text(points);
}

function updateAutonomous(crossings, color) {
    let indicators = $("#match-view " + getColorClass(color) + ".indicator-panel .auto .indicators").children();
    indicators.each((i, e) => i < crossings ? $(e).addClass("lit") : $(e).removeClass("lit"));
}

function updateEndgame(parks, hangs, level, color) {
    if (level) $("#match-view " + getColorClass(color) + ".indicator-panel .endgame .level.indicator").addClass("lit");
    else $("#match-view " + getColorClass(color) + ".indicator-panel .endgame .level.indicator").removeClass("lit");
    let indicators = $("#match-view " + getColorClass(color) + ".indicator-panel .endgame .indicators").children();
    for (let i = 0; i < 3; i++) {
        let indicator = indicators.eq(i);
        if (i < parks) {
            indicator.text("P");
            indicator.addClass("lit");
        } else if (i < parks + hangs) {
            indicator.text("H");
            indicator.addClass("lit");
        } else {
            indicator.text("");
            indicator.removeClass("lit");
        }
    }
}

function updateRankingPoints(energized, operational, color) {
    if (energized) $("#match-view " + getColorClass(color) + ".rp-panel .energized.indicator").addClass("lit");
    else $("#match-view " + getColorClass(color) + ".rp-panel .energized.indicator").removeClass("lit");
    if (operational) $("#match-view " + getColorClass(color) + ".rp-panel .operational.indicator").addClass("lit");
    else $("#match-view " + getColorClass(color) + ".rp-panel .operational.indicator").removeClass("lit");
}

function updateTask(color) { // TODO: Refactor to updateTask(color)
    if (color == Match.AllianceColor.RED) var alliance = Competition.match.red;
    else var alliance = Competition.match.blue;
    if (alliance.phase != Match.Phase.PHASE_3 && alliance.powerCellsInPhase < 9) {
        updatePowerCell(9 - alliance.powerCellsInPhase, color);
    } else if (alliance.phase == Match.Phase.NONE) updatePowerCell(0, color);
    else if (alliance.phase == Match.Phase.PHASE_1) {
        $("#match-view " + getColorClass(color) + ".task-panel .power-cell").hide();
        $("#match-view " + getColorClass(color) + ".task-panel .rotation-control").show();
        $("#match-view " + getColorClass(color) + ".task-panel .position-control").hide();
        $("#match-view " + getColorClass(color) + ".task-panel .done").hide();
    } else if (alliance.phase == Match.Phase.PHASE_2) {
        updatePositionControl(alliance.positionControlTarget, color);
    } else {
        $("#match-view " + getColorClass(color) + ".task-panel .power-cell").hide();
        $("#match-view " + getColorClass(color) + ".task-panel .rotation-control").hide();
        $("#match-view " + getColorClass(color) + ".task-panel .position-control").hide();
        $("#match-view " + getColorClass(color) + ".task-panel .done").show();
    }
}

function updatePositionControl(target, color) {
    $("#match-view " + getColorClass(color) + ".task-panel .power-cell").hide();
    $("#match-view " + getColorClass(color) + ".task-panel .rotation-control").hide();
    $("#match-view " + getColorClass(color) + ".task-panel .position-control").show();
    $("#match-view " + getColorClass(color) + ".task-panel .done").hide();
    if (target == Match.ControlPanel.RED) {
        $("#match-view " + getColorClass(color) + ".task-panel .position-control").addClass(".red");
        $("#match-view " + getColorClass(color) + ".task-panel .position-control").removeClass(".green");
        $("#match-view " + getColorClass(color) + ".task-panel .position-control").removeClass(".blue");
        
    }
    else if (target == Match.ControlPanel.GREEN) {
        $("#match-view " + getColorClass(color) + ".task-panel .position-control").removeClass(".red");
        $("#match-view " + getColorClass(color) + ".task-panel .position-control").addClass(".green");
        $("#match-view " + getColorClass(color) + ".task-panel .position-control").removeClass(".blue");
    }
    else if (target == Match.ControlPanel.BLUE) {
        $("#match-view " + getColorClass(color) + ".task-panel .position-control").removeClass(".red");
        $("#match-view " + getColorClass(color) + ".task-panel .position-control").removeClass(".green");
        $("#match-view " + getColorClass(color) + ".task-panel .position-control").addClass(".blue");
    } else {
        $("#match-view " + getColorClass(color) + ".task-panel .position-control").removeClass(".red");
        $("#match-view " + getColorClass(color) + ".task-panel .position-control").removeClass(".green");
        $("#match-view " + getColorClass(color) + ".task-panel .position-control").removeClass(".blue");
    }
}

let prevRedCellsRemaining = -1;
let prevBlueCellsRemaining = -1;
function updatePowerCell(cellsRemaining, color) {
    $("#match-view " + getColorClass(color) + ".task-panel .power-cell").show();
    $("#match-view " + getColorClass(color) + ".task-panel .rotation-control").hide();
    $("#match-view " + getColorClass(color) + ".task-panel .position-control").hide();
    $("#match-view " + getColorClass(color) + ".task-panel .done").hide();
    let prevCellsRemaining = color == Match.AllianceColor.RED ? prevRedCellsRemaining : prevBlueCellsRemaining;
    if (cellsRemaining != prevCellsRemaining) {
        if (color == Match.AllianceColor.RED) prevRedCellsRemaining = cellsRemaining;
        else prevBlueCellsRemaining = cellsRemaining;
        $(getColorClass(color) + ".task-panel .power-cell circle").stop(true);
        $(getColorClass(color) + ".task-panel .power-cell circle").animate(
            { "stroke-dashoffset": cellsRemaining * (101 / 9), queue: false}, 500);
        $(getColorClass(color) + ".task-panel .power-cell .capacity").text(cellsRemaining);
    }
}

function updatePhase(phase, color) {

    function setIndicators(indicators, on1, on2, on3) {
        [on1, on2, on3].forEach((e, i) => {
            e ? indicators.eq(i).addClass("lit") : indicators.eq(i).removeClass("lit");
        });
    }

    let indicators = $(getColorClass(color) + ".rp-panel .phase .indicators").children();
    
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

function setUpStream() {
    console.log("Media devices:", navigator.mediaDevices.enumerateDevices());
    let video = document.querySelector("#stream video");
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { width: { exact: 1920 }, height: { exact: 1080 } } }).then(stream => {
            video.srcObject = stream;
        }).catch((e) => console.log("Could not find camera.", e));
    }
}

function getColorClass(color) {
    if (color == Match.AllianceColor.RED) return ".red";
    else if (color == Match.AllianceColor.BLUE) return ".blue";
    else throw "Color must be a Match.AllianceColor";
}

$(setUpStream);