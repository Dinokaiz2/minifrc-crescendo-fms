import { Competition } from "./controller.js";
import { Match } from "./match.js";

const ipc = window.ipc;
const CtrlMsg = window.ipc.CtrlMsg;
const RenderMsg = window.ipc.RenderMsg;

ipc.on("view-match", () => Competition.showMatch());
ipc.on("view-results", () => Competition.showResults());
ipc.on("view-rankings", () => Competition.showRankings());

ipc.on("no-entry", () => Competition.noEntry());
ipc.on("do-not-enter", () => Competition.safeToEnter());
ipc.on("ready-for-match", () => Competition.readyForMatch());
ipc.on("start-match", () => Competition.startMatch());

ipc.on("field-fault", () => Competition.fieldFault());
ipc.on("replay-match", () => Competition.replayMatch());
ipc.on("save-results", () => Competition.saveResults());
ipc.on("next-match", () => Competition.nextMatch());
ipc.on("previous-match", () => Competition.previousMatch());

// Points
ipc.on(CtrlMsg.MOBILITY, (_, data) => {
    if (data.red) Competition.match.red.setMobility(data.count);
    else Competition.match.blue.setMobility(data.count);
});
const autoChargeMap = { 0: 0, 1: Match.PointValues.AUTO_DOCK, 2: Match.PointValues.AUTO_ENGAGE };
ipc.on(CtrlMsg.AUTO_CHARGE, (_, data) => {
    if (data.red) Competition.match.red.setAutoCharge(autoChargeMap[data.level]);
    else Competition.match.blue.setAutoCharge(autoChargeMap[data.level]);
});
const endgameMap = { 0: 0, 1: Match.PointValues.PARK, 2: Match.PointValues.DOCK, 3: Match.PointValues.ENGAGE };
ipc.on(CtrlMsg.ENDGAME, (_, data) => {
    if (data.red) Competition.match.red.setEndgame(data.position, endgameMap[data.level]);
    else Competition.match.blue.setEndgame(data.position, endgameMap[data.level]);
});

ipc.on(CtrlMsg.NODE, (_, data) => {
    let alliance = data.red ? Competition.match.red : Competition.match.blue;

    if      (data.level == 0 && data.auto && !data.undo) alliance.addAutoLowNode();
    else if (data.level == 0 && data.auto && data.undo) alliance.removeAutoLowNode();
    else if (data.level == 0 && !data.auto && !data.undo) alliance.addLowNode();
    else if (data.level == 0 && !data.auto && data.undo) alliance.removeLowNode();

    else if (data.level == 1 && data.auto && !data.undo) alliance.addAutoMidNode();
    else if (data.level == 1 && data.auto && data.undo) alliance.removeAutoMidNode();
    else if (data.level == 1 && !data.auto && !data.undo) alliance.addMidNode();
    else if (data.level == 1 && !data.auto && data.undo) alliance.removeMidNode();

    else if (data.level == 2 && data.auto && !data.undo) alliance.addAutoHighNode();
    else if (data.level == 2 && data.auto && data.undo) alliance.removeAutoHighNode();
    else if (data.level == 2 && !data.auto && !data.undo) alliance.addHighNode();
    else if (data.level == 2 && !data.auto && data.undo) alliance.removeHighNode();
});

ipc.on(CtrlMsg.LINK, (_, data) => {
    let alliance = data.red ? Competition.match.red : Competition.match.blue;
    if (data.undo) alliance.removeLink();
    else alliance.addLink();
});

ipc.on(CtrlMsg.COOPERTITION, (_, data) => {
    let alliance = data.red ? Competition.match.red : Competition.match.blue;
    if (data.undo) alliance.setCoopertition(false);
    else alliance.setCoopertition(true);
});

ipc.on(CtrlMsg.FOUL, (_, data) => {
    let alliance = data.red ? Competition.match.red : Competition.match.blue;
    if (!data.tech && !data.undo) alliance.addFoul();
    if (!data.tech && data.undo) alliance.removeFoul();
    if (data.tech && !data.undo) alliance.addTechFoul();
    if (data.tech && data.undo) alliance.removeTechFoul();
});

export function matchEnded() {
    ipc.send("match-ended");
}

export function loadedUndeterminedMatch() {
    ipc.send("loaded-undetermined-match");
}

export function loadedDeterminedMatch() {
    ipc.send("loaded-determined-match");
}

export function sendMatchData() {
    ipc.send("match-data", {
        redFouls: Competition.match.blue.fouls,
        blueFouls: Competition.match.red.fouls,
        redTechFouls: Competition.match.blue.techFouls,
        blueTechFouls: Competition.match.red.techFouls,
        redAutoLowNodes: Competition.match.red.autoLowNodes,
        blueAutoLowNodes: Competition.match.blue.autoLowNodes,
        redAutoMidNodes: Competition.match.red.autoMidNodes,
        blueAutoMidNodes: Competition.match.blue.autoMidNodes,
        redAutoHighNodes: Competition.match.red.autoHighNodes,
        blueAutoHighNodes: Competition.match.blue.autoHighNodes,
        redLowNodes: Competition.match.red.lowNodes,
        blueLowNodes: Competition.match.blue.lowNodes,
        redMidNodes: Competition.match.red.midNodes,
        blueMidNodes: Competition.match.blue.midNodes,
        redHighNodes: Competition.match.red.highNodes,
        blueHighNodes: Competition.match.blue.highNodes,
        redSustainability: Competition.match.red.sustainability,
        blueSustainability: Competition.match.blue.sustainability,
        redActivation: Competition.match.red.activation,
        blueActivation: Competition.match.blue.activation,
    });
}