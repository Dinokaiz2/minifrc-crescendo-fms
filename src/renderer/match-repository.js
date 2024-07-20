/**
 * Saves and retrieves match data from a database.
 */

import { Match } from "./match.js"

var db = window.db;

// TODO: It's not a bottleneck, but should really cache the most recent match looked up

// Put manual db generation here
function generate() {
    // generateMatch(1, 0, Match.Type.PLAYOFF, [], [], 1, 8);
    // generateMatch(2, 0, Match.Type.PLAYOFF, [], [], 4, 5);
    // generateMatch(3, 0, Match.Type.PLAYOFF, [], [], 3, 6);
    // generateMatch(4, 0, Match.Type.PLAYOFF, [], [], 2, 7);
}

$(generate);

/**
 * Creates a new match to be played and puts it in the database. Does not add the match
 * if a match with the same number, set, and type is already in the database.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {number[]} redTeams an array of three team numbers
 * @param {number[]} blueTeams an array of three team number
 * @param {string} redAllianceName name to use for the red alliance in a playoff match
 * @param {string} blueAllianceName name to use for the blue alliance in a playoff match
 */
export function generateMatch(number, set, type, redTeams, blueTeams, redAllianceNumber = 0, blueAllianceNumber = 0, surrogates = []) {
    if (Object.keys(getMatchData(number, set, type)) == 0) {
        db.save({
            number: number,
            set: set,
            type: type,
            disqualifications: [],
            surrogates: surrogates,
            result: Match.Result.UNDETERMINED,

            redTeams: redTeams,
            redNumber: redAllianceNumber,
            redMatchPoints: 0,
            redLeaves: 0,
            redAutoAmpNotes: 0,
            redAutoSpeakerNotes: 0,
            redAmpNotes: 0,
            redSpeakerNotes: 0,
            redAmpedSpeakerNotes: 0,
            redCoopertition: false,
            redStage: [0, 0, 0],
            redTrapNotes: [false, false, false],
            redHarmony: 0,
            redFouls: 0,
            redTechFouls: 0,
            redMelody: false,
            redEnsemble: false,

            blueTeams: blueTeams,
            blueNumber: blueAllianceNumber,
            blueMatchPoints: 0,
            blueLeaves: 0,
            blueAutoAmpNotes: 0,
            blueAutoSpeakerNotes: 0,
            blueAmpNotes: 0,
            blueSpeakerNotes: 0,
            blueAmpedSpeakerNotes: 0,
            blueCoopertition: false,
            blueStage: [0, 0, 0],
            blueTrapNotes: [false, false, false],
            blueHarmony: 0,
            blueFouls: 0,
            blueTechFouls: 0,
            blueMelody: false,
            blueEnsemble: false,
        });
    }
}

/**
 * Builds and returns an array of all matches.
 * @return {Match[]}
 */
export function getAllMatches() {
    let matches = db.findAll();
    matches.forEach((e, i, a) => a[i] = new Match(e.number, e.type, e.set));
    return matches;
}

// Helper functions
function getMatchData(number, set, type) {
    return db.findOne({ number: number, set: set, type: type });
}

function lookupByAlliance(keyName, allianceColor, matchNumber, matchSet, matchType) {
    let matchData = getMatchData(matchNumber, matchSet, matchType);
    if (allianceColor == Match.AllianceColor.RED) return matchData["red" + keyName];
    else if (allianceColor == Match.AllianceColor.BLUE) return matchData["blue" + keyName];
    else throw "Color must be a Match.AllianceColor";
}

function updateDb(keyName, value, matchNumber, matchSet, matchType) {
    let change = {}
    change[keyName] = value;
    db.update(getMatchData(matchNumber, matchSet, matchType).id, change);
}

function updateByAlliance(keyName, value, allianceColor, matchNumber, matchSet, matchType) {
    let change = {};
    if (allianceColor == Match.AllianceColor.RED) change["red" + keyName] = value;
    else if (allianceColor == Match.AllianceColor.BLUE) change["blue" + keyName] = value;
    else throw "allianceColor must be a Match.AllianceColor";
    db.update(getMatchData(matchNumber, matchSet, matchType).id, change);
}

/**
 * Gets the alliance team numbers in the match with the specified number, type, and set.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the color of the alliance
 * @return {number[]} an array of three red team numbers
 */
export function getAllianceTeams(number, set, type, color) { return lookupByAlliance("Teams", color, number, set, type); }
export function getAllianceNumber(number, set, type, color) { return lookupByAlliance("Number", color, number, set, type); }
export function getResult(number, set, type) { return getMatchData(number, set, type).result; }
export function setResult(result, number, set, type) { updateDb("result", result, number, set, type); }

