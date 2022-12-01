/**
 * Saves and retrieves match data from a database.
 */

import { Match } from "./match.js"

var db = window.db;

// TODO: It's not a bottleneck, but should really cache the most recent match looked up

// Put manual db generation here
function generate() {
    generateMatch(1, 0, Match.Type.QUALIFICATION, [3, 4, 5], [7, 8, 9]);
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
export function generateMatch(number, set, type, redTeams, blueTeams, redAllianceName = "", blueAllianceName = "") {
    if (Object.keys(getMatchData(number, set, type)) == 0) {
        db.save({
            number: number,
            set: set,
            type: type,
            disqualifications: [],
            surrogates: [],
            result: Match.Result.UNDETERMINED,
            redTeams: redTeams,
            redName: redAllianceName,
            redNumber: 0,
            redMatchPoints: 0,
            redAutoMovement: [0, 0, 0],
            redAutoLowGoals: 0,
            redAutoHighGoals: 0,
            redLowGoals: 0,
            redHighGoals: 0,
            redDefenseStrengths: [2, 2, 2, 2, 2],
            redEndgame: [0, 0, 0],
            redFouls: 0,
            redTechFouls: 0,
            redBreach: false,
            redCapture: false,
            blueTeams: blueTeams,
            blueName: blueAllianceName,
            blueNumber: 0,
            blueMatchPoints: 0,
            blueAutoMovement: [0, 0, 0],
            blueAutoLowGoals: 0,
            blueAutoHighGoals: 0,
            blueLowGoals: 0,
            blueHighGoals: 0,
            blueDefenseStrengths: [2, 2, 2, 2, 2],
            blueEndgame: [0, 0, 0],
            blueFouls: 0,
            blueTechFouls: 0,
            blueBreach: false,
            blueCapture: false,
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
export function getAllianceTeams(number, set, type, color) {
    return lookupByAlliance("Teams", color, number, set, type);
}

export function getAllianceName(number, set, type, color) {
    return lookupByAlliance("Name", color, number, set, type);
}

export function getResult(number, set, type) {
    return getMatchData(number, set, type).result;
}

export function setResult(result, number, set, type) {
    updateDb("result", result, number, set, type);
}

/**
 * Checks if the specified team was disqualified from this match.
 * @param {number} teamNumber the team number to check for disqualification
 * @param {number} matchNumber the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @return {boolean} whether the team was disqualified from this match
 */
export function isDisqualified(teamNumber, matchNumber, set, type) {
    return getMatchData(matchNumber, set, type).disqualifications.includes(teamNumber);
}

/**
 * Checks if the specified team is a surrogate in this match.
 * @param {number} teamNumber the team number to check for surrogacy
 * @param {number} matchNumber the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 */
export function isSurrogate(teamNumber, matchNumber, set, type) {
    return getMatchData(matchNumber, set, type).surrogates.includes(teamNumber);
}

/**
 * Gets the number of match points scored by the specified alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {number} the number of match points for this match
 */
export function getMatchPoints(number, set, type, color) {
    return lookupByAlliance("MatchPoints", color, number, set, type);
}

export function setMatchPoints(points, number, set, type, color) {
    updateByAlliance("MatchPoints", points, color, number, set, type);
}

export function getAutoMovement(number, set, type, color) {
    return lookupByAlliance("AutoMovement", color, number, set, type);
}

export function setAutoMovement(autoMovement, number, set, type, color) {
    updateByAlliance("AutoMovement", autoMovement, color, number, set, type);
}

export function getAutoLowGoals(number, set, type, color) {
    return lookupByAlliance("AutoLowGoals", color, number, set, type);
}

export function setAutoLowGoals(goals, number, set, type, color) {
    updateByAlliance("AutoLowGoals", goals, color, number, set, type);
}

export function getAutoHighGoals(number, set, type, color) {
    return lookupByAlliance("AutoHighGoals", color, number, set, type);
}

export function setAutoHighGoals(goals, number, set, type, color) {
    updateByAlliance("AutoHighGoals", goals, color, number, set, type);
}

export function getLowGoals(number, set, type, color) {
    return lookupByAlliance("LowGoals", color, number, set, type);
}

export function setLowGoals(goals, number, set, type, color) {
    updateByAlliance("LowGoals", goals, color, number, set, type);
}

export function getHighGoals(number, set, type, color) {
    return lookupByAlliance("HighGoals", color, number, set, type);
}

export function setHighGoals(goals, number, set, type, color) {
    updateByAlliance("HighGoals", goals, color, number, set, type);
}

export function getDefenseStrengths(number, set, type, color) {
    return lookupByAlliance("DefenseStrengths", color, number, set, type);
}

export function setDefenseStrengths(strengths, number, set, type, color) {
    updateByAlliance("DefenseStrengths", strengths, color, number, set, type);
}

export function getEndgame(number, set, type, color) {
    return lookupByAlliance("Endgame", color, number, set, type);
}

export function setEndgame(endgame, number, set, type, color) {
    updateByAlliance("Endgame", endgame, color, number, set, type);
}

/**
 * Gets the number of regular fouls awarded to the specified alliance as a result
 * of fouls committed by the opponent alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {number} the number of regular fouls awarded in this match
 */
export function getFouls(number, set, type, color) {
    return lookupByAlliance("Fouls", color, number, set, type);
}

export function setFouls(fouls, number, set, type, color) {
    return updateByAlliance("Fouls", fouls, color, number, set, type);
}

export function getTechFouls(number, set, type, color) {
    return lookupByAlliance("TechFouls", color, number, set, type);
}

export function setTechFouls(fouls, number, set, type, color) {
    return updateByAlliance("TechFouls", fouls, color, number, set, type);
}

export function getBreach(number, set, type, color) {
    return lookupByAlliance("Breach", color, number, set, type);
}

export function setBreach(breach, number, set, type, color) {
    return updateByAlliance("Breach", breach, color, number, set, type);
}

export function getCapture(number, set, type, color) {
    return lookupByAlliance("Capture", color, number, set, type);
}

export function setCapture(capture, number, set, type, color) {
    return updateByAlliance("Capture", capture, color, number, set, type);
}