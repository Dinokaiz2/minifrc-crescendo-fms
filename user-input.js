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
ipc.on(CtrlMsg.RED_DISMOUNT, (_, data) => Competition.match.red.setHabDismount(data.Position, data.Level));
ipc.on(CtrlMsg.BLUE_DISMOUNT, (_, data) => Competition.match.blue.setHabDismount(data.Position, data.Level));
ipc.on(CtrlMsg.RED_CLIMB, (_, data) => Competition.match.red.setHabClimb(data.Position, data.Level));
ipc.on(CtrlMsg.BLUE_CLIMB, (_, data) => Competition.match.blue.setHabClimb(data.Position, data.Level));

ipc.on(CtrlMsg.GAME_PIECE, (_, data) => {
    let alliance = data.Color === "red" ? Competition.match.red : Competition.match.blue;
    let hatch = alliance.hatches[data.Position];
    let cargo = alliance.cargo[data.Position];
    if (data.Remove) {
        if (cargo) alliance.setCargo(data.Position, false);
        else if (
            hatch === Match.HatchType.HATCH
            || (!Competition.inMatch && !Competition.matchOver && hatch === Match.HatchType.NULL_HATCH)
        ) alliance.setHatch(data.Position, Match.HatchType.NO_HATCH);
    } else {
        let hatchType = (Competition.inMatch || Competition.matchOver) ? Match.HatchType.HATCH : Match.HatchType.NULL_HATCH;
        if (hatch === Match.HatchType.NO_HATCH) alliance.setHatch(data.Position, hatchType);
        else if (Competition.inMatch || Competition.matchOver) alliance.setCargo(data.Position, true);
    }
});

ipc.on("add-red-foul", () => Competition.match.red.addFoul());
ipc.on("remove-red-foul", () => Competition.match.red.removeFoul());
ipc.on("add-blue-foul", () => Competition.match.blue.addFoul());
ipc.on("remove-blue-foul", () => Competition.match.blue.removeFoul());

ipc.on("add-red-tech-foul", () => Competition.match.red.addTechFoul());
ipc.on("remove-red-tech-foul", () => Competition.match.red.removeTechFoul());
ipc.on("add-blue-tech-foul", () => Competition.match.blue.addTechFoul());
ipc.on("remove-blue-tech-foul", () => Competition.match.blue.removeTechFoul());

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
        RedFouls: Competition.match.red.fouls,
        BlueFouls: Competition.match.blue.fouls,
        RedTechFouls: Competition.match.red.techFouls,
        BlueTechFouls: Competition.match.blue.techFouls,
    });
}