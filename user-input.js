import { Competition } from "./controller.js";

const ipc = window.ipc;

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
ipc.on("add-red-initiation-line", () => Competition.match.red.addInitiationLine());
ipc.on("remove-red-initiation-line", () => Competition.match.red.removeInitiationLine());
ipc.on("add-blue-initiation-line", () => Competition.match.blue.addInitiationLine());
ipc.on("remove-blue-initiation-line", () => Competition.match.blue.removeInitiationLine());

ipc.on("add-red-hang", () => Competition.match.red.addHang());
ipc.on("remove-red-hang", () => Competition.match.red.removeHang());
ipc.on("add-blue-hang", () => Competition.match.blue.addHang());
ipc.on("remove-blue-hang", () => Competition.match.blue.removeHang());

ipc.on("add-red-park", () => Competition.match.red.addPark());
ipc.on("remove-red-park", () => Competition.match.red.removePark());
ipc.on("add-blue-park", () => Competition.match.blue.addPark());
ipc.on("remove-blue-park", () => Competition.match.blue.removePark());

ipc.on("set-red-level", () => Competition.match.red.level = true);
ipc.on("unset-red-level", () => Competition.match.red.level = false);
ipc.on("set-blue-level", () => Competition.match.blue.level = true);
ipc.on("unset-blue-level", () => Competition.match.blue.level = false);

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
        RedInitiationLine: Competition.match.red.initiationLine,
        BlueInitiationLine: Competition.match.blue.initiationLine,
        RedParks: Competition.match.red.parks,
        BlueParks: Competition.match.blue.parks,
        RedHangs: Competition.match.red.hangs,
        BlueHangs: Competition.match.blue.hangs,
        RedLevel: Competition.match.red.level,
        BlueLevel: Competition.match.blue.level,
        RedFouls: Competition.match.red.fouls,
        BlueFouls: Competition.match.blue.fouls,
        RedTechFouls: Competition.match.red.techFouls,
        BlueTechFouls: Competition.match.blue.techFouls,
    });
}