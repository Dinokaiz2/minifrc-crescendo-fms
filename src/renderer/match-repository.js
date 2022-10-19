/**
 * Saves and retrieves match data from a database.
 * 
 * Notes:
 *  - We need to support match replays somehow. A good solution might be just rolling
 *      back the database if a replay is needed.
 */

import { Match } from "./match.js"

// const location = window.db.createLocation();
// var db = window.db.database(location);

window.onload = () => {
    // generateMatch(2, 0, Match.Type.QUALIFICATION, [0, 1, 2], [3, 4, 5], "red team", "blue team");
    // setMatchPoints(33, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setMatchPoints(46, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setRegularFouls(6, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setRegularFouls(10, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setTechFouls(5, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setTechFouls(2, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setAutoBottomPort(2, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setAutoBottomPort(0, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setAutoUpperPort(3, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setAutoUpperPort(9, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setTeleopBottomPort(15, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setTeleopBottomPort(4, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setTeleopUpperPort(12, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setTeleopUpperPort(35, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setInitiationLine(2, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setInitiationLine(3, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setParks(1, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setParks(2, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setHangs(2, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setHangs(1, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setLevel(true, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setLevel(false, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setPhase(Match.Phase.PHASE_1, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setPhase(Match.Phase.PHASE_3, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setPowerCellsInPhase(6, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setPowerCellsInPhase(20, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setShieldGeneratorEnergized(true, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setShieldGeneratorEnergized(false, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setShieldGeneratorOperational(true, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setShieldGeneratorOperational(true, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setResult(Match.Result.RED_WIN, 2, 0, Match.Type.QUALIFICATION);

    // console.log("get red match points", getMatchPoints(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red reg fouls", getRegularFouls(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red tech fouls", getTechFouls(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red auto bottom", getAutoBottomPort(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red auto top", getAutoUpperPort(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red teleop bottom", getTeleopBottomPort(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red teleop top", getTeleopUpperPort(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red initiation", getInitiationLine(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red parks", getParks(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red hangs", getHangs(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red level", getLevel(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red phase", getPhase(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red power cells in phase", getPowerCellsInPhase(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red shield gen operational", getShieldGeneratorOperational(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red shield gen energized", getShieldGeneratorEnergized(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));

    // console.log("get blue match points", getMatchPoints(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE reg fouls", getRegularFouls(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE tech fouls", getTechFouls(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE auto bottom", getAutoBottomPort(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE auto top", getAutoUpperPort(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE teleop bottom", getTeleopBottomPort(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE teleop top", getTeleopUpperPort(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE initiation", getInitiationLine(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE parks", getParks(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE hangs", getHangs(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE level", getLevel(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE phase", getPhase(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE power cells in phase", getPowerCellsInPhase(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE shield gen operational", getShieldGeneratorOperational(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE shield gen energized", getShieldGeneratorEnergized(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));

    // console.log("get results", getResult(2, 0, Match.Type.QUALIFICATION));
    // console.log("get Surrogate", isSurrogate(0, 2, 0, Match.Type.QUALIFICATION));
    // console.log("get Disqualified", isDisqualified(0, 2, 0, Match.Type.QUALIFICATION));
    // console.log("get all matches", getAllMatches());

};


/**
 * Builds and returns an array of all matches.
 * @return {Match[]}
 */
export function getAllMatches() {
    let matches = window.db.findAll();
    matches.forEach((e, i, a) => a[i] = new Match(e.Number, e.Type, e.Set));
    return matches;
}

/**
 * Gets the red team numbers in the match with the specified number, type, and set.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @return {number[]} an array of three red team numbers
 */
export function getRedTeams(number, set, type) {
    return window.db.findOne({ Number: number, Set: set, Type: type }).RedTeams;
}

/**
 * Gets the blue team numbers in the match with the specified number, type, and set.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @return {number[]} an array of three blue team numbers
 */
export function getBlueTeams(number, set, type) {
    return window.db.findOne({ Number: number, Set: set, Type: type }).BlueTeams;
}

/**
 * Returns the result of the match with the specified number, type, and set.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @return {Match.Result} the match result (Match.Result.UNDETERMINED if not yet played)
 */
export function getResult(number, set, type) {
    return window.db.findOne({ Number: number, Set: set, Type: type }).Results;
}

