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
const autoLevelMap = { 0: 0, 1: Match.PointValues.REACH, 2: Match.PointValues.AUTO_CROSS };
ipc.on(CtrlMsg.AUTO, (_, data) => {
    if (data.red) Competition.match.red.setAutoMovement(data.position, autoLevelMap[data.level]);
    else Competition.match.blue.setAutoMovement(data.position, autoLevelMap[data.level]);
});

const endgameLevelMap = { 0: 0, 1: Match.PointValues.CHALLENGE, 2: Match.PointValues.SCALE };
ipc.on(CtrlMsg.ENDGAME, (_, data) => {
    if (data.red) Competition.match.red.setEndgame(data.position, endgameLevelMap[data.level]);
    else Competition.match.blue.setEndgame(data.position, endgameLevelMap[data.level]);
});

ipc.on(CtrlMsg.BOULDER, (_, data) => {
    let alliance = data.red ? Competition.match.red : Competition.match.blue;
    if (!data.high && data.auto && !data.undo) alliance.addAutoLowGoal();
    else if (data.high && data.auto && !data.undo) alliance.addAutoHighGoal();
    else if (!data.high && !data.auto && !data.undo) alliance.addLowGoal();
    else if (data.high && !data.auto && !data.undo) alliance.addHighGoal();
    else if (!data.high && data.auto && data.undo) alliance.removeAutoLowGoal();
    else if (data.high && data.auto && data.undo) alliance.removeAutoHighGoal();
    else if (!data.high && !data.auto && data.undo) alliance.removeLowGoal();
    else if (data.high && !data.auto && data.undo) alliance.removeHighGoal();
});

ipc.on(CtrlMsg.FOUL, (_, data) => {
    let alliance = data.red ? Competition.match.red : Competition.match.blue;
    if (!data.tech && !data.undo) alliance.addFoul();
    if (!data.tech && data.undo) alliance.removeFoul();
    if (data.tech && !data.undo) alliance.addTechFoul();
    if (data.tech && data.undo) alliance.removeTechFoul();
});

ipc.on(CtrlMsg.DEFENSE, (_, data) => {
    let alliance = data.red ? Competition.match.red : Competition.match.blue;
    if (data.undo) alliance.undoDefenseDamage(data.position);
    else alliance.damageDefense(data.position);
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
        redAutoLowGoals: Competition.match.red.autoLowGoals,
        blueAutoLowGoals: Competition.match.blue.autoLowGoals,
        redAutoHighGoals: Competition.match.red.autoHighGoals,
        blueAutoHighGoals: Competition.match.blue.autoHighGoals
    });
}