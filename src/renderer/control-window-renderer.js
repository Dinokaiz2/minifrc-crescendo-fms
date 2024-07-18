import { updateMatchPanel } from "./match-renderer.js";

const ipc = window.ipc;
const CtrlMsg = window.ipc.CtrlMsg;
const RenderMsg = window.ipc.RenderMsg;

const View = {
    MATCH: 1,
    RESULTS: 2,
    RANKINGS: 3
}

const Phase = {
    NO_ENTRY: 1,
    SAFE_TO_ENTER: 2,
    READY_FOR_MATCH: 3,
    IN_MATCH: 4
}

let view = View.MATCH;
let phase = Phase.NO_ENTRY;
let currentMatchDetermined = false;
let matchResultsWaiting = false;
let matchResultsValid = false;
let fault = false;

// View
$("#view button#match").on("click", () => {
    view = View.MATCH;
    ipc.send(CtrlMsg.VIEW_MATCH);
});
$("#view button#results").on("click", () => {
    view = View.RESULTS;
    ipc.send(CtrlMsg.VIEW_RESULTS)
});
$("#view button#rankings").on("click", () => {
    view = View.RANKINGS;
    ipc.send(CtrlMsg.VIEW_RANKINGS)
});

// Phase
$("#phase button#no-entry").on("click", () => {
    phase = Phase.NO_ENTRY;
    ipc.send(CtrlMsg.NO_ENTRY)
});
$("#phase button#safe-to-enter").on("click", () => {
    phase = Phase.SAFE_TO_ENTER;
    ipc.send(CtrlMsg.SAFE_TO_ENTER)
});
$("#phase button#ready-for-match").on("click", () => {
    phase = Phase.READY_FOR_MATCH;
    ipc.send(CtrlMsg.READY_FOR_MATCH)
});
$("#phase button#start-match").on("click", () => {
    phase = Phase.IN_MATCH;
    ipc.send(CtrlMsg.START_MATCH);
    $(".leave button, .stage button, .harmony button").removeClass("selected");
    $(".leave button.none, .stage button.none, .harmony button.none").addClass("selected");
});

// Match
$("#match button#field-fault").on("click", () => {
    phase = Phase.NO_ENTRY;
    fault = true;
    ipc.send(CtrlMsg.FIELD_FAULT);
});
$("#match button#replay-match").on("click", () => {
    currentMatchDetermined = false;
    matchResultsWaiting = false;
    fault = false;
    ipc.send(CtrlMsg.REPLAY_MATCH)
});
$("#match button#save-results").on("click", () => {
    matchResultsWaiting = false;
    matchResultsValid = true;
    ipc.send(CtrlMsg.SAVE_RESULTS);
});
$("#match button#next-match").on("click", () => ipc.send(CtrlMsg.NEXT_MATCH));
$("#match button#previous-match").on("click", () => ipc.send(CtrlMsg.PREVIOUS_MATCH));

// Points
$(".leave button, .stage button, .harmony button").on("click", e => {
    $(e.target).addClass("selected");
    $(e.target).siblings().removeClass("selected");
    let red = $(e.target).hasClass("red");
    if ($(e.target).parent().hasClass("leave")) { 
        ipc.send(CtrlMsg.LEAVE, { red: red, count: $(e.target).attr("value") });
    } else if ($(e.target).parent().hasClass("harmony")) { 
        ipc.send(CtrlMsg.HARMONY, { red: red, count: $(e.target).attr("value") });
    } else if ($(e.target).parent().hasClass("trap")) { 
        let posMap = { "left": 0, "mid": 1, "right": 2 };
        let pos = posMap[Object.keys(posMap).find(pos => $(e.target).hasClass(pos))];
        ipc.send(CtrlMsg.TRAP, { red: red, position: pos, undo: $(e.target).attr("value") == 0 });
    } else if ($(e.target).parent().hasClass("stage")) {
        let posMap = { "left": 0, "mid": 1, "right": 2 };
        let pos = posMap[Object.keys(posMap).find(pos => $(e.target).hasClass(pos))];
        let lvlMap = { "none": 0, "park": 1, "onstage": 2 };
        let lvl = lvlMap[Object.keys(lvlMap).find(lvl => $(e.target).hasClass(lvl))];
        ipc.send(CtrlMsg.STAGE, { red: red, position: pos, level: lvl });
    }});

