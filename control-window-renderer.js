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
});

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

$(".dismount,.climb button").on("click", e => {
    $(e.target).addClass("selected");
    $(e.target).siblings().removeClass("selected");
    let climb = $(e.target).parent().hasClass("climb");
    let red = $(e.target).hasClass("red");
    let message = red ? (climb ? CtrlMsg.RED_CLIMB : CtrlMsg.RED_DISMOUNT) : (climb ? CtrlMsg.BLUE_CLIMB : CtrlMsg.BLUE_DISMOUNT);
    let lvlMap = { "none": 0, "lvl-1": 1, "lvl-2": 2, "lvl-3": 3 };
    let posMap = { "left": 0, "mid": 1, "right": 2 };
    let lvl = lvlMap[Object.keys(lvlMap).find(lvl => $(e.target).hasClass(lvl))];
    let pos = posMap[Object.keys(posMap).find(pos => $(e.target).hasClass(pos))];
    ipc.send(message, { Position: pos, Level: lvl });
});

// Award red fouls to blue and vice versa
$("#fouls .foul button.red").on("click", e => ipc.send(($(e.target).hasClass("add") ? "add" : "remove") + "-blue-foul"));
$("#fouls .foul button.blue").on("click", e => ipc.send(($(e.target).hasClass("add") ? "add" : "remove") + "-red-foul"));

$("#fouls .tech-foul button.red").on("click", e => ipc.send(($(e.target).hasClass("add") ? "add" : "remove") + "-blue-tech-foul"));
$("#fouls .tech-foul button.blue").on("click", e => ipc.send(($(e.target).hasClass("add") ? "add" : "remove") + "-red-tech-foul"));

let mods = {
    "ShiftLeft": false,
    "ShiftRight": false,
    "ControlLeft": false,
    "ControlRight": false
}

const keyMap = {
    "KeyQ": ["red", 0, "ShiftLeft"],
    "KeyW": ["red", 1, "ShiftLeft"],
    "KeyA": ["red", 2, "ShiftLeft"],
    "KeyS": ["red", 3, "ShiftLeft"],
    "KeyZ": ["red", 4, "ShiftLeft"],
    "KeyX": ["red", 5, "ShiftLeft"],
    "Digit1": ["red", 13, "ShiftLeft"],
    "Digit2": ["red", 17, "ShiftLeft"],
    "Digit3": ["red", 18, "ShiftLeft"],
    "Digit4": ["red", 19, "ShiftLeft"],

    "KeyE": ["red", 7, "ControlLeft"],
    "KeyR": ["red", 6, "ControlLeft"],
    "KeyD": ["red", 9, "ControlLeft"],
    "KeyF": ["red", 8, "ControlLeft"],
    "KeyC": ["red", 11, "ControlLeft"],
    "KeyV": ["red", 10, "ControlLeft"],
    "Digit5": ["red", 16, "ControlLeft"],
    "Digit6": ["red", 15, "ControlLeft"],
    "Digit7": ["red", 14, "ControlLeft"],
    "Digit8": ["red", 12, "ControlLeft"],

    "KeyT": ["blue", 0, "ShiftRight"],
    "KeyY": ["blue", 1, "ShiftRight"],
    "KeyG": ["blue", 2, "ShiftRight"],
    "KeyH": ["blue", 3, "ShiftRight"],
    "KeyB": ["blue", 4, "ShiftRight"],
    "KeyN": ["blue", 5, "ShiftRight"],
    "Digit9": ["blue", 19, "ShiftRight"],
    "Digit0": ["blue", 18, "ShiftRight"],
    "Minus": ["blue", 17, "ShiftRight"],
    "Equal": ["blue", 13, "ShiftRight"],

    "KeyU": ["blue", 7, "ControlRight"],
    "KeyI": ["blue", 6, "ControlRight"],
    "KeyJ": ["blue", 9, "ControlRight"],
    "KeyK": ["blue", 8, "ControlRight"],
    "KeyM": ["blue", 11, "ControlRight"],
    "Comma": ["blue", 10, "ControlRight"],
    "KeyO": ["blue", 12, "ControlRight"],
    "KeyP": ["blue", 14, "ControlRight"],
    "BracketLeft": ["blue", 15, "ControlRight"],
    "BracketRight": ["blue", 16, "ControlRight"],
};

$(document).on("keydown", e => {
    console.log(e.code);
    let pos = keyMap[e.code];
    if (!pos) return;
    ipc.send(CtrlMsg.GAME_PIECE, {
        Color: pos[0],
        Position: pos[1],
        Remove: mods[pos[2]]
    });
});

$(document).on("keydown", e => { if (e.code in mods) mods[e.code] = true; });
$(document).on("keyup", e => { if (e.code in mods) mods[e.code] = false; });

ipc.on(RenderMsg.LOADED_UNDETERMINED_MATCH, () => currentMatchDetermined = false);
ipc.on(RenderMsg.LOADED_DETERMINED_MATCH, () => currentMatchDetermined = true);
ipc.on(RenderMsg.MATCH_ENDED, () => {
    phase = Phase.NO_ENTRY;
    matchResultsWaiting = true;
    matchResultsValid = false;
});
ipc.on(RenderMsg.MATCH_DATA, (event, data) => {
    $("#data #fouls .red span").text(data.BlueFouls);
    $("#data #fouls .blue span").text(data.RedFouls);
    $("#data #tech-fouls .red span").text(data.BlueTechFouls);
    $("#data #tech-fouls .blue span").text(data.RedTechFouls);
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

function setAddOrRemove(shift) {
    if (shift) {
        $("#points button").removeClass("add");
        $("#points button").addClass("remove");
    }
    else {
        $("#points button").addClass("add");
        $("#points button").removeClass("remove");
    }
}

$(window).on("keydown", e => setAddOrRemove(e.shiftKey));
$(window).on("keyup", e => setAddOrRemove(e.shiftKey));

setInterval(update, 50);