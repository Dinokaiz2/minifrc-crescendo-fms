/**
 * Saves and retrieves match data from a database.
 * 
 * Notes:
 *  - We need to support match replays somehow. A good solution might be just rolling
 *      back the database if a replay is needed.
 */

import { Match } from "./match.js"

/**
 * Builds and returns an array of all matches.
 * @return {Match[]}
 */
export function getAllMatches() {

}

/**
 * Returns the result of the match with the specified number, type, and set.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @return {Match.Result} the match result (Match.Result.UNDETERMINED if not yet played)
 */
export function getResult(number, set, type) {

}

/**
 * Set the result of a match.
 * @param {Match.Result} result 
 * @param {number} number 
 * @param {number} set 
 * @param {Match.Type} type 
 */
export function setResult(result, number, set, type) {

}

/**
 * Checks if the specified team was disqualified from this match. Behavior is undefined
 * if called with a team number not in specified match.
 * @param {number} teamNumber the team number to check for disqualification
 * @param {number} matchNumber the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @return {boolean} whether the team was disqualified from this match
 */
export function isDisqualified(teamNumber, matchNumber, type, set) {
    
}

/**
 * Checks if the specified team is a surrogate in this match. Behavior is undefined
 * if called with a team number not in specified match.
 * @param {number} teamNumber the team number to check for surrogacy
 * @param {number} matchNumber the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 */
export function isSurrogate(teamNumber, matchNumber, type, set) {
    
}

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
export function generateMatch(number, set, type, redTeams, blueTeams,
    redAllianceName = "", blueAllianceName = "") {
    
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
    
}

/**
 * Sets the number of match points scored by the specified alliance in the match.
 * @param {number} points the number of points to set
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setMatchPoints(points, number, set, type, color) {
    
}

/**
 * Gets the number of initiation line points scored by the specified alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @param {number} the number of initiation line points for this match
 */
export function getInitiationLine(number, set, type, color) {
    
}

/**
 * Sets the number of initiation line points scored by the specified alliance in the match.
 * @param {number} points the number of initiation line points to set
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setInitiationLine(points, number, set, type, color) {
    
}

export function getAutoBottomPort(number, set, type, color) {

}

export function setAutoBottomPort(points, number, set, type, color) {
    
}

export function getAutoUpperPort(number, set, type, color) {

}

export function setAutoUpperPort(points, number, set, type, color) {
    
}

export function getTeleopBottomPort(number, set, type, color) {

}

export function setTeleopBottomPort(points, number, set, type, color) {
    
}

export function getTeleopUpperPort(number, set, type, color) {

}

export function setTeleopUpperPort(points, number, set, type, color) {
    
}

export function getControlPanel(number, set, type, color) {

}

export function setControlPanel(points, number, set, type, color) {
    
}

export function getEndgame(number, set, type, color) {

}

export function setEndgame(points, number, set, type, color) {
    
}

/**
 * Gets the number of regular foul points awarded to the specified alliance as a result
 * of fouls committed by the opponent alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {number} the number of regular foul points awarded in this match
 */
export function getRegularFouls(number, set, type, color) {
    
}

/**
 * Sets the number of regular foul points awarded to the specified alliance as a result
 * of fouls committed by the opponent alliance in the match.
 * @param {number} points the number of regular foul points to set
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setRegularFouls(points, number, set, type, color) {
    
}

/**
 * Gets the number of tech foul points awarded to the specified alliance as a result of
 * fouls committed by the opponent alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {number} the number of tech foul points awarded in this match
 */
 export function getTechFouls(number, set, type, color) {
    
}

/**
 * Sets the number of tech foul points awarded to the specified alliance as a result of
 * fouls committed by the opponent alliance in the match.
 * @param {number} points the number of tech foul points to set
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setTechFouls(points, number, set, type, color) {
    
}

export function getEndgame(number, set, type, color) {

}

export function setEndgame(points, number, set, type, color) {
    
}

/**
 * Checks if the Shield Generator Operational ranking point was awarded to the specified
 * alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {boolean} whether the ranking point was awarded
 */
export function getShieldGeneratorOperational(number, set, type, color) {

}


/**
 * Sets if the Shield Generator Operational ranking point was awarded to the specified
 * alliance in the match.
 * @param {boolean} operational whether the ranking point was awarded
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setShieldGeneratorOperational(operational, number, set, type, color) {
    
}

/**
 * Checks if the Shield Generator Energized ranking point was awarded to the specified
 * alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {boolean} whether the ranking point was awarded
 */
 export function getShieldGeneratorEnergized(number, set, type, color) {

}


/**
 * Sets if the Shield Generator Energized ranking point was awarded to the specified
 * alliance in the match.
 * @param {boolean} energized whether the ranking point was awarded
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setShieldGeneratorEnergized(energized, number, set, type, color) {
    
}