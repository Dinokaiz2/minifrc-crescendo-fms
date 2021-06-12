const ipc = window.ipc;

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
    ipc.send("view-match");
});
$("#view button#results").on("click", () => {
    view = View.RESULTS;
    ipc.send("view-results")
});
$("#view button#rankings").on("click", () => {
    view = View.RANKINGS;
    ipc.send("view-rankings")
});

$("#phase button#no-entry").on("click", () => {
    phase = Phase.NO_ENTRY;
    ipc.send("no-entry")
});
$("#phase button#safe-to-enter").on("click", () => {
    phase = Phase.SAFE_TO_ENTER
    ipc.send("safe-not-enter")
});
$("#phase button#ready-for-match").on("click", () => {
    phase = Phase.READY_FOR_MATCH;
    ipc.send("ready-for-match")
});
$("#phase button#start-match").on("click", () => {
    phase = Phase.IN_MATCH;
    ipc.send("start-match");
});

$("#match button#field-fault").on("click", () => {
    phase = Phase.NO_ENTRY;
    fault = true;
    ipc.send("field-fault");
});
$("#match button#replay-match").on("click", () => {
    currentMatchDetermined = false;
    matchResultsWaiting = false;
    fault = false;
    ipc.send("replay-match")
});
$("#match button#save-results").on("click", () => {
    matchResultsWaiting = false;
    matchResultsValid = true;
    ipc.send("save-results");
});
$("#match button#next-match").on("click", () => ipc.send("next-match"));
$("#match button#previous-match").on("click", () => ipc.send("previous-match"));

$("#points .initiation-line button.red.add").on("click", e => ipc.send(($(e.target).hasClass("add") ? "add" : "remove") + "-red-initiation-line"));
$("#points .initiation-line button.blue.add").on("click", e => ipc.send(($(e.target).hasClass("add") ? "add" : "remove") + "-blue-initiation-line"));

$("#points .hang button.red.add").on("click", e => ipc.send(($(e.target).hasClass("add") ? "add" : "remove") + "-red-hang"));
$("#points .hang button.blue.add").on("click", e => ipc.send(($(e.target).hasClass("add") ? "add" : "remove") + "-blue-hang"));

$("#points .park button.red.add").on("click", e => ipc.send(($(e.target).hasClass("add") ? "add" : "remove") + "-red-park"));
$("#points .park button.blue.add").on("click", e => ipc.send(($(e.target).hasClass("add") ? "add" : "remove") + "-blue-park"));

$("#points .level button.red.add").on("click", e => ipc.send(($(e.target).hasClass("add") ? "set" : "unset") + "-red-level"));
$("#points .level button.blue.add").on("click", e => ipc.send(($(e.target).hasClass("add") ? "set" : "unset") + "-blue-level"));

// Award red fouls to blue and vice versa
$("#points .foul button.red.add").on("click", e => ipc.send(($(e.target).hasClass("add") ? "add" : "remove") + "-blue-foul"));
$("#points .foul button.blue.add").on("click", e => ipc.send(($(e.target).hasClass("add") ? "add" : "remove") + "-red-foul"));

$("#points .tech-foul button.red.add").on("click", e => ipc.send(($(e.target).hasClass("add") ? "add" : "remove") + "-blue-tech-foul"));
$("#points .tech-foul button.blue.add").on("click", e => ipc.send(($(e.target).hasClass("add") ? "add" : "remove") + "-red-tech-foul"));


ipc.on("loaded-undetermined-match", () => currentMatchDetermined = false);
ipc.on("loaded-determined-match", () => currentMatchDetermined = true);
ipc.on("match-ended", () => {
    phase = Phase.NO_ENTRY;
    matchResultsWaiting = true;
    matchResultsValid = false;
});
ipc.on("match-data", (event, data) => {
    $("#data #crossings .red span").text(data.RedInitiationLine);
    $("#data #crossings .blue span").text(data.BlueInitiationLine);
    $("#data #parks .red span").text(data.RedParks);
    $("#data #parks .blue span").text(data.BlueParks);
    $("#data #hangs .red span").text(data.RedHangs);
    $("#data #hangs .blue span").text(data.BlueHangs);
    $("#data #level .red span").text(data.RedLevel ? "Yes" : "No");
    $("#data #level .blue span").text(data.BlueLevel ? "Yes" : "No");
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
        $("#phase button#ready-for-match").attr("disabled", true);
        $("#match button#next-match").attr("disabled", true);
        $("#match button#previous-match").attr("disabled", true);
    } else {
        $("#points button").attr("disabled", true);
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