import { Competition } from "./controller.js";

let timeShown;

export function show() {
    $("#rankings-view").addClass("fade-in");
    updateRankings();
    timeShown = Date.now();
    $("#rankings-view #frame .container").stop(true, true);
    $("#rankings-view #frame .container").scrollTop(0);
}

export function hide() {
    $("#rankings-view").removeClass("fade-in");
}

export function update() {
    let scroll = $("#rankings-view #frame .container");
    if ((Date.now() - timeShown) % 30000 < 5000) scroll.stop(true, true);
    else if ((Date.now() - timeShown) % 30000 < 15000) scroll.animate({ "scrollTop": scroll.prop("scrollHeight") - scroll.height() }, 10000);
    else if ((Date.now() - timeShown) % 30000 < 20000) scroll.stop(true, true);
    else scroll.animate({ "scrollTop": 0 }, 10000);
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
        row.append($("<td>" + e.stagePoints + "</td>"));
        row.append($("<td class='text'>" + e.wins + "-" + e.losses + "-" + e.ties + "</td>"));
        row.append($("<td>" + e.disqualifications + "</td>"));
        row.append($("<td>" + e.matchesPlayed + "</td>"));
        row.append($("<td>" + e.rankingPoints + "</td>"));
    });
}