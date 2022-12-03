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
    $(".auto button,.endgame button").removeClass("selected");
    $(".auto button.none,.endgame button.none").addClass("selected");
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
$(".auto button,.endgame button").on("click", e => {
    $(e.target).addClass("selected");
    $(e.target).siblings().removeClass("selected");
    let red = $(e.target).hasClass("red");
    let posMap = { "left": 0, "mid": 1, "right": 2 };
    let pos = posMap[Object.keys(posMap).find(pos => $(e.target).hasClass(pos))];
    if ($(e.target).parent().hasClass("endgame")) { // Endgame
        let lvlMap = { "none": 0, "challenge": 1, "scale": 2 };
        let lvl = lvlMap[Object.keys(lvlMap).find(lvl => $(e.target).hasClass(lvl))];
        ipc.send(CtrlMsg.ENDGAME, { red: red, position: pos, level: lvl });
    } else { // Auto
        let lvlMap = { "none": 0, "reach": 1, "cross": 2 };
        let lvl = lvlMap[Object.keys(lvlMap).find(lvl => $(e.target).hasClass(lvl))];
        ipc.send(CtrlMsg.AUTO, { red: red, position: pos, level: lvl });
    }
});

// Fouls
$("#fouls button").on("click", e => {
    let red = $(e.target).hasClass("blue"); // Award red fouls to blue and vice versa
    let tech = $(e.target).hasClass("tech");
    let undo = $(e.target).hasClass("remove");
    ipc.send(CtrlMsg.FOUL, {red: red, tech: tech, undo: undo})
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
    // Blue defenses (crossed by red)
    "Digit1": ["defense", "red", 4, "ShiftLeft"],
    "Digit2": ["defense", "red", 3, "ShiftLeft"],
    "Digit3": ["defense", "red", 2, "ShiftLeft"],
    "Digit4": ["defense", "red", 1, "ShiftLeft"],
    "Digit5": ["defense", "red", 0, "ShiftLeft"],
    
    // Red defenses (crossed by blue)
    "KeyB": ["defense", "blue", 4, "ShiftRight"],
    "KeyN": ["defense", "blue", 3, "ShiftRight"],
    "KeyM": ["defense", "blue", 2, "ShiftRight"],
    "Comma": ["defense", "blue", 1, "ShiftRight"],
    "Period": ["defense", "blue", 0, "ShiftRight"],

    // Blue tower (scored by red)
    "KeyS": ["boulder", "red", true, false, "ControlLeft"],
    "KeyX": ["boulder", "red", false, false, "ControlLeft"],
    "KeyF": ["boulder", "red", true, true, "ControlLeft"],
    "KeyV": ["boulder", "red", false, true, "ControlLeft"],
    
    // Red tower (scored by blue)
    "Digit0": ["boulder", "blue", true, false, "ControlRight"],
    "KeyP": ["boulder", "blue", false, false, "ControlRight"],
    "Digit8": ["boulder", "blue", true, true, "ControlRight"],
    "KeyI": ["boulder", "blue", false, true,"ControlRight"],
};

$(document).on("keydown", e => {
    let args = keyMap[e.code];
    if (!args) return;
    if (args[0] == "defense") ipc.send(CtrlMsg.DEFENSE, { red: args[1] == "red", position: args[2], undo: mods[args[3]] });
    else ipc.send(CtrlMsg.BOULDER, { red: args[1] == "red", high: args[2], auto: args[3], undo: mods[args[4]] });
});

ipc.on(RenderMsg.LOADED_UNDETERMINED_MATCH, () => currentMatchDetermined = false);
ipc.on(RenderMsg.LOADED_DETERMINED_MATCH, () => currentMatchDetermined = true);
ipc.on(RenderMsg.MATCH_ENDED, () => {
    phase = Phase.NO_ENTRY;
    matchResultsWaiting = true;
    matchResultsValid = false;
});
ipc.on(RenderMsg.MATCH_DATA, (event, data) => {
    $("#data .red .fouls span").text(data.redFouls);
    $("#data .red .tech-fouls span").text(data.redTechFouls);
    $("#data .blue .fouls span").text(data.blueFouls);
    $("#data .blue .tech-fouls span").text(data.blueTechFouls);
    $("#data .red .auto-low span").text(data.redAutoLowGoals);
    $("#data .red .auto-high span").text(data.redAutoHighGoals);
    $("#data .blue .auto-low span").text(data.blueAutoLowGoals);
    $("#data .blue .auto-high span").text(data.blueAutoHighGoals);
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