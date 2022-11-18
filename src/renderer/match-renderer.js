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
    updateHatch(Competition.match.red.hatches, Match.AllianceColor.RED);
    updateHatch(Competition.match.blue.hatches, Match.AllianceColor.BLUE);
    updateCargo(Competition.match.red.cargo, Match.AllianceColor.RED);
    updateCargo(Competition.match.blue.cargo, Match.AllianceColor.BLUE);
    updateAutonomous(Competition.match.red.habDismounts, Match.AllianceColor.RED);
    updateAutonomous(Competition.match.blue.habDismounts, Match.AllianceColor.BLUE);
    updateEndgame(Competition.match.red.habClimbs, Match.AllianceColor.RED);
    updateEndgame(Competition.match.blue.habClimbs, Match.AllianceColor.BLUE);
    updateRankingPoints(Competition.match.red.rocketComplete, Competition.match.red.docked, Match.AllianceColor.RED);
    updateRankingPoints(Competition.match.blue.rocketComplete, Competition.match.blue.docked, Match.AllianceColor.BLUE);
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
    let teams = $("#match-view #match-panel #teams " + getColorClass(color)).children();
    [team1, team2, team3].forEach((e, i) => teams.eq(i).text(e.number));
}

function updateMatchPoints(points, color) {
    $("#match-view #match-panel #score-box " + getColorClass(color)).text(points);
}

function updateAutonomous(crossings, color) {
    for (let i = 0; i < 3; i++) {
        let crossing = $("#hab-panel " + getColorClass(color) + ".dismount-" + i);
        if (crossings[i] == 0) crossing.height("0%");
        else if (crossings[i] == Match.PointValues.HAB_DISMOUNT_1) crossing.height("33%");
        else if (crossings[i] == Match.PointValues.HAB_DISMOUNT_2) crossing.height("66%");
        else if (crossings[i] == Match.PointValues.HAB_DISMOUNT_3) crossing.height("100%");
    }
}

function updateEndgame(climbs, color) {
    for (let i = 0; i < 3; i++) {
        let climb = $("#hab-panel " + getColorClass(color) + ".climb-" + i);
        if (climbs[i] == 0) climb.height("0%");
        else if (climbs[i] == Match.PointValues.HAB_CLIMB_1) climb.height("33%");
        else if (climbs[i] == Match.PointValues.HAB_CLIMB_2) climb.height("66%");
        else if (climbs[i] == Match.PointValues.HAB_CLIMB_3) climb.height("100%");
    }
}

function updateHatch(hatches, color) {
    function setHatchClass(hatch, cls) {
        hatch.removeClass(["hatch", "left-half-hatch", "right-half-hatch", "no-hatch", "null-hatch"]);
        hatch.addClass(cls);
    }
    for (let i = 0; i < 6; i++) {
        let left = hatches[2*i] === Match.HatchType.HATCH;
        let right = hatches[2*i+1] === Match.HatchType.HATCH;
        let hatch = $(getColorClass(color) + ".rocket-panel .hatch-" + i);
        setHatchClass(hatch, left && right ? "hatch" : left ? "left-half-hatch" : right ? "right-half-hatch" : "no-hatch");
    }
    for (let i = 12; i < 20; i++) {
        let hatch = $("#ship-panel " + getColorClass(color) + " .hatch-" + i);
        if (hatches[i] === Match.HatchType.NO_HATCH) setHatchClass(hatch, "no-hatch");
        else if (hatches[i] === Match.HatchType.HATCH) setHatchClass(hatch, "hatch");
        else if (hatches[i] === Match.HatchType.NULL_HATCH) setHatchClass(hatch, "null-hatch");
    }
}

function updateCargo(cargo, color) {
    function setCargoClass(cargo, cls) {
        cargo.removeClass(["cargo", "left-half-cargo", "right-half-cargo", "no-cargo"]);
        cargo.addClass(cls);
    }
    for (let i = 0; i < 6; i++) {
        let left = cargo[2*i];
        let right = cargo[2*i+1];
        let cargoElement = $(getColorClass(color) + ".rocket-panel .cargo-" + i);
        setCargoClass(cargoElement, left && right ? "cargo" : left ? "left-half-cargo" : right ? "right-half-cargo" : "no-cargo");
    }
    for (let i = 12; i < 20; i++) {
        let cargoElement = $("#ship-panel " + getColorClass(color) + " .cargo-" + i);
        setCargoClass(cargoElement, cargo[i] ? "cargo" : "no-cargo");
    }
}

function updateRankingPoints(rocket, docked, color) {
    if (rocket) $("#match-view " + getColorClass(color) + ".rocket-rp").addClass("lit");
    else $("#match-view " + getColorClass(color) + ".rocket-rp").removeClass("lit");
    if (docked) $("#match-view " + getColorClass(color) + ".docked-rp").addClass("lit");
    else $("#match-view " + getColorClass(color) + ".docked-rp").removeClass("lit");
}

function getColorClass(color) {
    if (color == Match.AllianceColor.RED) return ".red";
    else if (color == Match.AllianceColor.BLUE) return ".blue";
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