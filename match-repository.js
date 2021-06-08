/**
 * Saves and retrieves match data from a database.
 * 
 * Notes:
 *  - We need to support match replays somehow. A good solution might be just rolling
 *      back the database if a replay is needed.
 */

import { Match } from "./match.js"

const db = window.db.db
const location = window.db.createLocation();

window.onload = () => {
    generateMatch(2, 0, Match.Type.QUALIFICATION, [0, 1, 2], [3, 4, 5], "red team", "blue team");
    setMatchPoints(16, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    console.log("get match", getMatchPoints(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
};


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
    console.log("Generate Match ")
    let obj = new Object();

    db.getRows('Matches', location,
        {
            Number: number,
            Set: set,
            Type: type
        }, (succ, result) => {
            if (result.length != 0) return;
            // succ - boolean, tells if the call is successful
            console.log("Success: " + succ);
            console.log(result);
            obj.Number = number;
            obj.Set = set;
            obj.Type = type;
            obj.RedTeams = redTeams;
            obj.BlueTeams = blueTeams;
            obj.RedAllianceName = redAllianceName;
            obj.BlueAllianceName = blueAllianceName;


            if (db.valid('Matches', location)) {
                db.insertTableContent('Matches', location, obj, (succ, msg) => {
                    // succ - boolean, tells if the call is successful
                    console.log("Success: " + succ);
                    console.log("Message: " + msg);
                })
            }
        })
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

    let points = 0;

    db.getRows('Matches', location,
        {
            Number: number,
            Set: set,
            Type: type
        }, (succ, result) => {
            // succ - boolean, tells if the call is successful
            console.log("Success: " + succ);
            console.log(result);

            if (color == Match.AllianceColor.BLUE)
                points = result[0].MatchPointsBlue;
            else if (color == Match.AllianceColor.RED)
                points = result[0].MatchPointsRed;
        })
    return points;

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
    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { MatchPointsBlue: points }
    else if (color == Match.AllianceColor.RED)
        change = { MatchPointsRed: points }

    db.updateRow('Matches', location, where, change, (succ, msg) => {
        // succ - boolean, tells if the call is successful
        console.log("Success: " + succ);
        console.log("Message: " + msg);
    });
}

/**
 * Gets the number of initiation line crossings by the specified alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @param {number} the number of initiation line crossings for this match
 */
export function getInitiationLine(number, set, type, color) {

}

/**
 * Sets the number of initiation line crossings by the specified alliance in the match.
 * @param {number} crossings the number of initiation line crossings to set
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setInitiationLine(crossings, number, set, type, color) {

}

export function getAutoBottomPort(number, set, type, color) {

}

export function setAutoBottomPort(points, number, set, type, color) {

}

export function getAutoUpperPort(number, set, type, color) {

}

export function setAutoUpperPort(cells, number, set, type, color) {

}

export function getTeleopBottomPort(number, set, type, color) {

}

export function setTeleopBottomPort(cells, number, set, type, color) {

}

export function getTeleopUpperPort(number, set, type, color) {

}

export function setTeleopUpperPort(cells, number, set, type, color) {

}

export function getParks(number, set, type, color) {

}

export function setParks(parks, number, set, type, color) {

}

export function getHangs(number, set, type, color) {

}

export function setHangs(hangs, number, set, type, color) {

}

/**
 * Checks if the alliance's rung was level.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {boolean} `true` if the rung was level
 */
export function getLevel(number, set, type, color) {

}

/**
 * Sets if the alliance's rung was level.
 * @param {boolean} level whether the rung was level
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setLevel(level, number, set, type, color) {
}

/**
 * Gets the highest Infinite Recharge phase the alliance has activated.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {Match.Phase} the highest phase the alliance has activated
 */
export function getPhase(number, set, type, color) {

}

/**
 * Sets the highest Infinite Recharge phase the alliance has activated.
 * @param {Match.Phase} phase the phase to set
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setPhase(phase, number, set, type, color) {

}

/**
 * Gets the number of power cells scored by the alliance in the current phase.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {number} the number of power cells scored by the alliance in the current phase
 */
export function getPowerCellsInPhase(number, set, type, color) {

}

/**
 * Sets the number of power cells scored by the alliance in the current phase.
 * @param {number} cells number of power cells to set
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setPowerCellsInPhase(cells, number, set, type, color) {

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
export function getRegularFouls(number, set, type, color) {

}

/**
 * Sets the number of regular fouls awarded to the specified alliance as a result
 * of fouls committed by the opponent alliance in the match.
 * @param {number} fouls the number of regular fouls to set
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setRegularFouls(fouls, number, set, type, color) {

}

/**
 * Gets the number of tech fouls awarded to the specified alliance as a result of
 * fouls committed by the opponent alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {number} the number of tech fouls awarded in this match
 */
export function getTechFouls(number, set, type, color) {

}

/**
 * Sets the number of tech fouls awarded to the specified alliance as a result of
 * fouls committed by the opponent alliance in the match.
 * @param {number} fouls the number of tech fouls to set
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setTechFouls(fouls, number, set, type, color) {

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