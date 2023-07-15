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
            redMobility: 0,
            redAutoLowNodes: 0,
            redAutoMidNodes: 0,
            redAutoHighNodes: 0,
            redAutoCharge: 0,
            redLowNodes: 0,
            redMidNodes: 0,
            redHighNodes: 0,
            redLinks: 0,
            redCoopertition: false,
            redEndgame: [0, 0, 0],
            redFouls: 0,
            redTechFouls: 0,
            redSustainability: false,
            redActivation: false,

            blueTeams: blueTeams,
            blueNumber: blueAllianceNumber,
            blueMatchPoints: 0,
            blueMobility: 0,
            blueAutoLowNodes: 0,
            blueAutoMidNodes: 0,
            blueAutoHighNodes: 0,
            blueAutoCharge: 0,
            blueLowNodes: 0,
            blueMidNodes: 0,
            blueHighNodes: 0,
            blueLinks: 0,
            blueCoopertition: false,
            blueEndgame: [0, 0, 0],
            blueFouls: 0,
            blueTechFouls: 0,
            blueSustainability: false,
            blueActivation: false,
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

export function getAllianceNumber(number, set, type, color) {
    return lookupByAlliance("Number", color, number, set, type);
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

export function getMobility(number, set, type, color) {
    return lookupByAlliance("Mobility", color, number, set, type);
}

export function setMobility(mobility, number, set, type, color) {
    updateByAlliance("Mobility", mobility, color, number, set, type);
}

export function getAutoLowNodes(number, set, type, color) {
    return lookupByAlliance("AutoLowNodes", color, number, set, type);
}
export function setAutoLowNodes(autoLowNodes, number, set, type, color) {
    updateByAlliance("AutoLowNodes", autoLowNodes, color, number, set, type);
}
export function getAutoMidNodes(number, set, type, color) {
    return lookupByAlliance("AutoMidNodes", color, number, set, type);
}
export function setAutoMidNodes(autoMidNodes, number, set, type, color) {
    updateByAlliance("AutoMidNodes", autoMidNodes, color, number, set, type);
}
export function getAutoHighNodes(number, set, type, color) {
    return lookupByAlliance("AutoHighNodes", color, number, set, type);
}
export function setAutoHighNodes(autoHighNodes, number, set, type, color) {
    updateByAlliance("AutoHighNodes", autoHighNodes, color, number, set, type);
}

export function getAutoCharge(number, set, type, color) {
    return lookupByAlliance("AutoCharge", color, number, set, type);
}
export function setAutoCharge(autoCharge, number, set, type, color) {
    updateByAlliance("AutoCharge", autoCharge, color, number, set, type);
}

export function getLowNodes(number, set, type, color) {
    return lookupByAlliance("LowNodes", color, number, set, type);
}
export function setLowNodes(lowNodes, number, set, type, color) {
    updateByAlliance("LowNodes", lowNodes, color, number, set, type);
}
export function getMidNodes(number, set, type, color) {
    return lookupByAlliance("MidNodes", color, number, set, type);
}
export function setMidNodes(midNodes, number, set, type, color) {
    updateByAlliance("MidNodes", midNodes, color, number, set, type);
}
export function getHighNodes(number, set, type, color) {
    return lookupByAlliance("HighNodes", color, number, set, type);
}
export function setHighNodes(highNodes, number, set, type, color) {
    updateByAlliance("HighNodes", highNodes, color, number, set, type);
}

export function getLinks(number, set, type, color) {
    return lookupByAlliance("Links", color, number, set, type);
}
export function setLinks(links, number, set, type, color) {
    updateByAlliance("Links", links, color, number, set, type);
}

export function getCoopertition(number, set, type, color) {
    return lookupByAlliance("Coopertition", color, number, set, type);
}
export function setCoopertition(coopertition, number, set, type, color) {
    updateByAlliance("Coopertition", coopertition, color, number, set, type);
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

export function getSustainability(number, set, type, color) {
    return lookupByAlliance("Sustainability", color, number, set, type);
}

export function setSustainability(breach, number, set, type, color) {
    return updateByAlliance("Sustainability", breach, color, number, set, type);
}

export function getActivation(number, set, type, color) {
    return lookupByAlliance("Activation", color, number, set, type);
}

export function setActivation(capture, number, set, type, color) {
    return updateByAlliance("Activation", capture, color, number, set, type);
}