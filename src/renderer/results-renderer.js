import { Competition } from "./controller.js";
import { Match } from "./match.js"
import { Team } from "./team.js"
import * as sound from "./sound.js";

export function show() {
    $("#results-view").addClass("fade-in");
    if (Competition.results.result == Match.Result.RED_WIN) {
        $("#results-view video source").attr("src", "../../videos/red-win.mp4");
    } else if (Competition.results.result == Match.Result.BLUE_WIN) {
        $("#results-view video source").attr("src", "../../videos/blue-win.mp4");
    } else if (Competition.results.result == Match.Result.TIE) {
        $("#results-view video source").attr("src", "../../videos/tie.mp4");
    }
    $("#results-view video")[0].load();
    $("#results-view video")[0].play();
    sound.resultsVideo();
    updateRanks();
}

export function hide() {
    $("#results-view").removeClass("fade-in");
    $("#results-view video source").attr("src", "");
    $("#results-view video")[0].load();
    $("#results-view video").css("opacity", "100%");
}

export function update() {
    if (!Competition.results) return;
    updateMatchName();
    updateTeams(Competition.results.red);
    updateTeams(Competition.results.blue);
    updateScorePanel(Competition.results.red);
    updateScorePanel(Competition.results.blue);
    updateCategoryPanel(Competition.results.red);
    updateCategoryPanel(Competition.results.blue);
    updateRpPanel(Competition.results.red);
    updateRpPanel(Competition.results.blue);
}

function updateMatchName() {
    $("#results-view #match-label").text(Competition.results.friendlyName);
    // TODO: show total matches, i.e. Qualification 1 *of 20*
}

function updateTeams(alliance) {
    let teams = $("#results-view " + getAllianceClass(alliance) + ".alliance-panel .teams .team .number");
    alliance.teams.forEach((e, i) => teams.eq(i).text(e.number));
    let avatars = $("#results-view " + getAllianceClass(alliance) + ".alliance-panel .team .avatar");
    alliance.teams.forEach((e, i) => avatars.eq(i).css("background-image", `url(../../images/avatars/${e.number}.png`)); // Generates a file not found error if avatar doesn't exist
}

function updateRanks() {
    if (Competition.results.type == Match.Type.QUALIFICATION) {
        $("#results-view .rank-label").show();
        $("#results-view .rank").show();
        let prevRankings = Competition.previousRankings;
        let rankings = Competition.rankings;
        
        function updateRank(teamNumber, index, alliance) {
            let rankFields = $("#results-view " + getAllianceClass(alliance) + ".alliance-panel .teams .team .rank");
            if (prevRankings) var prevRank = prevRankings.findIndex(team => team.number == teamNumber) + 1;
            else var prevRank = 999;
            let rank = rankings.findIndex(team => team.number == teamNumber) + 1;
            if (rank < prevRank) rankFields.eq(index).text(rank + "▲");
            else if (rank > prevRank) rankFields.eq(index).text(rank + "▼");
            else rankFields.eq(index).text(rank);
        }

        Competition.results.red.teamNumbers.forEach((e, i) => updateRank(e, i, Competition.results.red));
        Competition.results.blue.teamNumbers.forEach((e, i) => updateRank(e, i, Competition.results.blue));
    } else {
        $("#results-view .rank-label").hide();
        $("#results-view .rank").hide();
    }
}

function updateScorePanel(alliance) {
    $("#results-view " + getAllianceClass(alliance) + ".alliance-panel .score-panel .score").text(alliance.matchPoints);
    if ((alliance.color == Match.AllianceColor.RED && Competition.results.result == Match.Result.RED_WIN)
            || (alliance.color == Match.AllianceColor.BLUE && Competition.results.result == Match.Result.BLUE_WIN)) {
        $("#results-view " + getAllianceClass(alliance) + ".alliance-panel .score-panel .result").text("Win");
    } else if (Competition.results.result == Match.Result.TIE) {
        $("#results-view " + getAllianceClass(alliance) + ".alliance-panel .score-panel .result").text("Tie");
    } else {
        $("#results-view " + getAllianceClass(alliance) + ".alliance-panel .score-panel .result").text("");
    }
    // TODO: high score
}

function updateRpPanel(alliance) {
    let melody = $("#results-view " + getAllianceClass(alliance) + ".alliance-panel .rp-panel .melody");
    let ensemble = $("#results-view " + getAllianceClass(alliance) + ".alliance-panel .rp-panel .ensemble");
    let win = $("#results-view " + getAllianceClass(alliance) + ".alliance-panel .rp-panel .win");
    let rp = (alliance.melody ? 1 : 0) + (alliance.ensemble ? 1 : 0);
    if (alliance.melody) melody.addClass("lit");
    else melody.removeClass("lit");
    if (alliance.ensemble) ensemble.addClass("lit");
    else ensemble.removeClass("lit");
    if ((alliance.color == Match.AllianceColor.RED && Competition.results.result == Match.Result.RED_WIN)
            || (alliance.color == Match.AllianceColor.BLUE && Competition.results.result == Match.Result.BLUE_WIN)) {
        rp += 2;
        win.addClass("lit");
    } else if (Competition.results.result == Match.Result.TIE) {
        rp += 1;
        win.addClass("lit");
        win.children("#win").hide();
        win.children("#tie").show();
    } else {
        win.removeClass("lit");
        win.children("#win").show();
        win.children("#tie").hide();
    }
    $("#results-view " + getAllianceClass(alliance) + ".alliance-panel .rp-panel .count").text(rp + " RP");
}

function updateCategoryPanel(alliance) {
    let categories = $("#results-view " + getAllianceClass(alliance) + ".alliance-panel .category-panel .category .points");
    [alliance.leavePoints, alliance.ampPoints, alliance.speakerPoints, alliance.stagePoints, alliance.penaltyPoints].forEach(
        (e, i) => categories.eq(i).text(e)
    );
}

function getAllianceClass(alliance) {
    if (alliance.color == Match.AllianceColor.RED) return ".red";
    else if (alliance.color == Match.AllianceColor.BLUE) return ".blue";
}

// Set video to fade out on end
$("#results-view video").on("ended", () => {
    $("#results-view video").css("opacity", "0%");
});