import { Competition } from "./controller.js";

export function show() {
    $("#rankings-view").addClass("fade-in");
    updateRankings();
}

export function hide() {
    $("#rankings-view").removeClass("fade-in");
}

export function update() {
    // TODO: scroll if table too long
}

function updateRankings() {
    $("#rankings-view #frame table .data").remove();
    let rankings = Competition.rankings;
    rankings.forEach((e, i) => {
        let table = $("#rankings-view #frame table tbody").append($("<tr></tr>").addClass("data"));
        let row = $("#rankings-view #frame table tbody .data").last();
        row.append($("<td>" + (i + 1) + "</td>"));
        row.append($("<td>" + e.number + "</td>"));
        row.append($("<td>" + (isNaN(e.rankingScore) ? "-" : e.rankingScore.toFixed(2)) + "</td>"));
        row.append($("<td>" + e.autoPoints + "</td>"));
        row.append($("<td>" + e.endgamePoints + "</td>"));
        row.append($("<td>" + e.boulderPoints + "</td>"));
        row.append($("<td>" + e.defensePoints + "</td>"));
        row.append($("<td class='text'>" + e.wins + "-" + e.losses + "-" + e.ties + "</td>"));
        row.append($("<td>" + e.disqualifications + "</td>"));
        row.append($("<td>" + e.matchesPlayed + "</td>"));
        row.append($("<td>" + e.rankingPoints + "</td>"));
    });
}