/**
 * Checks if the specified team was disqualified from this match.
 * @param {number} teamNumber the team number to check for disqualification
 * @param {number} matchNumber the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @return {boolean} whether the team was disqualified from this match
 */
export function isDisqualified(teamNumber, matchNumber, set, type) { return getMatchData(matchNumber, set, type).disqualifications.includes(teamNumber); }

/**
 * Checks if the specified team is a surrogate in this match.
 * @param {number} teamNumber the team number to check for surrogacy
 * @param {number} matchNumber the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 */
export function isSurrogate(teamNumber, matchNumber, set, type) { return getMatchData(matchNumber, set, type).surrogates.includes(teamNumber); }

/**
 * Gets the number of match points scored by the specified alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {number} the number of match points for this match
 */
export function getMatchPoints(number, set, type, color) { return lookupByAlliance("MatchPoints", color, number, set, type); }
export function setMatchPoints(points, number, set, type, color) { updateByAlliance("MatchPoints", points, color, number, set, type); }

export function getLeaves(number, set, type, color) { return lookupByAlliance("Leaves", color, number, set, type); }
export function setLeaves(mobility, number, set, type, color) { updateByAlliance("Leaves", mobility, color, number, set, type); }

export function getAutoAmpNotes(number, set, type, color) { return lookupByAlliance("AutoAmpNotes", color, number, set, type); }
export function setAutoAmpNotes(autoAmpNotes, number, set, type, color) { updateByAlliance("AutoAmpNotes", autoAmpNotes, color, number, set, type); }
export function getAutoSpeakerNotes(number, set, type, color) { return lookupByAlliance("AutoSpeakerNotes", color, number, set, type); }
export function setAutoSpeakerNotes(autoSpeakerNotes, number, set, type, color) { updateByAlliance("AutoSpeakerNotes", autoSpeakerNotes, color, number, set, type); }

export function getAmpNotes(number, set, type, color) { return lookupByAlliance("AmpNotes", color, number, set, type); }
export function setAmpNotes(ampNotes, number, set, type, color) { updateByAlliance("AmpNotes", ampNotes, color, number, set, type); }
export function getSpeakerNotes(number, set, type, color) { return lookupByAlliance("SpeakerNotes", color, number, set, type); }
export function setSpeakerNotes(speakerNotes, number, set, type, color) { updateByAlliance("SpeakerNotes", speakerNotes, color, number, set, type); }
export function getAmpedSpeakerNotes(number, set, type, color) { return lookupByAlliance("AmpedSpeakerNotes", color, number, set, type); }
export function setAmpedSpeakerNotes(ampedSpeakerNotes, number, set, type, color) { updateByAlliance("AmpedSpeakerNotes", ampedSpeakerNotes, color, number, set, type); }

export function getCoopertition(number, set, type, color) { return lookupByAlliance("Coopertition", color, number, set, type); }
export function setCoopertition(coopertition, number, set, type, color) { updateByAlliance("Coopertition", coopertition, color, number, set, type); }

export function getStage(number, set, type, color) { return lookupByAlliance("Stage", color, number, set, type); }
export function setStage(stage, number, set, type, color) { updateByAlliance("Stage", stage, color, number, set, type); }
export function getTrapNotes(number, set, type, color) { return lookupByAlliance("TrapNotes", color, number, set, type); }
export function setTrapNotes(trapNotes, number, set, type, color) { updateByAlliance("TrapNotes", trapNotes, color, number, set, type); }
export function getHarmony(number, set, type, color) { return lookupByAlliance("Harmony", color, number, set, type); }
export function setHarmony(harmony, number, set, type, color) { updateByAlliance("Harmony", harmony, color, number, set, type); }

/**
 * Gets the number of regular fouls awarded to the specified alliance as a result
 * of fouls committed by the opponent alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {number} the number of regular fouls awarded in this match
 */
export function getFouls(number, set, type, color) { return lookupByAlliance("Fouls", color, number, set, type); }
export function setFouls(fouls, number, set, type, color) { return updateByAlliance("Fouls", fouls, color, number, set, type); }
export function getTechFouls(number, set, type, color) { return lookupByAlliance("TechFouls", color, number, set, type); }
export function setTechFouls(fouls, number, set, type, color) { return updateByAlliance("TechFouls", fouls, color, number, set, type); }

export function getMelody(number, set, type, color) { return lookupByAlliance("Melody", color, number, set, type); }
export function setMelody(melody, number, set, type, color) { return updateByAlliance("Melody", melody, color, number, set, type); }
export function getEnsemble(number, set, type, color) { return lookupByAlliance("Ensemble", color, number, set, type); }
export function setEnsemble(ensemble, number, set, type, color) { return updateByAlliance("Ensemble", ensemble, color, number, set, type); }