// Fouls
$("#fouls button").on("click", e => {
    let red = $(e.target).hasClass("blue"); // Award red fouls to blue and vice versa
    let tech = $(e.target).hasClass("tech");
    let undo = $(e.target).hasClass("remove");
    ipc.send(CtrlMsg.FOUL, { red: red, tech: tech, undo: undo });
});

let mods = {
    "ShiftLeft": false,
    "ShiftRight": false,
    "ControlLeft": false,
    "ControlRight": false
}
$(document).on("keydown", e => { if (e.code in mods) mods[e.code] = true; });
$(document).on("keyup", e => { if (e.code in mods) mods[e.code] = false; });

const keyMap = {
    // Red
    "KeyS": ["speaker", "red", "context", "ShiftLeft"],
    "KeyX": ["amp",     "red", "context", "ShiftLeft"],
    "KeyF": ["amplify", "red"],
    "KeyG": ["coop",    "red", false, "ShiftLeft"],

    "Digit1": ["amp",     "red", "auto",    "ShiftLeft"],
    "Digit2": ["speaker", "red", "auto",    "ShiftLeft"],
    "Digit3": ["speaker", "red", "unamped", "ShiftLeft"],
    "Digit4": ["speaker", "red", "amped",   "ShiftLeft"],
    "Digit5": ["coop",    "red", true,      "ShiftLeft"],

    // Blue
    "KeyJ":      ["speaker", "blue", "context", "ShiftRight"],
    "KeyM":      ["amp",     "blue", "context", "ShiftRight"],
    "KeyL":      ["amplify", "blue"],
    "Semicolon": ["coop",    "blue", false,     "ShiftRight"],

    "Digit6": ["amp",     "blue", "auto",    "ShiftRight"],
    "Digit7": ["speaker", "blue", "auto",    "ShiftRight"],
    "Digit8": ["speaker", "blue", "unamped", "ShiftRight"],
    "Digit9": ["speaker", "blue", "amped",   "ShiftRight"],
    "Digit0": ["coop",    "blue", true,      "ShiftRight"],
};

$(document).on("keydown", e => {
    let args = keyMap[e.code];
    if (!args) return;
    if (args[0] == "speaker") ipc.send(CtrlMsg.SPEAKER, { red: args[1] == "red", type: args[2], undo: mods[args[3]] });
    else if (args[0] == "amp") ipc.send(CtrlMsg.AMP, { red: args[1] == "red", type: args[2], undo: mods[args[3]] });
    else if (args[0] == "amplify") ipc.send(CtrlMsg.AMPLIFY, { red: args[1] == "red", undo: mods[args[2]] });
    else if (args[0] == "coop") ipc.send(CtrlMsg.COOP, { red: args[1] == "red", force: args[2], undo: mods[args[3]] });
});