/**
 * Set the result of a match.
 * @param {Match.Result} result 
 * @param {number} number 
 * @param {number} set 
 * @param {Match.Type} type 
 */
export function setResult(result, number, set, type) {
    window.db.update(window.db.findOne({ Number: number, Set: set, Type: type }).id, { Results: result });
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
export function isDisqualified(teamNumber, matchNumber, set, type) {
    return window.db.findOne({ Number: matchNumber, Set: set, Type: type }).Disqualifications.includes(teamNumber);
}

/**
 * Checks if the specified team is a surrogate in this match. Behavior is undefined
 * if called with a team number not in specified match.
 * @param {number} teamNumber the team number to check for surrogacy
 * @param {number} matchNumber the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 */
export function isSurrogate(teamNumber, matchNumber, set, type) {
    return window.db.findOne({ Number: matchNumber, Set: set, Type: type }).Surrogates.includes(teamNumber);
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
export function generateMatch(number, set, type, redTeams, blueTeams, redAllianceName = "", blueAllianceName = "") {
    if (Object.keys(window.db.findOne({ Number: number, Set: set, Type: type })) == 0) {
        window.db.save({
            Number: number,
            Set: set,
            Type: type,
            RedTeams: redTeams,
            BlueTeams: blueTeams,
            RedAllianceName: redAllianceName,
            BlueAllianceName: blueAllianceName,
            Disqualifications: [],
            Surrogates: [],
            MatchPointsBlue: 0,
            MatchPointsRed: 0,
            Results: Match.Result.UNDETERMINED,

            RegularFoulsBlue: 0,
            TechFoulsBlue: 0,
            HabCrossBlue: [0, 0, 0],
            HatchBlue: Array(20).fill(0),
            CargoBlue: Array(20).fill(0),
            HabClimbBlue: [0, 0, 0],

            RegularFoulsRed: 0,
            TechFoulsRed: 0,
            HabCrossRed: [0, 0, 0],
            HatchRed: Array(20).fill(0),
            CargoRed: Array(20).fill(0),
            HabClimbRed: [0, 0, 0],
        });
    }
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
    if (color == Match.AllianceColor.BLUE)
        points = window.db.findOne({ Number: number, Set: set, Type: type }).MatchPointsBlue;
    else if (color == Match.AllianceColor.RED)
        points = window.db.findOne({ Number: number, Set: set, Type: type }).MatchPointsRed;
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
    let change;
    if (color == Match.AllianceColor.BLUE) change = { MatchPointsBlue: points }
    else if (color == Match.AllianceColor.RED) change = { MatchPointsRed: points }
    window.db.update(window.db.findOne({ Number: number, Set: set, Type: type }).id, change);
}

export function getHabCrossings(number, set, type, color) {
    let crossed = 0;
    if (color == Match.AllianceColor.BLUE)
        crossed = window.db.findOne({ Number: number, Set: set, Type: type }).HabCrossBlue;
    else if (color == Match.AllianceColor.RED)
        crossed = window.db.findOne({ Number: number, Set: set, Type: type }).HabCrossRed;
    return crossed;
}

export function setHabCrossings(crossings, number, set, type, color) {
    let change;
    if (color == Match.AllianceColor.BLUE) change = { HabCrossBlue: crossings }
    else if (color == Match.AllianceColor.RED) change = { HabCrossRed: crossings }
    window.db.update(window.db.findOne({ Number: number, Set: set, Type: type }).id, change);
}

export function getHatches(number, set, type, color) {
    let crossed = 0;
    if (color == Match.AllianceColor.BLUE)
        crossed = window.db.findOne({ Number: number, Set: set, Type: type }).HatchBlue;
    else if (color == Match.AllianceColor.RED)
        crossed = window.db.findOne({ Number: number, Set: set, Type: type }).HatchRed;
    return crossed;
}

export function setHatches(crossings, number, set, type, color) {
    let change;
    if (color == Match.AllianceColor.BLUE) change = { HatchBlue: crossings }
    else if (color == Match.AllianceColor.RED) change = { HatchRed: crossings }
    window.db.update(window.db.findOne({ Number: number, Set: set, Type: type }).id, change);
}

export function getCargo(number, set, type, color) {
    let crossed = 0;
    if (color == Match.AllianceColor.BLUE)
        crossed = window.db.findOne({ Number: number, Set: set, Type: type }).CargoBlue;
    else if (color == Match.AllianceColor.RED)
        crossed = window.db.findOne({ Number: number, Set: set, Type: type }).CargoRed;
    return crossed;
}

export function setCargo(crossings, number, set, type, color) {
    let change;
    if (color == Match.AllianceColor.BLUE) change = { CargoBlue: crossings }
    else if (color == Match.AllianceColor.RED) change = { CargoRed: crossings }
    window.db.update(window.db.findOne({ Number: number, Set: set, Type: type }).id, change);
}

export function getHabClimbs(number, set, type, color) {
    let crossed = 0;
    if (color == Match.AllianceColor.BLUE)
        crossed = window.db.findOne({ Number: number, Set: set, Type: type }).HabClimbBlue;
    else if (color == Match.AllianceColor.RED)
        crossed = window.db.findOne({ Number: number, Set: set, Type: type }).HabClimbRed;
    return crossed;
}

export function setHabClimbs(crossings, number, set, type, color) {
    let change;
    if (color == Match.AllianceColor.BLUE) change = { HabClimbBlue: crossings }
    else if (color == Match.AllianceColor.RED) change = { HabClimbRed: crossings }
    window.db.update(window.db.findOne({ Number: number, Set: set, Type: type }).id, change);
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
    let regularFouls = 0;
    if (color == Match.AllianceColor.BLUE)
        regularFouls = window.db.findOne({ Number: number, Set: set, Type: type }).RegularFoulsBlue;
    else if (color == Match.AllianceColor.RED)
        regularFouls = window.db.findOne({ Number: number, Set: set, Type: type }).RegularFoulsRed;
    return regularFouls;

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
    let change;
    if (color == Match.AllianceColor.BLUE) change = { RegularFoulsBlue: fouls }
    else if (color == Match.AllianceColor.RED) change = { RegularFoulsRed: fouls }
    window.db.update(window.db.findOne({ Number: number, Set: set, Type: type }).id, change);
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
    let techFouls = 0;
    if (color == Match.AllianceColor.BLUE)
        techFouls = window.db.findOne({ Number: number, Set: set, Type: type }).TechFoulsBlue;
    else if (color == Match.AllianceColor.RED)
        techFouls = window.db.findOne({ Number: number, Set: set, Type: type }).TechFoulsRed;
    return techFouls;

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
    let change;
    if (color == Match.AllianceColor.BLUE) change = { TechFoulsBlue: fouls }
    else if (color == Match.AllianceColor.RED) change = { TechFoulsRed: fouls }
    window.db.update(window.db.findOne({ Number: number, Set: set, Type: type }).id, change);
}

export function isRocketComplete(number, set, type, color) {
    let rocketComplete = false;
    if (color == Match.AllianceColor.BLUE)
        rocketComplete = window.db.findOne({ Number: number, Set: set, Type: type }).RocketCompleteBlue;
    else if (color == Match.AllianceColor.RED)
        rocketComplete = window.db.findOne({ Number: number, Set: set, Type: type }).RocketCompleteRed;
    return rocketComplete;
}

export function setRocketComplete(operational, number, set, type, color) {
    let change;
    if (color == Match.AllianceColor.BLUE) change = { RocketCompleteBlue: operational }
    else if (color == Match.AllianceColor.RED) change = { RocketCompleteRed: operational }
    window.db.update(window.db.findOne({ Number: number, Set: set, Type: type }).id, change);
}

export function isDocked(number, set, type, color) {
    let docked = false;
    if (color == Match.AllianceColor.BLUE)
        docked = window.db.findOne({ Number: number, Set: set, Type: type }).DockedBlue;
    else if (color == Match.AllianceColor.RED)
        docked = window.db.findOne({ Number: number, Set: set, Type: type }).DockedRed;
    return docked;
}

export function setDocked(operational, number, set, type, color) {
    let change;
    if (color == Match.AllianceColor.BLUE) change = { DockedBlue: operational }
    else if (color == Match.AllianceColor.RED) change = { DockedRed: operational }
    window.db.update(window.db.findOne({ Number: number, Set: set, Type: type }).id, change);
}