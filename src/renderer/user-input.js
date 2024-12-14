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
ipc.on(CtrlMsg.LEAVE, (_, data) => {
    if (data.red) Competition.match.red.setLeaves(data.count);
    else Competition.match.blue.setLeaves(data.count);
});

ipc.on(CtrlMsg.AMP, (_, data) => {
    let alliance = data.red ? Competition.match.red : Competition.match.blue;
    if (data.type == "auto") {
        if (data.undo) alliance.removeAutoAmpNote();
        else alliance.addAutoAmpNote();
    } else if (data.type == "context") {
        if (data.undo) alliance.removeAmpNote();
        else alliance.addAmpNote();
    }
});
ipc.on(CtrlMsg.SPEAKER, (_, data) => {
    let alliance = data.red ? Competition.match.red : Competition.match.blue;
    if (data.type == "auto") {
        if (data.undo) alliance.removeAutoSpeakerNote();
        else alliance.addAutoSpeakerNote();
    } else if (data.type == "unamped") {
        if (data.undo) alliance.removeTeleopSpeakerNote();
        else alliance.addTeleopSpeakerNote();
    } else if (data.type == "amped") {
        if (data.undo) alliance.removeAmpedSpeakerNote();
        else alliance.addAmpedSpeakerNote();
    } else if (data.type == "context") {
        if (data.undo) alliance.removeSpeakerNote();
        else alliance.addSpeakerNote();
    }
});

ipc.on(CtrlMsg.AMPLIFY, (_, data) => {
    if (data.red) Competition.match.red.startAmplification();
    else Competition.match.blue.startAmplification();
});
ipc.on(CtrlMsg.COOP, (_, data) => {
    let alliance = data.red ? Competition.match.red : Competition.match.blue;
    if (data.force) alliance.setCoopertitionForce(!data.undo);
    else alliance.setCoopertition();
});

const stageMap = { 0: 0, 1: Match.PointValues.PARK, 2: Match.PointValues.ONSTAGE };
ipc.on(CtrlMsg.STAGE, (_, data) => {
    if (data.red) Competition.match.red.setStage(data.position, stageMap[data.level]);
    else Competition.match.blue.setStage(data.position, stageMap[data.level]);
});
ipc.on(CtrlMsg.TRAP, (_, data) => {
    if (data.red) Competition.match.red.setTrapNote(data.position, !data.undo);
    else Competition.match.blue.setTrapNote(data.position, !data.undo);
});
ipc.on(CtrlMsg.HARMONY, (_, data) => {
    if (data.red) Competition.match.red.setHarmony(data.count);
    else Competition.match.blue.setHarmony(data.count);
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
    let data = {
        matchName: Competition.match.friendlyName,
        isPlayoff: Competition.match.isPlayoff()
    };
    [["red", Competition.match.red], ["blue", Competition.match.blue]].forEach(arr => {
        let [key, alliance] = arr;
        data[key] = {
            teams: alliance.teamNumbers,
            number: alliance.number,
            fouls: alliance.fouls,
            techFouls: alliance.techFouls,
            autoAmp: alliance.autoAmpNotes,
            autoSpeaker: alliance.autoSpeakerNotes,
            teleopAmp: alliance.ampNotes,
            unampedSpeaker: alliance.speakerNotes,
            ampedSpeaker: alliance.ampedSpeakerNotes,
            melody: alliance.melody,
            ensemble: alliance.ensemble,

            matchPoints: alliance.matchPoints,
            leaves: alliance.leaves,
            notes: alliance.notes,
            melodyThreshold: alliance.melodyThreshold,
            ampCharge: alliance.ampCharge,
            ampDurationRemaining: alliance.ampDurationRemaining,
            coopertition: alliance.coopertition,
            stage: alliance.stage,
            trapNotes: alliance.trapNotes,
            harmony: alliance.harmony,
            color: alliance.color
        }
    });
    ipc.send("match-data", data);
}