ipc.on(RenderMsg.LOADED_UNDETERMINED_MATCH, () => currentMatchDetermined = false);
ipc.on(RenderMsg.LOADED_DETERMINED_MATCH, () => currentMatchDetermined = true);
ipc.on(RenderMsg.MATCH_ENDED, () => {
    phase = Phase.NO_ENTRY;
    matchResultsWaiting = true;
    matchResultsValid = false;
});
ipc.on(RenderMsg.MATCH_DATA, (event, data) => {
    // Flip fouls to the alliance that caused them
    $("#data .red .fouls span").text(data.blue.fouls);
    $("#data .red .tech-fouls span").text(data.blue.techFouls);
    $("#data .blue .fouls span").text(data.red.fouls);
    $("#data .blue .tech-fouls span").text(data.red.techFouls);

    $("#data .red .auto-amp span").text(data.red.autoAmp);
    $("#data .red .auto-speaker span").text(data.red.autoSpeaker);
    $("#data .red .teleop-amp span").text(data.red.teleopAmp);
    $("#data .red .unamped-speaker span").text(data.red.unampedSpeaker);
    $("#data .red .amped-speaker span").text(data.red.ampedSpeaker);
    $("#data .red .melody span").text(data.red.melody);
    $("#data .red .ensemble span").text(data.red.ensemble);

    $("#data .blue .auto-amp span").text(data.blue.autoAmp);
    $("#data .blue .auto-speaker span").text(data.blue.autoSpeaker);
    $("#data .blue .teleop-amp span").text(data.blue.teleopAmp);
    $("#data .blue .unamped-speaker span").text(data.blue.unampedSpeaker);
    $("#data .blue .amped-speaker span").text(data.blue.ampedSpeaker);
    $("#data .blue .melody span").text(data.blue.melody);
    $("#data .blue .ensemble span").text(data.blue.ensemble);

    [data.red, data.blue].forEach(alliance => updateMatchPanel
        (
            data.matchName, alliance.teams, alliance.number, data.isPlayoff,
            alliance.matchPoints, alliance.mobility, alliance.autoCharge,
            alliance.autoNodes, alliance.nodeTotals,
            alliance.links, alliance.sustainabilityThreshold, alliance.coopertition, alliance.endgame, alliance.color
        )
    );
});

function update() {
    if (!currentMatchDetermined && view == View.MATCH && phase == Phase.READY_FOR_MATCH) {
        $("#phase button#start-match").attr("disabled", false);
    } else {
        $("#phase button#start-match").attr("disabled", true);
    }

    if (phase == Phase.IN_MATCH) {
        $("#view button#results").attr("disabled", true);
        $("#view button#rankings").attr("disabled", true);
        $("#phase button#no-entry").attr("disabled", true);
        $("#phase button#safe-to-enter").attr("disabled", true);
        $("#match button#replay-match").attr("disabled", true);
        $("#match button#field-fault").attr("disabled", false);
    } else {
        $("#view button#results").attr("disabled", false);
        $("#view button#rankings").attr("disabled", false);
        $("#phase button#no-entry").attr("disabled", false);
        $("#phase button#safe-to-enter").attr("disabled", false);
        $("#match button#field-fault").attr("disabled", true);
    }

    if (phase == Phase.IN_MATCH || matchResultsWaiting) {
        $("#points button").attr("disabled", false);
        $("#fouls button").attr("disabled", false);
        $("#phase button#ready-for-match").attr("disabled", true);
        $("#match button#next-match").attr("disabled", true);
        $("#match button#previous-match").attr("disabled", true);
    } else {
        $("#points button").attr("disabled", true);
        $("#fouls button").attr("disabled", true);
        $("#phase button#ready-for-match").attr("disabled", false);
        $("#match button#next-match").attr("disabled", false);
        $("#match button#previous-match").attr("disabled", false);
    }

    if (fault) {
        $("#phase button#ready-for-match").attr("disabled", true);
        $("#match button#next-match").attr("disabled", true);
        $("#match button#previous-match").attr("disabled", true);
    }

    if (matchResultsWaiting) {
        $("#view button#results").attr("disabled", true);
        $("#match button#save-results").attr("disabled", false);
    } else {
        $("#match button#save-results").attr("disabled", true);
    }

    if (matchResultsValid) {
        $("#view button#results").attr("disabled", false);
    } else {
        $("#view button#results").attr("disabled", true);
    }

    if (currentMatchDetermined || matchResultsWaiting || fault) {
        $("#match button#replay-match").attr("disabled", false);
    } else {
        $("#match button#replay-match").attr("disabled", true);
    }
}

setInterval(update, 50);